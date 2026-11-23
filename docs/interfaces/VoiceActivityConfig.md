[**WhatsApp Bot Framework**](../README.md)

***

[WhatsApp Bot Framework](../globals.md) / VoiceActivityConfig

# Interface: VoiceActivityConfig

Defined in: [types/index.ts:59](https://github.com/green-api/whatsapp-chatgpt-js/blob/1fdcaadfd7062f356e7347966f180de931a2fd84/src/types/index.ts#L59)

Settings of the server voice activity detection.

## Properties

### noiseReduction?

> `optional` **noiseReduction**: `null` \| `"near_field"` \| `"far_field"`

Defined in: [types/index.ts:70](https://github.com/green-api/whatsapp-chatgpt-js/blob/1fdcaadfd7062f356e7347966f180de931a2fd84/src/types/index.ts#L70)

Noise reduction of the caller's audio, null to turn it off. Default: near_field

***

### prefixPaddingMs?

> `optional` **prefixPaddingMs**: `number`

Defined in: [types/index.ts:64](https://github.com/green-api/whatsapp-chatgpt-js/blob/1fdcaadfd7062f356e7347966f180de931a2fd84/src/types/index.ts#L64)

Audio kept before the detected speech, in milliseconds. Default: 400

***

### silenceDurationMs?

> `optional` **silenceDurationMs**: `number`

Defined in: [types/index.ts:67](https://github.com/green-api/whatsapp-chatgpt-js/blob/1fdcaadfd7062f356e7347966f180de931a2fd84/src/types/index.ts#L67)

Silence that ends the caller's turn, in milliseconds. Default: 800

***

### threshold?

> `optional` **threshold**: `number`

Defined in: [types/index.ts:61](https://github.com/green-api/whatsapp-chatgpt-js/blob/1fdcaadfd7062f356e7347966f180de931a2fd84/src/types/index.ts#L61)

Speech threshold from 0 to 1, higher needs louder speech. Default: 0.5
