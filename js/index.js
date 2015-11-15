$(document).ready(function(){

  // enable bootstrap tabs ui

  $('#tabs').tab();

  // toggle level 2 navbar

  $('.tab-pane [data-subset]').on('click tap', function(){
    $(this).parents('.tab-pane').children('.subset').removeClass('active').filter('#' + $(this).attr('data-subset')).addClass('active');
  });

  // toggle about section

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

  // define data fetching funcitons

  var get_data = function(endpoint, key){
    key = key || '';
    return $.get('https://api.guildwars2.com/v2'+endpoint+key);
  }

  var get_guild = function(guild_id){
    return $.get('https://api.guildwars2.com/v1/guild_details.json?guild_id='+guild_id); // guild api is not available in v2 atm
  }

  // define data rendering functions

  var render_account = function(account_data){
    $('.accountname').text(account_data.name);
    // render worlds first, then achievements and bank
    get_data('/worlds?ids='+account_data.world).done(function(world_data){
      $('.worldname').text(world_data[0].name);
      $('#account-status').html('Account loaded <span class="glyphicon glyphicon-ok text-success"></span>')
      $('#account .status').show();
      get_render_achievements();
      get_render_bank();
    });
    $('.accountid').text(account_data.id);
    $('.accountcreated').text(account_data.created);
  }

  var render_achievements = function(achievements_data){
    var idList=[];
    var dataSet=[];
    var deferred = $.Deferred();
    $.each(achievements_data, function(achievement_data_index, achievement_data){
      idList.push(achievement_data.id);
    });
    var batch_count = Math.ceil(idList.length / 200);
    for(var i = 0; i < batch_count; i++){
      var idListString = idList.slice(i*200,(i+1)*200).join(',');
      get_data('/achievements?ids='+idListString).done(function(achievements){
        $.each(achievements, function(achievement_index, achievement){
          var achievement_icon = achievement.icon || '';
          var achievement_name = achievement.name || '';
          var achievement_current = achievements_data[achievement_index].current || '';
          var achievement_max = achievements_data[achievement_index].max || '';
          var achievement_done = achievements_data[achievement_index].done || '';
          var achievement_description = achievement.description || '';
          var achievement_requirement = achievement.requirement || '';
          var achievement_type = achievement.type || '';
          var achievement_flags = achievement.flags || '';
          var row = [achievement_icon,achievement_name,achievement_current,achievement_max,achievement_done,achievement_description,achievement_requirement,achievement_type,achievement_flags];
          //console.log(row);
          dataSet.push(row);
          if(achievements_data.length === dataSet.length){
            deferred.resolve();
          }        
        });
      });
    }
    deferred.done(function(){
      $('#achievements-table').DataTable( {
        data: dataSet,
        //"destroy":true,
        "pageLength": 50,
        //"pageing": false,
        "order": [[ 2, 'dsc' ]],
        //"dom":'',
        "columnDefs": [
          {
            "targets": 0,
            "render": function ( data, type, row ) {
              if(data){
                return "<img class='icon' src='" + data + "' />";
              }else{
                return data;
              }
            }
          },{
            "targets": 2,
            "render": function ( data, type, row ) {
              if(row[3]){
                return data + "/" + row[3];
              }else{
                return data;
              }
            }
          },{
            "targets": 4,
            "render": function ( data, type, row ) {
              if(data){
                return '<span class="glyphicon glyphicon-ok text-success" aria-hidden="true"></span>';
              }else{
                return data;
              }
            }
          },{
            "targets": 8,
            "render": function ( data, type, row ) {
              if(data){
                var str = '';
                $.each(data, function(index, value){
                  str += '<span class="label label-default">' + value + '</span> '
                });
                return str;
              }else{
                return data;
              }
            }
          },{
            "targets": [3],
            "visible": false
          }
        ],
        "initComplete": function( settings, json ) {
          $('#achievements .loading').hide();
          $('#achievements-status').html('Achievements loaded <span class="glyphicon glyphicon-ok text-success"></span>')
          //console.log("achievements done");
        }
      });
    });
  }

  // discard
  var render_guilds = function(guilds_data){
    var idList=[];
    var dataSet=[];
    var deferred = $.Deferred();
    var totalCount=0;
    $.each(guilds_data, function(index, guild_id){
      totalCount++;
      get_guild(guild_id).done(function(guild){
        var guild_emblem = guild.emblem || '';
        var guild_foreground = guild_emblem.foreground_id || '';
        var guild_background = guild_emblem.background_id || '';
        var guild_name = guild.guild_name || '';
        var guild_tag = guild.tag || '';
        var row = [guild_foreground, guild_background, guild_name, guild_tag];
        dataSet.push(row);
        if(totalCount === dataSet.length){
          deferred.resolve();
        }
      });
    });
    deferred.done(function(){
      $('#guilds-table').DataTable( {
        data: dataSet,
        "destroy":true,
        //"pageLength": -1,
        //"pageing": false,
        "orderFixed": [[ 2, 'asc' ]],
        "dom":'',
        "columnDefs": [
          {
            "targets": 0,
            "visible": false
            //"render": function ( data, type, row ) {
            //  return "<img class='icon' src='" + data + "' />";
            //}
          },{
            "targets": [ 1 ],
            "visible": false
          }
        ],
        "initComplete": function( settings, json ) {
          $('#guilds .loading').hide();
          console.log("guilds done");
        }
      });
    });
  }

  var render_bank = function(bank_data){

    // create a local copy from items api
    var idList=[];
    var dataRef={};
    var deferred_pre = $.Deferred();
    $.each(bank_data, function(bank_item_index, bank_item_data){
      if(bank_item_data){
        idList.push(bank_item_data.id);
      }
    });
    var totalCount = idList.length;
    idList = idList.filter( function( item, index, inputArray ) {
      return inputArray.indexOf(item) == index;
    });
    idList.sort(function(a, b) {
      return a - b;
    });
    var batch_count = Math.ceil(idList.length / 200);
    for(var i = 0; i < batch_count; i++){
      var idListString = idList.slice(i*200,(i+1)*200).join(',');
      get_data('/items?ids=' + idListString).done(function(items_data){
        $.each(items_data, function(item_index, item_data){
          dataRef[item_data.id] = item_data;
          if(Object.keys(dataRef).length == idList.length){
            deferred_pre.resolve();
          }
        });
      });
    }

    // render bank data
    var dataSet=[];
    var deferred = $.Deferred();
    var equipmentCount=utilityCount=toysCount=miscCount=armorCount=weaponCount=backCount=trinketCount=upgradeCount=bagCount=gatheringCount=toolCount=consumableCount=gizmoCount=minipetCount=containerCount=materialCount=trophyCount=traitCount = 0;
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
    }
    deferred_pre.done(function(){
      $.each(bank_data, function(item_index, item_data){
        if(item_data){
          var item_position = item_index + 1;
          var item_icon = dataRef[item_data.id].icon || "";
          var item_name = dataRef[item_data.id].name || "";
          var item_count = item_data.count || "";
          var item_type = dataRef[item_data.id].type || "";
          var item_level = dataRef[item_data.id].level || "";
          var item_rarity = dataRef[item_data.id].rarity || "";
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
          if(dataRef[item_data.id].details){
            $.each(dataRef[item_data.id].details, function(detail_key, detail_value){
              item_details += data_to_text(detail_key, detail_value);
            });
          }
          var item_description = dataRef[item_data.id].description + item_details;
          var row = [item_icon, item_name, item_count, item_type, item_level, item_rarity, item_description, item_position];
          dataSet.push(row);

          count(item_type);

          if(totalCount === dataSet.length){
            deferred.resolve();
            $.each({"all":totalCount, "equipment":equipmentCount, "utilities":utilityCount, "misc":miscCount, "toys":toysCount},function(key, value){
              $("[data-subset='"+ key +"'] .badge").text(value);
            });
            $.each({"Armor":armorCount, "Weapon":weaponCount,"Back":backCount, "Trinket":trinketCount, "UpgradeComponent":upgradeCount, "Bag":bagCount, "Gathering":gatheringCount, "Tool":toolCount, "Consumable":consumableCount,"Gizmo":gizmoCount,"Minipet":minipetCount,"Container":containerCount, "CraftingMaterial":materialCount,"Trophy":trophyCount,"Trait":traitCount},function(key, value){
              $("[data-option='"+ key +"'] .badge").text(value);
            });
          }
        }
      });
    });
    deferred.done(function(){
      $('#bank [data-click]').button('reset');

      $('#bank-table').DataTable( {
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
              return "<img class='item icon "+row[5]+"' data-toggle='tooltip' data-placement='right' title='" + tooltip + "' src='" + data + "' />";
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
          $('#bank-status').html('Bank loaded <span class="glyphicon glyphicon-ok text-success"></span>')
          //console.log("bank done");
        }
      });

      // search by nav bar click

      var bankTable = $('#bank-table').DataTable();

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
          get_render_bank();
        }
      });
    })
  }

  // custimozed behavior for different data sources

  var get_render_account = function(){
    $('#account-status').show();
    get_data('/account', access_token).done(function(account_data){
      render_account(account_data);
    });
  }

  var get_render_achievements = function(){
    get_data('/account/achievements', access_token).done(function(achievements_data){
      render_achievements(achievements_data);
    });
  }

  var get_render_bank = function(){
    get_data('/account/bank', access_token).done(function(bank_data){
      render_bank(bank_data);
    });
  }

  // actions on load

  var load_page = function(){
    get_render_account();
  }

});
