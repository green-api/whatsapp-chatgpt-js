[**WhatsApp Bot Framework**](../README.md)

***

[WhatsApp Bot Framework](../globals.md) / TextMessageHandler

# Class: TextMessageHandler

Defined in: [handlers/message-handlers.ts:26](https://github.com/green-api/whatsapp-chatgpt-js/blob/1fdcaadfd7062f356e7347966f180de931a2fd84/src/handlers/message-handlers.ts#L26)

Handles text messages

## Implements

- [`MessageHandler`](../interfaces/MessageHandler.md)

## Constructors

### new TextMessageHandler()

> **new TextMessageHandler**(): [`TextMessageHandler`](TextMessageHandler.md)

#### Returns

[`TextMessageHandler`](TextMessageHandler.md)

## Methods

### canHandle()

> **canHandle**(`message`): `boolean`

Defined in: [handlers/message-handlers.ts:27](https://github.com/green-api/whatsapp-chatgpt-js/blob/1fdcaadfd7062f356e7347966f180de931a2fd84/src/handlers/message-handlers.ts#L27)

#### Parameters

##### message

`Message`

#### Returns

`boolean`

#### Implementation of

[`MessageHandler`](../interfaces/MessageHandler.md).[`canHandle`](../interfaces/MessageHandler.md#canhandle)

***

### processMessage()

> **processMessage**(`message`): `Promise`\<`any`\>

Defined in: [handlers/message-handlers.ts:31](https://github.com/green-api/whatsapp-chatgpt-js/blob/1fdcaadfd7062f356e7347966f180de931a2fd84/src/handlers/message-handlers.ts#L31)

#### Parameters

##### message

`Message`

#### Returns

`Promise`\<`any`\>

#### Implementation of

[`MessageHandler`](../interfaces/MessageHandler.md).[`processMessage`](../interfaces/MessageHandler.md#processmessage)
