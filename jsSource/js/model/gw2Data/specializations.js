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
          ids: '1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54',
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