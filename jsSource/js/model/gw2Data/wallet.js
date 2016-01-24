'use strict';

define(['exports', 'model/apiKey', 'model/gw2Data/currencies'], function (exports, _apiKey, _currencies) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.wallet = undefined;

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
  var wallet = exports.wallet = {
    get: function get() {
      return dataRef;
    },
    load: function load() {
      var loadDeferred = new $.Deferred();
      var params = {
        access_token: _apiKey.apiKey.getKey(),
        lang: 'en'
      };
      var waiting = [];
      $.get('https://api.guildwars2.com/v2/account/wallet?' + $.param(params)).done(function (walletData) {
        //載入currencies
        waiting.push(_currencies.currencies.load());

        //全部載入完畢後才resolve loadDeferred
        $.when.apply($.when, waiting).done(function () {
          dataRef = walletData.map(function (walletItem) {
            var item = new Wallet(walletItem);
            return item.toJSON();
          });
          loadDeferred.resolve(dataRef);
        });
      });
      return loadDeferred;
    }
  };

  var Wallet = (function () {
    function Wallet(data) {
      _classCallCheck(this, Wallet);

      this._data = data;
      return this;
    }

    _createClass(Wallet, [{
      key: 'toJSON',
      value: function toJSON() {
        var _this = this;

        var result = {};
        Object.keys(this._data).forEach(function (key) {
          result[key] = _this[key];
        });
        ['name', 'description', 'icon', 'order'].forEach(function (key) {
          result[key] = _this[key] || '';
        });
        return result;
      }
    }, {
      key: 'icon',
      get: function get() {
        var iconUrl = _currencies.currencies.get(this._data.id).icon || '';
        return '<img class=\'large solo icon\' src=\'' + iconUrl + '\' />';
      }
    }, {
      key: 'name',
      get: function get() {
        var name = _currencies.currencies.get(this._data.id).name || '';
        return '<span class="bold">' + name + '</span>';
      }
    }, {
      key: 'value',
      get: function get() {
        var value = this._data.value || '';

        var name = _currencies.currencies.get(this._data.id).name;

        if (name == 'Coin') {
          return getCoinHtml(value);
        } else if (name == 'Gem') {
          return '<span class=\'currency gem\'>' + value + '</span>';
        } else if (name == 'Karma') {
          return '<span class=\'currency karma\'>' + value + '</span>';
        } else if (name == 'Laurel') {
          return '<span class=\'currency laurel\'>' + value + '</span>';
        } else {
          return value;
        }
      }
    }, {
      key: 'description',
      get: function get() {
        return _currencies.currencies.get(this._data.id).description || '';
      }
    }, {
      key: 'order',
      get: function get() {
        return '<span class="small light">' + _currencies.currencies.get(this._data.id).order + '</span>';
      }
    }]);

    return Wallet;
  })();

  function getCoinHtml(value) {
    var copper = value % 100;
    var silver = Math.floor(value / 100) % 100;
    var gold = Math.floor(value / 10000);
    return '\n    <div class="gold coin">\n      ' + gold + '\n      <img class="icon inline" title="gold" src="https://wiki.guildwars2.com/images/d/d1/Gold_coin.png" />\n    </div>\n    <div class="silver coin">\n      ' + silver + '\n      <img class="icon inline" title="silver" src="https://wiki.guildwars2.com/images/3/3c/Silver_coin.png" />\n    </div>\n    <div class="copper coin">\n      ' + copper + '\n      <img class="icon inline" title="copper" src="https://wiki.guildwars2.com/images/e/eb/Copper_coin.png" />\n    </div>\n  ';
  }
});