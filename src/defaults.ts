export const VOICE_DEFAULTS = {
	model: "gpt-realtime-2.1",
	voice: "marin",
	greeting: "Greet the caller briefly.",
	maxCallSeconds: 600,
	answerTimeoutMs: 60000,
	vad: {
		threshold: 0.5,
		prefixPaddingMs: 400,
		silenceDurationMs: 800,
		noiseReduction: "near_field",
	},
} as const;

export const REALTIME_URL = "wss://api.openai.com/v1/realtime";
export const REALTIME_SAMPLE_RATE = 24000;
export const REALTIME_PCM_BYTES_PER_MS = 48;
export const REALTIME_CONNECT_TIMEOUT_MS = 15000;
export const END_CALL_TOOL = {
	type: "function",
	name: "end_call",
	description: "Hangs up the phone call. Say goodbye first, then use it when the conversation is finished or the caller wants to end the call.",
	parameters: {type: "object", properties: {}, required: []},
} as const;
export const END_CALL_GRACE_MS = 500;
export const REALTIME_MISSING_WS ="Voice calls need the optional dependencies, install them with: npm install werift@^0.25.2 ws opusscript";
