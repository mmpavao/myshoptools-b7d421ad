import { db, getOpenAIApiKey } from '../firebase/config';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, setDoc, query, where } from 'firebase/firestore';
import { createOpenAIClient, handleOpenAIError } from '../utils/openAIUtils';

const getApiKey = () => {
  const apiKey = getOpenAIApiKey();
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured. Please contact the administrator.');
  }
  return apiKey;
};

export const testOpenAIConnection = async () => {
  try {
    const apiKey = getApiKey();
    const openai = createOpenAIClient(apiKey);
    await openai.models.list();
    return true;
  } catch (error) {
    handleOpenAIError(error, 'test connection');
    return false;
  }
};

export const chatWithBot = async (assistantId, message) => {
  try {
    if (!assistantId) {
      throw new Error('Assistant ID is undefined. Please ensure a valid bot is selected.');
    }

    const apiKey = getApiKey();
    const openai = createOpenAIClient(apiKey);
    const thread = await openai.beta.threads.create();
    const startTime = Date.now();
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
    const responseTime = Date.now() - startTime;
    const efficiency = calculateEfficiency(message, lastMessage.content[0].text.value, responseTime);
    
    await updateBotEfficiency(assistantId, efficiency);

    return {
      response: lastMessage.content[0].text.value,
      efficiency: efficiency
    };
  } catch (error) {
    handleOpenAIError(error, 'chat with bot');
  }
};

const calculateEfficiency = (prompt, response, responseTime) => {
  const promptLength = prompt.length;
  const responseLength = response.length;
  const responseQuality = responseLength > promptLength ? 1 : responseLength / promptLength;
  const timeEfficiency = Math.min(1, 10000 / responseTime); // 10 segundos ou menos é considerado eficiente

  // Pontuação baseada em vários fatores
  const lengthScore = Math.min(1, responseLength / 500); // Respostas de até 500 caracteres são consideradas boas
  const qualityScore = responseQuality;
  const timeScore = timeEfficiency;

  // Média ponderada dos scores
  const efficiency = (lengthScore * 0.3 + qualityScore * 0.4 + timeScore * 0.3) * 100;
  return Math.round(efficiency);
};

const updateBotEfficiency = async (assistantId, efficiency) => {
  const botsRef = collection(db, 'bots');
  const q = query(botsRef, where('assistantId', '==', assistantId));
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    const botDoc = querySnapshot.docs[0];
    const currentEfficiency = botDoc.data().efficiency || 0;
    const newEfficiency = Math.round((currentEfficiency + efficiency) / 2); // Média móvel
    await updateDoc(doc(db, 'bots', botDoc.id), { efficiency: newEfficiency });
  }
};

export const analyzeDocument = async (file) => {
  try {
    const apiKey = getApiKey();
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

export const analyzeImage = async (imageFile) => {
  try {
    const apiKey = getApiKey();
    const openai = createOpenAIClient(apiKey);
    const base64Image = await imageFileToBase64(imageFile);

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
                url: `data:image/jpeg;base64,${base64Image}`,
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

export const generateImage = async (prompt) => {
  try {
    const apiKey = getApiKey();
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

export const transcribeAudio = async (audioFile) => {
  try {
    const apiKey = getApiKey();
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

export const textToSpeech = async (text, voice = 'alloy') => {
  try {
    const apiKey = getApiKey();
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

const getDefaultBotDetails = () => ({
  name: 'Unnamed Bot',
  instructions: '',
  model: 'gpt-3.5-turbo',
  temperature: 1,
  voice: 'alloy',
});

export const getBotDetails = async (assistantId) => {
  try {
    if (!assistantId) {
      console.warn('Assistant ID is undefined. Returning default bot details.');
      return getDefaultBotDetails();
    }
    const apiKey = getApiKey();
    const openai = createOpenAIClient(apiKey);
    const assistant = await openai.beta.assistants.retrieve(assistantId);
    return {
      name: assistant.name || 'Unnamed Bot',
      instructions: assistant.instructions || '',
      model: assistant.model || 'gpt-3.5-turbo',
      temperature: 1,
      voice: 'alloy',
    };
  } catch (error) {
    console.error('Error getting bot details:', error);
    return getDefaultBotDetails();
  }
};

const createOrUpdateBot = async (botData, isUpdate = false) => {
  try {
    const apiKey = getApiKey();
    const openai = createOpenAIClient(apiKey);
    const assistantData = {
      name: botData.name,
      instructions: botData.instructions,
      model: botData.model || "gpt-3.5-turbo",
    };

    let assistant;
    if (isUpdate && botData.assistantId) {
      assistant = await openai.beta.assistants.update(botData.assistantId, assistantData);
    } else {
      assistant = await openai.beta.assistants.create(assistantData);
    }

    const botDocData = {
      ...botData,
      assistantId: assistant.id,
      avatar: botData.avatar || null,
      updatedAt: new Date().toISOString(),
      createdAt: isUpdate ? botData.createdAt : new Date().toISOString(),
    };

    let docRef;
    if (isUpdate) {
      if (!botData.id) {
        throw new Error('Bot ID is missing for update operation');
      }
      docRef = doc(db, 'bots', botData.id);
      await updateDoc(docRef, botDocData);
    } else {
      docRef = await addDoc(collection(db, 'bots'), botDocData);
      botDocData.id = docRef.id;
    }

    return botDocData;
  } catch (error) {
    console.error('Error in createOrUpdateBot:', error);
    throw error;
  }
};

export const createBot = (botData) => createOrUpdateBot(botData);

export const updateBot = async (botId, botData) => {
  if (!botId) {
    throw new Error('Bot ID is required for updating');
  }
  return createOrUpdateBot({ ...botData, id: botId }, true);
};

export const deleteBot = async (botId, assistantId) => {
  try {
    const apiKey = getApiKey();
    const openai = createOpenAIClient(apiKey);
    if (assistantId) {
      await openai.beta.assistants.del(assistantId);
    }
    await deleteDoc(doc(db, 'bots', botId));
  } catch (error) {
    handleOpenAIError(error, 'delete bot');
  }
};

export const getBots = async () => {
  try {
    const apiKey = getApiKey();
    const openai = createOpenAIClient(apiKey);
    const assistants = await openai.beta.assistants.list();
    const querySnapshot = await getDocs(collection(db, 'bots'));
    const firestoreBots = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const mergedBots = await Promise.all(assistants.data.map(async (assistant) => {
      const firestoreBot = firestoreBots.find(bot => bot.assistantId === assistant.id);
      let botDetails;
      try {
        botDetails = await getBotDetails(assistant.id);
      } catch (error) {
        console.error(`Error fetching details for assistant ${assistant.id}:`, error);
        botDetails = getDefaultBotDetails();
      }
      return {
        id: firestoreBot?.id || assistant.id,
        ...botDetails,
        assistantId: assistant.id,
        avatar: firestoreBot?.avatar || null,
        createdAt: firestoreBot?.createdAt || new Date(assistant.created_at * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: firestoreBot?.isActive || false,
        efficiency: firestoreBot?.efficiency || 0,
      };
    }));

    // Handle bots that exist in Firestore but not in OpenAI
    const orphanedBots = firestoreBots.filter(
      firestoreBot => !assistants.data.some(assistant => assistant.id === firestoreBot.assistantId)
    );

    for (const orphanedBot of orphanedBots) {
      console.warn(`Bot ${orphanedBot.id} exists in Firestore but not in OpenAI. Removing from Firestore.`);
      await deleteDoc(doc(db, 'bots', orphanedBot.id));
    }

    await syncBotsWithFirestore(mergedBots);
    return mergedBots;
  } catch (error) {
    console.error('Error getting bots:', error);
    handleOpenAIError(error, 'get bots');
    return [];
  }
};

const syncBotsWithFirestore = async (mergedBots) => {
  for (const bot of mergedBots) {
    const botRef = doc(db, 'bots', bot.id);
    await setDoc(botRef, bot, { merge: true });
  }
};
