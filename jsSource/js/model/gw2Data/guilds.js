'use strict';

define(['exports'], function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var dataRef = {};
  var loadingRef = {};
  var guilds = exports.guilds = {
    get: function get(id) {
      return dataRef[id];
    },
    load: function load(id) {
      if (!loadingRef[id]) {
        var params = {
          guild_id: id
        };
        loadingRef[id] = $.get('https://api.guildwars2.com/v1/guild_details.json?' + $.param(params)).done(function (guildData) {
          dataRef[guildData.guild_id] = guildData;
        });
      }
      return loadingRef[id];
    },
    loadByCharacterList: function loadByCharacterList(characterList) {
      var _this = this;

      var waiting = [];
      characterList.forEach(function (characterData) {
        if (characterData.guild) {
          waiting.push(_this.load(characterData.guild));
        }
      });
      return $.when.apply($.when, waiting);
    }
  };
});