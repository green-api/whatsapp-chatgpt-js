[**WhatsApp Bot Framework**](../README.md)

***

[WhatsApp Bot Framework](../globals.md) / AudioMessageHandler

# Class: AudioMessageHandler

Defined in: [handlers/message-handlers.ts:77](https://github.com/green-api/whatsapp-chatgpt-js/blob/144b3e2baae49a260200b70637f606416abe2026/src/handlers/message-handlers.ts#L77)

Handles audio messages

## Implements

- [`MessageHandler`](../interfaces/MessageHandler.md)

## Constructors

### new AudioMessageHandler()

> **new AudioMessageHandler**(): [`AudioMessageHandler`](AudioMessageHandler.md)

#### Returns

[`AudioMessageHandler`](AudioMessageHandler.md)

## Methods

### canHandle()

> **canHandle**(`message`): `boolean`

Defined in: [handlers/message-handlers.ts:78](https://github.com/green-api/whatsapp-chatgpt-js/blob/144b3e2baae49a260200b70637f606416abe2026/src/handlers/message-handlers.ts#L78)

#### Parameters

##### message

`Message`

#### Returns

`boolean`

#### Implementation of

[`MessageHandler`](../interfaces/MessageHandler.md).[`canHandle`](../interfaces/MessageHandler.md#canhandle)

***

### processMessage()

> **processMessage**(`message`, `openai`): `Promise`\<`any`\>

Defined in: [handlers/message-handlers.ts:82](https://github.com/green-api/whatsapp-chatgpt-js/blob/144b3e2baae49a260200b70637f606416abe2026/src/handlers/message-handlers.ts#L82)

#### Parameters

##### message

`Message`

##### openai

`OpenAI`

#### Returns

`Promise`\<`any`\>

#### Implementation of

[`MessageHandler`](../interfaces/MessageHandler.md).[`processMessage`](../interfaces/MessageHandler.md#processmessage)
