[**WhatsApp Bot Framework**](../README.md)

***

[WhatsApp Bot Framework](../globals.md) / GPTSessionData

# Interface: GPTSessionData

Defined in: [types/index.ts:30](https://github.com/green-api/whatsapp-chatgpt-js/blob/a8d23283a95688db13d271291301a016d80fdc7a/src/types/index.ts#L30)

Session data structure with conversation history

## Properties

### context?

> `optional` **context**: `object`

Defined in: [types/index.ts:41](https://github.com/green-api/whatsapp-chatgpt-js/blob/a8d23283a95688db13d271291301a016d80fdc7a/src/types/index.ts#L41)

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

Defined in: [types/index.ts:35](https://github.com/green-api/whatsapp-chatgpt-js/blob/a8d23283a95688db13d271291301a016d80fdc7a/src/types/index.ts#L35)

Timestamp of last activity

***

### messages

> **messages**: `ChatCompletionMessageParam`[]

Defined in: [types/index.ts:32](https://github.com/green-api/whatsapp-chatgpt-js/blob/a8d23283a95688db13d271291301a016d80fdc7a/src/types/index.ts#L32)

Conversation history

***

### userData?

> `optional` **userData**: `Record`\<`string`, `any`\>

Defined in: [types/index.ts:38](https://github.com/green-api/whatsapp-chatgpt-js/blob/a8d23283a95688db13d271291301a016d80fdc7a/src/types/index.ts#L38)

Custom user state data
