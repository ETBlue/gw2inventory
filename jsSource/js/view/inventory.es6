import {gw2Data} from 'model/gw2Data/gw2Data';

export const inventory = {
  initialize() {
    $('#inventory [data-click]').button('reset');
    this.bindEvents();
  },
  bindEvents() {
    gw2Data.on('loaded:inventory', (itemList) => {
      const fullList = itemList.filter(function(n){ return n != undefined });
      let idList = {};
      fullList.forEach((item) => {
        if (idList[item.id]) {
          idList[item.id] += 1;
        } else {
          idList[item.id] = 1;
        }
      });
      const dataSet = fullList.map((item) => {
        let duplicated = '';
        if (idList[item.id] > 1) {
          duplicated = 'duplicated';
        }
        return [
          item.icon,
          item.name,
          item.count,
          item.type,
          item.level,
          item.rarity,
          item.position,
          item.binding,
          duplicated,
          item.category
        ];
      });
      var table = $('#inventory-table').DataTable({
        data: dataSet,
        "destroy":true,
        "pageLength": 50,
        "order": [[ 6, 'asc' ]],
        "columnDefs": [
          {
            type: 'natural',
            targets: [2,4,6]
          },{
            visible: false,
            targets: [8,9]
          },{
          }
        ],
        drawCallback: function() {
          var api = this.api();
          $('#inventory .dataTables_length #sum').remove();
          $('#inventory .dataTables_length').append(
            "<span id='sum'>. Current amount: " + api.column(2, {page:'current'}).data().sum() + '</span>'
          );
        },
      });
      $('#inventory .loading').hide();

      var searchValue = "";
      var searchCollection = "";
      let searchDuplicated = false;
      // enable table search by nav bar click
      $('#inventory [data-subset]').on('click tap', function(){
        searchCollection = $(this).attr("data-subset");
        if(searchCollection == "rarity"){
        } else {
          if(searchCollection == "equipment"){
            searchValue = "Armor|Weapon|Trinket|Upgrades|Back";
          }else if(searchCollection == "utilities"){
            searchValue = "Bag|Gathering|Tool";
          }else if(searchCollection == "toys"){
            searchValue = "";
          }else if(searchCollection == "materials"){
            searchValue = "Material";
          }else if(searchCollection == "misc"){
            searchValue = "Container|Trophy|Trait|Consumable|Gizmo|Minipet";
          }else if(searchCollection == "all"){
            searchValue = "";
          }
          table.column([9]).search('').column([3]).search(searchValue, true).draw();
        }
      });
      $('#inventory [data-option]').on('click tap', function(){
        searchValue = $(this).attr("data-option");
        var searchTarget = $(this).attr("data-target");
        if ( searchTarget == 'rarity' ) {
          table.column([5]).search(searchValue).draw();
        } else if ( searchTarget == 'category' ) {
          table.column([3]).search('').column([9]).search(searchValue).draw();
        } else {
          table.column([9]).search('').column([3]).search(searchValue).draw();
        }
      });
      $('#inventory [data-filter="duplicated"]').on('click tap', function(){
        if (searchDuplicated) {
          table.column([8]).search('').draw();
        } else {
          table.column([8]).search('duplicated').draw();
        }
        searchDuplicated = !searchDuplicated;
      });
      // TODO: enable table refresh by navbar click
      $('#inventory [data-click]').on('click tap', function(){
        $(this).button('loading');
        $(this).parents('.tab-pane').children('.subset').removeClass('active');
        $(this).parents('.tab-pane').children('.loading').show();
        var action = $(this).attr('data-click');
        if(action == 'refreshinventory'){
          //get_render_inventory();
        }
      });
    });
  }
};

$(() => {
  inventory.initialize();
});

export default inventory;