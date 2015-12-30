import {apiKey} from 'model/apiKey';
import {guilds} from 'model/gw2Data/guilds';
import {specializations} from 'model/gw2Data/specializations';
import {traits} from 'model/gw2Data/traits';
import {items} from 'model/gw2Data/items';

let dataRef;

export const characters = {
  get() {
    return dataRef;
  },
  load() {
    let page = 0;
    const loadDeferred = new $.Deferred();
    const params = {
      access_token: apiKey.getKey(),
      lang: 'en',
      page: 0
    };
    const waiting = [];
    //載入specializations
    waiting.push(specializations.load());
    $.get('https://api.guildwars2.com/v2/characters?' + $.param(params))
      .done((characterList) => {
        //載入guild
        waiting.push(guilds.loadByCharacterList(characterList));
        //載入traits
        waiting.push(traits.loadByCharacterList(characterList));
        //載入items
        waiting.push(items.loadByCharacterList(characterList));

        //全部載入完畢後才resolve loadDeferred
        $.when.apply($.when, waiting).done(() => {
          dataRef = characterList.map((characterData) => {
            const character = new Character(characterData);
            return character.toJSON();
          });
          loadDeferred.resolve(dataRef);
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

  get equipment() {
    const equipmentArray = this._data.equipment;

    // 先把 equipment array 轉成 hash
    const equipment = {};
    equipmentArray.forEach(function(element, index, array){
      equipment[element.slot] = {};
      equipment[element.slot].id = element.id;
      equipment[element.slot].upgrades = element.upgrades;
      equipment[element.slot].infusions = element.infusions;
    });

    return {
      Helm: getEquipmentItemHtml(equipment.Helm),
      Shoulders: getEquipmentItemHtml(equipment.Shoulders),
      Gloves: getEquipmentItemHtml(equipment.Gloves),
      Coat: getEquipmentItemHtml(equipment.Coat),
      Leggings: getEquipmentItemHtml(equipment.Leggings),
      Boots: getEquipmentItemHtml(equipment.Boots),
      Backpack: getEquipmentItemHtml(equipment.Backpack),
      HelmAquatic: getEquipmentItemHtml(equipment.HelmAquatic),
      Amulet: getEquipmentItemHtml(equipment.Amulet),
      Accessory1: getEquipmentItemHtml(equipment.Accessory1),
      Accessory2: getEquipmentItemHtml(equipment.Accessory2),
      Ring1: getEquipmentItemHtml(equipment.Ring1),
      Ring2: getEquipmentItemHtml(equipment.Ring2),
      WeaponA1: getEquipmentItemHtml(equipment.WeaponA1),
      WeaponA2: getEquipmentItemHtml(equipment.WeaponA2),
      WeaponB1: getEquipmentItemHtml(equipment.WeaponB1),
      WeaponB2: getEquipmentItemHtml(equipment.WeaponB2),
      WeaponAquaticA: getEquipmentItemHtml(equipment.WeaponAquaticA),
      WeaponAquaticB: getEquipmentItemHtml(equipment.WeaponAquaticB),
      Sickle: getEquipmentItemHtml(equipment.Sickle),
      Axe: getEquipmentItemHtml(equipment.Axe),
      Pick: getEquipmentItemHtml(equipment.Pick)
    };
  }

  get bags() {
    const bags = this._data.bags;
    return getBagHtml(bags);
  }

}


function getSpecializationHtml(dataList) {
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

function getEquipmentItemHtml(data) {
  var html = '';
  if (data) {
    const equipment = items.get(data.id);
    let upgradeHtml = '';
    if (data.upgrades) {
      upgradeHtml = data.upgrades.reduce((upgradeHtml, upgradeId) => {
        const upgrade = items.get(upgradeId);
        if (upgrade) {
          return upgradeHtml + `
            <div class="table-item">
              <img class="small icon item ${upgrade.rarity}" data-toggle="tooltip" data-placement="left" title='${upgrade.description}' src="${upgrade.icon}">
              <span class="bold ${upgrade.rarity}">${upgrade.name}
                <small>(${upgrade.level})</small>
              </span>
            </div>
          `;
        }
        else {    
          return upgradeHtml;
        }
      }, '')
    }
    let infusionHtml = '';
    if (data.infusions) {
      infusionHtml = data.infusions.reduce((infusionHtml, infusionId) => {
        const infusion = items.get(infusionId);
        if (infusion) {
          return infusionHtml + `
            <div class="table-item">
              <img class="small icon item ${infusion.rarity}" data-toggle="tooltip" data-placement="left" title='${infusion.description}' src="${infusion.icon}">
              <span>${infusion.name}</span>
            </div>
          `;
        }
        else {
          return infusionHtml;
        }
      }, '')
    }
    return html + `
      <div class="table-item">
        <img data-toggle="tooltip" data-placement="left" title='' class="icon medium item ${equipment.rarity}" src="${equipment.icon}" />
        <span class="bold ${equipment.rarity}">${equipment.name}
          <small>(${equipment.level})</small>
        </span>
      </div>
      ${upgradeHtml}
      ${infusionHtml}
    `;
  }
  else {
    return html;
  }
}

function getBagHtml(dataList) {
  return dataList.reduce((html, bagData) => {
    if (bagData) {
      const bag = items.get(bagData.id);
      return html + `
        <div class="table-item">
          <img data-toggle="tooltip" data-placement="left" title="${bag.description}" class="icon medium item ${bag.rarity}" src="${bag.icon}" />
          <span class="bold ${bag.rarity}">${bag.name} 
            <small>(${bag.details.size} slots)</small>
          </span>
        </div>
      `;
    }
    else {
      return html;
    }
  }, '');
}

