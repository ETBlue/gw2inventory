'use strict';

define(['exports'], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var storage = localStorage.getItem('gw2apikey');
  var key = undefined;

  if (storage.indexOf('{') < 0) {
    key = JSON.parse(storage);
  } else {
    key = "{current: '" + key + "', recent: {}}";
  }

  var apiKey = exports.apiKey = {
    getKey: function getKey() {
      if (key) {
        return key.current;
      } else {
        return null;
      }
    },
    setKey: function setKey(apiKey) {
      if (!key) {
        key = { current: '', recent: {} };
      } else if (!key.current) {
        key = { current: '', recent: {} };
      }
      key.current = apiKey;
      localStorage.setItem('gw2apikey', JSON.stringify(key));
    },
    getHistory: function getHistory() {
      return key.recent;
    },
    setHistory: function setHistory(apiKey, accountId) {
      if (!key) {
        key = { current: '', recent: {} };
      } else if (!key.recent) {
        key = { current: '', recent: {} };
      }
      key.recent[apiKey] = accountId;
      localStorage.setItem('gw2apikey', JSON.stringify(key));
    },
    clearHistory: function clearHistory() {
      localStorage.removeItem('gw2apikey');
    }
  };
  exports.default = apiKey;
});