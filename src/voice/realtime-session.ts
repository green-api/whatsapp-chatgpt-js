import type WebSocket from "ws";
import type { CallsConnection } from "@green-api/whatsapp-api-client-js-v2";
import { VoiceSessionEnd, VoiceSessionOptions } from "../types";
import {
	END_CALL_GRACE_MS,
	END_CALL_TOOL,
	REALTIME_CONNECT_TIMEOUT_MS,
	REALTIME_MISSING_WS,
	REALTIME_PCM_BYTES_PER_MS,
	REALTIME_SAMPLE_RATE,
	REALTIME_URL,
} from "../defaults";

type RealtimeEvent = { type: string; [key: string]: any };

interface PlayingItem {
	itemId: string;
	contentIndex: number;
	responseId: string;
	receivedMs: number;
}

function loadWs(): typeof WebSocket {
	try {
		return require("ws");
	} catch {
		throw new Error(REALTIME_MISSING_WS);
	}
}

/**
 * One voice conversation between a call and an OpenAI Realtime model.
 * The caller's audio goes to the model, the model's speech goes into the call, and the caller can interrupt the model.
 * The model can end the call after saying goodbye.
 */
export class RealtimeVoiceSession {
	private socket?: WebSocket;
	private playing?: PlayingItem;
	private readonly interrupted = new Set<string>();
	private ending = false;
	private ended = false;
	private endWith!: (end: VoiceSessionEnd) => void;
	private readonly end: Promise<VoiceSessionEnd>;

	/**
	 * Creates the session.
	 *
	 * @param calls - Open calls connection of the instance, with the call dialed or accepted
	 * @param options - Model, voice, instructions and voice activity settings
	 * @param onError - Receives errors that do not end the call
	 */
	constructor(
		private readonly calls: CallsConnection,
		private readonly options: VoiceSessionOptions,
		private readonly onError: (error: Error) => void = (error) => console.error("Voice call error:", error.message),
	) {
		this.end = new Promise((resolve) => {
			this.endWith = resolve;
		});
	}

	/**
	 * Connects the call audio and the model, and runs the conversation until the call or the model connection ends.
	 *
	 * @returns Why the session ended
	 */
	async run(): Promise<VoiceSessionEnd> {
		const connecting = this.connect();
		connecting.catch(() => undefined);
		const onCallEnd = () => this.finish("call-ended");
		const onPcm = (pcm: Buffer) => this.send({type: "input_audio_buffer.append", audio: pcm.toString("base64")});
		this.calls.on("end-call", onCallEnd);
		const timer = setTimeout(() => this.finish("max-duration"), this.options.maxCallSeconds * 1000);
		try {
			await this.calls.startAudioBridge();
			this.socket = await connecting;
			await this.calls.waitFor("on-call", this.options.answerTimeoutMs);
			if (this.ended) {
				return await this.end;
			}
			this.calls.on("remote-pcm", onPcm);
			if (this.options.greeting) {
				this.send({type: "response.create", response: {instructions: this.options.greeting}});
			}
			return await this.end;
		} catch (error) {
			if (this.ended) {
				return await this.end;
			}
			if ((error as {code?: string}).code === "CALL_ENDED") {
				return "call-ended";
			}
			throw error;
		} finally {
			this.ended = true;
			clearTimeout(timer);
			this.calls.off("end-call", onCallEnd);
			this.calls.off("remote-pcm", onPcm);
			this.calls.clearAudio();
			connecting.then((socket) => socket.close(), () => undefined);
		}
	}

	private connect(): Promise<WebSocket> {
		const WebSocketClass = loadWs();
		return new Promise((resolve, reject) => {
			const url = `${REALTIME_URL}?model=${encodeURIComponent(this.options.model)}`;
			const socket = new WebSocketClass(url, {headers: {Authorization: `Bearer ${this.options.apiKey}`}});
			let configured = false;
			const fail = (error: Error) => {
				clearTimeout(timer);
				socket.terminate();
				reject(error);
			};
			const timer = setTimeout(() => fail(new Error("OpenAI Realtime did not answer in time")), REALTIME_CONNECT_TIMEOUT_MS);

			socket.on("open", () => {
				socket.send(JSON.stringify({type: "session.update", session: this.sessionSettings()}));
			});
			socket.on("message", (data) => {
				let event: RealtimeEvent;
				try {
					event = JSON.parse(data.toString());
				} catch {
					return;
				}
				if (configured) {
					this.onEvent(event);
					return;
				}
				if (event.type === "session.updated") {
					configured = true;
					clearTimeout(timer);
					resolve(socket);
				} else if (event.type === "error") {
					fail(new Error(`OpenAI Realtime refused the session: ${event.error?.message ?? "unknown error"}`));
				}
			});
			socket.on("error", (error) => {
				if (!configured) {
					fail(error);
				} else {
					this.onError(error);
				}
			});
			socket.on("close", (code, reason) => {
				if (!configured) {
					fail(new Error(`OpenAI Realtime closed the connection (${code} ${reason.toString()})`));
				} else {
					this.finish("realtime-closed");
				}
			});
		});
	}

	private sessionSettings(): Record<string, unknown> {
		const {vad} = this.options;
		const format = {type: "audio/pcm", rate: REALTIME_SAMPLE_RATE};
		return {
			type: "realtime",
			output_modalities: ["audio"],
			...(this.options.instructions ? {instructions: this.options.instructions} : {}),
			tools: [END_CALL_TOOL],
			tool_choice: "auto",
			audio: {
				input: {
					format,
					noise_reduction: vad.noiseReduction ? {type: vad.noiseReduction} : null,
					turn_detection: {
						type: "server_vad",
						threshold: vad.threshold,
						prefix_padding_ms: vad.prefixPaddingMs,
						silence_duration_ms: vad.silenceDurationMs,
						create_response: true,
						interrupt_response: true,
					},
				},
				output: {format, voice: this.options.voice},
			},
		};
	}

	private onEvent(event: RealtimeEvent): void {
		switch (event.type) {
			case "response.output_audio.delta":
				this.onAudio(event);
				return;
			case "input_audio_buffer.speech_started":
				this.interrupt();
				return;
			case "response.done":
				if (event.response?.output?.some((item: RealtimeEvent) => item.type === "function_call" && item.name === END_CALL_TOOL.name)) {
					this.endByModel();
				}
				return;
			case "error":
				this.onError(new Error(`OpenAI Realtime: ${event.error?.message ?? "unknown error"}`));
				return;
		}
	}

	private onAudio(event: RealtimeEvent): void {
		if (this.ending || this.ended || this.interrupted.has(event.response_id)) {
			return;
		}
		const pcm = Buffer.from(event.delta, "base64");
		let playing = this.playing;
		if (!playing || playing.itemId !== event.item_id || playing.contentIndex !== event.content_index) {
			playing = {itemId: event.item_id, contentIndex: event.content_index, responseId: event.response_id, receivedMs: 0};
			this.playing = playing;
		}
		playing.receivedMs += pcm.length / REALTIME_PCM_BYTES_PER_MS;
		try {
			this.calls.sendPcm(pcm);
		} catch (error) {
			this.onError(error as Error);
		}
	}

	private interrupt(): void {
		if (this.ending) {
			return;
		}
		const playing = this.playing;
		this.playing = undefined;
		const pendingMs = this.calls.pendingAudioMs;
		this.calls.clearAudio();
		if (!playing) {
			return;
		}
		this.interrupted.add(playing.responseId);
		if (pendingMs <= 0) {
			return;
		}
		this.send({
			type: "conversation.item.truncate",
			item_id: playing.itemId,
			content_index: playing.contentIndex,
			audio_end_ms: Math.max(0, Math.floor(playing.receivedMs - pendingMs)),
		});
	}

	private endByModel(): void {
		if (this.ending || this.ended) {
			return;
		}
		this.ending = true;
		this.calls.drainAudio()
			.catch(() => undefined)
			.then(() => new Promise((resolve) => setTimeout(resolve, END_CALL_GRACE_MS)))
			.then(() => this.finish("model-ended"));
	}

	private send(event: RealtimeEvent): void {
		if (!this.ended && this.socket && this.socket.readyState === this.socket.OPEN) {
			this.socket.send(JSON.stringify(event));
		}
	}

	private finish(end: VoiceSessionEnd): void {
		if (this.ended) {
			return;
		}
		this.ended = true;
		this.endWith(end);
	}
}
