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
    const formData = new FormData();
    formData.append('image', file);
    const response = await openai.createImageAnalysis({
      image: formData,
      model: "gpt-4-vision-preview",
    });
    return response.data[0].text;
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
