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

	/** Voice calls with an OpenAI Realtime model. Without it the bot does not answer calls */
	voiceCalls?: VoiceCallsConfig;
}

/**
 * Voice calls handled by an OpenAI Realtime model: the caller talks with the model, the model can be interrupted.
 */
export interface VoiceCallsConfig {
	/** Realtime model. Default: gpt-realtime-2.1 */
	model?: string;

	/** Voice of the model, for example marin, cedar, alloy, ash, coral, sage, shimmer, verse. Default: marin */
	voice?: string;

	/** Instructions for the voice conversation. Default: systemMessage */
	instructions?: string;

	/** What the model is asked to say first when the call connects, false to wait until the caller speaks */
	greeting?: string | false;

	/** Whether to answer incoming calls with the model. Default: true */
	answerIncoming?: boolean;

	/** Longest call in seconds, the bot hangs up after it. Default: 600 */
	maxCallSeconds?: number;

	/** Voice activity detection of the caller's speech */
	vad?: VoiceActivityConfig;
}

/**
 * Settings of the server voice activity detection.
 */
export interface VoiceActivityConfig {
	/** Speech threshold from 0 to 1, higher needs louder speech. Default: 0.5 */
	threshold?: number;

	/** Audio kept before the detected speech, in milliseconds. Default: 400 */
	prefixPaddingMs?: number;

	/** Silence that ends the caller's turn, in milliseconds. Default: 800 */
	silenceDurationMs?: number;

	/** Noise reduction of the caller's audio, null to turn it off. Default: near_field */
	noiseReduction?: "near_field" | "far_field" | null;
}

/**
 * Voice call settings with the defaults applied.
 */
export interface VoiceSessionOptions {
	apiKey: string;
	model: string;
	voice: string;
	instructions?: string;
	greeting: string | false;
	maxCallSeconds: number;
	answerTimeoutMs: number;
	vad: Required<VoiceActivityConfig>;
}

/**
 * Why a voice session ended: the call ended, the model ended the call after saying goodbye, the OpenAI connection closed,
 * or the call reached maxCallSeconds.
 */
export type VoiceSessionEnd = "call-ended" | "model-ended" | "realtime-closed" | "max-duration";

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
