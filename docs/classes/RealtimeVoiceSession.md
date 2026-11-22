[**WhatsApp Bot Framework**](../README.md)

***

[WhatsApp Bot Framework](../globals.md) / RealtimeVoiceSession

# Class: RealtimeVoiceSession

Defined in: [voice/realtime-session.ts:36](https://github.com/green-api/whatsapp-chatgpt-js/blob/1fdcaadfd7062f356e7347966f180de931a2fd84/src/voice/realtime-session.ts#L36)

One voice conversation between a call and an OpenAI Realtime model.
The caller's audio goes to the model, the model's speech goes into the call, and the caller can interrupt the model.
The model can end the call after saying goodbye.

## Constructors

### new RealtimeVoiceSession()

> **new RealtimeVoiceSession**(`calls`, `options`, `onError`): [`RealtimeVoiceSession`](RealtimeVoiceSession.md)

Defined in: [voice/realtime-session.ts:52](https://github.com/green-api/whatsapp-chatgpt-js/blob/1fdcaadfd7062f356e7347966f180de931a2fd84/src/voice/realtime-session.ts#L52)

Creates the session.

#### Parameters

##### calls

`CallsConnection`

Open calls connection of the instance, with the call dialed or accepted

##### options

[`VoiceSessionOptions`](../interfaces/VoiceSessionOptions.md)

Model, voice, instructions and voice activity settings

##### onError

(`error`) => `void`

Receives errors that do not end the call

#### Returns

[`RealtimeVoiceSession`](RealtimeVoiceSession.md)

## Methods

### run()

> **run**(): `Promise`\<[`VoiceSessionEnd`](../type-aliases/VoiceSessionEnd.md)\>

Defined in: [voice/realtime-session.ts:67](https://github.com/green-api/whatsapp-chatgpt-js/blob/1fdcaadfd7062f356e7347966f180de931a2fd84/src/voice/realtime-session.ts#L67)

Connects the call audio and the model, and runs the conversation until the call or the model connection ends.

#### Returns

`Promise`\<[`VoiceSessionEnd`](../type-aliases/VoiceSessionEnd.md)\>

Why the session ended
