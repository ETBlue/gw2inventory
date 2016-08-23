let dataRef = {};
let loadingRef;

export const titles = {
  get(id) {
    return dataRef[id];
  },
  load() {
    if (!loadingRef) {
      const params = {
        ids: 'all',
        lang: 'en'
      };
      loadingRef = $.get('https://api.guildwars2.com/v2/titles?' + $.param(params))
        .done((titlesData) => {
          titlesData.forEach((titleData) => {
            dataRef[ titleData.id ] = titleData;
          });
        });
    }
    return loadingRef;
  }
};
