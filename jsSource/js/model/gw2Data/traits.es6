let dataRef = {};

export const traits = {
  get(id) {
    return dataRef[id];
  },
  load(ids) {
    const result = new $.Deferred();
    ids = [...new Set(ids)];
    const params = {
      lang: 'en'
    };
    const waiting = [1];
    while (ids.length > 0) {
      params.ids = ids.splice(0, 200).join(',');
      waiting.push($.get('https://api.guildwars2.com/v2/traits?' + $.param(params)));
    }
    $.when.apply($.when, waiting).done((one, ...deferrerResponse) => {
      deferrerResponse.forEach((response) => {
        const traitList = response[0];
        traitList.forEach((trait) => {
          dataRef[ trait.id ] = trait;
        });
      });
      result.resolve(dataRef);
    });
    return result;
  },
  loadByCharacterList(characterList) {
    const needTraitsIdList = [];
    characterList.forEach((characterData) => {
      if (characterData.specializations) {
        $.each(characterData.specializations, (key, subSpecialization) => {
          if (subSpecialization) {
            subSpecialization.forEach((specialization) => {
              if (specialization && specialization.traits) {
                specialization.traits.forEach((trait) => {
                  needTraitsIdList.push(trait);
                });
              }
            });
          }
        });
      }
    });
    return this.load(needTraitsIdList);
  }
};
