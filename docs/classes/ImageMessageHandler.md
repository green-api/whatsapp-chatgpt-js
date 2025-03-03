[**WhatsApp Bot Framework**](../README.md)

***

[WhatsApp Bot Framework](../globals.md) / ImageMessageHandler

# Class: ImageMessageHandler

Defined in: [handlers/message-handlers.ts:39](https://github.com/green-api/whatsapp-chatgpt-js/blob/144b3e2baae49a260200b70637f606416abe2026/src/handlers/message-handlers.ts#L39)

Handles image messages

## Implements

- [`MessageHandler`](../interfaces/MessageHandler.md)

## Constructors

### new ImageMessageHandler()

> **new ImageMessageHandler**(): [`ImageMessageHandler`](ImageMessageHandler.md)

#### Returns

[`ImageMessageHandler`](ImageMessageHandler.md)

## Methods

### canHandle()

> **canHandle**(`message`): `boolean`

Defined in: [handlers/message-handlers.ts:40](https://github.com/green-api/whatsapp-chatgpt-js/blob/144b3e2baae49a260200b70637f606416abe2026/src/handlers/message-handlers.ts#L40)

#### Parameters

##### message

`Message`

#### Returns

`boolean`

#### Implementation of

[`MessageHandler`](../interfaces/MessageHandler.md).[`canHandle`](../interfaces/MessageHandler.md#canhandle)

***

### processMessage()

> **processMessage**(`message`, `_`, `model`): `Promise`\<`any`\>

Defined in: [handlers/message-handlers.ts:44](https://github.com/green-api/whatsapp-chatgpt-js/blob/144b3e2baae49a260200b70637f606416abe2026/src/handlers/message-handlers.ts#L44)

#### Parameters

##### message

`Message`

##### \_

`OpenAI`

##### model

[`OpenAIModel`](../type-aliases/OpenAIModel.md)

#### Returns

`Promise`\<`any`\>

#### Implementation of

[`MessageHandler`](../interfaces/MessageHandler.md).[`processMessage`](../interfaces/MessageHandler.md#processmessage)
