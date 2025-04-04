import { BotConfig } from "@green-api/whatsapp-chatbot-js-v2";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

/**
 * Configuration options for the GPT WhatsApp bot
 */
export interface GPTBotConfig extends BotConfig {
	/** OpenAI API key */
	openaiApiKey: string;

	/** Model to use for chat completion */
	model: OpenAIModel;

	/** Maximum number of messages to keep in conversation history */
	maxHistoryLength?: number;

	/** System message to set assistant behavior */
	systemMessage?: string;

	/** Temperature for response generation */
	temperature?: number;

	/** Default reply when an error occurs */
	errorMessage?: string;
}

/**
 * Session data structure with conversation history
 */
export interface GPTSessionData {
	/** Conversation history */
	messages: ChatCompletionMessageParam[];

	/** Timestamp of last activity */
	lastActivity: number;

	/** Custom user state data */
	userData?: Record<string, any>;

	/** Context for the current conversation */
	context?: {
		/** Tags or metadata for the conversation */
		tags?: string[];

		/** Custom context variables */
		variables?: Record<string, any>;
	};
}

export type OpenAIModel =
// GPT-4 models
	| "gpt-4"
	| "gpt-4-turbo"
	| "gpt-4-turbo-preview"
	| "gpt-4-1106-preview"
	| "gpt-4-0125-preview"
	| "gpt-4-32k"

// GPT-4o models
	| "gpt-4o"
	| "gpt-4o-mini"
	| "gpt-4o-2024-05-13"

// GPT-3.5 models
	| "gpt-3.5-turbo"
	| "gpt-3.5-turbo-16k"
	| "gpt-3.5-turbo-1106"
	| "gpt-3.5-turbo-0125"

// o1 models
	| "o1"
	| "o1-mini"
	| "o1-preview";

/**
 * OpenAI models with image comprehension capabilities
 */
export type ImageCapableModel =
	| "gpt-4o"
	| "gpt-4o-mini"
	| "gpt-4-vision-preview"
	| "gpt-4-turbo"
	| "gpt-4-turbo-preview";

/**
 * Default model to use if none specified
 */
export const DEFAULT_MODEL: OpenAIModel = "gpt-4o";

/**
 * Check if a model supports image processing
 */
export function isImageCapableModel(model: string): boolean {
	return [
		"gpt-4o",
		"gpt-4o-mini",
		"gpt-4-vision-preview",
		"gpt-4-turbo",
		"gpt-4-turbo-preview",
	].includes(model);
}
