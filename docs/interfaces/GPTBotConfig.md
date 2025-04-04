[**WhatsApp Bot Framework**](../README.md)

***

[WhatsApp Bot Framework](../globals.md) / GPTBotConfig

# Interface: GPTBotConfig

Defined in: [types/index.ts:7](https://github.com/green-api/whatsapp-chatgpt-js/blob/a8d23283a95688db13d271291301a016d80fdc7a/src/types/index.ts#L7)

Configuration options for the GPT WhatsApp bot

## Extends

- `BotConfig`

## Properties

### errorMessage?

> `optional` **errorMessage**: `string`

Defined in: [types/index.ts:24](https://github.com/green-api/whatsapp-chatgpt-js/blob/a8d23283a95688db13d271291301a016d80fdc7a/src/types/index.ts#L24)

Default reply when an error occurs

***

### maxHistoryLength?

> `optional` **maxHistoryLength**: `number`

Defined in: [types/index.ts:15](https://github.com/green-api/whatsapp-chatgpt-js/blob/a8d23283a95688db13d271291301a016d80fdc7a/src/types/index.ts#L15)

Maximum number of messages to keep in conversation history

***

### model

> **model**: [`OpenAIModel`](../type-aliases/OpenAIModel.md)

Defined in: [types/index.ts:12](https://github.com/green-api/whatsapp-chatgpt-js/blob/a8d23283a95688db13d271291301a016d80fdc7a/src/types/index.ts#L12)

Model to use for chat completion

***

### openaiApiKey

> **openaiApiKey**: `string`

Defined in: [types/index.ts:9](https://github.com/green-api/whatsapp-chatgpt-js/blob/a8d23283a95688db13d271291301a016d80fdc7a/src/types/index.ts#L9)

OpenAI API key

***

### systemMessage?

> `optional` **systemMessage**: `string`

Defined in: [types/index.ts:18](https://github.com/green-api/whatsapp-chatgpt-js/blob/a8d23283a95688db13d271291301a016d80fdc7a/src/types/index.ts#L18)

System message to set assistant behavior

***

### temperature?

> `optional` **temperature**: `number`

Defined in: [types/index.ts:21](https://github.com/green-api/whatsapp-chatgpt-js/blob/a8d23283a95688db13d271291301a016d80fdc7a/src/types/index.ts#L21)

Temperature for response generation
