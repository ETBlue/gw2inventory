'use strict';

define(['exports'], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var dataRef = {};
  var loadingRef = undefined;
  var materials = exports.materials = {
    get: function get(id) {
      return dataRef[id];
    },
    load: function load() {
      if (!loadingRef) {
        var params = {
          ids: 'all',
          lang: 'en'
        };
        loadingRef = $.get('https://api.guildwars2.com/v2/materials?' + $.param(params)).done(function (categories) {
          categories.forEach(function (category) {
            dataRef[category.id] = category;
          });
        });
      }
      return loadingRef;
    }
  };
});