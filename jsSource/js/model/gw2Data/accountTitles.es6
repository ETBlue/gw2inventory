import {apiKey} from 'model/apiKey';
import {titles} from 'model/gw2Data/titles';

let dataRef;

export const accountTitles = {
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
    $.get('https://api.guildwars2.com/v2/account/titles?' + $.param(params))
      .done((accountTitlesData) => {
        //載入 titles
        waiting.push(titles.load());

        //全部載入完畢後才resolve loadDeferred
        $.when.apply($.when, waiting).done(() => {
          let titleList = [];
          accountTitlesData.forEach((id) => {
            const titleData = titles.get(id);
            if (titleData) {
              titleList.push(`<span class="inline-block">${titleData.name}</span>`);
            }
          });
          dataRef = titleList.join(', ');
          loadDeferred.resolve(dataRef);
        });
      });
    return loadDeferred;
  }
};
