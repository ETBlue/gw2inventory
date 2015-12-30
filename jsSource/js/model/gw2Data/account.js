'use strict';

define(['exports', 'model/apiKey', 'model/gw2Data/worlds'], function (exports, _apiKey, _worlds) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.account = undefined;

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
  var account = exports.account = {
    get: function get() {
      return dataRef;
    },
    load: function load() {
      var loadDeferred = new $.Deferred();
      var params = {
        access_token: _apiKey.apiKey.getKey()
      };
      var waiting = [];
      $.get('https://api.guildwars2.com/v2/account?' + $.param(params)).done(function (accountData) {
        //載入worlds
        waiting.push(_worlds.worlds.load());

        //全部載入完畢後才resolve loadDeferred
        $.when.apply($.when, waiting).done(function () {
          var account = new Account(accountData);
          dataRef = account.toJSON();
          loadDeferred.resolve(dataRef);
        });
      });
      return loadDeferred;
    }
  };

  var Account = (function () {
    function Account(data) {
      _classCallCheck(this, Account);

      this._data = data;
      return this;
    }

    _createClass(Account, [{
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
      key: 'id',
      get: function get() {
        return this._data.id || '';
      }
    }, {
      key: 'name',
      get: function get() {
        return this._data.name || '';
      }
    }, {
      key: 'world',
      get: function get() {
        var worldData = _worlds.worlds.get(this._data.world);

        return '' + worldData.name;
      }
    }, {
      key: 'created',
      get: function get() {
        var created = this._data.created;
        return created.slice(0, created.indexOf('T')) || '';
      }
    }, {
      key: 'access',
      get: function get() {
        return this._data.access || '';
      }
    }, {
      key: 'fractal_level',
      get: function get() {
        return this._data.fractal_level || '';
      }
    }]);

    return Account;
  })();
});