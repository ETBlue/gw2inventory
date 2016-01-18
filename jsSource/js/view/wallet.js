'use strict';

define(['exports', 'model/gw2Data/gw2Data'], function (exports, _gw2Data) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.wallet = undefined;
  var wallet = exports.wallet = {
    initialize: function initialize() {
      $('#wallet [data-click]').button('reset');
      this.bindEvents();
    },
    bindEvents: function bindEvents() {
      _gw2Data.gw2Data.on('loaded:wallet', function (walletData) {
        var dataSet = walletData.map(function (walletItem) {
          return [walletItem.icon, walletItem.name, walletItem.value, walletItem.description, walletItem.order];
        });
        $('#wallet-table').DataTable({
          data: dataSet,
          destroy: true,
          pageLength: 50,
          "order": [[4, 'asc']],
          "dom": '',
          "columnDefs": [{ type: 'natural', targets: 2 }]
        });
        $('#wallet .loading').hide();
        var table = $('#wallet-table').DataTable();
        $('#wallet [data-click]').on('click tap', function () {
          $(this).button('loading');
          $(this).parents('.tab-pane').children('.loading').show();
          var action = $(this).attr('data-click');
          if (action == 'refreshwallet') {
            get_render_wallet();
          }
        });
      });
    }
  };
  $(function () {
    wallet.initialize();
  });
  exports.default = wallet;
});