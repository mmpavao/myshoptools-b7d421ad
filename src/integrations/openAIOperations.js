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
  // Implementation for creating a bot
};

export const updateBot = async (apiKey, botId, botData) => {
  // Implementation for updating a bot
};

export const deleteBot = async (apiKey, botId, assistantId) => {
  // Implementation for deleting a bot
};

export const getBots = async (apiKey) => {
  // Implementation for fetching bots
};

export const testOpenAIConnection = async (apiKey) => {
  // Implementation for testing OpenAI connection
};
