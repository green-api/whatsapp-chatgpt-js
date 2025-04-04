[**WhatsApp Bot Framework**](../README.md)

***

[WhatsApp Bot Framework](../globals.md) / ProcessMessageMiddleware

# Type Alias: ProcessMessageMiddleware()

> **ProcessMessageMiddleware**: (`message`, `messageContent`, `messages`, `sessionData`) => `Promise`\<\{ `messageContent`: `any`; `messages`: `ChatCompletionMessageParam`[]; \}\>

Defined in: [middleware/middleware.ts:8](https://github.com/green-api/whatsapp-chatgpt-js/blob/a8d23283a95688db13d271291301a016d80fdc7a/src/middleware/middleware.ts#L8)

Middleware function for processing messages before sending to OpenAI

## Parameters

### message

`Message`

### messageContent

`any`

### messages

`ChatCompletionMessageParam`[]

### sessionData

[`GPTSessionData`](../interfaces/GPTSessionData.md)

## Returns

`Promise`\<\{ `messageContent`: `any`; `messages`: `ChatCompletionMessageParam`[]; \}\>
