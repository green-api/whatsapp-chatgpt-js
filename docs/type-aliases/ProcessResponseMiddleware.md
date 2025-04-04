[**WhatsApp Bot Framework**](../README.md)

***

[WhatsApp Bot Framework](../globals.md) / ProcessResponseMiddleware

# Type Alias: ProcessResponseMiddleware()

> **ProcessResponseMiddleware**: (`response`, `messages`, `sessionData`) => `Promise`\<\{ `messages`: `ChatCompletionMessageParam`[]; `response`: `string`; \}\>

Defined in: [middleware/middleware.ts:21](https://github.com/green-api/whatsapp-chatgpt-js/blob/a8d23283a95688db13d271291301a016d80fdc7a/src/middleware/middleware.ts#L21)

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
