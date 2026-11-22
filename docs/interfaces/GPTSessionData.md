[**WhatsApp Bot Framework**](../README.md)

***

[WhatsApp Bot Framework](../globals.md) / GPTSessionData

# Interface: GPTSessionData

Defined in: [types/index.ts:96](https://github.com/green-api/whatsapp-chatgpt-js/blob/1fdcaadfd7062f356e7347966f180de931a2fd84/src/types/index.ts#L96)

Session data structure with conversation history

## Properties

### context?

> `optional` **context**: `object`

Defined in: [types/index.ts:107](https://github.com/green-api/whatsapp-chatgpt-js/blob/1fdcaadfd7062f356e7347966f180de931a2fd84/src/types/index.ts#L107)

Context for the current conversation

#### tags?

> `optional` **tags**: `string`[]

Tags or metadata for the conversation

#### variables?

> `optional` **variables**: `Record`\<`string`, `any`\>

Custom context variables

***

### lastActivity

> **lastActivity**: `number`

Defined in: [types/index.ts:101](https://github.com/green-api/whatsapp-chatgpt-js/blob/1fdcaadfd7062f356e7347966f180de931a2fd84/src/types/index.ts#L101)

Timestamp of last activity

***

### messages

> **messages**: `ChatCompletionMessageParam`[]

Defined in: [types/index.ts:98](https://github.com/green-api/whatsapp-chatgpt-js/blob/1fdcaadfd7062f356e7347966f180de931a2fd84/src/types/index.ts#L98)

Conversation history

***

### userData?

> `optional` **userData**: `Record`\<`string`, `any`\>

Defined in: [types/index.ts:104](https://github.com/green-api/whatsapp-chatgpt-js/blob/1fdcaadfd7062f356e7347966f180de931a2fd84/src/types/index.ts#L104)

Custom user state data
