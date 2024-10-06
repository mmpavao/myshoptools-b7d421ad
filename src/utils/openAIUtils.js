import OpenAI from 'openai';

export const createOpenAIClient = (apiKey) => new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

export const handleOpenAIError = (error, operation) => {
  console.error(`Error in ${operation}:`, error);
  
  if (error.response) {
    const status = error.response.status;
    const errorMessage = error.response.data?.error?.message || 'Unknown error occurred';
    
    if (status === 401) {
      throw new Error('Authentication failed. The API key may be invalid or expired. Please contact the administrator.');
    } else if (status === 403) {
      throw new Error('Access forbidden. The API key may not have the necessary permissions. Please contact the administrator.');
    } else if (status === 404) {
      throw new Error(`Resource not found. ${errorMessage}`);
    } else if (status === 429) {
      throw new Error('Rate limit exceeded. Please try again later or contact the administrator to increase the rate limit.');
    } else {
      throw new Error(`OpenAI API error: ${errorMessage}`);
    }
  } else if (error.request) {
    throw new Error('No response received from OpenAI. Please check your internet connection or try again later.');
  } else {
    throw new Error(`Failed to ${operation}: ${error.message}`);
  }
};