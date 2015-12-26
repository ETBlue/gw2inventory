'use strict';

define(['exports', 'model/gw2Data/gw2Data'], function (exports, _gw2Data) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.characters = undefined;
  var characters = exports.characters = {
    initialize: function initialize() {
      $('#characters [data-click]').button('reset');
      this.bindEvents();
    },
    bindEvents: function bindEvents() {
      _gw2Data.gw2Data.on('loaded:characters', function (characterList) {
        var dataSet = characterList.map(function (character) {
          return [character.name, character.level, character.profession, character.race, character.gender, character.age, character.deaths, character.created, character.guild, character.crafting, character.specializations_pve, character.specializations_pvp, character.specializations_wvw, character.helm, character.shoulders, character.gloves, character.coat, character.leggings, character.boots, character.back, character.aquahelm, character.amulet, character.accessory1, character.accessory2, character.ring1, character.ring2, character.weaponsA1, character.weaponsA2, character.weaponsB1, character.weaponsB2, character.weapons_aquaA, character.weapons_aquaB, character.bags, character.sickle, character.axe, character.pick];
        });
        $('#characters-table').DataTable({
          data: dataSet,
          destroy: true,
          pageLength: 50,
          columnDefs: [{
            targets: 0,
            render: function render(data, type, row) {
              if (data) {
                return '<span class="bold">' + data + '</span>';
              } else {
                return data;
              }
            }
          }, {
            targets: 3,
            render: function render(data, type, row) {
              return data + '<br />' + row[4];
            }
          }, {
            targets: [4, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35],
            visible: false
          }]
        });
        $('#characters .loading').hide();
        var table = $('#characters-table').DataTable();
        $('#characters [data-subset]').on('click tap', function () {
          table.columns('[data-toggle]').visible(false);
          table.columns('[data-toggle="' + $(this).attr('data-subset') + '"]').visible(true);
        });
        $('#characters [data-click]').on('click tap', function () {
          $(this).button('loading');
          $(this).parents('.tab-pane').children('.loading').show();
          var action = $(this).attr('data-click');
          if (action == 'refreshcharacters') {
            get_render_characters();
          }
        });
        $('#characters [data-option]').on('click tap', function () {
          var searchValue = $(this).attr("data-option");
          table.column([2]).search(searchValue).draw();
        });
      });
    }
  };
  $(function () {
    characters.initialize();
  });
  exports.default = characters;
});