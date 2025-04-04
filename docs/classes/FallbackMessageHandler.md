[**WhatsApp Bot Framework**](../README.md)

***

[WhatsApp Bot Framework](../globals.md) / FallbackMessageHandler

# Class: FallbackMessageHandler

Defined in: [handlers/message-handlers.ts:225](https://github.com/green-api/whatsapp-chatgpt-js/blob/a8d23283a95688db13d271291301a016d80fdc7a/src/handlers/message-handlers.ts#L225)

Fallback handler for unsupported message types

## Implements

- [`MessageHandler`](../interfaces/MessageHandler.md)

## Constructors

### new FallbackMessageHandler()

> **new FallbackMessageHandler**(): [`FallbackMessageHandler`](FallbackMessageHandler.md)

#### Returns

[`FallbackMessageHandler`](FallbackMessageHandler.md)

## Methods

### canHandle()

> **canHandle**(`_`): `boolean`

Defined in: [handlers/message-handlers.ts:226](https://github.com/green-api/whatsapp-chatgpt-js/blob/a8d23283a95688db13d271291301a016d80fdc7a/src/handlers/message-handlers.ts#L226)

#### Parameters

##### \_

`Message`

#### Returns

`boolean`

#### Implementation of

[`MessageHandler`](../interfaces/MessageHandler.md).[`canHandle`](../interfaces/MessageHandler.md#canhandle)

***

### processMessage()

> **processMessage**(`message`): `Promise`\<`any`\>

Defined in: [handlers/message-handlers.ts:230](https://github.com/green-api/whatsapp-chatgpt-js/blob/a8d23283a95688db13d271291301a016d80fdc7a/src/handlers/message-handlers.ts#L230)

#### Parameters

##### message

`Message`

#### Returns

`Promise`\<`any`\>

#### Implementation of

[`MessageHandler`](../interfaces/MessageHandler.md).[`processMessage`](../interfaces/MessageHandler.md#processmessage)
