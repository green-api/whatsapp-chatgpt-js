# Библиотека WhatsApp GPT Bot

Современная библиотека для создания WhatsApp-бота с интеграцией OpenAI GPT, построенная на базе GREEN-API и
библиотеки @green-api/whatsapp-chatbot-js-v2.

## Особенности

- Интеграция с моделями OpenAI GPT для интеллектуальных ответов
- Поддержка различных моделей GPT (GPT-3.5, GPT-4, GPT-4o)
- Мультимодальные возможности с поддержкой обработки изображений
- Транскрипция голосовых сообщений
- Комплексная обработка различных типов медиа сообщений WhatsApp
- Архитектура промежуточного ПО (middleware) для настройки обработки сообщений и ответов
- Встроенное управление историей разговоров
- Система состояний, унаследованная от базовой библиотеки
- Поддержка TypeScript

## Установка

```bash
npm install @green-api/whatsapp-chatgpt
```

Зависимости (`openai` и `@green-api/whatsapp-chatbot-js-v2`) будут установлены автоматически.

## Быстрый старт

```typescript
import { WhatsappGptBot } from '@green-api/whatsapp-chatgpt';

// Инициализация бота
const bot = new WhatsappGptBot({
    idInstance: "your-instance-id",
    apiTokenInstance: "your-token",
    openaiApiKey: "your-openai-api-key",
    model: "gpt-4o",
    systemMessage: "Вы - полезный ассистент."
});

// Запуск бота
bot.start();
```

# Варианты использования

Данная библиотека поддерживает два различных варианта использования в зависимости от ваших потребностей:

## 1. Самостоятельный бот

Вы можете запустить бота как самостоятельный сервис, который автоматически прослушивает и обрабатывает сообщения
WhatsApp:

```typescript
const bot = new WhatsappGptBot({
    idInstance: "your-instance-id",
    apiTokenInstance: "your-token",
    openaiApiKey: "your-openai-api-key",
    model: "gpt-4o",
    systemMessage: "Вы - полезный ассистент."
});

// Начать прослушивание вебхуков и обработку сообщений
bot.start();
```

## 2. Обработчик сообщений

Альтернативно, вы можете использовать бота как утилиту для обработки сообщений в вашем собственном боте или приложении:

```typescript
const gptBot = new WhatsappGptBot({
    idInstance: "your-instance-id",
    apiTokenInstance: "your-token",
    openaiApiKey: "your-openai-api-key",
    model: "gpt-4o",
    systemMessage: "Вы - полезный ассистент."
});

// Не нужно вызывать start() - просто используйте processMessage когда нужно
const {response, updatedData} = await gptBot.processMessage(message, sessionData);

// Обработайте ответ своим способом
await yourBot.sendText(message.chatId, response);

// Сохраните обновленные данные сессии в своей системе состояний
yourSessionData.gptSession = updatedData;
```

### Пример интеграции

Вот как интегрировать GPT-бота в ваш собственный бот, основанный на состояниях:

```typescript
interface CustomSessionData {
    lang?: string;
    gptSession?: GPTSessionData;  // Хранение данных сессии GPT
}

const gptState: State<CustomSessionData> = {
    name: "gpt_state",
    async onEnter(message, data) {
        // Инициализация сессии GPT
        data.gptSession = {
            messages: [{role: "system", content: gptBot.systemMessage}],
            lastActivity: Date.now()
        };
        await bot.sendText(message.chatId, "Чат с GPT начат!");
    },
    async onMessage(message, data) {
        // Обработка сообщений с помощью GPT-бота
        const {response, updatedData} = await gptBot.processMessage(
                message,
                data.gptSession
        );

        await bot.sendText(message.chatId, response);
        data.gptSession = updatedData;

        return undefined;  // Остаться в текущем состоянии
    }
};
```

Эта гибкость позволяет вам либо запускать бота независимо, либо интегрировать его возможности GPT в вашу систему,
сохраняя полный контроль над потоком разговора и управлением состояниями.

Ключевые моменты об этих вариантах:

1. **Самостоятельный бот**
    - Использует внутреннее управление состояниями
    - Автоматически обрабатывает вебхуки
    - Лучше подходит для простых, однофункциональных GPT-чатботов
    - Требует вызова `bot.start()`

2. **Обработчик сообщений**
    - Не требует внутреннего управления состояниями
    - Не обрабатывает вебхуки
    - Идеально подходит для интеграции в существующих ботов
    - Использует только возможности обработки GPT
    - Более гибкий и контролируемый
    - Никогда не вызывайте `start()` - просто используйте `processMessage()`

## Основные компоненты

### Конфигурация бота

Полные параметры конфигурации для WhatsappGptBot:

```typescript
interface GPTBotConfig extends BotConfig {
    /** API-ключ OpenAI */
    openaiApiKey: string;

    /** Модель для генерации ответов (по умолчанию: gpt-4o) */
    model?: OpenAIModel;

    /** Максимальное количество сообщений для хранения в истории разговора (по умолчанию: 10) */
    maxHistoryLength?: number;

    /** Системное сообщение для определения поведения ассистента */
    systemMessage?: string;

    /** Температура для генерации ответов (по умолчанию: 0.5) */
    temperature?: number;

    /** Ответ по умолчанию при возникновении ошибки */
    errorMessage?: string;

    // Все параметры конфигурации из базовой библиотеки WhatsAppBot также доступны
    // См. документацию @green-api/whatsapp-chatbot-js-v2 для дополнительных опций
}
```

### WhatsappGptBot

Основной класс для создания и управления вашим WhatsApp-ботом с OpenAI:

```typescript
const bot = new WhatsappGptBot({
    // Обязательные параметры
    idInstance: "your-instance-id",
    apiTokenInstance: "your-token",
    openaiApiKey: "your-openai-api-key",

    // Опциональные GPT-специфические параметры
    model: "gpt-4o",
    maxHistoryLength: 15,
    systemMessage: "Вы - полезный ассистент, специализирующийся на поддержке клиентов.",
    temperature: 0.7,
    errorMessage: "Извините, я не смог обработать ваш запрос. Пожалуйста, попробуйте снова.",

    // Опциональные параметры из базового бота
    defaultState: "greeting",
    sessionTimeout: 300,
    // См. документацию базовой библиотеки для дополнительных опций
});
```

## Обработка сообщений

Бот автоматически обрабатывает различные типы сообщений WhatsApp и преобразует их в формат, понятный моделям OpenAI.

### Поддерживаемые типы сообщений

- **Текст**: Обычные текстовые сообщения
- **Изображения**: Фотографии с опциональными подписями (поддерживается в моделях с возможностью обработки изображений)
- **Аудио**: Голосовые сообщения с автоматической транскрипцией
- **Видео**: Видеосообщения с подписями
- **Документы**: Вложенные файлы
- **Опросы**: Сообщения с опросами и обновлениями опросов
- **Местоположение**: Общий доступ к местоположению
- **Контакты**: Общий доступ к контактам

### Реестр обработчиков сообщений

Бот использует реестр обработчиков сообщений для обработки различных типов сообщений:

```typescript
// Доступ к реестру
const registry = bot.messageHandlers;

// Создание пользовательского обработчика сообщений
class CustomMessageHandler implements MessageHandler {
    canHandle(message: Message): boolean {
        return message.type === "custom-type";
    }

    async processMessage(message: Message): Promise<any> {
        // Обработка сообщения
        return "Обработанный контент";
    }
}

// Регистрация пользовательского обработчика
bot.registerMessageHandler(new CustomMessageHandler());

// Замена существующего обработчика
bot.replaceHandler(TextMessageHandler, new CustomTextHandler());
```

## Система промежуточного ПО (Middleware)

Система промежуточного ПО позволяет настраивать обработку сообщений перед отправкой в GPT и обработку ответов перед
отправкой пользователю.

### Добавление промежуточного ПО для сообщений

```typescript
// Обработка сообщений перед отправкой в GPT
bot.addMessageMiddleware(async (message, messageContent, messages, sessionData) => {
    // Добавление пользовательского контекста в разговор
    if (message.type === "text" && message.chatId.endsWith("@c.us")) {
        // Добавление информации о пользователе из базы данных
        const userInfo = await getUserInfo(message.chatId);

        // Изменение текущего содержимого сообщения
        const enhancedContent = `[Пользователь: ${userInfo.name}] ${messageContent}`;

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

### Добавление промежуточного ПО для ответов

```typescript
// Обработка ответов GPT перед отправкой пользователю
bot.addResponseMiddleware(async (response, messages, sessionData) => {
    // Форматирование или изменение ответа
    const formattedResponse = response
            .replace(/\bGPT\b/g, "Ассистент")
            .trim();

    // Вы также можете изменить сообщения, которые будут сохранены в истории
    return {
        response: formattedResponse,
        messages
    };
});
```

## Данные сессии

GPT-бот расширяет базовые данные сессии информацией, специфичной для разговора:

```typescript
interface GPTSessionData {
    /** История разговора */
    messages: ChatCompletionMessageParam[];

    /** Временная метка последней активности */
    lastActivity: number;

    /** Пользовательские данные состояния */
    userData?: Record<string, any>;

    /** Контекст для текущего разговора */
    context?: {
        /** Теги или метаданные для разговора */
        tags?: string[];

        /** Пользовательские переменные контекста */
        variables?: Record<string, any>;
    };
}
```

Вы можете получить доступ и изменить эти данные в вашем промежуточном ПО:

```typescript
bot.addMessageMiddleware(async (message, content, messages, sessionData) => {
    // Установка переменных контекста
    if (!sessionData.context) {
        sessionData.context = {variables: {}};
    }

    sessionData.context.variables.lastInteraction = new Date().toISOString();

    return {messageContent: content, messages};
});
```

## Утилиты

Библиотека предоставляет несколько служебных функций для общих задач:

### Обработка медиафайлов

```typescript
import { Utils } from '@green-api/whatsapp-chatgpt';

// Загрузка медиафайла из URL
const tempFile = await Utils.downloadMedia("https://example.com/image.jpg");

// Транскрипция аудио
const openai = new OpenAI({apiKey: "your-openai-api-key"});
const transcript = await Utils.transcribeAudio("/path/to/audio.ogg", openai);

// Очистка после обработки
fs.unlinkSync(tempFile);
```

### Управление разговором

```typescript
import { Utils } from '@green-api/whatsapp-chatgpt';

// Обрезка истории разговора
const trimmedMessages = Utils.trimConversationHistory(
        messages,
        10,  // макс. кол-во сообщений
        true  // сохранить системное сообщение
);

// Оценка использования токенов
const estimatedTokens = Utils.estimateTokens(messages);
```

## Поддерживаемые модели OpenAI

Библиотека поддерживает различные модели OpenAI:

### Модели GPT-4

- gpt-4
- gpt-4-turbo
- gpt-4-turbo-preview
- gpt-4-1106-preview
- gpt-4-0125-preview
- gpt-4-32k

### Модели GPT-4o

- gpt-4o (по умолчанию)
- gpt-4o-mini
- gpt-4o-2024-05-13

### Модели GPT-3.5

- gpt-3.5-turbo
- gpt-3.5-turbo-16k
- gpt-3.5-turbo-1106
- gpt-3.5-turbo-0125

### Модели o1

- o1
- o1-mini
- o1-preview

### Модели с поддержкой изображений

Следующие модели могут обрабатывать изображения:

- gpt-4o
- gpt-4o-mini
- gpt-4-vision-preview
- gpt-4-turbo
- gpt-4-turbo-preview

## Расширенная конфигурация

### Пользовательская обработка состояний

Поскольку библиотека построена на @green-api/whatsapp-chatbot-js-v2, вы можете использовать все функции состояний
базовой библиотеки:

```typescript
// Добавление пользовательского состояния
bot.addState({
    name: "collect_info",
    async onEnter(message) {
        await bot.sendText(message.chatId, "Пожалуйста, укажите ваше имя.");
    },
    async onMessage(message, data = {}) {
        // Сохранение имени и обработка с помощью GPT
        const openai = bot.getOpenAI();
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {role: "system", content: "Сгенерируйте персонализированное приветствие."},
                {role: "user", content: `Меня зовут ${message.text}`}
            ]
        });

        await bot.sendText(message.chatId, completion.choices[0]?.message.content || "Привет!");
        return "main_chat"; // Переход в основное состояние чата
    }
});
```

### Расширенная обработка сообщений

```typescript
// Получение клиента OpenAI для пользовательских API-вызовов
const openai = bot.getOpenAI();

// Проверка поддержки изображений текущей моделью
if (bot.supportsImages()) {
    // Обработка рабочего процесса на основе изображений
}
```

## Пример демо-бота

См. [наш демо-чат-бот](https://github.com/green-api/whatsapp-demo-chatgpt-js) для комплексного демо-чат-бота,
демонстрирующего множество функций:

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

// Пользовательский обработчик изображений с расширенными описаниями
class EnhancedImageHandler extends ImageMessageHandler {
    async processMessage(message: Message, openai: OpenAI, model: OpenAIModel): Promise<any> {
        const result = await super.processMessage(message, openai, model);

        if (typeof result === "string") {
            return result.replace(
                    "[The user sent an image",
                    "[Пользователь отправил изображение. Сообщите ему, что вы не та модель, которую он должен использовать"
            );
        }

        return result;
    }
}

// Примеры промежуточного ПО

// Промежуточное ПО для логирования
const loggingMessageMiddleware: ProcessMessageMiddleware = async (
        message, messageContent, messages, _
) => {
    console.log(`[${new Date().toISOString()}] Пользователь (${message.chatId}): `,
            typeof messageContent === "string"
                    ? messageContent
                    : JSON.stringify(messageContent));

    return {messageContent, messages};
};

// Инициализация бота
const bot = new WhatsappGptBot({
    idInstance: process.env.INSTANCE_ID || "",
    apiTokenInstance: process.env.INSTANCE_TOKEN || "",
    openaiApiKey: process.env.OPENAI_API_KEY || "",
    model: "gpt-4o",
    systemMessage: "Вы - полезный WhatsApp-ассистент, созданный GREEN-API",
    maxHistoryLength: 15,
    temperature: 0.5,
    handlersFirst: true,
    clearWebhookQueueOnStart: true,
});

// Обработчики команд
bot.onText("/help", async (message, _) => {
    const helpText = `*WhatsAppGPT Демо-бот*\n\nДоступные команды:\n- /help - Показать это сообщение помощи\n- /clear - Очистить историю разговора`;
    await bot.sendText(message.chatId, helpText);
});

// Регистрация промежуточного ПО
bot.addMessageMiddleware(loggingMessageMiddleware);

// Замена обработчиков по умолчанию
bot.replaceHandler(ImageMessageHandler, new EnhancedImageHandler());

// Запуск бота
bot.start();
```

Этот демо-бот включает:

- Пользовательские обработчики сообщений
- Различные реализации промежуточного ПО
- Обработчики команд
- Пользовательские обработчики типов
- Обработку ошибок

## Дополнительные примеры

### Мультиязычный бот

```typescript
import { WhatsappGptBot } from '@green-api/whatsapp-chatgpt';
import { detectLanguage } from './language-detector';

const bot = new WhatsappGptBot({
    idInstance: "your-instance-id",
    apiTokenInstance: "your-token",
    openaiApiKey: "your-openai-api-key",
    model: "gpt-4o"
});

// Добавление промежуточного ПО для определения языка
bot.addMessageMiddleware(async (message, content, messages, sessionData) => {
    // Обрабатывать только текстовые сообщения
    if (message.type !== 'text' || !message.text) {
        return {messageContent: content, messages};
    }

    // Определение языка
    const language = await detectLanguage(message.text);

    // Сохранение языка в сессии
    if (!sessionData.context) {
        sessionData.context = {variables: {}};
    }
    sessionData.context.variables.language = language;

    // Обновление системного сообщения с инструкцией о языке
    const languageInstruction = `Пользователь пишет на ${language}. Отвечайте на том же языке.`;

    // Поиск системного сообщения
    const systemIndex = messages.findIndex(m => m.role === 'system');

    if (systemIndex >= 0) {
        // Обновление существующего системного сообщения
        const updatedMessages = [...messages];
        const currentContent = updatedMessages[systemIndex].content;
        if (typeof currentContent === 'string' && !currentContent.includes('Пользователь пишет на')) {
            updatedMessages[systemIndex].content = `${currentContent} ${languageInstruction}`;
        }
        return {messageContent: content, messages: updatedMessages};
    } else {
        // Добавление нового системного сообщения
        return {
            messageContent: content,
            messages: [
                {role: 'system', content: languageInstruction},
                ...messages
            ]
        };
    }
});

// Запуск бота
bot.start();
```

## Лицензия

MIT
