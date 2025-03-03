import { Message } from "@green-api/whatsapp-chatbot-js-v2";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { GPTSessionData } from "../types";

/**
 * Middleware function for processing messages before sending to OpenAI
 */
export type ProcessMessageMiddleware = (
	message: Message,
	messageContent: any,
	messages: ChatCompletionMessageParam[],
	sessionData: GPTSessionData,
) => Promise<{
	messageContent: any;
	messages: ChatCompletionMessageParam[];
}>;

/**
 * Middleware function for processing OpenAI responses before sending to user
 */
export type ProcessResponseMiddleware = (
	response: string,
	messages: ChatCompletionMessageParam[],
	sessionData: GPTSessionData,
) => Promise<{
	response: string;
	messages: ChatCompletionMessageParam[];
}>;

/**
 * Middleware manager to handle processing pipelines
 */
export class MiddlewareManager {
	private messageMiddlewares: ProcessMessageMiddleware[] = [];
	private responseMiddlewares: ProcessResponseMiddleware[] = [];

	/**
	 * Add middleware to process messages before sending to OpenAI
	 */
	addMessageMiddleware(middleware: ProcessMessageMiddleware): void {
		this.messageMiddlewares.push(middleware);
	}

	/**
	 * Add middleware to process responses before sending to the user
	 */
	addResponseMiddleware(middleware: ProcessResponseMiddleware): void {
		this.responseMiddlewares.push(middleware);
	}

	/**
	 * Process a message through all message middlewares
	 */
	async processMessage(
		message: Message,
		initialMessageContent: any,
		messages: ChatCompletionMessageParam[],
		sessionData: GPTSessionData,
	): Promise<{
		messageContent: any;
		messages: ChatCompletionMessageParam[];
	}> {
		let result = {
			messageContent: initialMessageContent,
			messages,
		};

		for (const middleware of this.messageMiddlewares) {
			result = await middleware(message, result.messageContent, result.messages, sessionData);
		}

		return result;
	}

	/**
	 * Process a response through all response middlewares
	 */
	async processResponse(
		initialResponse: string,
		messages: ChatCompletionMessageParam[],
		sessionData: GPTSessionData,
	): Promise<{
		response: string;
		messages: ChatCompletionMessageParam[];
	}> {
		let result = {
			response: initialResponse,
			messages,
		};

		for (const middleware of this.responseMiddlewares) {
			result = await middleware(result.response, result.messages, sessionData);
		}

		return result;
	}
}
