import {apiKey} from 'model/apiKey';

let dataRef;

export const accountInventory = {
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
    $.get('https://api.guildwars2.com/v2/account/inventory?' + $.param(params))
      .done((accountInventoryData) => {
        dataRef = accountInventoryData;
        loadDeferred.resolve(dataRef);
    });
    return loadDeferred;
  }
};