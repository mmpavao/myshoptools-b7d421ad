import { createOpenAIClient, handleOpenAIError } from '../utils/openAIUtils';
import firebaseOperations from '../firebase/firebaseOperations';

export const testOpenAIConnection = async (apiKey) => {
  try {
    const openai = createOpenAIClient(apiKey);
    await openai.models.list();
    return true;
  } catch (error) {
    handleOpenAIError(error, 'test connection');
    return false;
  }
};

export const chatWithBot = async (apiKey, assistantId, message) => {
  try {
    const openai = createOpenAIClient(apiKey);
    const thread = await openai.beta.threads.create();
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message
    });
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
      model: "gpt-3.5-turbo"
    });
    
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    while (runStatus.status !== "completed") {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }
    
    const messages = await openai.beta.threads.messages.list(thread.id);
    const lastMessage = messages.data[0];
    return lastMessage.content[0].text.value;
  } catch (error) {
    handleOpenAIError(error, 'chat with bot');
  }
};

export const analyzeDocument = async (apiKey, file) => {
  try {
    const openai = createOpenAIClient(apiKey);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', 'gpt-4-vision-preview');
    formData.append('prompt', 'Analyze this document and provide a brief summary. What specific information might the user be interested in?');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    handleOpenAIError(error, 'analyze document');
  }
};

export const analyzeImage = async (apiKey, imageFile) => {
  try {
    const openai = createOpenAIClient(apiKey);
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('model', 'gpt-4-vision-preview');
    formData.append('prompt', 'Analyze this image and provide a brief description.');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    handleOpenAIError(error, 'analyze image');
  }
};

export const generateImage = async (apiKey, prompt) => {
  try {
    const openai = createOpenAIClient(apiKey);
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });
    return response.data[0].url;
  } catch (error) {
    handleOpenAIError(error, 'generate image');
  }
};

export const transcribeAudio = async (apiKey, audioFile) => {
  try {
    const openai = createOpenAIClient(apiKey);
    const formData = new FormData();
    formData.append('file', audioFile);
    formData.append('model', 'whisper-1');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    handleOpenAIError(error, 'transcribe audio');
  }
};

export const textToSpeech = async (apiKey, text, voice = 'alloy') => {
  try {
    const openai = createOpenAIClient(apiKey);
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: voice,
      input: text,
    });
    const buffer = Buffer.from(await mp3.arrayBuffer());
    return buffer;
  } catch (error) {
    handleOpenAIError(error, 'text to speech');
  }
};

const createOrUpdateBot = async (apiKey, botData, isUpdate = false) => {
  try {
    const openai = createOpenAIClient(apiKey);
    const assistantData = {
      name: botData.name,
      instructions: botData.instructions,
      model: botData.model || "gpt-3.5-turbo",
      tools: [{ type: "code_interpreter" }],
    };

    let assistant;
    if (isUpdate && botData.assistantId) {
      assistant = await openai.beta.assistants.update(botData.assistantId, assistantData);
    } else {
      assistant = await openai.beta.assistants.create(assistantData);
    }

    let avatarUrl = botData.avatar;
    if (botData.avatarFile) {
      avatarUrl = await firebaseOperations.uploadBotAvatar(botData.avatarFile, assistant.id);
    }

    const botDocData = {
      ...botData,
      assistantId: assistant.id,
      avatar: avatarUrl,
      voice: botData.voice || 'alloy',
      updatedAt: new Date().toISOString(),
    };

    if (!isUpdate) {
      botDocData.createdAt = new Date().toISOString();
    }

    if (isUpdate) {
      await firebaseOperations.updateBot(botData.id, botDocData);
    } else {
      await firebaseOperations.createBot(botDocData);
    }

    return { id: botData.id, ...botDocData };
  } catch (error) {
    handleOpenAIError(error, isUpdate ? 'update bot' : 'create bot');
  }
};

export const createBot = (apiKey, botData) => createOrUpdateBot(apiKey, botData);
export const updateBot = (apiKey, botId, botData) => createOrUpdateBot(apiKey, { ...botData, id: botId }, true);

export const deleteBot = async (apiKey, botId, assistantId) => {
  try {
    const openai = createOpenAIClient(apiKey);
    if (assistantId) {
      await openai.beta.assistants.del(assistantId);
    }
    await firebaseOperations.deleteBot(botId);
  } catch (error) {
    handleOpenAIError(error, 'delete bot');
  }
};

export const getBots = async (apiKey, userId) => {
  try {
    console.log('Getting bots for userId:', userId);
    const openai = createOpenAIClient(apiKey);
    const firestoreBots = await firebaseOperations.getBots(userId);
    console.log('Firestore bots:', firestoreBots);

    if (firestoreBots.length === 0) {
      console.log('No bots found in Firestore');
      return [];
    }

    const assistants = await openai.beta.assistants.list();
    console.log('OpenAI assistants:', assistants.data);

    const bots = firestoreBots.map(bot => {
      const assistant = assistants.data.find(a => a.id === bot.assistantId);
      if (!assistant) {
        console.log(`No matching OpenAI assistant found for bot ${bot.id}`);
      }
      return {
        ...bot,
        name: assistant?.name || bot.name,
        instructions: assistant?.instructions || bot.instructions,
        model: assistant?.model || bot.model,
      };
    });

    console.log('Final bots array:', bots);
    return bots;
  } catch (error) {
    console.error('Error in getBots:', error);
    handleOpenAIError(error, 'get bots');
    return [];
  }
};

// Ensure all functions are properly exported
export {
  testOpenAIConnection,
  chatWithBot,
  analyzeDocument,
  analyzeImage,
  generateImage,
  transcribeAudio,
  createBot,
  updateBot,
  deleteBot,
  getBots
};
