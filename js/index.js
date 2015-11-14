$(document).ready(function(){

  // verdors: bootstrap tabs ui

  $('#tabs').tab();

  // secondary navbar

  $('.tab-pane [data-subset]').on('click tap', function(){
    $(this).parents('.tab-pane').children('.subset').removeClass('active').filter('#' + $(this).attr('data-subset')).addClass('active');
  });

  // about section

  $('[data-click="toggleAbout"]').on('click tap', function(){
    $('#about').slideToggle();
  });

  // get account info

  var account_key = '';
  var access_token = '';

  $('#api_key').keypress(function(e){
    if(e.keyCode == 13){
      account_key = $(this).val();
      access_token = '?access_token=' + account_key
      load_page();
    }
  });

  // general funcitons

  var get_data = function(endpoint, key){
    key = key || '';
    return $.get('https://api.guildwars2.com/v2'+endpoint+key);
  }

  // rendering functions

  var render_account = function(accountdata){
    $('.accountname').text(accountdata.name);
    get_data('/worlds?ids='+accountdata.world).done(function(worlddata){
      $('.worldname').text(worlddata[0].name);
    });
    $('.accountid').text(accountdata.id);
    $('.accountcreated').text(accountdata.created);
  }

  var render_bank = function(bankdata){
    var dataSet=[];
    var deferred = $.Deferred();
    var totalCount=equipmentCount=utilityCount=toysCount=miscCount=armorCount=weaponCount=backCount=trinketCount=upgradeCount=bagCount=gatheringCount=toolCount=consumableCount=gizmoCount=minipetCount=containerCount=materialCount=trophyCount=traitCount = 0;
    var count = function(type){
      if(type == "Armor"){
        armorCount+=1;
        equipmentCount+=1;
      }else if(type == "Weapon"){
        weaponCount+=1;
        equipmentCount+=1;
      }else if(type == "Back"){
        backCount+=1;
        equipmentCount+=1;
      }else if(type == "Trinket"){
        trinketCount+=1;
        equipmentCount+=1;
      }else if(type == "UpgradeComponent"){
        upgradeCount+=1;
        equipmentCount+=1;
      }else if(type == "Bag"){
        bagCount+=1;
        utilityCount+=1;
      }else if(type == "Gathering"){
        gatheringCount+=1;
        utilityCount+=1;
      }else if(type == "Tool"){
        toolCount+=1;
        utilityCount+=1;
      }else if(type == "Consumable"){
        consumableCount+=1;
        toysCount+=1;
      }else if(type == "Gizmo"){
        gizmoCount+=1;
        toysCount+=1;
      }else if(type == "Minipet"){
        minipetCount+=1;
        toysCount+=1;
      }else if(type == "Container"){
        containerCount+=1;
        miscCount+=1;
      }else if(type == "CraftingMaterial"){
        materialCount+=1;
        miscCount+=1;
      }else if(type == "Trophy"){
        trophyCount+=1;
        miscCount+=1;
      }else if(type == "Trait"){
        traitCount+=1;
        miscCount+=1;
      }
    };

    //$.each(bankdata.slice(0,50), function(index, value){
    $.each(bankdata, function(index, value){

      if(value){
        totalCount++;
        get_data('/items/' + value.id).done(function(item_data){
          var item_position = index + 1;
          var item_icon = item_data.icon || "";
          var item_name = item_data.name || "";
          var item_count = item_data.count || "";
          var item_type = item_data.type || "";
          var item_level = item_data.level || "";
          var item_rarity = item_data.rarity || "";
          var item_details = "";
          var data_to_text = function(key, value){
            var text = "";
            if(typeof value == "string"){
              text += key + ': ' + value + '. ';
            }else if(typeof value == "number"){
              text += key + ': ' + parseInt(value) + '. ';
            }else if(value.length == 0){
              text += key + ': . ';
            }else{
              text += key + ': ' + JSON.stringify(value) + '. ';
              //$.each(value, function(value_key, value_value){
              //  data_to_text(value_key, value_value);
              //});
            }
            return text;
          };
          if(item_data.details){
            $.each(item_data.details, function(detail_key, detail_value){
              item_details += data_to_text(detail_key, detail_value);
            });
          }
          var item_description = item_data.description + item_details;
          var row = [item_icon, item_name, value.count, item_type, item_level, item_rarity, item_description, item_position];
          dataSet.push(row);

          count(item_type);

          console.log(JSON.stringify(item_data));

          if(totalCount === dataSet.length){
            deferred.resolve();
            $.each({"all":totalCount, "equipment":equipmentCount, "utilities":utilityCount, "misc":miscCount, "toys":toysCount},function(key, value){
              $("[data-subset='"+ key +"'] .badge").text(value);
            });
            $.each({"Armor":armorCount, "Weapon":weaponCount,"Back":backCount, "Trinket":trinketCount, "UpgradeComponent":upgradeCount, "Bag":bagCount, "Gathering":gatheringCount, "Tool":toolCount, "Consumable":consumableCount,"Gizmo":gizmoCount,"Minipet":minipetCount,"Container":containerCount, "CraftingMaterial":materialCount,"Trophy":trophyCount,"Trait":traitCount},function(key, value){
              $("[data-option='"+ key +"'] .badge").text(value);
            });
          }
        });
      }
    });
    deferred.done(function(){
      $('#bank [data-click]').button('reset');

      $('#bank .datatable').DataTable( {
        data: dataSet,
        "destroy":true,
        "pageLength": 50,
        "order": [[ 7, 'asc' ]],
        "columnDefs": [
          {
            "targets": 0,
            "render": function ( data, type, row ) {
              //console.log(row[6]);
              var tooltip = row[6].replace(/"/g, '').replace(/'/g, '');
              return "<img class='icon "+row[5]+"' data-toggle='tooltip' data-placement='right' title='" + tooltip + "' src='" + data + "' />";
            }
          },{
            "targets": [ 6 ],
            "visible": false
          },{
            "targets": [ 1 ],
            "render": function ( data, type, row ) {
              return "<span class='bold "+row[5]+"'>" + data + "</span>";
            }
          }
        ],
        "initComplete": function( settings, json ) {
          $('#bank [data-toggle="tooltip"]').tooltip();
          $('#bank .loading').hide();
          console.log("done");
        }
      });

      // search by nav bar click

      var bankTable = $('#bank .datatable').DataTable();

      $('#bank [data-option]').on('click tap', function(){
        var searchValue = $(this).attr("data-option");
        bankTable.column([3]).search(searchValue).draw();
      });
      $('#bank [data-subset]').on('click tap', function(){
        var searchCollection = $(this).attr("data-subset");
        var searchValue = "";
        if(searchCollection == "equipment"){
          searchValue = "Armor|Weapon|Trinket|UpgradeComponent|Back";
        }else if(searchCollection == "utilities"){
          searchValue = "Bag|Gathering|Tool";
        }else if(searchCollection == "toys"){
          searchValue = "Consumable|Gizmo|Minipet";
        }else if(searchCollection == "misc"){
          searchValue = "Container|CraftingMaterial|Trophy|Trait";
        }
        bankTable.column([3]).search(searchValue, true).draw();
      });

      // refresh by navbar click

      $('#bank [data-click]').on('click tap', function(){
        $(this).button('loading');
        $(this).parents('.tab-pane').children('.subset').removeClass('active');
        $(this).parents('.tab-pane').children('.loading').show();

        var action = $(this).attr('data-click');
        if(action == 'refreshbank'){
          get_bank();
        }
      });


    })
  }

  // custimozed behavior for different data sources

  var get_account = function(){
    get_data('/account', access_token).done(function(accountdata){
      render_account(accountdata);
    });
  }

  var get_bank = function(){
    get_data('/account/bank', access_token).done(function(bankdata){
      render_bank(bankdata);
    });
  }

  // actions on load

  var load_page = function(){
    get_account();
    get_bank();
  }

});
