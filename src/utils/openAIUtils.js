import OpenAI from 'openai';

export const createOpenAIClient = (apiKey) => new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

export const handleOpenAIError = (error, operation) => {
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