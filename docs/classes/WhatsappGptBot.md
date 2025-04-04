[**WhatsApp Bot Framework**](../README.md)

***

[WhatsApp Bot Framework](../globals.md) / WhatsappGptBot

# Class: WhatsappGptBot

Defined in: [whatsapp-gpt-bot.ts:16](https://github.com/green-api/whatsapp-chatgpt-js/blob/a8d23283a95688db13d271291301a016d80fdc7a/src/whatsapp-gpt-bot.ts#L16)

WhatsApp bot with GPT integration

## Extends

- `WhatsAppBot`\<[`GPTSessionData`](../interfaces/GPTSessionData.md)\>

## Constructors

### new WhatsappGptBot()

> **new WhatsappGptBot**(`config`): [`WhatsappGptBot`](WhatsappGptBot.md)

Defined in: [whatsapp-gpt-bot.ts:29](https://github.com/green-api/whatsapp-chatgpt-js/blob/a8d23283a95688db13d271291301a016d80fdc7a/src/whatsapp-gpt-bot.ts#L29)

Creates a new GPT WhatsApp bot instance

#### Parameters

##### config

[`GPTBotConfig`](../interfaces/GPTBotConfig.md)

#### Returns

[`WhatsappGptBot`](WhatsappGptBot.md)

#### Overrides

`WhatsAppBot<GPTSessionData>.constructor`

## Properties

### systemMessage

> `readonly` **systemMessage**: `string`

Defined in: [whatsapp-gpt-bot.ts:19](https://github.com/green-api/whatsapp-chatgpt-js/blob/a8d23283a95688db13d271291301a016d80fdc7a/src/whatsapp-gpt-bot.ts#L19)

## Methods

### addMessageMiddleware()

> **addMessageMiddleware**(`middleware`): `this`

Defined in: [whatsapp-gpt-bot.ts:131](https://github.com/green-api/whatsapp-chatgpt-js/blob/a8d23283a95688db13d271291301a016d80fdc7a/src/whatsapp-gpt-bot.ts#L131)

Add middleware to process messages before sending to the model

#### Parameters

##### middleware

`any`

#### Returns

`this`

***

### addResponseMiddleware()

> **addResponseMiddleware**(`middleware`): `this`

Defined in: [whatsapp-gpt-bot.ts:139](https://github.com/green-api/whatsapp-chatgpt-js/blob/a8d23283a95688db13d271291301a016d80fdc7a/src/whatsapp-gpt-bot.ts#L139)

Add middleware to process responses before sending to the user

#### Parameters

##### middleware

`any`

#### Returns

`this`

***

### getModel()

> **getModel**(): [`OpenAIModel`](../type-aliases/OpenAIModel.md)

Defined in: [whatsapp-gpt-bot.ts:162](https://github.com/green-api/whatsapp-chatgpt-js/blob/a8d23283a95688db13d271291301a016d80fdc7a/src/whatsapp-gpt-bot.ts#L162)

Get the current model being used

#### Returns

[`OpenAIModel`](../type-aliases/OpenAIModel.md)

***

### getOpenAI()

> **getOpenAI**(): `OpenAI`

Defined in: [whatsapp-gpt-bot.ts:155](https://github.com/green-api/whatsapp-chatgpt-js/blob/a8d23283a95688db13d271291301a016d80fdc7a/src/whatsapp-gpt-bot.ts#L155)

Get the OpenAI client instance

#### Returns

`OpenAI`

***

### processMessage()

> **processMessage**(`message`, `sessionData`): `Promise`\<\{ `response`: `string`; `updatedData`: [`GPTSessionData`](../interfaces/GPTSessionData.md); \}\>

Defined in: [whatsapp-gpt-bot.ts:71](https://github.com/green-api/whatsapp-chatgpt-js/blob/a8d23283a95688db13d271291301a016d80fdc7a/src/whatsapp-gpt-bot.ts#L71)

Processes a message through the GPT model without using internal state management.
Handles message preprocessing, GPT model interaction, and response processing.

#### Parameters

##### message

`Message`

The message to process

##### sessionData

[`GPTSessionData`](../interfaces/GPTSessionData.md) = `...`

Current session data containing message history and metadata.
                    Defaults to empty messages array and current timestamp.

#### Returns

`Promise`\<\{ `response`: `string`; `updatedData`: [`GPTSessionData`](../interfaces/GPTSessionData.md); \}\>

Object containing the processed response and updated session data

#### Example

```typescript
const { response, updatedData } = await gptBot.processMessage(message, {
    messages: [{ role: "system", content: "You are a helpful assistant" }],
    lastActivity: Date.now()
});
await bot.sendText(message.chatId, response);
```

***

### registerMessageHandler()

> **registerMessageHandler**(`handler`, `index`?): `this`

Defined in: [whatsapp-gpt-bot.ts:147](https://github.com/green-api/whatsapp-chatgpt-js/blob/a8d23283a95688db13d271291301a016d80fdc7a/src/whatsapp-gpt-bot.ts#L147)

Register a custom message handler

#### Parameters

##### handler

`any`

##### index?

`number`

#### Returns

`this`

***

### replaceHandler()

> **replaceHandler**(`handlerType`, `newHandler`): `boolean`

Defined in: [whatsapp-gpt-bot.ts:179](https://github.com/green-api/whatsapp-chatgpt-js/blob/a8d23283a95688db13d271291301a016d80fdc7a/src/whatsapp-gpt-bot.ts#L179)

Replace a message handler with a new implementation

#### Parameters

##### handlerType

(...`args`) => [`MessageHandler`](../interfaces/MessageHandler.md)

The handler class to replace

##### newHandler

[`MessageHandler`](../interfaces/MessageHandler.md)

The new handler implementation

#### Returns

`boolean`

true if replacement succeeded, false otherwise

***

### supportsImages()

> **supportsImages**(): `boolean`

Defined in: [whatsapp-gpt-bot.ts:169](https://github.com/green-api/whatsapp-chatgpt-js/blob/a8d23283a95688db13d271291301a016d80fdc7a/src/whatsapp-gpt-bot.ts#L169)

Check if the current model supports image processing

#### Returns

`boolean`
