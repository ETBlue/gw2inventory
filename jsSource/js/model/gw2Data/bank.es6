import {apiKey} from 'model/apiKey';
import {items} from 'model/gw2Data/items';
import {characters} from 'model/gw2Data/characters';
import {materials} from 'model/gw2Data/materials';
import {vault} from 'model/gw2Data/vault';

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
    
    //載入銀行
    $.get('https://api.guildwars2.com/v2/account/bank?' + $.param(params))
      .done((bankData) => {
        dataRef = bankData;
        loadDeferred.resolve(dataRef);
    });
    return loadDeferred;
  }
};