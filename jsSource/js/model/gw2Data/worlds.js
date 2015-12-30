'use strict';

define(['exports'], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var dataRef = {};
  var loadingRef = undefined;
  var worlds = exports.worlds = {
    get: function get(id) {
      return dataRef[id];
    },
    load: function load() {
      if (!loadingRef) {
        var params = {
          ids: 'all',
          lang: 'en'
        };
        loadingRef = $.get('https://api.guildwars2.com/v2/worlds?' + $.param(params)).done(function (worldsData) {
          worldsData.forEach(function (worldData) {
            dataRef[worldData.id] = worldData;
          });
        });
      }
      return loadingRef;
    }
  };
});