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
  var items = exports.items = {
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
        waiting.push($.get('https://api.guildwars2.com/v2/items?' + $.param(params)));
      }
      $.when.apply($.when, waiting).done(function (one) {
        for (var _len = arguments.length, deferrerResponse = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          deferrerResponse[_key - 1] = arguments[_key];
        }

        deferrerResponse.forEach(function (response) {
          var itemList = response[0];
          itemList.forEach(function (item) {
            dataRef[item.id] = item;
          });
        });
        result.resolve(dataRef);
      });
      return result;
    },
    loadByCharacterList: function loadByCharacterList(characterList) {
      var needItemIdList = [];
      characterList.forEach(function (characterData) {
        if (characterData.bags) {
          characterData.bags.forEach(function (bag) {
            if (bag) {
              needItemIdList.push(bag.id);
              if (bag.inventory) {
                bag.inventory.forEach(function (item) {
                  if (item) {
                    needItemIdList.push(item.id);
                    if (item.upgrades) {
                      item.upgrades.forEach(function (upgradeId) {
                        needItemIdList.push(upgradeId);
                      });
                    }
                    if (item.infusions) {
                      item.infusions.forEach(function (infusionId) {
                        needItemIdList.push(infusionId);
                      });
                    }
                  }
                });
              }
            }
          });
        }
        if (characterData.equipment) {
          characterData.equipment.forEach(function (equipment) {
            if (equipment) {
              needItemIdList.push(equipment.id);
              if (equipment.upgrades) {
                equipment.upgrades.forEach(function (upgradeId) {
                  needItemIdList.push(upgradeId);
                });
              }
              if (equipment.infusions) {
                equipment.infusions.forEach(function (infusionId) {
                  needItemIdList.push(infusionId);
                });
              }
            }
          });
        }
      });
      return this.load(needItemIdList);
    }
  };
});