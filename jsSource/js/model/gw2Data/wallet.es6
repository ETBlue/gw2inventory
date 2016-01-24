import {apiKey} from 'model/apiKey';
import {currencies} from 'model/gw2Data/currencies';

let dataRef;

export const wallet = {
  get() {
    return dataRef;
  },
  load() {
    const loadDeferred = new $.Deferred();
    const params = {
      access_token: apiKey.getKey(),
      lang: 'en'
    };
    const waiting = [];
    $.get('https://api.guildwars2.com/v2/account/wallet?' + $.param(params))
      .done((walletData) => {
        //載入currencies
        waiting.push(currencies.load());

        //全部載入完畢後才resolve loadDeferred
        $.when.apply($.when, waiting).done(() => {
          dataRef = walletData.map((walletItem) => {
            const item = new Wallet(walletItem);
            return item.toJSON();
          });
          loadDeferred.resolve(dataRef);
        });
      });
    return loadDeferred;
  }
};

class Wallet {
  constructor(data) {
    this._data = data;
    return this;
  }
  toJSON() {
    const result = {};
    Object.keys(this._data).forEach((key) => {
      result[key] = this[key];
    });
    ['name', 'description', 'icon', 'order'].forEach((key) => {
      result[key] = this[key] || '';
    });
    return result;
  }
  get icon() {
    const iconUrl = currencies.get(this._data.id).icon || '';
    return `<img class='large solo icon' src='${iconUrl}' />`;
  }
  get name() {
    const name = currencies.get(this._data.id).name || '';
    return `<span class="bold">${name}</span>`;
  }
  get value() {
    const value = this._data.value || '';
    const name = currencies.get(this._data.id).name;
    if ( name == 'Coin') {
      return getCoinHtml(value);
    } else if ( name == 'Gem') {
      return `<span class='currency gem'>${value}</span>`;
    } else if ( name == 'Karma') {
      return `<span class='currency karma'>${value}</span>`;
    } else if ( name == 'Laurel') {
      return `<span class='currency laurel'>${value}</span>`;
    } else {
      return value;
    }
  }
  get description() {
    return currencies.get(this._data.id).description || '';
  }
  get order() {
    return `<span class="small light">${currencies.get(this._data.id).order}</span>`;
  }
}

function getCoinHtml(value) {
  const copper = value % 100;
  const silver = Math.floor(value / 100) % 100;
  const gold = Math.floor(value / 10000);
  return `
    <div class="gold coin">
      ${gold}
      <img class="icon inline" title="gold" src="https://wiki.guildwars2.com/images/d/d1/Gold_coin.png" />
    </div>
    <div class="silver coin">
      ${silver}
      <img class="icon inline" title="silver" src="https://wiki.guildwars2.com/images/3/3c/Silver_coin.png" />
    </div>
    <div class="copper coin">
      ${copper}
      <img class="icon inline" title="copper" src="https://wiki.guildwars2.com/images/e/eb/Copper_coin.png" />
    </div>
  `;
}