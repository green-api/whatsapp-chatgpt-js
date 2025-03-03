[**WhatsApp Bot Framework**](../README.md)

***

[WhatsApp Bot Framework](../globals.md) / WhatsappGptBot

# Class: WhatsappGptBot

Defined in: [whatsapp-gpt-bot.ts:17](https://github.com/green-api/whatsapp-chatgpt-js/blob/144b3e2baae49a260200b70637f606416abe2026/src/whatsapp-gpt-bot.ts#L17)

WhatsApp bot with GPT integration

## Extends

- `WhatsAppBot`\<[`GPTSessionData`](../interfaces/GPTSessionData.md)\>

## Constructors

### new WhatsappGptBot()

> **new WhatsappGptBot**(`config`): [`WhatsappGptBot`](WhatsappGptBot.md)

Defined in: [whatsapp-gpt-bot.ts:30](https://github.com/green-api/whatsapp-chatgpt-js/blob/144b3e2baae49a260200b70637f606416abe2026/src/whatsapp-gpt-bot.ts#L30)

Creates a new GPT WhatsApp bot instance

#### Parameters

##### config

[`GPTBotConfig`](../interfaces/GPTBotConfig.md)

#### Returns

[`WhatsappGptBot`](WhatsappGptBot.md)

#### Overrides

`WhatsAppBot<GPTSessionData>.constructor`

## Methods

### addMessageMiddleware()

> **addMessageMiddleware**(`middleware`): `this`

Defined in: [whatsapp-gpt-bot.ts:57](https://github.com/green-api/whatsapp-chatgpt-js/blob/144b3e2baae49a260200b70637f606416abe2026/src/whatsapp-gpt-bot.ts#L57)

Add middleware to process messages before sending to the model

#### Parameters

##### middleware

`any`

#### Returns

`this`

***

### addResponseMiddleware()

> **addResponseMiddleware**(`middleware`): `this`

Defined in: [whatsapp-gpt-bot.ts:65](https://github.com/green-api/whatsapp-chatgpt-js/blob/144b3e2baae49a260200b70637f606416abe2026/src/whatsapp-gpt-bot.ts#L65)

Add middleware to process responses before sending to the user

#### Parameters

##### middleware

`any`

#### Returns

`this`

***

### getModel()

> **getModel**(): [`OpenAIModel`](../type-aliases/OpenAIModel.md)

Defined in: [whatsapp-gpt-bot.ts:88](https://github.com/green-api/whatsapp-chatgpt-js/blob/144b3e2baae49a260200b70637f606416abe2026/src/whatsapp-gpt-bot.ts#L88)

Get the current model being used

#### Returns

[`OpenAIModel`](../type-aliases/OpenAIModel.md)

***

### getOpenAI()

> **getOpenAI**(): `OpenAI`

Defined in: [whatsapp-gpt-bot.ts:81](https://github.com/green-api/whatsapp-chatgpt-js/blob/144b3e2baae49a260200b70637f606416abe2026/src/whatsapp-gpt-bot.ts#L81)

Get the OpenAI client instance

#### Returns

`OpenAI`

***

### registerMessageHandler()

> **registerMessageHandler**(`handler`, `index`?): `this`

Defined in: [whatsapp-gpt-bot.ts:73](https://github.com/green-api/whatsapp-chatgpt-js/blob/144b3e2baae49a260200b70637f606416abe2026/src/whatsapp-gpt-bot.ts#L73)

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

Defined in: [whatsapp-gpt-bot.ts:105](https://github.com/green-api/whatsapp-chatgpt-js/blob/144b3e2baae49a260200b70637f606416abe2026/src/whatsapp-gpt-bot.ts#L105)

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

Defined in: [whatsapp-gpt-bot.ts:95](https://github.com/green-api/whatsapp-chatgpt-js/blob/144b3e2baae49a260200b70637f606416abe2026/src/whatsapp-gpt-bot.ts#L95)

Check if the current model supports image processing

#### Returns

`boolean`
