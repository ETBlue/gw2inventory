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
        const itemList = response[0];
        itemList.forEach((item) => {
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
      if (characterData.bags) {
        characterData.bags.forEach((bag) => {
          if (bag) {
            needItemIdList.push(bag.id);
            if (bag.inventory) {
              bag.inventory.forEach((item) => {
                if (item) {
                  needItemIdList.push(item.id);
                  if (item.upgrades) {
                    item.upgrades.forEach((upgradeId) => {
                      needItemIdList.push(upgradeId);
                    });
                  }
                  if (item.infusions) {
                    item.infusions.forEach((infusionId) => {
                      needItemIdList.push(infusionId);
                    });
                  }
                }
              });
            }
          }
        });
      }
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
