import { WhatsAppBot, Message, State } from "@green-api/whatsapp-chatbot-js-v2";
import OpenAI from "openai";
import {
	DEFAULT_MODEL,
	GPTBotConfig,
	GPTSessionData,
	isImageCapableModel,
	MessageProcessingOptions,
	OpenAIModel,
} from "./types";
import { MiddlewareManager } from "./middleware/middleware";
import { MessageHandler, MessageHandlerRegistry } from "./handlers/message-handlers";

/**
 * WhatsApp bot with GPT integration
 */
export class WhatsappGptBot extends WhatsAppBot<GPTSessionData> {
	private readonly openai: OpenAI;
	private readonly maxHistoryLength: number;
	private readonly systemMessage: string;
	private readonly model: OpenAIModel;
	private readonly temperature: number;
	private readonly errorMessage: string;
	private readonly middleware: MiddlewareManager;
	private readonly messageHandlers: MessageHandlerRegistry;

	/**
	 * Creates a new GPT WhatsApp bot instance
	 */
	constructor(config: GPTBotConfig) {
		super({
			...config,
			defaultState: "chat",
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
		options: MessageProcessingOptions = {},
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
