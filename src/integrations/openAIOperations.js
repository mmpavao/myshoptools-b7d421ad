import OpenAI from 'openai';
import { db, storage, openAIConfig } from '../firebase/config';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const openai = new OpenAI({ apiKey: openAIConfig.apiKey });

// Remova a função initializeOpenAI, pois não é mais necessária

export const createBot = async (botData) => {
  try {
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

export const updateBot = async (botId, botData) => {
  try {
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

export const deleteBot = async (botId, assistantId) => {
  try {
    await deleteDoc(doc(db, 'bots', botId));
    await openai.beta.assistants.del(assistantId);
  } catch (error) {
    console.error('Error deleting bot:', error);
    throw error;
  }
};

export const getBots = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'bots'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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

// Adicione mais funções conforme necessário para outras funcionalidades da OpenAI

// Ensure all functions are using the 'openai' instance directly instead of relying on initialization
