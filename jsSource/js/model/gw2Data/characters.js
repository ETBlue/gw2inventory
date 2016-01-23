'use strict';

define(['exports', 'model/apiKey', 'model/gw2Data/guilds', 'model/gw2Data/specializations', 'model/gw2Data/traits', 'model/gw2Data/items'], function (exports, _apiKey, _guilds, _specializations, _traits, _items) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.characters = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = (function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();

  var dataRef = undefined;
  var characters = exports.characters = {
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
      var waiting = [];
      //載入specializations
      waiting.push(_specializations.specializations.load());
      $.get('https://api.guildwars2.com/v2/characters?' + $.param(params)).done(function (characterList) {
        //載入guild
        waiting.push(_guilds.guilds.loadByCharacterList(characterList));
        //載入traits
        waiting.push(_traits.traits.loadByCharacterList(characterList));
        //載入items
        waiting.push(_items.items.loadByCharacterList(characterList));

        //全部載入完畢後才resolve loadDeferred
        $.when.apply($.when, waiting).done(function () {
          dataRef = characterList.map(function (characterData) {
            var character = new Character(characterData);
            return character.toJSON();
          });
          loadDeferred.resolve(dataRef);
        });
      });
      return loadDeferred;
    }
  };

  var Character = (function () {
    function Character(data) {
      _classCallCheck(this, Character);

      this._data = data;
      return this;
    }

    _createClass(Character, [{
      key: 'toJSON',
      value: function toJSON() {
        var _this = this;

        var result = {};
        Object.keys(this._data).forEach(function (key) {
          result[key] = _this[key];
        });
        result.inventory = this.inventory;
        result._data = this._data;
        return result;
      }
    }, {
      key: 'name',
      get: function get() {
        return this._data.name || '';
      }
    }, {
      key: 'race',
      get: function get() {
        return this._data.race || '';
      }
    }, {
      key: 'gender',
      get: function get() {
        return this._data.gender || '';
      }
    }, {
      key: 'profession',
      get: function get() {
        var profession = this._data.profession || '';
        var characterSpecializations = this._data.specializations;
        Object.keys(characterSpecializations).forEach(function (context) {
          characterSpecializations[context].forEach(function (specialization) {
            if (specialization) {
              var specializationRef = _specializations.specializations.get(specialization.id);

              if (specializationRef.elite) {
                console.log(specializationRef.name);
                profession = specializationRef.name + '<br />(' + specializationRef.profession + ')';
              }
            }
          });
        });
        return profession;
      }
    }, {
      key: 'level',
      get: function get() {
        return this._data.level || '';
      }
    }, {
      key: 'created',
      get: function get() {
        var created = this._data.created;
        return created.slice(0, created.indexOf('T')) || '';
      }
    }, {
      key: 'age',
      get: function get() {
        var age = this._data.age;
        var seconds = age % 60;
        var minutes = Math.floor(age / 60) % 60;
        var hours = Math.floor(age / 3600);
        return hours + ':' + minutes + ':' + seconds;
      }
    }, {
      key: 'deaths',
      get: function get() {
        return this._data.deaths || '';
      }
    }, {
      key: 'guild',
      get: function get() {
        if (this._data.guild) {
          var guildData = _guilds.guilds.get(this._data.guild);

          return guildData.guild_name + '<br />[' + guildData.tag + ']';
        } else {
          return '';
        }
      }
    }, {
      key: 'crafting',
      get: function get() {
        var crafting = this._data.crafting;

        if (crafting && crafting.reduce) {
          return crafting.reduce(function (html, craftData) {
            return html + (craftData.rating + '|' + craftData.discipline + ' <br />');
          }, '');
        }
      }
    }, {
      key: 'specializations',
      get: function get() {
        var specializations = this._data.specializations;
        return {
          pve: getSpecializationHtml(specializations.pve),
          pvp: getSpecializationHtml(specializations.pvp),
          wvw: getSpecializationHtml(specializations.wvw)
        };
      }
    }, {
      key: 'equipment',
      get: function get() {
        var equipmentArray = this._data.equipment;
        var equipment = {};
        equipmentArray.forEach(function (element) {
          equipment[element.slot] = {};
          equipment[element.slot].id = element.id;
          equipment[element.slot].upgrades = element.upgrades;
          equipment[element.slot].infusions = element.infusions;
        });
        return {
          Helm: getEquipmentItemHtml(equipment.Helm),
          Shoulders: getEquipmentItemHtml(equipment.Shoulders),
          Gloves: getEquipmentItemHtml(equipment.Gloves),
          Coat: getEquipmentItemHtml(equipment.Coat),
          Leggings: getEquipmentItemHtml(equipment.Leggings),
          Boots: getEquipmentItemHtml(equipment.Boots),
          Backpack: getEquipmentItemHtml(equipment.Backpack),
          HelmAquatic: getEquipmentItemHtml(equipment.HelmAquatic),
          Amulet: getEquipmentItemHtml(equipment.Amulet),
          Accessory1: getEquipmentItemHtml(equipment.Accessory1),
          Accessory2: getEquipmentItemHtml(equipment.Accessory2),
          Ring1: getEquipmentItemHtml(equipment.Ring1),
          Ring2: getEquipmentItemHtml(equipment.Ring2),
          WeaponA1: getEquipmentItemHtml(equipment.WeaponA1),
          WeaponA2: getEquipmentItemHtml(equipment.WeaponA2),
          WeaponB1: getEquipmentItemHtml(equipment.WeaponB1),
          WeaponB2: getEquipmentItemHtml(equipment.WeaponB2),
          WeaponAquaticA: getEquipmentItemHtml(equipment.WeaponAquaticA),
          WeaponAquaticB: getEquipmentItemHtml(equipment.WeaponAquaticB),
          Sickle: getEquipmentItemHtml(equipment.Sickle),
          Axe: getEquipmentItemHtml(equipment.Axe),
          Pick: getEquipmentItemHtml(equipment.Pick)
        };
      }
    }, {
      key: 'bags',
      get: function get() {
        var bags = this._data.bags;
        return getBagHtml(bags);
      }
    }, {
      key: 'inventory',
      get: function get() {
        var bags = this._data.bags;
        var inventory = {
          services: [],
          special: [],
          boosts: [],
          misc: []
        };
        bags.forEach(function (bag) {
          if (bag) {
            bag.inventory.forEach(function (item) {
              if (item) {
                var itemData = _items.items.get(item.id);

                if (itemData) {
                  itemData.count = item.count || "";
                  itemData.binding = item.binding || "";
                  itemData.bound_to = item.bound_to || "";

                  if (itemData.type == "Consumable") {
                    if (itemData.details.type == "Booze") {}

                    if (itemData.details.type == "Food") {
                      inventory.boosts.push(itemData);
                    }

                    if (itemData.details.type == "Generic") {
                      inventory.misc.push(itemData);
                    }

                    if (itemData.details.type == "Halloween") {
                      inventory.boosts.push(itemData);
                    }

                    if (itemData.details.type == "Immediate") {
                      inventory.misc.push(itemData);
                    }

                    if (itemData.details.type == "Unlock") {
                      inventory.misc.push(itemData);
                    }

                    if (itemData.details.type == "Utility") {
                      inventory.boosts.push(itemData);
                    }
                  }

                  if (itemData.type == "Gizmo") {
                    if (itemData.details.type == "Default") {
                      inventory.misc.push(itemData);
                    }
                  }
                }
              }
            });
          }
        });
        return {
          boosts: getInventoryHtml(inventory.boosts),
          misc: getInventoryHtml(inventory.misc)
        };
      }
    }]);

    return Character;
  })();

  function getSpecializationHtml(dataList) {
    return dataList.reduce(function (html, specializationData) {
      if (specializationData) {
        var specialization = _specializations.specializations.get(specializationData.id);

        var traitHtml = '';

        if (specializationData.traits) {
          traitHtml = specializationData.traits.reduce(function (traitHtml, traitId) {
            var trait = _traits.traits.get(traitId);

            if (trait) {
              return traitHtml + ('\n              <div class="table-item">\n                <img class="small icon" data-toggle="tooltip" data-placement="left" title="' + trait.description + '" src="' + trait.icon + '">\n                <span>' + trait.name + '</span>\n              </div>\n            ');
            } else {
              return traitHtml;
            }
          }, '');
        }

        return html + ('\n        <div class="table-item">\n          <img class="medium icon spec" src="' + specialization.icon + '" />\n          <span>' + specialization.name + '</span>\n        </div>\n        ' + traitHtml + '\n      ');
      } else {
        return html;
      }
    }, '');
  }

  function getEquipmentItemHtml(data) {
    var html = '';

    if (data) {
      var equipment = _items.items.get(data.id);

      var upgradeHtml = '';

      if (data.upgrades) {
        upgradeHtml = data.upgrades.reduce(function (upgradeHtml, upgradeId) {
          var upgrade = _items.items.get(upgradeId);

          if (upgrade) {
            return upgradeHtml + ('\n            <div class="table-item">\n              <img class="small icon item ' + upgrade.rarity + '" data-toggle="tooltip" data-placement="left" title=\'\' src="' + upgrade.icon + '">\n              <span class="bold ' + upgrade.rarity + '">' + upgrade.name + '\n                <small>(' + upgrade.level + ')</small>\n              </span>\n            </div>\n          ');
          } else {
            return upgradeHtml;
          }
        }, '');
      }

      var infusionHtml = '';

      if (data.infusions) {
        infusionHtml = data.infusions.reduce(function (infusionHtml, infusionId) {
          var infusion = _items.items.get(infusionId);

          if (infusion) {
            return infusionHtml + ('\n            <div class="table-item">\n              <img class="small icon item ' + infusion.rarity + '" data-toggle="tooltip" data-placement="left" title=\'\' src="' + infusion.icon + '">\n              <span>' + infusion.name + '</span>\n            </div>\n          ');
          } else {
            return infusionHtml;
          }
        }, '');
      }

      return html + ('\n      <div class="table-item">\n        <img data-toggle="tooltip" data-placement="left" title="" class="icon medium item ' + equipment.rarity + '" src="' + equipment.icon + '" />\n        <span class="bold ' + equipment.rarity + '">' + equipment.name + '\n          <small>(' + equipment.level + ')</small>\n        </span>\n      </div>\n      ' + upgradeHtml + '\n      ' + infusionHtml + '\n    ');
    } else {
      return html;
    }
  }

  function getBagHtml(dataList) {
    return dataList.reduce(function (html, bagData) {
      if (bagData) {
        var bag = _items.items.get(bagData.id);

        return html + ('\n        <div class="table-item">\n          <img data-toggle="tooltip" data-placement="left" title="" class="icon medium item ' + bag.rarity + '" src="' + bag.icon + '" />\n          <span class="bold ' + bag.rarity + '">' + bag.name + ' \n            <small>(' + bag.details.size + ' slots)</small>\n          </span>\n        </div>\n      ');
      } else {
        return html;
      }
    }, '');
  }

  function getInventoryHtml(dataList) {
    return dataList.reduce(function (html, item) {
      if (item) {
        return html + ('\n        <div class="table-item">\n          <img data-toggle="tooltip" data-placement="left" title="" class="icon medium item ' + item.rarity + '" src="' + item.icon + '" />\n          <span class="bold ' + item.rarity + '">' + item.name + ' \n            <small>(' + item.count + ')</small>\n          </span>\n        </div>\n      ');
      } else {
        return html;
      }
    }, '');
  }
});