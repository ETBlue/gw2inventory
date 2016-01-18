import {apiKey} from 'model/apiKey';
import {worlds} from 'model/gw2Data/worlds';

let dataRef;

export const account = {
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
    $.get('https://api.guildwars2.com/v2/account?' + $.param(params))
      .done((accountData) => {
        //載入worlds
        waiting.push(worlds.load());

        //全部載入完畢後才resolve loadDeferred
        $.when.apply($.when, waiting).done(() => {
          const account = new Account(accountData);
          dataRef = account.toJSON();
          loadDeferred.resolve(dataRef);
        });
      });
    return loadDeferred;
  }
};

class Account {
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
  get id() {
    return this._data.id || '';
  }
  get name() {
    return this._data.name || '';
  }
  get world() {
    const worldData = worlds.get(this._data.world);
    return `${worldData.name}`;
  }
  get created() {
    const created = this._data.created;
    return created.slice(0, created.indexOf('T')) || '';
  }
  get access() {
    return this._data.access || '';
  }
  get fractal_level() {
    return this._data.fractal_level || '';
  }

}
