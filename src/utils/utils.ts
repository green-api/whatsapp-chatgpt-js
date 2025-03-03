import { createReadStream } from "fs";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import * as https from "https";
import * as util from "util";
import * as stream from "stream";
import OpenAI from "openai";

const pipeline = util.promisify(stream.pipeline);

/**
 * Utility functions for the WhatsApp GPT bot
 */
export class Utils {
	/**
	 * Downloads a media file from a URL to a temporary file
	 *
	 * @param url URL of the media file
	 * @param extension Optional file extension (default: determined from URL)
	 * @returns Path to the downloaded temporary file
	 */
	static async downloadMedia(url: string, extension?: string): Promise<string> {
		const tempDir = os.tmpdir();
		const ext = extension || path.extname(url) || ".bin";
		const tempFile = path.join(tempDir, `whatsapp-media-${Date.now()}${ext}`);
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

	/**
	 * Transcribes an audio file using OpenAI's Whisper API
	 *
	 * @param filePath Path to the audio file
	 * @param openai OpenAI client instance
	 * @returns Transcribed text
	 */
	static async transcribeAudio(filePath: string, openai: OpenAI): Promise<string> {
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

	/**
	 * Trims conversation history to keep it within token limits
	 *
	 * @param messages Array of messages
	 * @param maxMessages Maximum number of messages to keep
	 * @param preserveSystem Whether to preserve the system message
	 * @returns Trimmed message array
	 */
	static trimConversationHistory(
		messages: any[],
		maxMessages: number,
		preserveSystem: boolean = true,
	): any[] {
		if (messages.length <= maxMessages) {
			return [...messages];
		}

		if (preserveSystem && messages[0]?.role === "system") {
			const systemMessage = messages[0];
			const recentMessages = messages.slice(-(maxMessages - 1));
			return [systemMessage, ...recentMessages];
		}

		return messages.slice(-maxMessages);
	}

	/**
	 * Estimates token usage for a conversation
	 * Very rough estimate: ~4 chars per token
	 *
	 * @param messages Conversation messages
	 * @returns Estimated token count
	 */
	static estimateTokens(messages: any[]): number {
		let totalChars = 0;

		for (const message of messages) {
			if (typeof message.content === "string") {
				totalChars += message.content.length;
			} else if (Array.isArray(message.content)) {
				for (const part of message.content) {
					if (part.type === "text") {
						totalChars += part.text?.length || 0;
					}
				}
			}
		}

		return Math.ceil(totalChars / 4);
	}
}
