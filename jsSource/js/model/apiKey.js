'use strict';

define(['exports'], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var key = localStorage.getItem('gw2apikey');
  var apiKey = exports.apiKey = {
    getKey: function getKey() {
      return key;
    },
    setKey: function setKey(apiKey) {
      key = apiKey;
      localStorage.setItem('gw2apikey', key);
    }
  };
  exports.default = apiKey;
});