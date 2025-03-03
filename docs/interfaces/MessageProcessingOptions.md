[**WhatsApp Bot Framework**](../README.md)

***

[WhatsApp Bot Framework](../globals.md) / MessageProcessingOptions

# Interface: MessageProcessingOptions

Defined in: [types/index.ts:53](https://github.com/green-api/whatsapp-chatgpt-js/blob/144b3e2baae49a260200b70637f606416abe2026/src/types/index.ts#L53)

Options for creating message content

## Properties

### context?

> `optional` **context**: `string`

Defined in: [types/index.ts:58](https://github.com/green-api/whatsapp-chatgpt-js/blob/144b3e2baae49a260200b70637f606416abe2026/src/types/index.ts#L58)

Custom context to inject into the message

***

### modelOverride?

> `optional` **modelOverride**: [`OpenAIModel`](../type-aliases/OpenAIModel.md)

Defined in: [types/index.ts:61](https://github.com/green-api/whatsapp-chatgpt-js/blob/144b3e2baae49a260200b70637f606416abe2026/src/types/index.ts#L61)

Override the model for this specific message

***

### useHistory?

> `optional` **useHistory**: `boolean`

Defined in: [types/index.ts:55](https://github.com/green-api/whatsapp-chatgpt-js/blob/144b3e2baae49a260200b70637f606416abe2026/src/types/index.ts#L55)

Whether to use message history
