import OpenAI from 'openai';
import { db, storage } from '../firebase/config';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
    return false;
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
    throw error;
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
    throw error;
  }
};

export const deleteBot = async (apiKey, botId, assistantId) => {
  try {
    const openai = createOpenAIClient(apiKey);
    await deleteDoc(doc(db, 'bots', botId));
    await openai.beta.assistants.del(assistantId);
  } catch (error) {
    console.error('Error deleting bot:', error);
    throw error;
  }
};

export const getBots = async (apiKey) => {
  try {
    const openai = createOpenAIClient(apiKey);
    const assistants = await openai.beta.assistants.list();
    const querySnapshot = await getDocs(collection(db, 'bots'));
    const localBots = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Merge local bots with OpenAI assistants
    const mergedBots = assistants.data.map(assistant => {
      const localBot = localBots.find(bot => bot.assistantId === assistant.id);
      return localBot ? { ...localBot, ...assistant } : assistant;
    });

    return mergedBots;
  } catch (error) {
    console.error('Error fetching bots:', error);
    throw error;
  }
};

export const addKnowledgeBase = async (assistantId, file) => {
  try {
    const fileRef = ref(storage, `knowledge_base/${assistantId}/${file.name}`);
    await uploadBytes(fileRef, file);
    const fileUrl = await getDownloadURL(fileRef);

    const uploadedFile = await openai.files.create({
      file: await fetch(fileUrl).then(r => r.blob()),
      purpose: 'assistants',
    });

    await openai.beta.assistants.files.create(assistantId, {
      file_id: uploadedFile.id,
    });

    return uploadedFile.id;
  } catch (error) {
    console.error('Error adding knowledge base:', error);
    throw error;
  }
};

export const analyzeImage = async (imageFile) => {
  try {
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

export const generateImage = async (prompt) => {
  try {
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

export const transcribeAudio = async (audioFile) => {
  try {
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

export const textToSpeech = async (text, voice = 'alloy') => {
  try {
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
// Make sure to update these functions to use the createOpenAIClient(apiKey) instead of the global openai instance
