import firebaseOperations from '../firebase/firebaseOperations';

export const getUserSettings = async (userId) => {
  try {
    const settings = await firebaseOperations.getUserSettings(userId);
    return settings || {};
  } catch (error) {
    console.error('Error fetching user settings:', error);
    return {};
  }
};

export const updateUserSettings = async (userId, newSettings) => {
  try {
    await firebaseOperations.updateUserSettings(userId, newSettings);
    return true;
  } catch (error) {
    console.error('Error updating user settings:', error);
    return false;
  }
};

export const getOpenAIApiKey = async (userId) => {
  const settings = await getUserSettings(userId);
  return settings.openaiApiKey || '';
};

export const setOpenAIApiKey = async (userId, apiKey) => {
  return await updateUserSettings(userId, { openaiApiKey: apiKey });
};