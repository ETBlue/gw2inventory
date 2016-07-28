'use strict';

define(['exports', 'model/gw2Data/gw2Data', 'model/apiKey'], function (exports, _gw2Data, _apiKey) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.app = undefined;
  var app = exports.app = {
    initialize: function initialize() {
      // show saved apiKey
      var savedKey = _apiKey.apiKey.getKey();
      if (savedKey) {
        $('#api_key #current').val(savedKey);
        this.drawHistory();
      }
      this.bindEvents();
    },
    drawHistory: function drawHistory() {
      $('#api_key #recent').html(function () {
        var savedKeyHistory = _apiKey.apiKey.getHistory();
        if (savedKeyHistory) {
          var html = '';
          Object.keys(savedKeyHistory).forEach(function (key) {
            html += '\n            <li>\n              <a data-key=\'' + key + '\'>' + savedKeyHistory[key] + '</a>\n            </li>\n          ';
          });
          html += '\n            <li role="separator" class="divider"></li>\n            <li>\n              <a data-action="clear">Clear Hostory</a>\n            </li>\n        ';
          return html;
        }
      });
    },
    bindEvents: function bindEvents() {
      var _this = this;

      var newKey = undefined;
      function loadpage() {
        app.showLoading();
        _gw2Data.gw2Data.loadAccount();
        _gw2Data.gw2Data.loadCharacters();
        _gw2Data.gw2Data.loadInventory();
        _gw2Data.gw2Data.loadWallet();
      }

      var matchQuery = undefined;
      if (matchQuery = location.href.match(/(s|source)=(.*)/)) {
        newKey = decodeURIComponent(matchQuery[2]);
        _apiKey.apiKey.setKey(newKey);
        loadpage();
      }

      $('#api_key #current').keypress(function (e) {
        if (e.keyCode == 13) {
          newKey = $(this).val();
          _apiKey.apiKey.setKey(newKey);
          loadpage();
        }
      });

      $('#api_key #recent').on('click tap', '[data-key]', function (e) {
        newKey = $(this).attr('data-key');
        $('#api_key #current').val(newKey);
        _apiKey.apiKey.setKey(newKey);
        loadpage();
      });

      $('#api_key #recent').on('click tap', '[data-action="clear"]', function (e) {
        $('#api_key #current').val('');
        _apiKey.apiKey.clearHistory();
        $('#api_key #recent').html('<li><a>Hmmm. No history yet.</a></li>');
      });

      _gw2Data.gw2Data.on('loaded:characters', function () {
        $('#characters-status').html('Characters loaded <span class="glyphicon glyphicon-ok text-success"></span>');
      });

      _gw2Data.gw2Data.on('loaded:account', function (account) {
        _apiKey.apiKey.setHistory(newKey, account.name);
        _this.drawHistory();
        $('title').html(account.name + ' | Guild Wars 2 Inventory');
        $('.accountname').text(account.name);
        $('.accountid').text(account.id);
        $('.accountcreated').text(account.created);
        $('.worldname').html(account.world);
        $('.fractal_level').html(account.fractal_level);
        $('.access').html(account.access);

        $('#account-status').html('Account loaded <span class="glyphicon glyphicon-ok text-success"></span>');
      });

      _gw2Data.gw2Data.on('loaded:wallet', function () {
        $('#wallet-status').html('Wallet loaded <span class="glyphicon glyphicon-ok text-success"></span>');
      });

      _gw2Data.gw2Data.on('loaded:inventory', function () {
        $('#inventory-status').html('Inventory loaded <span class="glyphicon glyphicon-ok text-success"></span>');
      });
    },
    showLoading: function showLoading() {
      $('#account-status').parent().empty().html('\n      <p id="account-status" class="status" style="display: block;">\n        Loading account...\n      </p>\n      <p id="characters-status" class="status" style="display: block;">\n        Loading characters...\n      </p>\n      <p id="inventory-status" class="status" style="display: block;">\n        Loading inventory...\n      </p>\n      <p id="wallet-status" class="status" style="display: block;">\n        Loading wallet...\n      </p>\n    ');
    }
  };
  $(function () {
    app.initialize();
  });
});