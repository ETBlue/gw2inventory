'use strict';

define(['exports', 'utils/events', 'model/apiKey', 'model/gw2Data/account', 'model/gw2Data/characters', 'model/gw2Data/guilds'], function (exports, _events, _apiKey, _account, _characters, _guilds) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.gw2Data = undefined;
  var gw2Data = exports.gw2Data = {
    loadAccount: function loadAccount() {
      var _this = this;

      this.trigger('load:account');
      return _account.account.load().done(function (accountData) {
        _this.trigger('loaded:account', accountData);
      });
    },
    loadCharacters: function loadCharacters() {
      var _this2 = this;

      this.trigger('load:characters');
      return _characters.characters.load().done(function (characterList) {
        _this2.trigger('loaded:characters', characterList);
      });
    },
    loadGuild: function loadGuild(guildId) {
      var _this3 = this;

      this.trigger('load:guild');
      var guild_id = guildId;
      return _guilds.guilds.load(guildId).done(function (guildData) {
        _this3.trigger('loaded:guild', guildData);
      });;
    }
  };
  exports.default = gw2Data;
  (0, _events.eventful)(gw2Data);
});