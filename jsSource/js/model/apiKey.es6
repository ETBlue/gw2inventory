let key = JSON.parse(localStorage.getItem('gw2apikey'));

export const apiKey = {
  getKey() {
    if (key) {
      return key.current;
    } else {
      return null;
    }
  },
  setKey(apiKey) {
    if (!key) {
      key = {current: '', recent: {}};
    } else if (!key.current) {
      key = {current: '', recent: {}};
    }
    key.current = apiKey;
    localStorage.setItem('gw2apikey', JSON.stringify(key));
  },
  getHistory() {
    return key.recent;
  },
  setHistory(apiKey, accountId) {
    if (!key) {
      key = {current: '', recent: {}};
    } else if (!key.recent) {
      key = {current: '', recent: {}};
    }
    key.recent[apiKey] = accountId;
    localStorage.setItem('gw2apikey', JSON.stringify(key));
  },
  clearHistory() {
    localStorage.removeItem('gw2apikey');
  }
};

export default apiKey;