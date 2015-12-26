'use strict';

define(['exports'], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  var dataRef = {};
  var traits = exports.traits = {
    get: function get(id) {
      return dataRef[id];
    },
    load: function load(ids) {
      var result = new $.Deferred();
      ids = [].concat(_toConsumableArray(new Set(ids)));
      var params = {
        lang: 'en'
      };
      var waiting = [1];
      while (ids.length > 0) {
        params.ids = ids.splice(0, 200).join(',');
        waiting.push($.get('https://api.guildwars2.com/v2/traits?' + $.param(params)));
      }
      $.when.apply($.when, waiting).done(function (one) {
        for (var _len = arguments.length, deferrerResponse = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          deferrerResponse[_key - 1] = arguments[_key];
        }

        deferrerResponse.forEach(function (response) {
          var traitList = response[0];
          traitList.forEach(function (trait) {
            dataRef[trait.id] = trait;
          });
        });
        result.resolve(dataRef);
      });
      return result;
    },
    loadByCharacterList: function loadByCharacterList(characterList) {
      var needTraitsIdList = [];
      characterList.forEach(function (characterData) {
        if (characterData.specializations) {
          $.each(characterData.specializations, function (key, subSpecialization) {
            if (subSpecialization) {
              subSpecialization.forEach(function (specialization) {
                if (specialization && specialization.traits) {
                  specialization.traits.forEach(function (trait) {
                    needTraitsIdList.push(trait);
                  });
                }
              });
            }
          });
        }
      });
      return this.load(needTraitsIdList);
    }
  };
});