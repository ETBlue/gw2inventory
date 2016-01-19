'use strict';

define(['exports', 'utils/events', 'model/apiKey', 'model/gw2Data/account', 'model/gw2Data/characters', 'model/gw2Data/guilds', 'model/gw2Data/wallet', 'model/gw2Data/bank'], function (exports, _events, _apiKey, _account, _characters, _guilds, _wallet, _bank) {
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
    loadWallet: function loadWallet() {
      var _this3 = this;

      this.trigger('load:wallet');
      return _wallet.wallet.load().done(function (walletData) {
        _this3.trigger('loaded:wallet', walletData);
      });
    },
    loadBank: function loadBank() {
      var _this4 = this;

      this.trigger('load:bank');
      return _bank.bank.load().done(function (bankData) {
        _this4.trigger('loaded:bank', bankData);
      });
    },
    loadGuild: function loadGuild(guildId) {
      var _this5 = this;

      this.trigger('load:guild');
      var guild_id = guildId;
      return _guilds.guilds.load(guildId).done(function (guildData) {
        _this5.trigger('loaded:guild', guildData);
      });;
    }
  };
  exports.default = gw2Data;
  (0, _events.eventful)(gw2Data);
});