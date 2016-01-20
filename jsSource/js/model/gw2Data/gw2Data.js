'use strict';

define(['exports', 'utils/events', 'model/apiKey', 'model/gw2Data/account', 'model/gw2Data/characters', 'model/gw2Data/inventory', 'model/gw2Data/wallet'], function (exports, _events, _apiKey, _account, _characters, _inventory, _wallet) {
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
    loadInventory: function loadInventory() {
      var _this3 = this;

      this.trigger('load:inventory');
      return _inventory.inventory.load().done(function (inventoryData) {
        _this3.trigger('loaded:inventory', inventoryData);
      });
    },
    loadWallet: function loadWallet() {
      var _this4 = this;

      this.trigger('load:wallet');
      return _wallet.wallet.load().done(function (walletData) {
        _this4.trigger('loaded:wallet', walletData);
      });
    }
  };
  exports.default = gw2Data;
  (0, _events.eventful)(gw2Data);
});