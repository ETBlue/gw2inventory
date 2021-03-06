import {apiKey} from 'model/apiKey';
import {items} from 'model/gw2Data/items';
import {characters} from 'model/gw2Data/characters';
import {materials} from 'model/gw2Data/materials';
import {vault} from 'model/gw2Data/vault';
import {bank} from 'model/gw2Data/bank';
import {accountInventory} from 'model/gw2Data/accountInventory';

let dataRef;
let materialRef;

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

    //載入 shared inventory slots
    waiting.push(accountInventory.load());

    $.when.apply($.when, waiting).done(() => {
      const waitingLoadItems = [];
      //載入銀行物品資料
      waitingLoadItems.push(items.loadByBankList(bank.get()));
      waitingLoadItems.push(items.loadByVaultList(vault.get()));
      waitingLoadItems.push(items.loadByAccountInventoryList(accountInventory.get()));
      
      //全部載入完畢後才 merge
      $.when.apply($.when, waitingLoadItems).done(() => {
    
          dataRef = [];
          materialRef = {};

          const vaultDataRef = vault.get().map((material, index) => {
            if (material) {
              materialRef[material.id] = materials.get(material.category).name;
              const itemInfo = items.get(material.id);
              const position = 'Vault|' + (index + 1);
              const item = new Item(position, material, itemInfo);
              return item.toJSON();
            }
          });
          $.merge(dataRef, vaultDataRef);

          const characterDataRef = [];
          characters.get().forEach((character) => {
            character._data.equipment = character._data.equipment || [];
            character._data.equipment.forEach((equipmentItem) => {
              if (equipmentItem) {
                const itemInfo = items.get(equipmentItem.id);
                const position = character.name + `<br /><span class='small light'>(equipped)</span>`;
                equipmentItem.count = 1;
                const item = new Item(position, equipmentItem, itemInfo);
                characterDataRef.push( item.toJSON() );
              }
            });
            character._data.bags = character._data.bags || [];
            character._data.bags.forEach((bag) => {
              if (bag) {
                const itemInfo = items.get(bag.id);
                const position = character.name + `<br /><span class='small light'>(equipped)</span>`;
                bag.count = 1;
                const item = new Item(position, bag, itemInfo);
                characterDataRef.push( item.toJSON() );

                bag.inventory.forEach((bagItem) => {
                  if (bagItem) {
                    const itemInfo = items.get(bagItem.id);
                    const position = character.name + `<br /><span class='small light'>(bag)</span>`;
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

          const accountInventoryDataRef = accountInventory.get().map((accountInventoryItem, index) => {
            if (accountInventoryItem) {
              const itemInfo = items.get(accountInventoryItem.id);
              const position = 'Shared|' + (index + 1);
              const item = new Item(position, accountInventoryItem, itemInfo);
              return item.toJSON();
            }
          });
          $.merge(dataRef, accountInventoryDataRef);

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
    const keys = [ 'icon', 'name', 'count', 'type', 'level', 'rarity', 'position', 'binding', 'id', 'category' ];
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
  get id() {
    return this._data.id || '';
  }
  get icon() {
    const icon = this._ref.icon || '';
    const rarity = this._ref.rarity || '';
    const description = getToolTipHtml(this._ref);
    return `<img class='large solo item icon ${rarity}' data-toggle='tooltip' data-html='true' data-placement='right' title='${description}' src='${icon}' />`;
  }
  get name() {
    const name = this._ref.name || '';
    const rarity = this._ref.rarity || '';
    return `<span class='bold ${rarity}'>${name}</span>`;
  }
  get count() {
    return parseInt(this._data.count,10);
  }
  get type() {
    let type = this._ref.type || '';
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
    let html = this._data.position || ''
    if (this._data.category) {
      const category = materials.get(this._data.category).name || '';
      return html += `<br /><span class='small light'>${category}</span>`;
    } else {
      return html;
    }
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
    if (materialRef[this._data.id]) {
      return materialRef[this._data.id] || '';
    } else {
      return '';
    }
  }
}

function escapeHtml(data) {

  const entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

  return String(data).replace(/[&<>"'\/]/g, function (s) {
    return entityMap[s];
  });

  let escape = document.createElement('textarea');
  escape.textContent = data;
  let html = escape.innerHTML;
  html = html.replace(/(?:\r\n|\r|\n)/g, '<br />').replace();

}

function getToolTipHtml(item) {
  let html = '';
  if (item.details) {
    if (item.details.infix_upgrade) {
      if (item.details.infix_upgrade.attributes) {
        item.details.infix_upgrade.attributes.forEach((attribute) => {
          html += `${attribute.attribute}: ${attribute.modifier}<br />`;
        });
      }
      if (item.details.infix_upgrade.buff) {
//        item.details.infix_upgrade.buff.forEach((skill) => {
//          const description = skill.description || '';
//          html += escapeHtml(description);
//        });
      }
    }
    if (item.details.stat_choices) {
      
    }
    if (item.details.description) {
      const description = item.details.description || '';
      html += escapeHtml(description);
    } else if (item.description) {
      const description = item.description || '';
      html += escapeHtml(description);
    }
  } else if (item.description) {
    const description = item.description || '';
    html += escapeHtml(description);
  }
  return html;
}
