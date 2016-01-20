let dataRef = {};
let loadingRef;

export const specializations = {
  get(id) {
    return dataRef[id];
  },
  load() {
    if (!loadingRef) {
      const params = {
        ids: 'all',
        lang: 'en'
      };
      loadingRef = $.get('https://api.guildwars2.com/v2/specializations?' + $.param(params))
        .done((specializationData) => {
          specializationData.forEach((specialization) => {
            dataRef[ specialization.id ] = specialization;
          });
        });
    }
    return loadingRef;
  }
};
