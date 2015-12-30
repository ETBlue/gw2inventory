let dataRef = {};
let loadingRef;

export const worlds = {
  get(id) {
    return dataRef[id];
  },
  load() {
    if (!loadingRef) {
      const params = {
        ids: 'all',
        lang: 'en'
      };
      loadingRef = $.get('https://api.guildwars2.com/v2/worlds?' + $.param(params))
        .done((worldsData) => {
          worldsData.forEach((worldData) => {
           dataRef[ worldData.id ] = worldData;
          });
        });
    }
    return loadingRef;
  }
};
