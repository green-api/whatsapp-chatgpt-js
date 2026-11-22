[**WhatsApp Bot Framework**](../README.md)

***

[WhatsApp Bot Framework](../globals.md) / WhatsappGptBot

# Class: WhatsappGptBot

Defined in: [whatsapp-gpt-bot.ts:38](https://github.com/green-api/whatsapp-chatgpt-js/blob/1fdcaadfd7062f356e7347966f180de931a2fd84/src/whatsapp-gpt-bot.ts#L38)

WhatsApp bot with GPT integration

## Extends

- `WhatsAppBot`\<[`GPTSessionData`](../interfaces/GPTSessionData.md)\>

## Constructors

### new WhatsappGptBot()

> **new WhatsappGptBot**(`config`): [`WhatsappGptBot`](WhatsappGptBot.md)

Defined in: [whatsapp-gpt-bot.ts:53](https://github.com/green-api/whatsapp-chatgpt-js/blob/1fdcaadfd7062f356e7347966f180de931a2fd84/src/whatsapp-gpt-bot.ts#L53)

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

Defined in: [whatsapp-gpt-bot.ts:41](https://github.com/green-api/whatsapp-chatgpt-js/blob/1fdcaadfd7062f356e7347966f180de931a2fd84/src/whatsapp-gpt-bot.ts#L41)

## Accessors

### inVoiceCall

#### Get Signature

> **get** **inVoiceCall**(): `boolean`

Defined in: [whatsapp-gpt-bot.ts:115](https://github.com/green-api/whatsapp-chatgpt-js/blob/1fdcaadfd7062f356e7347966f180de931a2fd84/src/whatsapp-gpt-bot.ts#L115)

Whether a voice conversation with the model is running now.

##### Returns

`boolean`

## Methods

### addMessageMiddleware()

> **addMessageMiddleware**(`middleware`): `this`

Defined in: [whatsapp-gpt-bot.ts:229](https://github.com/green-api/whatsapp-chatgpt-js/blob/1fdcaadfd7062f356e7347966f180de931a2fd84/src/whatsapp-gpt-bot.ts#L229)

Add middleware to process messages before sending to the model

#### Parameters

##### middleware

`any`

#### Returns

`this`

***

### addResponseMiddleware()

> **addResponseMiddleware**(`middleware`): `this`

Defined in: [whatsapp-gpt-bot.ts:237](https://github.com/green-api/whatsapp-chatgpt-js/blob/1fdcaadfd7062f356e7347966f180de931a2fd84/src/whatsapp-gpt-bot.ts#L237)

Add middleware to process responses before sending to the user

#### Parameters

##### middleware

`any`

#### Returns

`this`

***

### getModel()

> **getModel**(): [`OpenAIModel`](../type-aliases/OpenAIModel.md)

Defined in: [whatsapp-gpt-bot.ts:260](https://github.com/green-api/whatsapp-chatgpt-js/blob/1fdcaadfd7062f356e7347966f180de931a2fd84/src/whatsapp-gpt-bot.ts#L260)

Get the current model being used

#### Returns

[`OpenAIModel`](../type-aliases/OpenAIModel.md)

***

### getOpenAI()

> **getOpenAI**(): `OpenAI`

Defined in: [whatsapp-gpt-bot.ts:253](https://github.com/green-api/whatsapp-chatgpt-js/blob/1fdcaadfd7062f356e7347966f180de931a2fd84/src/whatsapp-gpt-bot.ts#L253)

Get the OpenAI client instance

#### Returns

`OpenAI`

***

### processMessage()

> **processMessage**(`message`, `sessionData`): `Promise`\<\{ `response`: `string`; `updatedData`: [`GPTSessionData`](../interfaces/GPTSessionData.md); \}\>

Defined in: [whatsapp-gpt-bot.ts:169](https://github.com/green-api/whatsapp-chatgpt-js/blob/1fdcaadfd7062f356e7347966f180de931a2fd84/src/whatsapp-gpt-bot.ts#L169)

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

Defined in: [whatsapp-gpt-bot.ts:245](https://github.com/green-api/whatsapp-chatgpt-js/blob/1fdcaadfd7062f356e7347966f180de931a2fd84/src/whatsapp-gpt-bot.ts#L245)

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

Defined in: [whatsapp-gpt-bot.ts:277](https://github.com/green-api/whatsapp-chatgpt-js/blob/1fdcaadfd7062f356e7347966f180de931a2fd84/src/whatsapp-gpt-bot.ts#L277)

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

Defined in: [whatsapp-gpt-bot.ts:267](https://github.com/green-api/whatsapp-chatgpt-js/blob/1fdcaadfd7062f356e7347966f180de931a2fd84/src/whatsapp-gpt-bot.ts#L267)

Check if the current model supports image processing

#### Returns

`boolean`

***

### voiceCall()

> **voiceCall**(`chatId`): `Promise`\<`string`\>

Defined in: [whatsapp-gpt-bot.ts:99](https://github.com/green-api/whatsapp-chatgpt-js/blob/1fdcaadfd7062f356e7347966f180de931a2fd84/src/whatsapp-gpt-bot.ts#L99)

Calls a chat and talks with the person through the OpenAI Realtime model when they answer.
Needs voiceCalls in the config. Outgoing calls work only to chats that wrote or called in the last 72 hours.

#### Parameters

##### chatId

`string`

Chat to call

#### Returns

`Promise`\<`string`\>

The call ID. The conversation runs in the background until the call ends

#### Example

```typescript
bot.onText("call me", async (message) => {
  await bot.voiceCall(message.chatId);
});
```
