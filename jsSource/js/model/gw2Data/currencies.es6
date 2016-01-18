let dataRef = {};
let loadingRef;

export const currencies = {
  get(id) {
    return dataRef[id];
  },
  load() {
    if (!loadingRef) {
      const params = {
        ids: 'all',
        lang: 'en'
      };
      loadingRef = $.get('https://api.guildwars2.com/v2/currencies?' + $.param(params))
        .done((currenciesData) => {
          currenciesData.forEach((currency) => {
           dataRef[ currency.id ] = currency;
          });
        });
    }
    return loadingRef;
  }
};
