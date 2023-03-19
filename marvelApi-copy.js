import axios from 'axios';
import * as Crypto from 'expo-crypto';

const publicKey = 'YOUR_PUBLIC_KEY';
const privateKey = 'YOUR_PRIVATE_KEY';
const baseUrl = 'https://gateway.marvel.com/v1/public';

const getHash = async (timestamp) => {
  const toHash = timestamp + privateKey + publicKey;
  return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.MD5, toHash);
};

export const getCharacters = async (limit = 8) => {
  const timestamp = new Date().getTime();
  const hash = await getHash(timestamp);
  const url = `${baseUrl}/characters?limit=${limit}&apikey=${publicKey}&ts=${timestamp}&hash=${hash}`;

  try {
    const response = await axios.get(url);
    return response.data.data.results;
  } catch (error) {
    console.error('Error fetching Marvel characters:', error);
    return [];
  }
};
