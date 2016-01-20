'use strict';

define(['exports', 'model/apiKey'], function (exports, _apiKey) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.bank = undefined;
  var dataRef = undefined;
  var bank = exports.bank = {
    get: function get() {
      return dataRef;
    },
    load: function load() {
      var loadDeferred = new $.Deferred();
      var params = {
        access_token: _apiKey.apiKey.getKey(),
        lang: 'en',
        page: 0
      };

      //載入銀行
      $.get('https://api.guildwars2.com/v2/account/bank?' + $.param(params)).done(function (bankData) {
        dataRef = bankData;
        loadDeferred.resolve(dataRef);
      });
      return loadDeferred;
    }
  };
});