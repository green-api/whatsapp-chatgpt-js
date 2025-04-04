[**WhatsApp Bot Framework**](../README.md)

***

[WhatsApp Bot Framework](../globals.md) / MessageHandler

# Interface: MessageHandler

Defined in: [handlers/message-handlers.ts:17](https://github.com/green-api/whatsapp-chatgpt-js/blob/a8d23283a95688db13d271291301a016d80fdc7a/src/handlers/message-handlers.ts#L17)

Base handler interface for processing different message types

## Methods

### canHandle()

> **canHandle**(`message`): `boolean`

Defined in: [handlers/message-handlers.ts:18](https://github.com/green-api/whatsapp-chatgpt-js/blob/a8d23283a95688db13d271291301a016d80fdc7a/src/handlers/message-handlers.ts#L18)

#### Parameters

##### message

`Message`

#### Returns

`boolean`

***

### processMessage()

> **processMessage**(`message`, `openai`, `model`?): `Promise`\<`any`\>

Defined in: [handlers/message-handlers.ts:20](https://github.com/green-api/whatsapp-chatgpt-js/blob/a8d23283a95688db13d271291301a016d80fdc7a/src/handlers/message-handlers.ts#L20)

#### Parameters

##### message

`Message`

##### openai

`OpenAI`

##### model?

`string`

#### Returns

`Promise`\<`any`\>
