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
      if (!loadingRef[id]) {
        var params = {
          guild_id: id
        };
        loadingRef[id] = $.get('https://api.guildwars2.com/v1/guild_details.json?' + $.param(params)).done(function (guildData) {
          dataRef[guildData.guild_id] = guildData;
        });
      }
      return loadingRef[id];
    }
  };
});