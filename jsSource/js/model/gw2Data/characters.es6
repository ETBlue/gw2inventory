import {apiKey} from 'model/apiKey';
import {guilds} from 'model/gw2Data/guilds';
import {specializations} from 'model/gw2Data/specializations';
import {traits} from 'model/gw2Data/traits';

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
        //載入specializations
        waiting.push(specializations.load());

        const needTraitsId = [];
        responseData.forEach((characterData) => {
          //載入guild
          if (characterData.guild) {
            waiting.push(guilds.load(characterData.guild));
          }
          if (characterData.specializations) {
            $.each(characterData.specializations, (key, subSpecialization) => {
              if (subSpecialization) {
                subSpecialization.forEach((specialization) => {
                  if (specialization && specialization.traits) {
                    specialization.traits.forEach((trait) => {
                      needTraitsId.push(trait);
                    });
                  }
                });
              }
            });
          }
        });
        //載入traits
        waiting.push(traits.load(needTraitsId));

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
  get specializations() {
    const specializations = this._data.specializations;
    return {
      pve: getSpecializationHtml(specializations.pve),
      pvp: getSpecializationHtml(specializations.pvp),
      wvw: getSpecializationHtml(specializations.wvw)
    };
  }
}


function getSpecializationHtml(dataList) {
  var output_string = '';
  return dataList.reduce((html, specializationData) => {
    if (specializationData) {
      const specialization = specializations.get(specializationData.id);
      let traitHtml = '';
      if (specializationData.traits) {
        traitHtml = specializationData.traits.reduce((traitHtml, traitId) => {
          const trait = traits.get(traitId);
          if (trait) {
            return traitHtml + `
              <div class="table-item">
                <img class="small icon" data-toggle="tooltip" data-placement="left" title="${trait.description}" src="${trait.icon}">
                <span>${trait.name}</span>
              </div>
            `;
          }
          else {
            return traitHtml;
          }
        }, '')
      }
      return html + `
        <div class="table-item">
          <img class="medium icon spec" src="${specialization.icon}" />
          <span>${specialization.name}</span>
        </div>
        ${traitHtml}
      `;
    }
    else {
      return html;
    }
  }, '');
}