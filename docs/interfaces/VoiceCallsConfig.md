[**WhatsApp Bot Framework**](../README.md)

***

[WhatsApp Bot Framework](../globals.md) / VoiceCallsConfig

# Interface: VoiceCallsConfig

Defined in: [types/index.ts:33](https://github.com/green-api/whatsapp-chatgpt-js/blob/1fdcaadfd7062f356e7347966f180de931a2fd84/src/types/index.ts#L33)

Voice calls handled by an OpenAI Realtime model: the caller talks with the model, the model can be interrupted.

## Properties

### answerIncoming?

> `optional` **answerIncoming**: `boolean`

Defined in: [types/index.ts:47](https://github.com/green-api/whatsapp-chatgpt-js/blob/1fdcaadfd7062f356e7347966f180de931a2fd84/src/types/index.ts#L47)

Whether to answer incoming calls with the model. Default: true

***

### greeting?

> `optional` **greeting**: `string` \| `false`

Defined in: [types/index.ts:44](https://github.com/green-api/whatsapp-chatgpt-js/blob/1fdcaadfd7062f356e7347966f180de931a2fd84/src/types/index.ts#L44)

What the model is asked to say first when the call connects, false to wait until the caller speaks

***

### instructions?

> `optional` **instructions**: `string`

Defined in: [types/index.ts:41](https://github.com/green-api/whatsapp-chatgpt-js/blob/1fdcaadfd7062f356e7347966f180de931a2fd84/src/types/index.ts#L41)

Instructions for the voice conversation. Default: systemMessage

***

### maxCallSeconds?

> `optional` **maxCallSeconds**: `number`

Defined in: [types/index.ts:50](https://github.com/green-api/whatsapp-chatgpt-js/blob/1fdcaadfd7062f356e7347966f180de931a2fd84/src/types/index.ts#L50)

Longest call in seconds, the bot hangs up after it. Default: 600

***

### model?

> `optional` **model**: `string`

Defined in: [types/index.ts:35](https://github.com/green-api/whatsapp-chatgpt-js/blob/1fdcaadfd7062f356e7347966f180de931a2fd84/src/types/index.ts#L35)

Realtime model. Default: gpt-realtime-2.1

***

### vad?

> `optional` **vad**: [`VoiceActivityConfig`](VoiceActivityConfig.md)

Defined in: [types/index.ts:53](https://github.com/green-api/whatsapp-chatgpt-js/blob/1fdcaadfd7062f356e7347966f180de931a2fd84/src/types/index.ts#L53)

Voice activity detection of the caller's speech

***

### voice?

> `optional` **voice**: `string`

Defined in: [types/index.ts:38](https://github.com/green-api/whatsapp-chatgpt-js/blob/1fdcaadfd7062f356e7347966f180de931a2fd84/src/types/index.ts#L38)

Voice of the model, for example marin, cedar, alloy, ash, coral, sage, shimmer, verse. Default: marin
