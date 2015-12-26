'use strict';

define(['exports', 'utils/events', 'model/apiKey', 'model/gw2Data/characters', 'model/gw2Data/guilds'], function (exports, _events, _apiKey, _characters, _guilds) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.gw2Data = undefined;
  var gw2Data = exports.gw2Data = {
    loadCharacters: function loadCharacters() {
      var _this = this;

      this.trigger('load:characters');
      return _characters.characters.load().done(function (characterList) {
        _this.trigger('loaded:characters', characterList);
      });
    },
    loadGuild: function loadGuild(guildId) {
      var _this2 = this;

      this.trigger('load:guild');
      var guild_id = guildId;
      return _guilds.guilds.load(guildId).done(function (guildData) {
        _this2.trigger('loaded:guild', guildData);
      });;
    }
  };
  exports.default = gw2Data;
  (0, _events.eventful)(gw2Data);
});