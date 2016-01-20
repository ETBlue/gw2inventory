import {apiKey} from 'model/apiKey';

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