# WhatsApp GPT Bot Library

A modern, state-based WhatsApp bot library with OpenAI GPT integration, built on top of GREEN-API by
@green-api/whatsapp-chatgpt.

## Features

- OpenAI GPT model integration for intelligent responses
- Support for multiple GPT models (GPT-3.5, GPT-4, GPT-4o)
- Multimodal capabilities with image processing support
- Voice message transcription
- Comprehensive message handling for various WhatsApp media types
- Middleware architecture for customizing message and response processing
- Built-in conversation history management
- State-based conversation flow inherited from base library
- TypeScript support

## Installation

```bash
npm install @green-api/whatsapp-chatgpt
```

The dependencies (`openai` and `@green-api/whatsapp-chatbot-js-v2`) will be installed automatically.

## Quick Start

```typescript
import { WhatsappGptBot } from '@green-api/whatsapp-chatgpt';

// Initialize the bot
const bot = new WhatsappGptBot({
    idInstance: "your-instance-id",
    apiTokenInstance: "your-token",
    openaiApiKey: "your-openai-api-key",
    model: "gpt-4o",
    systemMessage: "You are a helpful assistant."
});

// Start the bot
bot.start();
```

# Usage Patterns

This library supports two distinct usage patterns depending on your needs:

## 1. Standalone Bot

You can run the bot as a standalone service that listens for and processes WhatsApp messages automatically:

```typescript
const bot = new WhatsappGptBot({
    idInstance: "your-instance-id",
    apiTokenInstance: "your-token",
    openaiApiKey: "your-openai-api-key",
    model: "gpt-4o",
    systemMessage: "You are a helpful assistant."
});

// Start listening for webhooks and processing messages
bot.start();
```

## 2. Message Processor

Alternatively, you can use the bot as a message processing utility within your own bot or application:

```typescript
const gptBot = new WhatsappGptBot({
    idInstance: "your-instance-id",
    apiTokenInstance: "your-token",
    openaiApiKey: "your-openai-api-key",
    model: "gpt-4o",
    systemMessage: "You are a helpful assistant."
});

// No need to call start() - just use processMessage when needed
const {response, updatedData} = await gptBot.processMessage(message, sessionData);

// Handle the response in your own way
await yourBot.sendText(message.chatId, response);

// Store the updated session data in your own state system
yourSessionData.gptSession = updatedData;
```

### Integration Example

Here's how to integrate the GPT bot into your own state-based bot:

```typescript
interface CustomSessionData {
    lang?: string;
    gptSession?: GPTSessionData;  // Store GPT session data
}

const gptState: State<CustomSessionData> = {
    name: "gpt_state",
    async onEnter(message, data) {
        // Initialize GPT session
        data.gptSession = {
            messages: [{role: "system", content: gptBot.systemMessage}],
            lastActivity: Date.now()
        };
        await bot.sendText(message.chatId, "Chat with GPT started!");
    },
    async onMessage(message, data) {
        // Process messages using GPT bot
        const {response, updatedData} = await gptBot.processMessage(
                message,
                data.gptSession
        );

        await bot.sendText(message.chatId, response);
        data.gptSession = updatedData;

        return undefined;  // Stay in current state
    }
};
```

This flexibility allows you to either run the bot independently or integrate its GPT capabilities into a larger system
while maintaining full control over the conversation flow and state management.

Key points about these patterns:

1. **Standalone Bot**
    - Uses internal state management
    - Handles webhooks automatically
    - Better for simple, single-purpose GPT chatbots
    - Requires calling `bot.start()`

2. **Message Processor**
    - No internal state management needed
    - No webhook handling
    - Perfect for integration into existing bots
    - Uses only the GPT processing capabilities
    - More flexible and controllable
    - Never call `start()` - just use `processMessage()`

## Core Components

### Bot Configuration

Complete configuration options for the WhatsappGptBot:

```typescript
interface GPTBotConfig extends BotConfig {
    /** OpenAI API key */
    openaiApiKey: string;

    /** Model to use for chat completion (default: gpt-4o) */
    model?: OpenAIModel;

    /** Maximum number of messages to keep in conversation history (default: 10) */
    maxHistoryLength?: number;

    /** System message to set assistant behavior */
    systemMessage?: string;

    /** Temperature for response generation (default: 0.5) */
    temperature?: number;

    /** Default reply when an error occurs */
    errorMessage?: string;

    // All configuration options from the base WhatsAppBot are also available
    // See @green-api/whatsapp-chatbot-js-v2 for additional options
}
```

### WhatsappGptBot

Main class for creating and managing your OpenAI-powered WhatsApp bot:

```typescript
const bot = new WhatsappGptBot({
    // Required parameters
    idInstance: "your-instance-id",
    apiTokenInstance: "your-token",
    openaiApiKey: "your-openai-api-key",

    // Optional GPT-specific parameters
    model: "gpt-4o",
    maxHistoryLength: 15,
    systemMessage: "You are a helpful assistant specializing in customer support.",
    temperature: 0.7,
    errorMessage: "Sorry, I couldn't process your request. Please try again.",

    // Optional parameters from base bot
    defaultState: "greeting",
    sessionTimeout: 300,
    // See base library documentation for more options
});
```

## Message Handling

The bot automatically handles different types of WhatsApp messages and converts them into a format understood by
OpenAI's models.

### Supported Message Types

- **Text**: Regular text messages
- **Image**: Photos with optional captions (supported in vision-capable models)
- **Audio**: Voice messages with automatic transcription
- **Video**: Video messages with captions
- **Document**: File attachments
- **Poll**: Poll messages and poll updates
- **Location**: Location sharing
- **Contact**: Contact sharing

### Message Handler Registry

The bot uses a registry of message handlers to process different message types:

```typescript
// Access the registry
const registry = bot.messageHandlers;

// Create a custom message handler
class CustomMessageHandler implements MessageHandler {
    canHandle(message: Message): boolean {
        return message.type === "custom-type";
    }

    async processMessage(message: Message): Promise<any> {
        // Process the message
        return "Processed content";
    }
}

// Register the custom handler
bot.registerMessageHandler(new CustomMessageHandler());

// Replace an existing handler
bot.replaceHandler(TextMessageHandler, new CustomTextHandler());
```

## Middleware System

The middleware system allows for customizing message processing before sending to GPT and response processing before
sending back to the user.

### Adding Message Middleware

```typescript
// Process messages before sending to GPT
bot.addMessageMiddleware(async (message, messageContent, messages, sessionData) => {
    // Add custom context to the conversation
    if (message.type === "text" && message.chatId.endsWith("@c.us")) {
        // Add user information from a database
        const userInfo = await getUserInfo(message.chatId);

        // Modify the current message content
        const enhancedContent = `[User: ${userInfo.name}] ${messageContent}`;

        return {
            messageContent: enhancedContent,
            messages
        };
    }

    return {
        messageContent,
        messages
    };
});
```

### Adding Response Middleware

```typescript
// Process GPT responses before sending to user
bot.addResponseMiddleware(async (response, messages, sessionData) => {
    // Format or modify the response
    const formattedResponse = response
            .replace(/\bGPT\b/g, "Assistant")
            .trim();

    // You can also modify the messages that will be saved in history
    return {
        response: formattedResponse,
        messages
    };
});
```

## Session Data

The GPT bot extends the base session data with conversation-specific information:

```typescript
interface GPTSessionData {
    /** Conversation history */
    messages: ChatCompletionMessageParam[];

    /** Timestamp of last activity */
    lastActivity: number;

    /** Custom user state data */
    userData?: Record<string, any>;

    /** Context for the current conversation */
    context?: {
        /** Tags or metadata for the conversation */
        tags?: string[];

        /** Custom context variables */
        variables?: Record<string, any>;
    };
}
```

You can access and modify this data in your middleware:

```typescript
bot.addMessageMiddleware(async (message, content, messages, sessionData) => {
    // Set context variables
    if (!sessionData.context) {
        sessionData.context = {variables: {}};
    }

    sessionData.context.variables.lastInteraction = new Date().toISOString();

    return {messageContent: content, messages};
});
```

## Utilities

The library provides several utility functions for common tasks:

### Media Handling

```typescript
import { Utils } from '@green-api/whatsapp-chatgpt';

// Download media from a URL
const tempFile = await Utils.downloadMedia("https://example.com/image.jpg");

// Transcribe audio
const openai = new OpenAI({apiKey: "your-openai-api-key"});
const transcript = await Utils.transcribeAudio("/path/to/audio.ogg", openai);

// Clean up after processing
fs.unlinkSync(tempFile);
```

### Conversation Management

```typescript
import { Utils } from 'whatsapp-gpt-bot';

// Trim conversation history
const trimmedMessages = Utils.trimConversationHistory(
        messages,
        10,  // max messages
        true  // preserve system message
);

// Estimate token usage
const estimatedTokens = Utils.estimateTokens(messages);
```

## Supported OpenAI Models

The library supports a variety of OpenAI models:

### GPT-4 Models

- gpt-4
- gpt-4-turbo
- gpt-4-turbo-preview
- gpt-4-1106-preview
- gpt-4-0125-preview
- gpt-4-32k

### GPT-4o Models

- gpt-4o (default)
- gpt-4o-mini
- gpt-4o-2024-05-13

### GPT-3.5 Models

- gpt-3.5-turbo
- gpt-3.5-turbo-16k
- gpt-3.5-turbo-1106
- gpt-3.5-turbo-0125

### o1 Models

- o1
- o1-mini
- o1-preview

### Image-Capable Models

The following models can process images:

- gpt-4o
- gpt-4o-mini
- gpt-4-vision-preview
- gpt-4-turbo
- gpt-4-turbo-preview

## Advanced Configuration

### Custom State Handling

Since the library is built on @green-api/whatsapp-chatbot-js-v2, you can use all the state features of the base library:

```typescript
// Add custom state
bot.addState({
    name: "collect_info",
    async onEnter(message) {
        await bot.sendText(message.chatId, "Please provide your name.");
    },
    async onMessage(message, data = {}) {
        // Store the name and process with GPT
        const openai = bot.getOpenAI();
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {role: "system", content: "Generate a personalized greeting."},
                {role: "user", content: `My name is ${message.text}`}
            ]
        });

        await bot.sendText(message.chatId, completion.choices[0]?.message.content || "Hello!");
        return "main_chat"; // Transition to main chat state
    }
});
```

### Advanced Message Processing

```typescript
// Get OpenAI client for custom API calls
const openai = bot.getOpenAI();

// Check if current model supports images
if (bot.supportsImages()) {
    // Handle image-based workflow
}
```

## Demo Bot Example

See [our demo chatbot](https://github.com/green-api/whatsapp-demo-chatgpt-js) for a comprehensive demo chatbot, which
showcases many features:

```typescript
import {
    GPTSessionData,
    ImageMessageHandler,
    ProcessMessageMiddleware,
    ProcessResponseMiddleware,
    WhatsappGptBot,
    OpenAIModel,
} from "@green-api/whatsapp-chatgpt";
import * as dotenv from "dotenv";
import { Message } from "@green-api/whatsapp-chatbot-js-v2";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import OpenAI from "openai";

dotenv.config();

// Custom image handler that provides enhanced descriptions
class EnhancedImageHandler extends ImageMessageHandler {
    async processMessage(message: Message, openai: OpenAI, model: OpenAIModel): Promise<any> {
        const result = await super.processMessage(message, openai, model);

        if (typeof result === "string") {
            return result.replace(
                    "[The user sent an image",
                    "[The user sent an image. Tell them that you are not the model they should be using"
            );
        }

        return result;
    }
}

// Middleware examples

// Logging middleware
const loggingMessageMiddleware: ProcessMessageMiddleware = async (
        message, messageContent, messages, _
) => {
    console.log(`[${new Date().toISOString()}] User (${message.chatId}): `,
            typeof messageContent === "string"
                    ? messageContent
                    : JSON.stringify(messageContent));

    return {messageContent, messages};
};

// Initialize the bot
const bot = new WhatsappGptBot({
    idInstance: process.env.INSTANCE_ID || "",
    apiTokenInstance: process.env.INSTANCE_TOKEN || "",
    openaiApiKey: process.env.OPENAI_API_KEY || "",
    model: "gpt-4o",
    systemMessage: "You are a helpful WhatsApp assistant created by GREEN-API",
    maxHistoryLength: 15,
    temperature: 0.5,
    handlersFirst: true,
    clearWebhookQueueOnStart: true,
});

// Command handlers
bot.onText("/help", async (message, _) => {
    const helpText = `*WhatsAppGPT Demo Bot*\n\nAvailable commands:\n- /help - Show this help message\n- /clear - Clear conversation history`;
    await bot.sendText(message.chatId, helpText);
});

// Register middleware
bot.addMessageMiddleware(loggingMessageMiddleware);

// Replace default handlers
bot.replaceHandler(ImageMessageHandler, new EnhancedImageHandler());

// Start the bot
bot.start();
```

This demo bot includes:

- Custom message handlers
- Various middleware implementations
- Command handlers
- Custom type handlers
- Error handling

## Additional Examples

### Multi-Language Support Bot

```typescript
import { WhatsappGptBot } from '@green-api/whatsapp-chatgpt';
import { detectLanguage } from './language-detector';

const bot = new WhatsappGptBot({
    idInstance: "your-instance-id",
    apiTokenInstance: "your-token",
    openaiApiKey: "your-openai-api-key",
    model: "gpt-4o"
});

// Add language detection middleware
bot.addMessageMiddleware(async (message, content, messages, sessionData) => {
    // Only process text messages
    if (message.type !== 'text' || !message.text) {
        return {messageContent: content, messages};
    }

    // Detect language
    const language = await detectLanguage(message.text);

    // Store language in session
    if (!sessionData.context) {
        sessionData.context = {variables: {}};
    }
    sessionData.context.variables.language = language;

    // Update system message with language instruction
    const languageInstruction = `User is writing in ${language}. Reply in the same language.`;

    // Find system message
    const systemIndex = messages.findIndex(m => m.role === 'system');

    if (systemIndex >= 0) {
        // Update existing system message
        const updatedMessages = [...messages];
        const currentContent = updatedMessages[systemIndex].content;
        if (typeof currentContent === 'string' && !currentContent.includes('User is writing in')) {
            updatedMessages[systemIndex].content = `${currentContent} ${languageInstruction}`;
        }
        return {messageContent: content, messages: updatedMessages};
    } else {
        // Add new system message
        return {
            messageContent: content,
            messages: [
                {role: 'system', content: languageInstruction},
                ...messages
            ]
        };
    }
});

// Start the bot
bot.start();
```

## License

MIT
