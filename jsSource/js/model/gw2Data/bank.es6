import {apiKey} from 'model/apiKey';
import {items} from 'model/gw2Data/items';

let dataRef;

export const bank = {
  get() {
    return dataRef;
  },
  load() {
    let page = 0;
    const loadDeferred = new $.Deferred();
    const params = {
      access_token: apiKey.getKey(),
      lang: 'en',
      page: 0
    };
    const waiting = [];
    //載入specializations
    $.get('https://api.guildwars2.com/v2/characters?' + $.param(params))
      .done((characterList) => {
        //載入items
        waiting.push(items.loadByCharacterList(characterList));

        //全部載入完畢後才resolve loadDeferred
        $.when.apply($.when, waiting).done(() => {
          dataRef = characterList.map((characterData) => {
            const character = new Character(characterData);
            return character.toJSON();
          });
          loadDeferred.resolve(dataRef);
        });
      });
    return loadDeferred;
  }
};

class Character {
  constructor(data) {
    this._data = data;
    return this;
  }
  toJSON() {
    const result = {};
    Object.keys(this._data).forEach((key) => {
      result[key] = this[key];
    });
    return result;
  }

  get inventory() {
    const bags = this._data.bags;
    const inventory = {
      services: [],
      special: [],
      boosts: [],
      style: [],
      misc: []
    };
    bags.forEach((bag) => {
      if (bag) {
        bag.inventory.forEach((item) => {
          if (item) {
            const itemData = items[item.id];
            itemData.count = item.count || "";
            itemData.binding = item.binding || "";
            itemData.bound_to = item.bound_to || "";
            if (itemData.type == "Consumable") {
              if (itemData.details.type == "AppearanceChange") {
                inventory.services.push(itemData);
              }
              if (itemData.details.type == "Booze") {
                // alcohol
              }
              if (itemData.details.type == "ContractNpc") {
                inventory.services.push(itemData);
              }
              if (itemData.details.type == "Food") {
                inventory.boosts.push(itemData);
              }
              if (itemData.details.type == "Generic") {
                inventory.misc.push(itemData);
              }
              if (itemData.details.type == "Halloween") {
                inventory.boosts.push(itemData);
              }
              if (itemData.details.type == "Immediate") {
                inventory.misc.push(itemData);
              }
              if (itemData.details.type == "Transmutation") {
                inventory.style.push(itemData);
              }
              if (itemData.details.type == "Unlock") {
                inventory.misc.push(itemData);
              }
              if (itemData.details.type == "UpgradeRemoval") {
                inventory.special.push(itemData);
              }
              if (itemData.details.type == "Utility") {
                inventory.boosts.push(itemData);
              }
              if (itemData.details.type == "TeleportToFriend") {
                inventory.special.push(itemData);
              }
            }
            if (itemData.type == "Gizmo") {
              if (itemData.details.type == "Default") {
                inventory.misc.push(itemData);
              }
              if (itemData.details.type == "ContainerKey") {
                inventory.special.push(itemData);
              }
              if (itemData.details.type == "RentableContractNpc") {
                inventory.services.push(itemData);
              }
              if (itemData.details.type == "UnlimitedConsumable") {
                inventory.services.push(itemData);
              }
            }
          }
        });
      }
    });
    return {
      services: getInventoryHtml(inventory.services),
      special: getInventoryHtml(inventory.special),
      boosts: getInventoryHtml(inventory.boosts),
      style: getInventoryHtml(inventory.style),
      misc: getInventoryHtml(inventory.misc)
    };
  }
}

function getInventoryHtml(dataList) {
  return dataList.reduce((html, item) => {
    if (item) {
      return html + `
        <div class="table-item">
          <img data-toggle="tooltip" data-placement="left" title="${item.description}" class="icon medium item ${item.rarity}" src="${item.icon}" />
          <span class="bold ${item.rarity}">${item.name}
          </span>
        </div>
      `;
    }
    else {
      return html;
    }
  }, '');
}
