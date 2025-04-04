[**WhatsApp Bot Framework**](../README.md)

***

[WhatsApp Bot Framework](../globals.md) / DocumentMessageHandler

# Class: DocumentMessageHandler

Defined in: [handlers/message-handlers.ts:132](https://github.com/green-api/whatsapp-chatgpt-js/blob/a8d23283a95688db13d271291301a016d80fdc7a/src/handlers/message-handlers.ts#L132)

Handles document messages

## Implements

- [`MessageHandler`](../interfaces/MessageHandler.md)

## Constructors

### new DocumentMessageHandler()

> **new DocumentMessageHandler**(): [`DocumentMessageHandler`](DocumentMessageHandler.md)

#### Returns

[`DocumentMessageHandler`](DocumentMessageHandler.md)

## Methods

### canHandle()

> **canHandle**(`message`): `boolean`

Defined in: [handlers/message-handlers.ts:133](https://github.com/green-api/whatsapp-chatgpt-js/blob/a8d23283a95688db13d271291301a016d80fdc7a/src/handlers/message-handlers.ts#L133)

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

Defined in: [handlers/message-handlers.ts:137](https://github.com/green-api/whatsapp-chatgpt-js/blob/a8d23283a95688db13d271291301a016d80fdc7a/src/handlers/message-handlers.ts#L137)

#### Parameters

##### message

`Message`

#### Returns

`Promise`\<`any`\>

#### Implementation of

[`MessageHandler`](../interfaces/MessageHandler.md).[`processMessage`](../interfaces/MessageHandler.md#processmessage)
