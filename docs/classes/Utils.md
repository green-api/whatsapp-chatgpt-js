[**WhatsApp Bot Framework**](../README.md)

***

[WhatsApp Bot Framework](../globals.md) / Utils

# Class: Utils

Defined in: [utils/utils.ts:15](https://github.com/green-api/whatsapp-chatgpt-js/blob/144b3e2baae49a260200b70637f606416abe2026/src/utils/utils.ts#L15)

Utility functions for the WhatsApp GPT bot

## Constructors

### new Utils()

> **new Utils**(): [`Utils`](Utils.md)

#### Returns

[`Utils`](Utils.md)

## Methods

### downloadMedia()

> `static` **downloadMedia**(`url`, `extension`?): `Promise`\<`string`\>

Defined in: [utils/utils.ts:23](https://github.com/green-api/whatsapp-chatgpt-js/blob/144b3e2baae49a260200b70637f606416abe2026/src/utils/utils.ts#L23)

Downloads a media file from a URL to a temporary file

#### Parameters

##### url

`string`

URL of the media file

##### extension?

`string`

Optional file extension (default: determined from URL)

#### Returns

`Promise`\<`string`\>

Path to the downloaded temporary file

***

### estimateTokens()

> `static` **estimateTokens**(`messages`): `number`

Defined in: [utils/utils.ts:97](https://github.com/green-api/whatsapp-chatgpt-js/blob/144b3e2baae49a260200b70637f606416abe2026/src/utils/utils.ts#L97)

Estimates token usage for a conversation
Very rough estimate: ~4 chars per token

#### Parameters

##### messages

`any`[]

Conversation messages

#### Returns

`number`

Estimated token count

***

### transcribeAudio()

> `static` **transcribeAudio**(`filePath`, `openai`): `Promise`\<`string`\>

Defined in: [utils/utils.ts:50](https://github.com/green-api/whatsapp-chatgpt-js/blob/144b3e2baae49a260200b70637f606416abe2026/src/utils/utils.ts#L50)

Transcribes an audio file using OpenAI's Whisper API

#### Parameters

##### filePath

`string`

Path to the audio file

##### openai

`OpenAI`

OpenAI client instance

#### Returns

`Promise`\<`string`\>

Transcribed text

***

### trimConversationHistory()

> `static` **trimConversationHistory**(`messages`, `maxMessages`, `preserveSystem`): `any`[]

Defined in: [utils/utils.ts:72](https://github.com/green-api/whatsapp-chatgpt-js/blob/144b3e2baae49a260200b70637f606416abe2026/src/utils/utils.ts#L72)

Trims conversation history to keep it within token limits

#### Parameters

##### messages

`any`[]

Array of messages

##### maxMessages

`number`

Maximum number of messages to keep

##### preserveSystem

`boolean` = `true`

Whether to preserve the system message

#### Returns

`any`[]

Trimmed message array
