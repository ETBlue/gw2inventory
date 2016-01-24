import {apiKey} from 'model/apiKey';
import {items} from 'model/gw2Data/items';
import {characters} from 'model/gw2Data/characters';
import {materials} from 'model/gw2Data/materials';
import {vault} from 'model/gw2Data/vault';
import {bank} from 'model/gw2Data/bank';

let dataRef;

export const inventory = {
  get() {
    return dataRef;
  },
  load() {
    const loadDeferred = new $.Deferred();
    const params = {
      access_token: apiKey.getKey(),
      lang: 'en',
      page: 0
    };
    const waiting = [];

    // 載入材料分類表
    waiting.push(materials.load());

    // 載入角色包包與物品資料
    waiting.push(characters.load());

    // 載入倉庫與物品資料
    waiting.push(vault.load());

    //載入銀行
    waiting.push(bank.load());

    $.when.apply($.when, waiting).done(() => {
      const waitingLoadItems = [];
      //載入銀行物品資料
      waitingLoadItems.push(items.loadByBankList(bank.get()));
      waitingLoadItems.push(items.loadByVaultList(vault.get()));
      
      //全部載入完畢後才 merge
      $.when.apply($.when, waitingLoadItems).done(() => {
    
          dataRef = [];

          const characterDataRef = [];
          characters.get().forEach((character) => {
            character._data.equipment.forEach((equipmentItem) => {
              if (equipmentItem) {
                const itemInfo = items.get(equipmentItem.id);
                const position = character.name + '<br /><span class="small light">(equipped)</span>';
                equipmentItem.count = 1;
                const item = new Item(position, equipmentItem, itemInfo);
                characterDataRef.push( item.toJSON() );
              }
            });
            character._data.bags.forEach((bag) => {
              if (bag) {
                bag.inventory.forEach((bagItem) => {
                  if (bagItem) {
                    const itemInfo = items.get(bagItem.id);
                    const position = character.name + '<br /><span class="small light">(bag)</span>';
                    const item = new Item(position, bagItem, itemInfo);
                    characterDataRef.push( item.toJSON() );
                  }
                });
              }
            });
          });
          $.merge(dataRef, characterDataRef);

          const bankDataRef = bank.get().map((bankItem, index) => {
            if (bankItem) {
              const itemInfo = items.get(bankItem.id);
              const position = 'Bank|' + (index + 1);
              const item = new Item(position, bankItem, itemInfo);
              return item.toJSON();
            }
          });
          $.merge(dataRef, bankDataRef);

          const vaultDataRef = vault.get().map((material, index) => {
            if (material) {
              const itemInfo = items.get(material.id);
              const position = 'Vault|' + (index + 1);
              const item = new Item(position, material, itemInfo);
              return item.toJSON();
            }
          });
          $.merge(dataRef, vaultDataRef);

          loadDeferred.resolve(dataRef);
        
      });
      
    });
    return loadDeferred;
  }
};

class Item {
  constructor(position, data, itemInfo) {
    this._data = data || {};
    this._data.position = position || '';
    this._ref = itemInfo || {};
    return this;
  }
  toJSON() {
    const result = {};
    const keys = [ 'icon', 'name', 'count', 'type', 'level', 'rarity', 'position', 'binding', 'description', 'category' ];
    keys.forEach((key) => {
      result[key] = this[key];
    });
    //Object.keys(this._data).forEach((key) => {
    //  result[key] = this[key];
    //});
    //Object.keys(this._ref).forEach((key) => {
    //  result[key] = this[key];
    //});
    return result;
  }
  get icon() {
    const icon = this._ref.icon || '';
    const rarity = this._ref.rarity || '';
    const description = this._ref.description || '';    
    return `<img class='large solo item icon ${rarity}' data-toggle='tooltip' data-placement='right' title='' src='${icon}' />`;
  }
  get name() {
    const name = this._ref.name || '';
    const rarity = this._ref.rarity || '';
    return `<span class="bold ${rarity}">${name}</span>`;
  }
  get count() {
    return parseInt(this._data.count,10);
  }
  get type() {
    var type = this._ref.type || '';
    if ( type == 'UpgradeComponent' ) {
      type = 'Upgrades';
    } else if ( type == 'CraftingMaterial' ) {
      type = 'Material';
    }
    return type;
  }
  get level() {
    return this._ref.level || '';
  }
  get rarity() {
    return this._ref.rarity || '';
  }
  get position() {
    return this._data.position || '';
  }
  get binding() {
    const binding = this._data.binding;
    const bound_to = this._data.bound_to;
    if (binding) {
      if (bound_to) {
        return bound_to;
      } else {
        return binding;
      }
    } else {
      return '';
    }
  }
  get description() {
    return this._ref.description || '';
  }
  get category() {
    if (this._data.category) {
      return materials.get(this._data.category).name || '';
    } else {
      return '';
    }
  }
}
