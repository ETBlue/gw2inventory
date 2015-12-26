'use strict';

define(['exports', 'model/gw2Data/gw2Data'], function (exports, _gw2Data) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.guilds = undefined;
  var dataRef = {};
  var loadingRef = {};
  var guilds = exports.guilds = {
    get: function get(id) {
      return dataRef[id];
    },
    load: function load(id) {
      var guild_id = guildId;
      if (!loadingRef[guildId]) {
        loadingRef[guildId] = (0, _gw2Data.loadData)('guild_details.json', { guild_id: guild_id }).done(function (guildData) {
          guildDataRef[guildData.guild_id] = guildData;
        });
      }
      return loadingRef[guildId];
    }
  };
});