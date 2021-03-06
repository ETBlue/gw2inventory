let dataRef = {};
let loadingRef = {};

export const guilds = {
  get(id) {
    return dataRef[id];
  },
  load(id) {
    if (!loadingRef[id]) {
      const params = {
        guild_id: id
      };
      loadingRef[id] = $.get('https://api.guildwars2.com/v1/guild_details.json?' + $.param(params))
        .done((guildData) => {
          dataRef[ guildData.guild_id ] = guildData;
        });
    }
    return loadingRef[id];
  },
  loadByCharacterList(characterList) {
    const waiting = [];
    characterList.forEach((characterData) => {
      if (characterData.guild) {
        waiting.push(this.load(characterData.guild));
      }
    });
    return $.when.apply($.when, waiting);
  }
};
