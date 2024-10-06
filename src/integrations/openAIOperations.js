import { db } from '../firebase/config';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { createOpenAIClient, handleOpenAIError } from '../utils/openAIUtils';

import { db } from '../firebase/config';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { createOpenAIClient, handleOpenAIError } from '../utils/openAIUtils';

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
    formData.append('file', imageFile);
    formData.append('model', 'gpt-4-vision-preview');
    formData.append('prompt', 'Analyze this image and provide a brief description.');

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this image and provide a brief description." },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${await imageFileToBase64(imageFile)}`,
              },
            },
          ],
        },
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    handleOpenAIError(error, 'analyze image');
  }
};

const imageFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
  });
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
    const buffer = await mp3.arrayBuffer();
    const blob = new Blob([buffer], { type: 'audio/mpeg' });
    return URL.createObjectURL(blob);
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
      model: "gpt-3.5-turbo",
    };

    let assistant;
    if (isUpdate) {
      assistant = await openai.beta.assistants.update(botData.assistantId, assistantData);
    } else {
      assistant = await openai.beta.assistants.create(assistantData);
    }

    const botDocData = {
      ...botData,
      assistantId: assistant.id,
      avatar: botData.avatar || null,
      updatedAt: new Date().toISOString(),
      model: "gpt-3.5-turbo",
    };

    if (!isUpdate) {
      botDocData.createdAt = new Date().toISOString();
    }

    const docRef = isUpdate ? doc(db, 'bots', botData.id) : collection(db, 'bots');
    const operation = isUpdate ? updateDoc : addDoc;
    await operation(docRef, botDocData);

    return { id: isUpdate ? botData.id : docRef.id, ...botDocData };
  } catch (error) {
    handleOpenAIError(error, isUpdate ? 'update bot' : 'create bot');
  }
};

export const createBot = (apiKey, botData) => createOrUpdateBot(apiKey, botData);
export const updateBot = (apiKey, botId, botData) => createOrUpdateBot(apiKey, { ...botData, id: botId }, true);

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

    const mergedBots = assistants.data.map(assistant => {
      const firestoreBot = firestoreBots.find(bot => bot.assistantId === assistant.id);
      return {
        id: firestoreBot?.id || assistant.id,
        name: assistant.name,
        instructions: assistant.instructions,
        model: assistant.model,
        assistantId: assistant.id,
        avatar: firestoreBot?.avatar || null,
        createdAt: firestoreBot?.createdAt || assistant.created_at,
        updatedAt: firestoreBot?.updatedAt || new Date().toISOString(),
      };
    });

    for (const bot of mergedBots) {
      const botRef = doc(db, 'bots', bot.id);
      await setDoc(botRef, bot, { merge: true });
    }

    return mergedBots;
  } catch (error) {
    handleOpenAIError(error, 'get bots');
  }
};

