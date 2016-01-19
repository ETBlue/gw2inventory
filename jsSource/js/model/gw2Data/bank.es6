import {apiKey} from 'model/apiKey';
import {items} from 'model/gw2Data/items';
//import {characters} from 'model/gw2Data/characters';

let dataRef;

export const bank = {
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
    //載入bank
    $.get('https://api.guildwars2.com/v2/account/bank?' + $.param(params))
      .done((bankData) => {
        //載入items
        waiting.push(items.loadByBankList(bankData));

        //全部載入完畢後才resolve loadDeferred
        $.when.apply($.when, waiting).done(() => {
          dataRef = bankData.map((bankItem, index) => {
            if (bankItem) {
              const itemInfo = items.get(bankItem.id);
              const position = 'Bank|' + (index + 1);
              const item = new Item(position, bankItem, itemInfo);
              return item.toJSON();
            }
          });
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
    const keys = [ 'icon', 'name', 'count', 'type', 'level', 'rarity', 'position', 'binding', 'description' ];
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
    return this._data.count || '';
  }
  get type() {
    return this._ref.type || '';
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
}
