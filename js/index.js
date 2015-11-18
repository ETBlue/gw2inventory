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
      $('#account-status').show();
      load_page();
    }
  });

  // define data fetching funcitons

  var get_data = function(endpoint, key){
    key = key || '';
    return $.get('https://api.guildwars2.com/v2'+endpoint+key);
  }

  var get_id_list = function(data){
    var id_list = [];
    $.each(data, function(index, value){
      if(value){
        id_list.push(value.id);
      }
    });
    id_list.sort(function(a, b) {
      return a - b;
    });
    return id_list;
  }

  var create_data_ref = function(id_list, endpoint, defer){
    var data_ref={};
    var batch_count = Math.ceil(id_list.length / 200);
    for(var i = 0; i < batch_count; i++){
      var id_list_string = id_list.slice(i*200,(i+1)*200).join(',');
      get_data(endpoint + id_list_string).done(function(items_data){
        $.each(items_data, function(item_index, item_data){
          data_ref[item_data.id] = item_data;
          if(Object.keys(data_ref).length == id_list.length){
            defer.resolve(data_ref);
          }
        });
      });
    }
  }

  var get_guild = function(guild_id){
    return $.get('https://api.guildwars2.com/v1/guild_details.json?guild_id='+guild_id); // guild api is not available in v2 atm
  }

  var create_guild_ref = function(guild_id_list, defer){
    var data_ref={};
    $.each(guild_id_list, function(index, guild){
      get_guild(guild).done(function(guild_data){
        data_ref[guild_data.guild_id] = guild_data;
        if(Object.keys(data_ref).length == guild_id_list.length){
          defer.resolve(data_ref);
        }
      });
    });
  }

  // need to update manually if the specializations system is changed
  var specializations_id_list = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54];
  var deferred_specializations = $.Deferred();
  create_data_ref(specializations_id_list, '/specializations?ids=', deferred_specializations);

  // need to update manually if the traits system is changed
  var traits_id_list = [214,221,222,223,224,226,227,229,232,238,253,257,263,264,265,266,268,275,277,278,279,280,281,282,287,289,294,296,318,319,320,325,328,334,335,340,348,349,350,351,358,360,361,362,363,364,394,396,413,429,432,433,445,468,469,470,472,473,482,487,505,507,508,509,510,512,514,515,516,517,518,519,520,521,523,525,526,531,532,536,549,551,553,554,557,558,559,562,563,564,565,566,567,568,571,572,574,577,578,579,580,581,582,583,584,585,586,587,588,589,594,603,604,610,612,617,620,621,622,624,625,628,633,634,635,637,646,648,649,653,654,666,667,668,669,670,671,673,674,675,677,680,681,682,685,686,687,691,692,693,694,700,701,704,705,706,707,708,710,712,713,721,722,723,729,731,733,734,738,740,744,751,752,753,756,757,778,780,782,783,788,789,792,799,801,802,803,810,812,813,815,816,820,829,839,842,853,855,856,857,858,860,861,874,875,887,888,889,891,892,893,894,898,899,903,905,909,913,914,915,916,917,919,964,965,968,970,974,975,978,986,996,1000,1001,1009,1010,1011,1014,1015,1016,1021,1038,1047,1054,1055,1056,1059,1060,1062,1064,1065,1066,1067,1068,1069,1070,1072,1075,1080,1083,1086,1089,1090,1094,1096,1098,1099,1100,1101,1112,1130,1134,1135,1136,1137,1157,1158,1159,1160,1162,1163,1164,1167,1169,1170,1187,1190,1192,1209,1210,1215,1232,1234,1237,1238,1240,1241,1242,1245,1252,1257,1267,1268,1269,1272,1276,1277,1279,1280,1281,1282,1284,1286,1289,1290,1291,1292,1293,1294,1295,1297,1299,1300,1315,1316,1317,1329,1333,1334,1336,1337,1338,1342,1343,1344,1346,1348,1350,1367,1368,1369,1372,1375,1376,1379,1380,1381,1413,1415,1416,1417,1437,1440,1444,1446,1447,1448,1449,1451,1453,1454,1455,1469,1470,1471,1474,1479,1480,1481,1482,1484,1485,1486,1487,1488,1489,1502,1503,1507,1508,1510,1511,1541,1556,1606,1649,1657,1667,1672,1673,1674,1675,1676,1678,1679,1680,1682,1683,1684,1685,1686,1687,1688,1690,1692,1693,1694,1696,1697,1698,1699,1700,1701,1702,1703,1704,1705,1706,1707,1708,1709,1711,1713,1714,1715,1716,1719,1720,1721,1724,1726,1727,1728,1730,1732,1737,1738,1740,1741,1743,1744,1746,1749,1754,1755,1757,1758,1760,1761,1765,1766,1767,1769,1770,1772,1774,1776,1777,1778,1779,1781,1782,1783,1784,1786,1788,1789,1790,1791,1792,1793,1795,1799,1800,1801,1802,1803,1806,1808,1810,1811,1813,1814,1815,1816,1817,1818,1819,1820,1821,1822,1823,1824,1825,1826,1829,1831,1832,1833,1834,1835,1837,1838,1839,1844,1846,1848,1849,1852,1854,1856,1859,1860,1861,1862,1863,1865,1866,1867,1868,1869,1871,1872,1874,1876,1877,1878,1879,1882,1883,1884,1886,1887,1888,1889,1890,1891,1892,1893,1896,1898,1899,1900,1901,1902,1904,1905,1908,1910,1911,1912,1913,1914,1915,1916,1917,1919,1922,1923,1925,1926,1927,1928,1929,1930,1931,1932,1933,1935,1936,1938,1940,1941,1942,1943,1944,1945,1946,1947,1948,1949,1950,1951,1952,1954,1955,1957,1959,1960,1962,1963,1964,1965,1969,1971,1974,1975,1977,1978,1979,1980,1981,1983,1984,1985,1986,1987,1988,1992,1993,1994,1995,1997,1999,2000,2001,2002,2004,2005,2006,2008,2009,2011,2013,2014,2015,2016,2017,2018,2020,2021,2022,2023,2025,2026,2028,2030,2031,2032,2033,2035,2036,2037,2038,2039,2042,2043,2046,2047,2049,2050,2052,2053,2055,2056,2057,2058];
  var deferred_traits = $.Deferred();
  create_data_ref(traits_id_list, '/traits?ids=', deferred_traits);


  // define data rendering functions

  var render_account = function(account_data){
    $('.accountname').text(account_data.name);
    $('.accountid').text(account_data.id);
    $('.accountcreated').text(account_data.created);

    // render world in advance
    get_data('/worlds?ids='+account_data.world).done(function(world_data){
      $('.worldname').text(world_data[0].name);
      $('#account-status').html('Account loaded <span class="glyphicon glyphicon-ok text-success"></span>')
      //get_render_achievements();
    });

    var deferred_guild = $.Deferred();
    create_guild_ref(account_data.guilds, deferred_guild);
    deferred_guild.done(function(dataRef_guild){
      get_render_characters(dataRef_guild);
    });

    get_render_wallet();
    get_render_bank();
  }

  var render_characters = function(characters_data, dataRef_guild){

    var dataSet=[];
    var deferred = $.Deferred();

      $.each(characters_data, function(character_index, character){
        var character_name = character.name || '';
        var character_race = character.race || '';
        var character_gender = character.gender || '';
        var character_profession = character.profession || '';
        var character_level = character.level || '';
        var character_created = character.created.replace(/[T]/, '<br />').replace(/Z/,'') || '';
        var character_age = character.age || '';
        var character_deaths = character.deaths || '';
        var character_crafting_list = [];
        $.each(character.crafting, function(index, value){
          character_crafting_list.push(value.rating +'|'+ value.discipline);
        });
        var character_crafting = character_crafting_list.join(' <br/>') || '';

        var character_guild = '';
        if(character.guild){
          var guild_data = dataRef_guild[character.guild];
          character_guild += guild_data.guild_name + ' [' + guild_data.tag + ']';
        }
        //var character_guild = dataRef_guild[character.id].guild || '';
        var character_specializations = character.specializations || '';
        var character_specializations_pve = '';
        if(character_specializations.pve){
          $.each(character_specializations.pve, function(pve_index, pve_data){
            character_specializations_pve += JSON.stringify(pve_data);
          });
        }
        var character_specializations_pvp = '';
        if(character_specializations.pvp){
          $.each(character_specializations.pvp, function(pvp_index, pvp_data){
            character_specializations_pvp += JSON.stringify(pvp_data);
          });
        }
        var character_specializations_wvw = '';
        if(character_specializations.wvw){
          $.each(character_specializations.wvw, function(wvw_index, wvw_data){
            character_specializations_wvw += JSON.stringify(wvw_data);
          });
        }
        var character_equipment = character.equipment || '';
        var character_helm = '';
        var character_shoulders = '';
        var character_gloves = '';
        var character_coat = '';
        var character_leggings = '';
        var character_boots = '';
        var character_back = '';
        var character_aquahelm = '';
        var character_amulet = '';
        var character_accessory1 = '';
        var character_accessory2 = '';
        var character_ring1 = '';
        var character_ring2 = '';
        var character_weaponsA1 = '';
        var character_weaponsA2 = '';
        var character_weaponsB1 = '';
        var character_weaponsB2 = '';
        var character_weapons_aquaA = '';
        var character_weapons_aquaB = '';
        var character_sickle = '';
        var character_axe = '';
        var character_pick = '';
        $.each(character_equipment, function(index, equipment_data){
          switch(equipment_data.slot){
            case "Helm":
              character_helm = JSON.stringify(equipment_data);
              break;
            case "Shoulders":
              character_shoulders = JSON.stringify(equipment_data);
              break;
            case "Gloves":
              character_gloves = JSON.stringify(equipment_data);
              break;
            case "Coat":
              character_coat = JSON.stringify(equipment_data);
              break;
            case "Leggings":
              character_leggings = JSON.stringify(equipment_data);
              break;
            case "Boots":
              character_boots = JSON.stringify(equipment_data);
              break;
            case "Backpack":
              character_back = JSON.stringify(equipment_data);
              break;
            case "HelmAquatic":
              character_aquahelm = JSON.stringify(equipment_data);
              break;
            case "Amulet":
              character_amulet = JSON.stringify(equipment_data);
              break;
            case "Accessory1":
              character_accessory1 = JSON.stringify(equipment_data);
              break;
            case "Accessory2":
              character_accessory2 = JSON.stringify(equipment_data);
              break;
            case "Ring1":
              character_ring1 = JSON.stringify(equipment_data);
              break;
            case "Ring2":
              character_ring2 = JSON.stringify(equipment_data);
              break;
            case "WeaponA1":
              character_weaponsA1 = JSON.stringify(equipment_data);
              break;
            case "WeaponA2":
              character_weaponsA2 = JSON.stringify(equipment_data);
              break;
            case "WeaponB1":
              character_weaponsB1 = JSON.stringify(equipment_data);
              break;
            case "WeaponB2":
              character_weaponsB2 = JSON.stringify(equipment_data);
              break;
            case "WeaponAquaticA":
              character_weapons_aquaA = JSON.stringify(equipment_data);
              break;
            case "WeaponAquaticB":
              character_weapons_aquaB = JSON.stringify(equipment_data);
              break;
            case "Sickle":
              character_sickle = JSON.stringify(equipment_data);
              break;
            case "Axe":
              character_axe = JSON.stringify(equipment_data);
              break;
            case "Pick":
              character_pick = JSON.stringify(equipment_data);
              break;
            default:
              // ...
              break;
          }
        });
        var character_bags = '';
        var character_bags_list = character.bags || [];
        $.each(character_bags_list, function(index, bag_data){
          if(bag_data){
            character_bags += bag_data.id + ':' + bag_data.size + ', ';
          }
        });

        //var character_specializations = dataRef_specializations[character.id].specializations || '';
        //var character_equipment = dataRef_equipment[character.id].equipment || '';
        //var character_bags = dataRef_bags[character.id].bags || '';

        var row = [character_name, character_level, character_profession, character_race, character_gender, character_age, character_deaths, character_created, character_guild, character_crafting, character_specializations_pve, character_specializations_pvp, character_specializations_wvw, character_helm, character_shoulders, character_gloves, character_coat, character_leggings, character_boots, character_back, character_aquahelm, character_amulet, character_accessory1, character_accessory2, character_ring1, character_ring2, character_weaponsA1, character_weaponsA2, character_weaponsB1, character_weaponsB2, character_weapons_aquaA, character_weapons_aquaB, character_bags, character_sickle, character_axe, character_pick];
        dataSet.push(row);
        if(characters_data.length === dataSet.length){
          deferred.resolve();
        }        
      });
    deferred.done(function(){
      $('#characters [data-click]').button('reset');
      $('#characters-table').DataTable( {
        data: dataSet,
        "destroy":true,
        "pageLength": 50,
        //"pageing": false,
        "order": [[ 1, 'dsc' ]],
        "dom":'',
        "columnDefs": [
          {
            "targets": 0,
            "render": function ( data, type, row ) {
              if(data){
                return '<span class="bold">'+ data + '</span>';
              }else{
                return data;
              }
            }
          },{
            "targets": [9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35],
            "visible": false
          }
        ],
        "initComplete": function( settings, json ) {
          $('#characters .loading').hide();
          $('#characters-status').html('Characters loaded <span class="glyphicon glyphicon-ok text-success"></span>')
          var table = $('#characters-table').DataTable();
          $('#characters [data-subset]').on('click tap', function(){
            table.columns('[data-toggle]').visible(false);
            table.columns('[data-toggle="' + $(this).attr('data-subset') + '"]').visible(true);
            //console.log($(this).attr('data-subset'));
          });
          $('#characters [data-click]').on('click tap', function(){
            $(this).button('loading');
            $(this).parents('.tab-pane').children('.loading').show();
            var action = $(this).attr('data-click');
            if(action == 'refreshcharacters'){
              get_render_characters(dataRef_guild);
            }
          });
        }
      });
    });
  }

  var render_achievements = function(achievements_data){
    // create a local copy from achievements api
    var idList = get_id_list(achievements_data);
    var deferred_pre = $.Deferred();
    create_data_ref(idList, '/achievements?ids=', deferred_pre);

    // render achievements data
    var dataSet=[];
    var deferred = $.Deferred();
    deferred_pre.done(function(dataRef){
      $.each(achievements_data, function(achievement_index, achievement){
        var achievement_icon = dataRef[achievement.id].icon || '';
        var achievement_name = dataRef[achievement.id].name || '';
        var achievement_current = achievement.current || '';
        var achievement_max = achievement.max || '';
        var achievement_done = achievement.done || '';
        var achievement_description = dataRef[achievement.id].description || '';
        var achievement_requirement = dataRef[achievement.id].requirement || '';
        var achievement_type = dataRef[achievement.id].type || '';
        var achievement_flags = dataRef[achievement.id].flags || '';
        var row = [achievement_icon,achievement_name,achievement_current,achievement_max,achievement_done,achievement_description,achievement_requirement,achievement_type,achievement_flags];
        dataSet.push(row);
        if(achievements_data.length === dataSet.length){
          deferred.resolve();
        }        
      });
    });
    deferred.done(function(){
      $('#achievements-table').DataTable( {
        data: dataSet,
        //"destroy":true,
        "pageLength": 50,
        //"pageing": false,
        "order": [[ 4, 'dsc' ]],
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
            "targets": 1,
            "render": function ( data, type, row ) {
              if(data){
                return '<span class="bold">'+ data + '</span>';
              }else{
                return data;
              }
            }
          },{
            "targets": 2,
            "render": function ( data, type, row ) {
              if(row[3]){
                var max;
                if(row[3] == -1){
                  max = '∞';
                }else{
                  max = row[3];
                }
                return data + "/" + max;
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
            "targets": [3,7,8],
            "visible": false
          }
        ],
        "initComplete": function( settings, json ) {
          $('#achievements .loading').hide();
          $('#achievements-status').html('Achievements loaded <span class="glyphicon glyphicon-ok text-success"></span>')
        }
      });
    });
  }

  var render_wallet = function(wallet_data){
    // create a local copy from currencies api
    var idList = get_id_list(wallet_data);
    var deferred_pre = $.Deferred();
    create_data_ref(idList, '/currencies?ids=', deferred_pre);

    // render wallet data
    var dataSet=[];
    var deferred = $.Deferred();
    deferred_pre.done(function(dataRef){
      $.each(wallet_data, function(wallet_item_index, concurrency){
        var concurrency_icon = dataRef[concurrency.id].icon || '';
        var concurrency_value = concurrency.value || '';
        var concurrency_name = dataRef[concurrency.id].name || '';
        var concurrency_description = dataRef[concurrency.id].description || '';
        var concurrency_order = dataRef[concurrency.id].order || '';
        var row = [concurrency_icon,concurrency_name,concurrency_value,concurrency_description,concurrency_order];
        dataSet.push(row);
        if(wallet_data.length === dataSet.length){
          deferred.resolve();
        }        
      });
    });
    deferred.done(function(){
      $('#wallet-table').DataTable( {
        data: dataSet,
        //"destroy":true,
        "pageLength": 25,
        //"pageing": false,
        "order": [[ 2, 'dsc' ]],
        "dom":'',
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
            "targets": 1,
            "render": function ( data, type, row ) {
              if(data){
                return '<span class="bold">'+ data + '</span>';
              }else{
                return data;
              }
            }
          }
        ],
        "initComplete": function( settings, json ) {
          $('#wallet .loading').hide();
          $('#wallet-status').html('Wallet loaded <span class="glyphicon glyphicon-ok text-success"></span>')
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
    // step 1: create a local copy from items api
    var idList = get_id_list(bank_data);
    var deferred_pre = $.Deferred();

    var totalCount = idList.length;
    idList = idList.filter( function( item, index, inputArray ) {
      return inputArray.indexOf(item) == index;
    });

    create_data_ref(idList, '/items?ids=', deferred_pre);

    // step 2: create bank data
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
        miscCount+=1;
      }else if(type == "Gizmo"){
        gizmoCount+=1;
        miscCount+=1;
      }else if(type == "Minipet"){
        minipetCount+=1;
        miscCount+=1;
      }else if(type == "Container"){
        containerCount+=1;
        miscCount+=1;
      }else if(type == "CraftingMaterial"){
        materialCount+=1;
      }else if(type == "Trophy"){
        trophyCount+=1;
        miscCount+=1;
      }else if(type == "Trait"){
        traitCount+=1;
        miscCount+=1;
      }
    }
    deferred_pre.done(function(dataRef){
      $.each(bank_data, function(item_index, item_data){
        if(item_data){
          var item_position;
          if(item_index + 1 < 10){
            item_position = 'bank|00'+(item_index + 1);
          }else if(item_index + 1 < 100){
            item_position = 'bank|0'+(item_index + 1);
          }else{
            item_position = 'bank|'+(item_index + 1);
          }
          var item_icon = dataRef[item_data.id].icon || "";
          var item_name = dataRef[item_data.id].name || "";
          var item_count = item_data.count || "";
          var item_type = dataRef[item_data.id].type || "";
          var item_level = dataRef[item_data.id].level || "";
          var item_rarity = dataRef[item_data.id].rarity || "";
          var item_binding = '';
          if(item_data.binding){
            if(item_data.binding == 'Character'){
              item_binding = item_data.bound_to;
            }else{
              item_binding = item_data.binding;
            }
          }
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
          var row = [item_icon, item_name, item_count, item_type, item_level, item_rarity, item_description, item_position, item_binding];
          dataSet.push(row);

          count(item_type);

          if(totalCount === dataSet.length){
            deferred.resolve();
            $.each({"all":totalCount, "equipment":equipmentCount, "utilities":utilityCount, "materials":materialCount, "misc":miscCount, "toys":toysCount},function(key, value){
              $("[data-subset='"+ key +"'] .badge").text(value);
            });
            $.each({"Armor":armorCount, "Weapon":weaponCount,"Back":backCount, "Trinket":trinketCount, "UpgradeComponent":upgradeCount, "Bag":bagCount, "Gathering":gatheringCount, "Tool":toolCount, "Consumable":consumableCount,"Gizmo":gizmoCount,"Minipet":minipetCount,"Container":containerCount, "CraftingMaterial":materialCount,"Trophy":trophyCount,"Trait":traitCount},function(key, value){
              $("[data-option='"+ key +"'] .badge").text(value);
            });
          }
        }
      });
    });
    // step 3: datatable
    deferred.done(function(){
      // step 3-1: reset refresh button
      $('#bank [data-click]').button('reset');
      // step 3-2: initialize datatable
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
          $('#bank-status').html('Assets loaded <span class="glyphicon glyphicon-ok text-success"></span>')
          // step 3-3: enable table search by nav bar click
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
              searchValue = "";
            }else if(searchCollection == "materials"){
              searchValue = "CraftingMaterial";
            }else if(searchCollection == "misc"){
              searchValue = "Container|Trophy|Trait|Consumable|Gizmo|Minipet";
            }
            bankTable.column([3]).search(searchValue, true).draw();
          });
          // step 3-4: enable table refresh by navbar click
          $('#bank [data-click]').on('click tap', function(){
            $(this).button('loading');
            $(this).parents('.tab-pane').children('.subset').removeClass('active');
            $(this).parents('.tab-pane').children('.loading').show();
            var action = $(this).attr('data-click');
            if(action == 'refreshbank'){
              get_render_bank();
            }
          });
        }
      });
    })
  }

  // custimozed behavior for different data sources

  var get_render_account = function(){
    get_data('/account', access_token).done(function(account_data){
      $('#account .status').show();
      render_account(account_data);
    });
  }

  var get_render_achievements = function(){
    get_data('/account/achievements', access_token).done(function(achievements_data){
      render_achievements(achievements_data);
    });
  }

  var get_render_characters = function(dataRef_guild){
    get_data('/characters?page=0&access_token=', account_key).done(function(characters_data){
      render_characters(characters_data, dataRef_guild);
    });
  }

  var get_render_wallet = function(){
    get_data('/account/wallet', access_token).done(function(wallet_data){
      render_wallet(wallet_data);
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
