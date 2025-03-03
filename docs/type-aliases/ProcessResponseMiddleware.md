[**WhatsApp Bot Framework**](../README.md)

***

[WhatsApp Bot Framework](../globals.md) / ProcessResponseMiddleware

# Type Alias: ProcessResponseMiddleware()

> **ProcessResponseMiddleware**: (`response`, `messages`, `sessionData`) => `Promise`\<\{ `messages`: `ChatCompletionMessageParam`[]; `response`: `string`; \}\>

Defined in: [middleware/middleware.ts:21](https://github.com/green-api/whatsapp-chatgpt-js/blob/144b3e2baae49a260200b70637f606416abe2026/src/middleware/middleware.ts#L21)

Middleware function for processing OpenAI responses before sending to user

## Parameters

### response

`string`

### messages

`ChatCompletionMessageParam`[]

### sessionData

[`GPTSessionData`](../interfaces/GPTSessionData.md)

## Returns

`Promise`\<\{ `messages`: `ChatCompletionMessageParam`[]; `response`: `string`; \}\>
