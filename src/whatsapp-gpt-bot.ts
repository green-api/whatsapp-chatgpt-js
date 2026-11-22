import { WhatsAppBot, Message, State, CallEvent } from "@green-api/whatsapp-chatbot-js-v2";
import OpenAI from "openai";
import {
	DEFAULT_MODEL,
	GPTBotConfig,
	GPTSessionData,
	isImageCapableModel,
	OpenAIModel,
	VoiceCallsConfig,
	VoiceSessionOptions,
} from "./types";
import { MiddlewareManager } from "./middleware/middleware";
import { MessageHandler, MessageHandlerRegistry } from "./handlers/message-handlers";
import { RealtimeVoiceSession } from "./voice/realtime-session";
import { REALTIME_SAMPLE_RATE, VOICE_DEFAULTS } from "./defaults";

function voiceSessionOptions(voice: VoiceCallsConfig, apiKey: string, systemMessage: string): VoiceSessionOptions {
	return {
		apiKey,
		model: voice.model ?? VOICE_DEFAULTS.model,
		voice: voice.voice ?? VOICE_DEFAULTS.voice,
		instructions: voice.instructions ?? (systemMessage || undefined),
		greeting: voice.greeting ?? VOICE_DEFAULTS.greeting,
		maxCallSeconds: voice.maxCallSeconds ?? VOICE_DEFAULTS.maxCallSeconds,
		answerTimeoutMs: VOICE_DEFAULTS.answerTimeoutMs,
		vad: {
			threshold: voice.vad?.threshold ?? VOICE_DEFAULTS.vad.threshold,
			prefixPaddingMs: voice.vad?.prefixPaddingMs ?? VOICE_DEFAULTS.vad.prefixPaddingMs,
			silenceDurationMs: voice.vad?.silenceDurationMs ?? VOICE_DEFAULTS.vad.silenceDurationMs,
			noiseReduction: voice.vad?.noiseReduction === undefined ? VOICE_DEFAULTS.vad.noiseReduction : voice.vad.noiseReduction,
		},
	};
}

/**
 * WhatsApp bot with GPT integration
 */
export class WhatsappGptBot extends WhatsAppBot<GPTSessionData> {
	private readonly openai: OpenAI;
	private readonly maxHistoryLength: number;
	public readonly systemMessage: string;
	private readonly model: OpenAIModel;
	private readonly temperature: number;
	private readonly errorMessage: string;
	private readonly middleware: MiddlewareManager;
	private readonly messageHandlers: MessageHandlerRegistry;
	private readonly voiceOptions?: VoiceSessionOptions;
	private voiceSession?: RealtimeVoiceSession;

	/**
	 * Creates a new GPT WhatsApp bot instance
	 */
	constructor(config: GPTBotConfig) {
		super({
			...config,
			defaultState: "chat",
			calls: config.voiceCalls ? {...config.calls, pcmSampleRate: REALTIME_SAMPLE_RATE} : config.calls,
		});

		this.openai = new OpenAI({
			apiKey: config.openaiApiKey,
		});

		this.maxHistoryLength = config.maxHistoryLength || 10;
		this.model = config.model || DEFAULT_MODEL;
		this.temperature = config.temperature || 0.5;
		this.systemMessage = config.systemMessage || "";
		this.errorMessage = config.errorMessage ||
			"Sorry, I encountered an error processing your message. Please try again.";

		this.middleware = new MiddlewareManager();

		this.messageHandlers = new MessageHandlerRegistry(this.openai, this.model);

		this.addState(this.createChatState());

		if (config.voiceCalls) {
			this.voiceOptions = voiceSessionOptions(config.voiceCalls, config.openaiApiKey, this.systemMessage);
			if (config.voiceCalls.answerIncoming !== false) {
				this.onCall((call) => this.answerWithVoice(call));
			}
		}
	}

	/**
	 * Calls a chat and talks with the person through the OpenAI Realtime model when they answer.
	 * Needs voiceCalls in the config. Outgoing calls work only to chats that wrote or called in the last 72 hours.
	 *
	 * @param chatId - Chat to call
	 * @returns The call ID. The conversation runs in the background until the call ends
	 *
	 * @example
	 * ```typescript
	 * bot.onText("call me", async (message) => {
	 *   await bot.voiceCall(message.chatId);
	 * });
	 * ```
	 */
	async voiceCall(chatId: string): Promise<string> {
		if (!this.voiceOptions) {
			throw new Error("Voice calls are not configured, set voiceCalls in the bot config");
		}
		if (this.voiceSession) {
			throw new Error("A voice call is already running");
		}
		await this.connectCalls();
		const callId = await this.call(chatId);
		this.runVoiceSession().catch((error) => console.error("Voice call failed:", error.message));
		return callId;
	}

	/**
	 * Whether a voice conversation with the model is running now.
	 */
	get inVoiceCall(): boolean {
		return this.voiceSession !== undefined;
	}

	private async answerWithVoice(call: CallEvent): Promise<void> {
		if (call.direction !== "incoming" || call.status !== "offer" || this.voiceSession) {
			return;
		}
		try {
			await this.connectCalls();
			await this.acceptCall();
			await this.runVoiceSession();
		} catch (error) {
			console.error("Voice call failed:", (error as Error).message);
		}
	}

	private async runVoiceSession(): Promise<void> {
		const calls = await this.connectCalls();
		const session = new RealtimeVoiceSession(calls, this.voiceOptions!);
		this.voiceSession = session;
		try {
			const end = await session.run();
			if (end !== "call-ended") {
				await this.hangUp().catch(() => undefined);
			}
		} catch (error) {
			await this.hangUp().catch(() => undefined);
			throw error;
		} finally {
			if (this.voiceSession === session) {
				this.voiceSession = undefined;
			}
		}
	}

	/**
	 * Processes a message through the GPT model without using internal state management.
	 * Handles message preprocessing, GPT model interaction, and response processing.
	 *
	 * @param message - The message to process
	 * @param sessionData - Current session data containing message history and metadata.
	 *                     Defaults to empty messages array and current timestamp.
	 * @returns Object containing the processed response and updated session data
	 *
	 * @example
	 * ```typescript
	 * const { response, updatedData } = await gptBot.processMessage(message, {
	 *     messages: [{ role: "system", content: "You are a helpful assistant" }],
	 *     lastActivity: Date.now()
	 * });
	 * await bot.sendText(message.chatId, response);
	 * ```
	 */
	public async processMessage(message: Message, sessionData: GPTSessionData = {
		messages: [],
		lastActivity: Date.now(),
	}): Promise<{
		response: string;
		updatedData: GPTSessionData;
	}> {
		try {
			const {messageContent, messages} = await this.processMessageContent(message, sessionData);

			messages.push({
				role: "user",
				content: messageContent,
			});

			if (messages.length > this.maxHistoryLength + 1) {
				const systemMsg = messages[0];
				messages.splice(1, messages.length - this.maxHistoryLength);
				messages[0] = systemMsg;
			}

			const completion = await this.openai.chat.completions.create({
				model: this.model,
				messages: messages,
				temperature: this.temperature,
				max_tokens: 1000,
			});

			const assistantMessage = completion.choices[0]?.message || {content: "No response generated"};
			const response = assistantMessage.content || "No response generated";

			const {response: processedResponse, messages: processedMessages} =
				await this.middleware.processResponse(response, messages, sessionData);

			processedMessages.push({
				role: "assistant",
				content: processedResponse,
			});

			return {
				response: processedResponse,
				updatedData: {
					messages: processedMessages,
					lastActivity: Date.now(),
					userData: sessionData.userData || {},
					context: sessionData.context || {},
				},
			};
		} catch (error) {
			console.error("Error processing message:", error);
			return {
				response: this.errorMessage,
				updatedData: sessionData,
			};
		}
	}

	/**
	 * Add middleware to process messages before sending to the model
	 */
	addMessageMiddleware(middleware: any): this {
		this.middleware.addMessageMiddleware(middleware);
		return this;
	}

	/**
	 * Add middleware to process responses before sending to the user
	 */
	addResponseMiddleware(middleware: any): this {
		this.middleware.addResponseMiddleware(middleware);
		return this;
	}

	/**
	 * Register a custom message handler
	 */
	registerMessageHandler(handler: any, index?: number): this {
		this.messageHandlers.registerHandler(handler, index);
		return this;
	}

	/**
	 * Get the OpenAI client instance
	 */
	getOpenAI(): OpenAI {
		return this.openai;
	}

	/**
	 * Get the current model being used
	 */
	getModel(): OpenAIModel {
		return this.model;
	}

	/**
	 * Check if the current model supports image processing
	 */
	supportsImages(): boolean {
		return isImageCapableModel(this.model);
	}

	/**
	 * Replace a message handler with a new implementation
	 * @param handlerType The handler class to replace
	 * @param newHandler The new handler implementation
	 * @returns true if replacement succeeded, false otherwise
	 */
	replaceHandler(handlerType: new (...args: any[]) => MessageHandler, newHandler: MessageHandler): boolean {
		return this.messageHandlers.replaceHandler(handlerType, newHandler);
	}

	/**
	 * Process a message and prepare it for the model
	 */
	private async processMessageContent(
		message: Message,
		sessionData: GPTSessionData,
	): Promise<{ messageContent: any, messages: any[] }> {
		try {
			const initialContent = await this.messageHandlers.processMessage(message);

			const messages = [...sessionData.messages];

			return await this.middleware.processMessage(
				message,
				initialContent,
				messages,
				sessionData,
			);
		} catch (error) {
			console.error("Error processing message:", error);
			throw error;
		}
	}

	/**
	 * Creates the main chat state for handling conversations
	 */
	private createChatState(): State<GPTSessionData> {
		const systemMessage = this.systemMessage;
		const maxHistoryLength = this.maxHistoryLength;
		const openai = this.openai;
		const model = this.model;
		const temperature = this.temperature;
		const errorMessage = this.errorMessage;
		const middleware = this.middleware;

		const processMessageContent = this.processMessageContent.bind(this);
		const sendText = this.sendText.bind(this);

		return {
			name: "chat",
			async onEnter(_, data) {
				if (!data?.messages) {
					return {
						state: "chat",
						data: {
							messages: [
								{role: "system", content: systemMessage},
							],
							lastActivity: Date.now(),
						},
						continueToOnMessage: true,
					};
				}
				return undefined;
			},
			async onMessage(message, data = {messages: [], lastActivity: Date.now()}) {
				try {
					const {messageContent, messages} = await processMessageContent(
						message,
						data,
					);
					console.log(data);

					messages.push({
						role: "user",
						content: messageContent,
					});

					if (messages.length > maxHistoryLength + 1) { // +1 for system message
						const systemMsg = messages[0];
						messages.splice(1, messages.length - maxHistoryLength);
						messages[0] = systemMsg;
					}

					const completion = await openai.chat.completions.create({
						model: model,
						messages: messages,
						temperature: temperature,
						max_tokens: 1000,
					});

					const assistantMessage = completion.choices[0]?.message || {content: "No response generated"};
					const response = assistantMessage.content || "No response generated";

					const {response: processedResponse, messages: processedMessages} =
						await middleware.processResponse(response, messages, data);

					processedMessages.push({
						role: "assistant",
						content: processedResponse,
					});

					await sendText(message.chatId, processedResponse);

					return {
						state: "chat",
						data: {
							messages: processedMessages,
							lastActivity: Date.now(),
							userData: data.userData || {},
							context: data.context || {},
						},
					};
				} catch (error) {
					console.error("Error in chat state:", error);
					await sendText(message.chatId, errorMessage);
					return undefined;
				}
			},
		};
	}
}
