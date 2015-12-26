import {apiKey} from 'model/apiKey';
import {guilds} from 'model/gw2Data/guilds';

let characterList;

export const characters = {
  get() {
    return characterList;
  },
  load() {
    let page = 0;
    const loadDeferred = new $.Deferred();
    const params = {
      access_token: apiKey.getKey(),
      lang: 'en',
      page: 0
    };
    $.get('https://api.guildwars2.com/v2/characters?' + $.param(params))
      .done((responseData) => {
        const waiting = [];
        responseData.forEach((characterData) => {
          //載入guild
          if (characterData.guild) {
            waiting.push(guilds.load(characterData.guild));
          }
        });

        //全部載入完畢後才resolve loadDeferred
        $.when.apply($.when, waiting).done(() => {
          characterList = responseData.map((characterData) => {
            const character = new Character(characterData);
            return character.toJSON();
          });
          loadDeferred.resolve(characterList);
        });
      });
    return loadDeferred;
  }
};

class Character {
  constructor(data) {
    this._data = data;
    return this;
  }
  toJSON() {
    const result = {};
    Object.keys(this._data).forEach((key) => {
      result[key] = this[key];
    });
    return result;
  }
  get name() {
    return this._data.name || '';
  }
  get race() {
    return this._data.race || '';
  }
  get gender() {
    return this._data.gender || '';
  }
  get profession() {
    return this._data.profession || '';
  }
  get level() {
    return this._data.level || '';
  }
  get created() {
    const created = this._data.created;
    return created.slice(0, created.indexOf('T')) || '';
  }
  get age() {
    const age = this._data.age;
    const seconds = age % 60;
    const minutes = Math.floor(age / 60) % 60;
    const hours = Math.floor(age / 3600);
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  get deaths() {
    return this._data.deaths || '';
  }
  get guild() {
    const guildData = guilds.get(this._data.guild);
    return `${guildData.guild_name}<br />[${guildData.tag}]`;
  }
  get crafting() {
    const crafting = this._data.crafting;
    if (crafting && crafting.reduce) {
      return crafting.reduce((html, craftData) => {
        return html + `${craftData.rating}|${craftData.discipline} <br />`;
      }, '');
    }
  }
}