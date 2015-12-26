'use strict';

define(['exports', 'model/gw2Data/gw2Data', 'model/apiKey'], function (exports, _gw2Data, _apiKey) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.accounts = undefined;
  var accounts = exports.accounts = {
    initialize: function initialize() {
      // show saved apiKey
      var savedKey = _apiKey.apiKey.getKey();
      if (savedKey) {
        $('#api_key').val(savedKey);
      }
      this.bindEvents();
    },
    bindEvents: function bindEvents() {
      $('#api_key').keypress(function (e) {
        if (e.keyCode == 13) {
          var newKey = $(this).val();
          _apiKey.apiKey.setKey(newKey);
          accounts.showLoading();
          _gw2Data.gw2Data.loadCharacters();
        }
      });

      _gw2Data.gw2Data.on('loaded:characters', function () {
        $('#characters-status').html('Characters loaded <span class="glyphicon glyphicon-ok text-success"></span>');
      });
    },
    showLoading: function showLoading() {
      $('#account-status').parent().empty().html('\n      <p id="account-status" class="status" style="display: block;">\n        Loading account...\n      </p>\n      <p id="characters-status" class="status" style="display: block;">\n        Loading characters...\n      </p>\n      <p id="bank-status" class="status" style="display: block;">\n        Loading inventory...\n      </p>\n      <p id="wallet-status" class="status" style="display: block;">\n        Loading wallet...\n      </p>\n    ');
    }
  };
  $(function () {
    accounts.initialize();
  });
});