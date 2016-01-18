import {gw2Data} from 'model/gw2Data/gw2Data';

export const bank = {
  initialize() {
    $('#bank [data-click]').button('reset');
    this.bindEvents();
  },
  bindEvents() {
    gw2Data.on('loaded:bank', (characterList) => {
      const dataSet = characterList.map((character) => {
        return [
          character.name,
          character.level,
          character.profession,
          character.race,
          character.gender,
          character.age,
          character.deaths,
          character.created,
          character.guild,
          character.crafting,
          character.specializations.pve,
          character.specializations.pvp,
          character.specializations.wvw,
          character.equipment.Helm,
          character.equipment.Shoulders,
          character.equipment.Gloves,
          character.equipment.Coat,
          character.equipment.Leggings,
          character.equipment.Boots,
          character.equipment.Backpack,
          character.equipment.HelmAquatic,
          character.equipment.Amulet,
          character.equipment.Accessory1,
          character.equipment.Accessory2,
          character.equipment.Ring1,
          character.equipment.Ring2,
          character.equipment.WeaponA1,
          character.equipment.WeaponA2,
          character.equipment.WeaponB1,
          character.equipment.WeaponB2,
          character.equipment.WeaponAquaticA,
          character.equipment.WeaponAquaticB,
          character.bags,
          "character. inventory. services",
          "character. inventory. special",
          "character. inventory. boosts",
          "character. inventory. style",
          "character. inventory. misc",
          character.equipment.Sickle,
          character.equipment.Axe,
          character.equipment.Pick
        ];
      });
      $('#bank-table').DataTable({
        data: dataSet,
        destroy: true,
        pageLength: 50,
        columnDefs: [
          {
            targets: 0,
            render: function ( data, type, row ) {
              if (data) {
                return `<span class="bold">${data}</span>`;
              }
              else {
                return data;
              }
            }
          },
          {
            targets: 3,
            render: function ( data, type, row ) {
              return data + '<br />' + row[4];
            }
          },
          {
            targets: [4,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40],
            visible: false
          }
        ]
      });
      $('#bank .loading').hide();
      var table = $('#bank-table').DataTable();
      $('#bank [data-subset]').on('click tap', function(){
        table.columns('[data-toggle]').visible(false);
        table.columns('[data-toggle="' + $(this).attr('data-subset') + '"]').visible(true);
      });
      $('#bank [data-click]').on('click tap', function(){
        $(this).button('loading');
        $(this).parents('.tab-pane').children('.loading').show();
        var action = $(this).attr('data-click');
        if(action == 'refreshbank'){
          get_render_bank();
        }
      });
      $('#bank [data-option]').on('click tap', function(){
        var searchValue = $(this).attr("data-option");
        table.column([2]).search(searchValue).draw();
      });

    });
  }
};


$(() => {
  bank.initialize();
});

export default bank;