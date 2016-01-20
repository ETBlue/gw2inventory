'use strict';

define(['exports', 'model/apiKey'], function (exports, _apiKey) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.vault = undefined;
  var dataRef = undefined;
  var vault = exports.vault = {
    get: function get() {
      return dataRef;
    },
    load: function load() {
      var loadDeferred = new $.Deferred();
      var params = {
        access_token: _apiKey.apiKey.getKey(),
        lang: 'en'
      };
      //載入specializations
      $.get('https://api.guildwars2.com/v2/account/materials?' + $.param(params)).done(function (materialList) {
        dataRef = materialList;
        loadDeferred.resolve(dataRef);
      });
      return loadDeferred;
    }
  };
});