[**WhatsApp Bot Framework**](../README.md)

***

[WhatsApp Bot Framework](../globals.md) / MessageHandlerRegistry

# Class: MessageHandlerRegistry

Defined in: [handlers/message-handlers.ts:238](https://github.com/green-api/whatsapp-chatgpt-js/blob/144b3e2baae49a260200b70637f606416abe2026/src/handlers/message-handlers.ts#L238)

Message handler registry that processes WhatsApp messages for OpenAI

## Constructors

### new MessageHandlerRegistry()

> **new MessageHandlerRegistry**(`openai`, `model`): [`MessageHandlerRegistry`](MessageHandlerRegistry.md)

Defined in: [handlers/message-handlers.ts:243](https://github.com/green-api/whatsapp-chatgpt-js/blob/144b3e2baae49a260200b70637f606416abe2026/src/handlers/message-handlers.ts#L243)

#### Parameters

##### openai

`OpenAI`

##### model

[`OpenAIModel`](../type-aliases/OpenAIModel.md)

#### Returns

[`MessageHandlerRegistry`](MessageHandlerRegistry.md)

## Methods

### processMessage()

> **processMessage**(`message`): `Promise`\<`any`\>

Defined in: [handlers/message-handlers.ts:295](https://github.com/green-api/whatsapp-chatgpt-js/blob/144b3e2baae49a260200b70637f606416abe2026/src/handlers/message-handlers.ts#L295)

Process a message using the appropriate handler

#### Parameters

##### message

`Message`

#### Returns

`Promise`\<`any`\>

***

### registerHandler()

> **registerHandler**(`handler`, `index`?): `void`

Defined in: [handlers/message-handlers.ts:284](https://github.com/green-api/whatsapp-chatgpt-js/blob/144b3e2baae49a260200b70637f606416abe2026/src/handlers/message-handlers.ts#L284)

Register a custom message handler

#### Parameters

##### handler

[`MessageHandler`](../interfaces/MessageHandler.md)

The handler to register

##### index?

`number`

Optional position to insert the handler (default: before fallback)

#### Returns

`void`

***

### replaceHandler()

> **replaceHandler**(`handlerType`, `newHandler`): `boolean`

Defined in: [handlers/message-handlers.ts:270](https://github.com/green-api/whatsapp-chatgpt-js/blob/144b3e2baae49a260200b70637f606416abe2026/src/handlers/message-handlers.ts#L270)

Replace a handler of a specific type with a new handler

#### Parameters

##### handlerType

(...`args`) => [`MessageHandler`](../interfaces/MessageHandler.md)

The constructor of the handler type to replace

##### newHandler

[`MessageHandler`](../interfaces/MessageHandler.md)

The new handler to use instead

#### Returns

`boolean`

true if a handler was replaced, false otherwise
