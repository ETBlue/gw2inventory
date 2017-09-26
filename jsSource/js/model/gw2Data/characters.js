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
        return this._data.race + '<br /><span class="small light">' + this._data.gender + '</span>';
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
        characterSpecializations.pve.forEach(function (specialization) {
          if (specialization) {
            var specializationRef = _specializations.specializations.get(specialization.id);

            if (specializationRef.elite) {
              profession = specializationRef.profession + '<br /><span class="small light">' + specializationRef.name + '</span>';
            }
          }
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

          return guildData.guild_name + '<br /><span class="small light">[' + guildData.tag + ']</span>';
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
          Sickle: getToolItemHtml(equipment.Sickle),
          Axe: getToolItemHtml(equipment.Axe),
          Pick: getToolItemHtml(equipment.Pick)
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
        var bags = this._data.bags || [];
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
          boosts: getInventoryHtml(inventory.boosts)
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

  function getToolItemHtml(data) {
    var html = '';

    if (data) {
      var tool = _items.items.get(data.id);

      html += '\n      <div class=\'table-item\'>\n        <img class="medium icon item ' + tool.rarity + '" data-toggle="tooltip" data-placement="left" title=\'\' src="' + tool.icon + '">\n        <div class="bold ' + tool.rarity + '">' + tool.name + '\n          <span class="small light">(' + tool.level + ')</span>\n        </div>\n      </div>\n    ';
    }

    return html;
  }

  function getEquipmentItemHtml(data) {
    var html = '';
    var iconHtml = '';
    var nameHtml = '';

    if (data) {
      var equipment = _items.items.get(data.id);

      if (data.upgrades || data.infusions) {
        nameHtml += '<hr />';
      }

      if (data.upgrades) {
        data.upgrades.forEach(function (upgradeId) {
          var upgrade = _items.items.get(upgradeId);

          if (upgrade) {
            iconHtml += '\n            <img class="medium icon item ' + upgrade.rarity + '" data-toggle="tooltip" data-placement="left" title=\'\' src="' + upgrade.icon + '">\n          ';
            nameHtml += '\n            <div class="small bold ' + upgrade.rarity + '">' + upgrade.name + '\n              <span class="light">(' + upgrade.level + ')</span>\n            </div>\n            ';
          }
        });
      }

      if (data.infusions) {
        data.infusions.forEach(function (infusionId) {
          var infusion = _items.items.get(infusionId);

          if (infusion) {
            iconHtml += '\n            <img class="medium icon item ' + infusion.rarity + '" data-toggle="tooltip" data-placement="left" title=\'\' src="' + infusion.icon + '">\n          ';
            nameHtml += '\n            <div class="small bold ' + infusion.rarity + '">' + infusion.name + '</div>\n          ';
          }
        });
      }

      html = '\n      <div class=\'equipment\'>\n        <img data-toggle="tooltip" data-placement="left" title="" class="icon large item ' + equipment.rarity + '" src="' + equipment.icon + '" />\n        ' + iconHtml + '\n      </div>\n      <div class=\'equipment\'>\n        <div class="bold ' + equipment.rarity + '">' + equipment.name + '\n          <span class="small light">(' + equipment.level + ')</span>\n        </div>\n        ' + nameHtml + '\n      </div>\n      ';
    }

    return html;
  }

  function getBagHtml(dataList) {
    var iconHtml = '';
    var nameHtml = '';
    var countHtml = '';
    var bagCount = 0;
    var slotCount = 0;
    dataList.forEach(function (bagData) {
      slotCount += 1;

      if (bagData) {
        bagCount += 1;

        var bag = _items.items.get(bagData.id);

        iconHtml += '\n        <img data-toggle="tooltip" data-placement="left" title="" class="icon large item ' + bag.rarity + '" src="' + bag.icon + '" />\n      ';
        nameHtml += '\n        <div class="bold ' + bag.rarity + '">' + bag.name + ' \n          <span class="small light">(' + bag.details.size + ' slots)</span>\n        </div>\n      ';
      }
    });

    if (slotCount - bagCount > 1) {
      countHtml += ' (' + (slotCount - bagCount) + ' unused slots)';
    } else if (slotCount - bagCount == 1) {
      countHtml += ' (1 unused slot)';
    }

    return '\n    <p>' + bagCount + ' bags: ' + countHtml + '</p>\n    <div class="equipment">\n      ' + iconHtml + '\n    </div>\n    <div class="equipment">\n      ' + nameHtml + '\n    </div>\n  ';
  }

  function getInventoryHtml(dataList) {
    var iconHtml = '';
    var nameHtml = '';
    var countHtml = '';
    var count = [];
    var foodCount = 0;
    var utilityCount = 0;
    var holloweenCount = 0;
    dataList.forEach(function (item) {
      if (item) {
        iconHtml += '\n        <img data-toggle="tooltip" data-placement="left" title="" class="icon medium item ' + item.rarity + '" src="' + item.icon + '" />\n      ';
        nameHtml += '\n        <div>' + item.count + ' \n          <span class="bold ' + item.rarity + '">' + item.name + ' \n            <span class="small light">(' + item.level + ')</span>\n          </span>\n        </div>\n      ';

        if (item.details.type == "Food") {
          foodCount++;
        } else if (item.details.type == "Utility") {
          utilityCount++;
        } else if (item.details.type == "Halloween") {
          holloweenCount++;
        }
      }
    });

    if (foodCount > 0) {
      count.push(foodCount + ' food');
    }

    if (utilityCount > 1) {
      count.push(utilityCount + ' utilities');
    } else if (utilityCount == 1) {
      count.push(utilityCount + ' utility');
    }

    if (holloweenCount > 1) {
      count.push(holloweenCount + ' Boosters');
    } else if (holloweenCount == 1) {
      count.push('1 Booster');
    }

    if (count.length > 0) {
      countHtml = '<p>' + count.join(', ') + ':</p>';
    }

    return '\n    ' + countHtml + '\n    <div class="equipment">\n      ' + iconHtml + '\n    </div>\n    <div class="equipment">\n      ' + nameHtml + '\n    </div>\n  ';
  }
});