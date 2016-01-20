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
          return [item.icon, item.name, item.count, item.type, item.level, item.rarity, item.position, item.binding, item.description, item.category];
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
            targets: [8, 9]
          }]
        });
        $('#bank .loading').hide();

        var searchValue = "";
        var searchCollection = "";
        // enable table search by nav bar click
        $('#bank [data-subset]').on('click tap', function () {
          searchCollection = $(this).attr("data-subset");
          if (searchCollection == "rarity") {} else {
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
            } else if (searchCollection == "all") {
              searchValue = "";
            }
            table.column([9]).search('').column([3]).search(searchValue, true).draw();
          }
        });
        $('#bank [data-option]').on('click tap', function () {
          searchValue = $(this).attr("data-option");
          var searchTarget = $(this).attr("data-target");
          if (searchTarget == 'rarity') {
            table.column([5]).search(searchValue).draw();
          } else if (searchTarget == 'category') {
            table.column([3]).search('').column([9]).search(searchValue).draw();
          } else {
            table.column([9]).search('').column([3]).search(searchValue).draw();
          }
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