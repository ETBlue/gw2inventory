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
      var page = 0;
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
        return this._data.profession || '';
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
        return hours + 'h ' + minutes + 'm ' + seconds + 's';
      }
    }, {
      key: 'deaths',
      get: function get() {
        return this._data.deaths || '';
      }
    }, {
      key: 'guild',
      get: function get() {
        var guildData = _guilds.guilds.get(this._data.guild);

        return guildData.guild_name + '<br />[' + guildData.tag + ']';
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
    }]);

    return Character;
  })();

  function getSpecializationHtml(dataList) {
    var output_string = '';
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
});