import OpenAI from 'openai';
import { db } from '../firebase/config';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';

const createOpenAIClient = (apiKey) => new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

const handleOpenAIError = (error, operation) => {
  console.error(`Error in ${operation}:`, error);
  if (error.status === 401) {
    throw new Error('Authentication failed. Please check your API key.');
  } else if (error.status === 403) {
    throw new Error('Access forbidden. Your account may not have the necessary permissions.');
  } else {
    throw new Error(`Failed to ${operation}: ${error.message}`);
  }
};

export const testOpenAIConnection = async (apiKey) => {
  try {
    const openai = createOpenAIClient(apiKey);
    await openai.models.list();
    return true;
  } catch (error) {
    handleOpenAIError(error, 'test connection');
  }
};

export const createBot = async (apiKey, botData) => {
  try {
    const openai = createOpenAIClient(apiKey);
    const assistant = await openai.beta.assistants.create({
      name: botData.name,
      instructions: botData.instructions,
      model: botData.model,
    });
    const now = new Date().toISOString();
    const botWithTimestamps = {
      ...botData,
      assistantId: assistant.id,
      createdAt: now,
      updatedAt: now,
      efficiency: Math.floor(Math.random() * 100) // Placeholder for bot efficiency
    };
    const botRef = await addDoc(collection(db, 'bots'), botWithTimestamps);
    return { id: botRef.id, ...botWithTimestamps };
  } catch (error) {
    handleOpenAIError(error, 'create bot');
  }
};

export const updateBot = async (apiKey, botId, botData) => {
  try {
    const openai = createOpenAIClient(apiKey);
    const updatedData = {
      ...botData,
      updatedAt: new Date().toISOString(),
      efficiency: Math.floor(Math.random() * 100) // Placeholder for bot efficiency
    };
    await updateDoc(doc(db, 'bots', botId), updatedData);
    await openai.beta.assistants.update(botData.assistantId, {
      name: botData.name,
      instructions: botData.instructions,
      model: botData.model,
    });
    return { id: botId, ...updatedData };
  } catch (error) {
    handleOpenAIError(error, 'update bot');
  }
};

export const deleteBot = async (apiKey, botId, assistantId) => {
  try {
    const openai = createOpenAIClient(apiKey);
    await deleteDoc(doc(db, 'bots', botId));
    await openai.beta.assistants.del(assistantId);
  } catch (error) {
    handleOpenAIError(error, 'delete bot');
  }
};

export const getBots = async (apiKey) => {
  try {
    const openai = createOpenAIClient(apiKey);
    const assistants = await openai.beta.assistants.list();
    const querySnapshot = await getDocs(collection(db, 'bots'));
    const localBots = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    return assistants.data.map(assistant => {
      const localBot = localBots.find(bot => bot.assistantId === assistant.id);
      return localBot ? { ...localBot, ...assistant } : {
        id: assistant.id,
        name: assistant.name,
        instructions: assistant.instructions,
        model: assistant.model,
        assistantId: assistant.id,
        createdAt: assistant.created_at,
        updatedAt: assistant.created_at,
        efficiency: Math.floor(Math.random() * 100) // Placeholder for bot efficiency
      };
    });
  } catch (error) {
    handleOpenAIError(error, 'fetch bots');
  }
};

export const analyzeImage = async (apiKey, imageFile) => {
  try {
    const openai = createOpenAIClient(apiKey);
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "What's in this image?" },
            { type: "image_url", image_url: { url: imageFile } },
          ],
        },
      ],
      max_tokens: 300,
    });
    return response.choices[0].message.content;
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
    const transcript = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
    });
    return transcript.text;
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
    handleOpenAIError(error, 'convert text to speech');
  }
};