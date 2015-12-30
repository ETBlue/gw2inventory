'use strict';

define(['exports'], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var dataRef = {};
  var loadingRef = undefined;
  var specializations = exports.specializations = {
    get: function get(id) {
      return dataRef[id];
    },
    load: function load() {
      if (!loadingRef) {
        var params = {
          ids: 'all',
          lang: 'en'
        };
        loadingRef = $.get('https://api.guildwars2.com/v2/specializations?' + $.param(params)).done(function (specializationDatas) {
          specializationDatas.forEach(function (specialization) {
            dataRef[specialization.id] = specialization;
          });
        });
      }
      return loadingRef;
    }
  };
});