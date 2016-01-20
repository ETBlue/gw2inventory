'use strict';

define(['exports', 'model/apiKey', 'model/gw2Data/items', 'model/gw2Data/characters', 'model/gw2Data/materials', 'model/gw2Data/vault', 'model/gw2Data/bank'], function (exports, _apiKey, _items, _characters, _materials, _vault, _bank) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.inventory = undefined;

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
  var inventory = exports.inventory = {
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

      // 載入材料分類表
      waiting.push(_materials.materials.load());

      // 載入角色包包與物品資料
      waiting.push(_characters.characters.load());

      // 載入倉庫與物品資料
      waiting.push(_vault.vault.load());

      //載入銀行
      waiting.push(_bank.bank.load());

      $.when.apply($.when, waiting).done(function () {
        var waitingLoadItems = [];
        //載入銀行物品資料
        waitingLoadItems.push(_items.items.loadByBankList(_bank.bank.get()));
        waitingLoadItems.push(_items.items.loadByVaultList(_vault.vault.get()));

        //全部載入完畢後才 merge
        $.when.apply($.when, waitingLoadItems).done(function () {

          dataRef = [];

          var characterDataRef = [];
          _characters.characters.get().forEach(function (character) {
            character._data.bags.forEach(function (bag) {
              if (bag) {
                bag.inventory.forEach(function (bagItem) {
                  if (bagItem) {
                    var itemInfo = _items.items.get(bagItem.id);
                    var position = character.name;
                    var item = new Item(position, bagItem, itemInfo);
                    characterDataRef.push(item.toJSON());
                  }
                });
              }
            });
          });
          $.merge(dataRef, characterDataRef);

          var bankDataRef = _bank.bank.get().map(function (bankItem, index) {
            if (bankItem) {
              var itemInfo = _items.items.get(bankItem.id);
              var position = 'Bank|' + (index + 1);
              var item = new Item(position, bankItem, itemInfo);
              return item.toJSON();
            }
          });
          $.merge(dataRef, bankDataRef);

          var vaultDataRef = _vault.vault.get().map(function (material, index) {
            if (material) {
              var itemInfo = _items.items.get(material.id);
              console.log(itemInfo);
              var position = 'Vault|' + (index + 1);
              var item = new Item(position, material, itemInfo);
              return item.toJSON();
            }
          });
          $.merge(dataRef, vaultDataRef);

          loadDeferred.resolve(dataRef);
        });
      });
      return loadDeferred;
    }
  };

  var Item = (function () {
    function Item(position, data, itemInfo) {
      _classCallCheck(this, Item);

      this._data = data || {};
      this._data.position = position || '';
      this._ref = itemInfo || {};
      return this;
    }

    _createClass(Item, [{
      key: 'toJSON',
      value: function toJSON() {
        var _this = this;

        var result = {};
        var keys = ['icon', 'name', 'count', 'type', 'level', 'rarity', 'position', 'binding', 'description', 'category'];
        keys.forEach(function (key) {
          result[key] = _this[key];
        });
        return result;
      }
    }, {
      key: 'icon',
      get: function get() {
        var icon = this._ref.icon || '';
        var rarity = this._ref.rarity || '';
        var description = this._ref.description || '';
        return '<img class=\'large solo item icon ' + rarity + '\' data-toggle=\'tooltip\' data-placement=\'right\' title=\'\' src=\'' + icon + '\' />';
      }
    }, {
      key: 'name',
      get: function get() {
        var name = this._ref.name || '';
        var rarity = this._ref.rarity || '';
        return '<span class="bold ' + rarity + '">' + name + '</span>';
      }
    }, {
      key: 'count',
      get: function get() {
        return parseInt(this._data.count, 10);
      }
    }, {
      key: 'type',
      get: function get() {
        return this._ref.type || '';
      }
    }, {
      key: 'level',
      get: function get() {
        return this._ref.level || '';
      }
    }, {
      key: 'rarity',
      get: function get() {
        return this._ref.rarity || '';
      }
    }, {
      key: 'position',
      get: function get() {
        return this._data.position || '';
      }
    }, {
      key: 'binding',
      get: function get() {
        var binding = this._data.binding;
        var bound_to = this._data.bound_to;

        if (binding) {
          if (bound_to) {
            return bound_to;
          } else {
            return binding;
          }
        } else {
          return '';
        }
      }
    }, {
      key: 'description',
      get: function get() {
        return this._ref.description || '';
      }
    }, {
      key: 'category',
      get: function get() {
        if (this._data.category) {
          return _materials.materials.get(this._data.category).name || '';
        } else {
          return '';
        }
      }
    }]);

    return Item;
  })();
});