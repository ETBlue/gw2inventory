let dataRef = {};
let loadingRef;

export const materials = {
  get(id) {
    return dataRef[id];
  },
  load() {
    if (!loadingRef) {
      const params = {
        ids: 'all',
        lang: 'en'
      };
      loadingRef = $.get('https://api.guildwars2.com/v2/materials?' + $.param(params))
        .done((categories) => {
          categories.forEach((category) => {
            dataRef[ category.id ] = category;
          });
        });
    }
    return loadingRef;
  }
};
