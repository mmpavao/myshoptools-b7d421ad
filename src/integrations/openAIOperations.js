import OpenAI from 'openai';
import { db } from '../firebase/config';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';

const createOpenAIClient = (apiKey) => new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

const handleOpenAIError = (error, operation) => {
  console.error(`Error in ${operation}:`, error);
  if (error.response) {
    const status = error.response.status;
    if (status === 401) {
      throw new Error('Authentication failed. Please check your API key.');
    } else if (status === 403) {
      throw new Error('Access forbidden. Your account may not have the necessary permissions.');
    } else if (status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    } else {
      throw new Error(`OpenAI API error: ${error.response.data.error.message}`);
    }
  } else if (error.request) {
    throw new Error('No response received from OpenAI. Please check your internet connection.');
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
      assistant_id: assistantId
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

export const analyzeImage = async (apiKey, file) => {
  try {
    const openai = createOpenAIClient(apiKey);
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "What's in this image?" },
            { type: "image_url", image_url: { url: URL.createObjectURL(file) } }
          ],
        },
      ],
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
    const response = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
    });
    return response.text;
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
    const blob = new Blob([await mp3.arrayBuffer()], { type: 'audio/mpeg' });
    return URL.createObjectURL(blob);
  } catch (error) {
    handleOpenAIError(error, 'text to speech');
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
    const docRef = await addDoc(collection(db, 'bots'), {
      ...botData,
      assistantId: assistant.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...botData, assistantId: assistant.id };
  } catch (error) {
    handleOpenAIError(error, 'create bot');
  }
};

export const updateBot = async (apiKey, botId, botData) => {
  try {
    const openai = createOpenAIClient(apiKey);
    await openai.beta.assistants.update(botData.assistantId, {
      name: botData.name,
      instructions: botData.instructions,
      model: botData.model,
    });
    await updateDoc(doc(db, 'bots', botId), {
      ...botData,
      updatedAt: new Date().toISOString(),
    });
    return { id: botId, ...botData };
  } catch (error) {
    handleOpenAIError(error, 'update bot');
  }
};

export const deleteBot = async (apiKey, botId, assistantId) => {
  try {
    const openai = createOpenAIClient(apiKey);
    await openai.beta.assistants.del(assistantId);
    await deleteDoc(doc(db, 'bots', botId));
  } catch (error) {
    handleOpenAIError(error, 'delete bot');
  }
};

export const getBots = async (apiKey) => {
  try {
    const openai = createOpenAIClient(apiKey);
    const assistants = await openai.beta.assistants.list();
    const querySnapshot = await getDocs(collection(db, 'bots'));
    const firestoreBots = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Merge OpenAI assistants with Firestore data
    const mergedBots = assistants.data.map(assistant => {
      const firestoreBot = firestoreBots.find(bot => bot.assistantId === assistant.id);
      return {
        id: firestoreBot?.id || assistant.id,
        name: assistant.name,
        instructions: assistant.instructions,
        model: assistant.model,
        assistantId: assistant.id,
        createdAt: firestoreBot?.createdAt || assistant.created_at,
        updatedAt: firestoreBot?.updatedAt || new Date().toISOString(),
        // Add any other properties you want to include
      };
    });

    // Update Firestore with any missing bots
    for (const bot of mergedBots) {
      if (!firestoreBots.some(fBot => fBot.assistantId === bot.assistantId)) {
        await addDoc(collection(db, 'bots'), {
          ...bot,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    return mergedBots;
  } catch (error) {
    handleOpenAIError(error, 'get bots');
  }
};
