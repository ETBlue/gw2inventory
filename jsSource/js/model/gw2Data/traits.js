'use strict';

define(['exports'], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var dataRef = {};
  var loadingRef = undefined;
  var traits = exports.traits = {
    get: function get(id) {
      return dataRef[id];
    },
    load: function load(ids) {
      if (!loadingRef) {
        var params = {
          lang: 'en'
        };
        var waiting = [1];
        while (ids.length > 0) {
          params.ids = ids.splice(0, 200).join(',');
          waiting.push($.get('https://api.guildwars2.com/v2/traits?' + $.param(params)));
        }
        loadingRef = $.when.apply($.when, waiting).done(function (one) {
          for (var _len = arguments.length, deferrerResponse = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            deferrerResponse[_key - 1] = arguments[_key];
          }

          deferrerResponse.forEach(function (response) {
            var traitList = response[0];
            traitList.forEach(function (trait) {
              dataRef[trait.id] = trait;
            });
          });
        });
      }
      return loadingRef;
    }
  };
});