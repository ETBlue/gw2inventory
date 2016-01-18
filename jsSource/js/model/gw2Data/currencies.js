'use strict';

define(['exports'], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var dataRef = {};
  var loadingRef = undefined;
  var currencies = exports.currencies = {
    get: function get(id) {
      return dataRef[id];
    },
    load: function load() {
      if (!loadingRef) {
        var params = {
          ids: 'all',
          lang: 'en'
        };
        loadingRef = $.get('https://api.guildwars2.com/v2/currencies?' + $.param(params)).done(function (currenciesData) {
          currenciesData.forEach(function (currency) {
            dataRef[currency.id] = currency;
          });
        });
      }
      return loadingRef;
    }
  };
});