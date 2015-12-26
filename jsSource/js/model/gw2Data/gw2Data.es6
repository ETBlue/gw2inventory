import {eventful} from 'utils/events';
import {apiKey} from 'model/apiKey';
import {characters} from 'model/gw2Data/characters';
import {guilds} from 'model/gw2Data/guilds';

export const gw2Data = {
  loadAll() {
    return $.when(this.loadCharacters());
  },
  loadCharacters() {
    this.trigger('load:characters');
    return characters.load().done((characterList) => {
      this.trigger('loaded:characters', characterList);
    });
  },
  loadGuild(guildId) {
    this.trigger('load:guild');
    let guild_id = guildId;
    return guilds.load(guildId).done((guildData) => {
      this.trigger('loaded:guild', guildData);
    });;
  }
};
export default gw2Data;

eventful(gw2Data);


