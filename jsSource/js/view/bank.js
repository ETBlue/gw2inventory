'use strict';

define(['exports', 'model/gw2Data/gw2Data'], function (exports, _gw2Data) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.bank = undefined;
  var bank = exports.bank = {
    initialize: function initialize() {
      $('#bank [data-click]').button('reset');
      this.bindEvents();
    },
    bindEvents: function bindEvents() {
      _gw2Data.gw2Data.on('loaded:bank', function (itemList) {
        var fullList = itemList.filter(function (n) {
          return n != undefined;
        });
        var dataSet = fullList.map(function (item) {
          return [item.icon, item.name, item.count, item.type, item.level, item.rarity, item.position, item.binding, item.description];
        });
        var table = $('#bank-table').DataTable({
          data: dataSet,
          "destroy": true,
          "pageLength": 50,
          "order": [[6, 'asc']],
          "columnDefs": [{
            type: 'natural',
            targets: [2, 4, 6]
          }, {
            visible: false,
            targets: 8
          }]
        });
        $('#bank .loading').hide();

        $('#bank [data-option]').on('click tap', function () {
          var searchValue = $(this).attr("data-option");
          table.search(searchValue).draw();
        });
        // enable table search by nav bar click
        $('#bank [data-subset]').on('click tap', function () {
          var searchCollection = $(this).attr("data-subset");
          var searchValue = "";
          if (searchCollection == "equipment") {
            searchValue = "Armor|Weapon|Trinket|UpgradeComponent|Back";
          } else if (searchCollection == "utilities") {
            searchValue = "Bag|Gathering|Tool";
          } else if (searchCollection == "toys") {
            searchValue = "";
          } else if (searchCollection == "materials") {
            searchValue = "CraftingMaterial";
          } else if (searchCollection == "misc") {
            searchValue = "Container|Trophy|Trait|Consumable|Gizmo|Minipet";
          } else if (searchCollection == "rarity") {
            searchValue = "";
          }
          table.search(searchValue, true).draw();
        });
        // TODO: enable table refresh by navbar click
        $('#bank [data-click]').on('click tap', function () {
          $(this).button('loading');
          $(this).parents('.tab-pane').children('.subset').removeClass('active');
          $(this).parents('.tab-pane').children('.loading').show();
          var action = $(this).attr('data-click');
          if (action == 'refreshbank') {
            //get_render_bank();
          }
        });
      });
    }
  };
  $(function () {
    bank.initialize();
  });
  exports.default = bank;
});