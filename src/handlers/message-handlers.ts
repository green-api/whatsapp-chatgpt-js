import OpenAI from "openai";
import { createReadStream } from "fs";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import * as https from "https";
import * as util from "util";
import * as stream from "stream";
import { Message } from "@green-api/whatsapp-chatbot-js-v2";
import { isImageCapableModel, OpenAIModel } from "../types";

const pipeline = util.promisify(stream.pipeline);

/**
 * Base handler interface for processing different message types
 */
export interface MessageHandler {
	canHandle(message: Message): boolean;

	processMessage(message: Message, openai: OpenAI, model?: string): Promise<any>;
}

/**
 * Handles text messages
 */
export class TextMessageHandler implements MessageHandler {
	canHandle(message: Message): boolean {
		return message.type === "text" && !!message.text;
	}

	async processMessage(message: Message): Promise<any> {
		return message.text || "Empty message";
	}
}

/**
 * Handles image messages
 */
export class ImageMessageHandler implements MessageHandler {
	canHandle(message: Message): boolean {
		return message.type === "image" && !!message.media?.url;
	}

	async processMessage(message: Message, _: OpenAI, model: OpenAIModel): Promise<any> {
		const supportsImages = isImageCapableModel(model);
		const caption = message.media?.caption || "Analyzing this image";

		if (supportsImages) {
			return [
				{type: "text", text: caption},
				{type: "image_url", image_url: {url: message.media!.url}},
			];
		} else {
			// For non-vision models
			return `[The user sent an image${caption ? ` with caption: "${caption}"` : ""}]`;
		}
	}
}

/**
 * Handles video messages
 */
export class VideoMessageHandler implements MessageHandler {
	canHandle(message: Message): boolean {
		return message.type === "video" && !!message.media?.url;
	}

	async processMessage(message: Message): Promise<any> {
		const caption = message.media?.caption ? ` with caption: "${message.media.caption}"` : "";
		return `[The user sent a video ${message.media?.fileName}${caption}]`;
	}
}

/**
 * Handles audio messages
 */
export class AudioMessageHandler implements MessageHandler {
	canHandle(message: Message): boolean {
		return message.type === "audio" && !!message.media?.url;
	}

	async processMessage(message: Message, openai: OpenAI): Promise<any> {
		try {
			const tempFile = await this.downloadMedia(message.media!.url!);
			const transcription = await this.transcribeAudio(tempFile, openai);
			fs.unlinkSync(tempFile);

			return `[The user sent an audio. Transcription: "${transcription}"]`;
		} catch (error) {
			console.error("Error processing audio:", error);
			return "[The user sent an audio message that couldn't be transcribed]";
		}
	}

	private async downloadMedia(url: string): Promise<string> {
		const tempDir = os.tmpdir();
		const tempFile = path.join(tempDir, `whatsapp-audio-${Date.now()}.ogg`);
		const fileStream = fs.createWriteStream(tempFile);

		return new Promise<string>((resolve, reject) => {
			https.get(url, (response) => {
				if (response.statusCode !== 200) {
					reject(new Error(`Failed to download: ${response.statusCode}`));
					return;
				}

				pipeline(response, fileStream)
					.then(() => resolve(tempFile))
					.catch(reject);
			}).on("error", reject);
		});
	}

	private async transcribeAudio(filePath: string, openai: OpenAI): Promise<string> {
		try {
			const transcription = await openai.audio.transcriptions.create({
				file: createReadStream(filePath) as any,
				model: "whisper-1",
			});

			return transcription.text;
		} catch (error) {
			console.error("Transcription error:", error);
			throw new Error("Failed to transcribe audio");
		}
	}
}

/**
 * Handles document messages
 */
export class DocumentMessageHandler implements MessageHandler {
	canHandle(message: Message): boolean {
		return message.type === "document" && !!message.media?.url;
	}

	async processMessage(message: Message): Promise<any> {
		const fileName = message.media?.fileName || "unknown file";
		const caption = message.media?.caption ? ` with caption: "${message.media.caption}"` : "";
		return `[The user sent a document: "${fileName}"${caption}]`;
	}
}

/**
 * Handles poll messages
 */
export class PollMessageHandler implements MessageHandler {
	canHandle(message: Message): boolean {
		return message.type === "poll" && !!message.poll;
	}

	async processMessage(message: Message): Promise<any> {
		const pollName = message.poll?.name || "unnamed poll";
		const options = message.poll?.options?.map(o => o.optionName).join(", ") || "no options";
		return `[The user created a poll: "${pollName}" with options: ${options}]`;
	}
}

/**
 * Handles poll update messages
 */
export class PollUpdateMessageHandler implements MessageHandler {
	canHandle(message: Message): boolean {
		return message.type === "pollUpdate" && !!message.pollUpdate;
	}

	async processMessage(message: Message): Promise<any> {
		const pollName = message.pollUpdate?.name || "unnamed poll";
		const votes = message.pollUpdate?.votes || [];

		// Format votes information
		const voteInfo = votes.map(vote => {
			const voters = vote.optionVoters.length;
			return `"${vote.optionName}" (${voters} vote${voters !== 1 ? "s" : ""})`;
		}).join(", ");

		return `[The user voted in poll: "${pollName}" with results: ${voteInfo}]`;
	}
}

/**
 * Handles location messages
 */
export class LocationMessageHandler implements MessageHandler {
	canHandle(message: Message): boolean {
		return message.type === "location" && !!message.location;
	}

	async processMessage(message: Message): Promise<any> {
		const name = message.location?.name || "unnamed location";
		const address = message.location?.address ? ` (${message.location.address})` : "";
		const coords = `${message.location?.latitude}, ${message.location?.longitude}`;
		return `[The user shared a location: "${name}"${address} at coordinates: ${coords}]`;
	}
}

/**
 * Handles contact messages
 */
export class ContactMessageHandler implements MessageHandler {
	canHandle(message: Message): boolean {
		return message.type === "contact" && !!message.contact;
	}

	async processMessage(message: Message): Promise<any> {
		const contactName = message.contact?.displayName || "unknown";
		const vcard = message.contact?.vcard || "";

		const phoneMatch = vcard.match(/TEL(?:;[^:]+)?:([+\d\s-]+)/);
		const phoneNumber = phoneMatch ? phoneMatch[1] : null;

		let response = `[The user shared a contact: "${contactName}"]`;

		if (phoneNumber) {
			response += `\nPhone: ${phoneNumber}`;
		}

		return response;
	}
}

/**
 * Fallback handler for unsupported message types
 */
export class FallbackMessageHandler implements MessageHandler {
	canHandle(_: Message): boolean {
		return true;
	}

	async processMessage(message: Message): Promise<any> {
		return `[The user sent a ${message.type} message]`;
	}
}

/**
 * Message handler registry that processes WhatsApp messages for OpenAI
 */
export class MessageHandlerRegistry {
	private handlers: MessageHandler[] = [];
	private readonly openai: OpenAI;
	private readonly model: OpenAIModel;

	constructor(openai: OpenAI, model: OpenAIModel) {
		this.openai = openai;
		this.model = model;
		this.registerDefaultHandlers();
	}

	private registerDefaultHandlers(): void {
		this.handlers = [
			new TextMessageHandler(),
			new ImageMessageHandler(),
			new VideoMessageHandler(),
			new AudioMessageHandler(),
			new DocumentMessageHandler(),
			new PollMessageHandler(),
			new PollUpdateMessageHandler(),
			new LocationMessageHandler(),
			new ContactMessageHandler(),
			new FallbackMessageHandler(),
		];
	}

	/**
	 * Replace a handler of a specific type with a new handler
	 * @param handlerType The constructor of the handler type to replace
	 * @param newHandler The new handler to use instead
	 * @returns true if a handler was replaced, false otherwise
	 */
	replaceHandler(handlerType: new (...args: any[]) => MessageHandler, newHandler: MessageHandler): boolean {
		const index = this.handlers.findIndex(h => h instanceof handlerType);
		if (index >= 0) {
			this.handlers[index] = newHandler;
			return true;
		}
		return false;
	}

	/**
	 * Register a custom message handler
	 * @param handler The handler to register
	 * @param index Optional position to insert the handler (default: before fallback)
	 */
	registerHandler(handler: MessageHandler, index?: number): void {
		if (index !== undefined) {
			this.handlers.splice(index, 0, handler);
		} else {
			this.handlers.splice(this.handlers.length - 1, 0, handler);
		}
	}

	/**
	 * Process a message using the appropriate handler
	 */
	async processMessage(message: Message): Promise<any> {
		for (const handler of this.handlers) {
			if (handler.canHandle(message)) {
				if (handler instanceof ImageMessageHandler) {
					return handler.processMessage(message, this.openai, this.model);
				}
				return handler.processMessage(message, this.openai);
			}
		}

		// This should never happen as the fallback handler accepts all messages
		return "Unhandled message type";
	}
}
