import {loadData} from 'model/gw2Data/gw2Data';

let dataRef = {};
let loadingRef = {};

export const guilds = {
  get(id) {
    return dataRef[id];
  },
  load(id) {
    let guild_id = guildId;
    if (!loadingRef[guildId]) {
      loadingRef[guildId] = loadData('guild_details.json', {guild_id}).done((guildData) => {
        guildDataRef[ guildData.guild_id ] = guildData;
      });
    }
    return loadingRef[guildId];
  }
};
