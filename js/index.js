$(document).ready(function(){

  // verdors

  $('#tabs').tab();

  // custom ui
  $('.tab-pane [data-subset]').on('click tap', function(){
    $(this).parents('.tab-pane').children('.subset').removeClass('active').filter('#' + $(this).attr('data-subset')).addClass('active');
  });

  // get data

  var account_key = '';

  var get_data = function(endpoint){
    return $.get('https://api.guildwars2.com/v2'+endpoint+'?access_token='+account_key);
  }

  var compile_data = function(data){
    $.each(data, function(index, value){
      if(value){
        get_data('/items/' + value.id).done(function(item_data){
          console.log('index: ' + index);
          console.log('value: ' + value.id);
          console.log('content: ' + JSON.stringify(item_data));
        });
      }
    });
    return JSON.stringify(data);
  }

  var render_data = function(data){
    var dataSet=[];
    var deferred = $.Deferred();

    var totalCount=0;
    var equipmentCount=0;
    var utilityCount=0;
    var toysCount=0;
    var miscCount=0;

    var armorCount=0;
    var weaponCount=0;
    var backCount=0;
    var trinketCount=0;
    var upgradeCount=0;
    var bagCount=0;
    var gatheringCount=0;
    var toolCount=0;
    var consumableCount=0;
    var gizmoCount=0;
    var minipetCount=0;
    var containerCount=0;
    var materialCount=0;
    var trophyCount=0;
    var traitCount=0;

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

     //var item_template_source ='<tr><td><img class="icon" src="{{icon}}"/></td><td>{{name}}</td><td>{{count}}</td><td>{{type}}</td><td>{{description}}</td></tr>';
    //var item_template = Handlebars.compile(item_template_source);
    //$.each(data.slice(200,250), function(index, value){
    $.each(data, function(index, value){
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
          var item_description = item_data.description || item_details;
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
          //var context = {id: item_data.id, count: value.count, type:item_data.type, name: item_data.name, description: item_data.description, icon: item_data.icon};
          //var $item_element = $(item_template(context));
          //$('tbody').append($item_element);

          //console.log('index: ' + index);
          //console.log('value: ' + value.id);
          //console.log('content: ' + JSON.stringify(item_data));
        });
      }
    });
    deferred.done(function(){
      $('#datatable').DataTable( {
        data: dataSet,
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
          }
        ],
        "initComplete": function( settings, json ) {
          $('[data-toggle="tooltip"]').tooltip();

          //$('#datatable').columns().every(function(){
          //  $('[data-option]').on('click tap', function(){
          //    var searchValue = $(this).attr("[data-option]");
          //    this.search(searchValue).draw();
          //  });
          //});
          $('.loading').remove();
        }
      });
    })
  }

  get_data('/account/bank').done(function(data){
    render_data(data);
  });

});
