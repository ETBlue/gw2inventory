let key = localStorage.getItem('gw2apikey');

export const apiKey = {
  getKey() {
    return key;
  },
  setKey(apiKey) {
    key = apiKey;
    localStorage.setItem('gw2apikey', key);
  }
};

export default apiKey;