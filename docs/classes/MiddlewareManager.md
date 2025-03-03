[**WhatsApp Bot Framework**](../README.md)

***

[WhatsApp Bot Framework](../globals.md) / MiddlewareManager

# Class: MiddlewareManager

Defined in: [middleware/middleware.ts:33](https://github.com/green-api/whatsapp-chatgpt-js/blob/144b3e2baae49a260200b70637f606416abe2026/src/middleware/middleware.ts#L33)

Middleware manager to handle processing pipelines

## Constructors

### new MiddlewareManager()

> **new MiddlewareManager**(): [`MiddlewareManager`](MiddlewareManager.md)

#### Returns

[`MiddlewareManager`](MiddlewareManager.md)

## Methods

### addMessageMiddleware()

> **addMessageMiddleware**(`middleware`): `void`

Defined in: [middleware/middleware.ts:40](https://github.com/green-api/whatsapp-chatgpt-js/blob/144b3e2baae49a260200b70637f606416abe2026/src/middleware/middleware.ts#L40)

Add middleware to process messages before sending to OpenAI

#### Parameters

##### middleware

[`ProcessMessageMiddleware`](../type-aliases/ProcessMessageMiddleware.md)

#### Returns

`void`

***

### addResponseMiddleware()

> **addResponseMiddleware**(`middleware`): `void`

Defined in: [middleware/middleware.ts:47](https://github.com/green-api/whatsapp-chatgpt-js/blob/144b3e2baae49a260200b70637f606416abe2026/src/middleware/middleware.ts#L47)

Add middleware to process responses before sending to the user

#### Parameters

##### middleware

[`ProcessResponseMiddleware`](../type-aliases/ProcessResponseMiddleware.md)

#### Returns

`void`

***

### processMessage()

> **processMessage**(`message`, `initialMessageContent`, `messages`, `sessionData`): `Promise`\<\{ `messageContent`: `any`; `messages`: `ChatCompletionMessageParam`[]; \}\>

Defined in: [middleware/middleware.ts:54](https://github.com/green-api/whatsapp-chatgpt-js/blob/144b3e2baae49a260200b70637f606416abe2026/src/middleware/middleware.ts#L54)

Process a message through all message middlewares

#### Parameters

##### message

`Message`

##### initialMessageContent

`any`

##### messages

`ChatCompletionMessageParam`[]

##### sessionData

[`GPTSessionData`](../interfaces/GPTSessionData.md)

#### Returns

`Promise`\<\{ `messageContent`: `any`; `messages`: `ChatCompletionMessageParam`[]; \}\>

***

### processResponse()

> **processResponse**(`initialResponse`, `messages`, `sessionData`): `Promise`\<\{ `messages`: `ChatCompletionMessageParam`[]; `response`: `string`; \}\>

Defined in: [middleware/middleware.ts:78](https://github.com/green-api/whatsapp-chatgpt-js/blob/144b3e2baae49a260200b70637f606416abe2026/src/middleware/middleware.ts#L78)

Process a response through all response middlewares

#### Parameters

##### initialResponse

`string`

##### messages

`ChatCompletionMessageParam`[]

##### sessionData

[`GPTSessionData`](../interfaces/GPTSessionData.md)

#### Returns

`Promise`\<\{ `messages`: `ChatCompletionMessageParam`[]; `response`: `string`; \}\>
