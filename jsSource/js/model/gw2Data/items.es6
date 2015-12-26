let dataRef = {};

export const items = {
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
      waiting.push($.get('https://api.guildwars2.com/v2/items?' + $.param(params)));
    }
    $.when.apply($.when, waiting).done((one, ...deferrerResponse) => {
      deferrerResponse.forEach((response) => {
        const traitList = response[0];
        traitList.forEach((item) => {
          dataRef[ item.id ] = item;
        });
      });
      result.resolve(dataRef);
    });
    return result;
  },
  loadByCharacterList(characterList) {
    const needItemIdList = [];
    characterList.forEach((characterData) => {
      if (characterData.equipment) {
        characterData.equipment.forEach((equipment) => {
          if (equipment) {
            needItemIdList.push(equipment.id);
            if (equipment.upgrades) {
              equipment.upgrades.forEach((upgradeId) => {
                needItemIdList.push(upgradeId);
              });
            }
            if (equipment.infusions) {
              equipment.infusions.forEach((infusionId) => {
                needItemIdList.push(infusionId);
              });
            }
          }
        });
      }
    });
    return this.load(needItemIdList);
  }
};
