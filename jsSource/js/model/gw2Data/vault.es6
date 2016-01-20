import {apiKey} from 'model/apiKey';

let dataRef;

export const vault = {
  get() {
    return dataRef;
  },
  load() {
    const loadDeferred = new $.Deferred();
    const params = {
      access_token: apiKey.getKey(),
      lang: 'en'
    };
    //載入specializations
    $.get('https://api.guildwars2.com/v2/account/materials?' + $.param(params))
      .done((materialList) => {
        dataRef = materialList;
        loadDeferred.resolve(dataRef);
      });
    return loadDeferred;
  }
};
