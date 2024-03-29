import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);

  } catch (e) {
    console.log('Failed to store data:', e);
  }
};
const removeStorageData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log('Failed to remove data:', e);
  }
};
const getStorageData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);

    if (value !== null) {
      return value;
    } else {
      return null;
    }
  } catch (e) {
    console.log('Failed to fetch data:', e);
    return null;
  }
};

export { storeData, getStorageData ,removeStorageData };
