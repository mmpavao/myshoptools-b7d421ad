import OpenAI from 'openai';
import { db } from '../firebase/config';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';

const createOpenAIClient = (apiKey) => {
  return new OpenAI({ 
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
  });
};

export const testOpenAIConnection = async (apiKey) => {
  try {
    const openai = createOpenAIClient(apiKey);
    await openai.models.list();
    return true;
  } catch (error) {
    console.error('Error testing OpenAI connection:', error);
    throw new Error(`Failed to connect to OpenAI: ${error.message}`);
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

    const botRef = await addDoc(collection(db, 'bots'), {
      ...botData,
      assistantId: assistant.id,
    });

    return { id: botRef.id, ...botData, assistantId: assistant.id };
  } catch (error) {
    console.error('Error creating bot:', error);
    throw new Error(`Failed to create bot: ${error.message}`);
  }
};

export const updateBot = async (apiKey, botId, botData) => {
  try {
    const openai = createOpenAIClient(apiKey);
    const botRef = doc(db, 'bots', botId);
    await updateDoc(botRef, botData);

    await openai.beta.assistants.update(botData.assistantId, {
      name: botData.name,
      instructions: botData.instructions,
      model: botData.model,
    });

    return { id: botId, ...botData };
  } catch (error) {
    console.error('Error updating bot:', error);
    throw new Error(`Failed to update bot: ${error.message}`);
  }
};

export const deleteBot = async (apiKey, botId, assistantId) => {
  try {
    const openai = createOpenAIClient(apiKey);
    await deleteDoc(doc(db, 'bots', botId));
    await openai.beta.assistants.del(assistantId);
  } catch (error) {
    console.error('Error deleting bot:', error);
    throw new Error(`Failed to delete bot: ${error.message}`);
  }
};

export const getBots = async (apiKey) => {
  try {
    const openai = createOpenAIClient(apiKey);
    console.log('Fetching assistants from OpenAI...');
    const assistants = await openai.beta.assistants.list();
    console.log('Assistants from OpenAI:', assistants);

    console.log('Fetching bots from Firestore...');
    const querySnapshot = await getDocs(collection(db, 'bots'));
    const localBots = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log('Local bots from Firestore:', localBots);

    // Merge OpenAI assistants with local bots
    const mergedBots = assistants.data.map(assistant => {
      const localBot = localBots.find(bot => bot.assistantId === assistant.id);
      return localBot ? { ...localBot, ...assistant } : {
        id: assistant.id,
        name: assistant.name,
        instructions: assistant.instructions,
        model: assistant.model,
        assistantId: assistant.id
      };
    });

    console.log('Merged bots:', mergedBots);
    return mergedBots;
  } catch (error) {
    console.error('Error fetching bots:', error);
    if (error.status === 401) {
      throw new Error('Authentication failed. Please check your API key.');
    } else if (error.status === 403) {
      throw new Error('Access forbidden. Your account may not have the necessary permissions for the Assistants API.');
    } else {
      throw new Error(`Failed to fetch bots: ${error.message}`);
    }
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
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
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
    console.error('Error generating image:', error);
    throw error;
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
    console.error('Error transcribing audio:', error);
    throw error;
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
    console.error('Error converting text to speech:', error);
    throw error;
  }
};
