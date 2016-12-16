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
    result.inventory = this.inventory;
    result._data = this._data;
    return result;
  }
  get name() {
    return this._data.name || '';
  }
  get race() {
    return `${this._data.race}<br /><span class='small light'>${this._data.gender}</span>`;
  }
  get gender() {
    return this._data.gender || '';
  }
  get profession() {
    let profession = this._data.profession || '';
    const characterSpecializations = this._data.specializations;
    characterSpecializations.pve.forEach((specialization) => {
      if (specialization) {
        const specializationRef = specializations.get(specialization.id);
        if ( specializationRef.elite ) {
          profession = `${specializationRef.profession}<br /><span class='small light'>${specializationRef.name}</span>`;
        }
      }
    });
    return profession;
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
    return `${hours}:${minutes}:${seconds}`;
  }
  get deaths() {
    const deathCount = this._data.deaths
    if (deathCount > 0) {
      const age = this._data.age / this._data.deaths;
      const minutes = Math.floor(age / 60);
      const deathPeriod = `${minutes} mins`;
      return `${this._data.deaths}<br /><span class='small light'>${deathPeriod}</span>`;
    } else {
      return this._data.deaths || '';
    }
  }
  get guild() {
    if (this._data.guild) {
      const guildData = guilds.get(this._data.guild);
      return `${guildData.guild_name}<br /><span class='small light'>[${guildData.tag}]</span>`;
    } else {
      return ``;
    }
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
    equipmentArray.forEach((element) => {
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
      Sickle: getToolItemHtml(equipment.Sickle),
      Axe: getToolItemHtml(equipment.Axe),
      Pick: getToolItemHtml(equipment.Pick)
    };
  }
  get bags() {
    const bags = this._data.bags;
    return getBagHtml(bags);
  }
  get inventory() {
    const bags = this._data.bags;
    const inventory = {
      services: [],
      special: [],
      boosts: [],
      //style: [],
      misc: []
    };

    bags.forEach((bag) => {
      if (bag) {
        bag.inventory.forEach((item) => {
          if (item) {
            const itemData = items.get(item.id);
            if (itemData) {
              itemData.count = item.count || '';
              itemData.binding = item.binding || '';
              itemData.bound_to = item.bound_to || '';
              if (itemData.type == 'Consumable') {
                //if (itemData.details.type == 'AppearanceChange') {
                //  inventory.services.push(itemData);
                //}
                if (itemData.details.type == 'Booze') {
                  // alcohol
                }
                //if (itemData.details.type == 'ContractNpc') {
                //  inventory.services.push(itemData);
                //}
                if (itemData.details.type == 'Food') {
                  inventory.boosts.push(itemData);
                }
                if (itemData.details.type == 'Generic') {
                  inventory.misc.push(itemData);
                }
                if (itemData.details.type == 'Halloween') {
                  inventory.boosts.push(itemData);
                }
                if (itemData.details.type == 'Immediate') {
                  inventory.misc.push(itemData);
                }
                //if (itemData.details.type == 'Transmutation') {
                //  inventory.style.push(itemData);
                //}
                if (itemData.details.type == 'Unlock') {
                  inventory.misc.push(itemData);
                }
                //if (itemData.details.type == 'UpgradeRemoval') {
                //  inventory.special.push(itemData);
                //}
                if (itemData.details.type == 'Utility') {
                  inventory.boosts.push(itemData);
                }
                //if (itemData.details.type == 'TeleportToFriend') {
                //  inventory.special.push(itemData);
                //}
              }
              if (itemData.type == 'Gizmo') {
                if (itemData.details.type == 'Default') {
                  inventory.misc.push(itemData);
                }
                //if (itemData.details.type == 'ContainerKey') {
                //  inventory.special.push(itemData);
                //}
                //if (itemData.details.type == 'RentableContractNpc') {
                //  inventory.services.push(itemData);
                //}
                //if (itemData.details.type == 'UnlimitedConsumable') {
                //  inventory.services.push(itemData);
                //}
              }
            }
          }
        });
      }
    });

    return {
      //services: getInventoryHtml(inventory.services),
      //special: getInventoryHtml(inventory.special),
      boosts: getInventoryHtml(inventory.boosts),
      //style: getInventoryHtml(inventory.style),
      //misc: getInventoryHtml(inventory.misc)
    };
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
              <div class='table-item'>
                <img class='small icon' data-toggle='tooltip' data-placement='top' data-html='true' title='${trait.description}' src='${trait.icon}'>
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
        <div class='table-item'>
          <img class='medium icon spec' src='${specialization.icon}' />
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

function getToolItemHtml(data) {
  let html = '';
  if (data) {
    let tool = items.get(data.id);
    const descriptionHtml = getToolTipHtml(tool);
    html += `
      <div class='table-item'>
        <img class='medium icon item ${tool.rarity}' data-toggle='tooltip' data-placement='top' title='${descriptionHtml}' src='${tool.icon}'>
        <div class='bold ${tool.rarity}'>${tool.name}
          <span class='small light'>(${tool.level})</span>
        </div>
      </div>
    `;
  }
  return html;
}

function getEquipmentItemHtml(data) {
  let iconHtml = '';
  let nameHtml = '';
  if (data) {
    const equipment = items.get(data.id);
    if (data.upgrades || data.infusions) {
      nameHtml += '<hr />';
    }
    if (data.upgrades) {
      data.upgrades.forEach((upgradeId) => {
        const upgrade = items.get(upgradeId);
        if (upgrade) {
          const descriptionHtml = getToolTipHtml(upgrade);
          iconHtml += `
            <img class='medium icon item ${upgrade.rarity}' data-toggle='tooltip' data-placement='top' title='${descriptionHtml}' src='${upgrade.icon}'>
          `;
          nameHtml += `
            <div class='small bold ${upgrade.rarity}'>${upgrade.name}
              <span class='light'>(${upgrade.level})</span>
            </div>
            `;
        }
      });
    }
    if (data.infusions) {
      data.infusions.forEach((infusionId) => {
        const infusion = items.get(infusionId);
        if (infusion) {
          const descriptionHtml = getToolTipHtml(infusion);
          iconHtml += `
            <img class='medium icon item ${infusion.rarity}' data-toggle='tooltip' data-placement='top' title='${descriptionHtml}' src='${infusion.icon}'>
          `;
          nameHtml += `
            <div class='small bold ${infusion.rarity}'>${infusion.name}</div>
          `;
        }
      });
    }
    if (equipment) {
      const descriptionHtml = getToolTipHtml(equipment);
      return `
        <div class='equipment'>
          <img data-toggle='tooltip' data-placement='top' title='${descriptionHtml}' class='icon large item ${equipment.rarity}' src='${equipment.icon}' />
          ${iconHtml}
        </div>
        <div class='equipment'>
          <div class='bold ${equipment.rarity}'>${equipment.name}
            <span class='small light'>(${equipment.level})</span>
          </div>
          ${nameHtml}
        </div>
        `;
    } else {
      return '';
    }
  } else {
    return '';
  }
}

function getBagHtml(dataList) {
  let iconHtml = '';
  let nameHtml = '';
  let countHtml = '';
  let bagCount = 0;
  let slotCount = 0;
  dataList.forEach((bagData) => {
    slotCount += 1;
    if (bagData) {
      bagCount += 1;
      const bag = items.get(bagData.id);
      const descriptionHtml = getToolTipHtml(bag);
      iconHtml += `
        <img data-toggle='tooltip' data-placement='top' title='${descriptionHtml}' class='icon large item ${bag.rarity}' src='${bag.icon}' />
      `;
      nameHtml += `
        <div class='bold ${bag.rarity}'>${bag.name} 
          <span class='small light'>(${bag.details.size} slots)</span>
        </div>
      `;
    }
  });
  if (slotCount - bagCount > 1) {
    countHtml += ` (${slotCount - bagCount} unused slots)`;
  } else if (slotCount - bagCount == 1) {
    countHtml += ` (1 unused slot)`;
  }
  return `
    <p>${bagCount} bags: ${countHtml}</p>
    <div class='equipment'>
      ${iconHtml}
    </div>
    <div class='equipment'>
      ${nameHtml}
    </div>
  `;
}

function getInventoryHtml(dataList) {
  let iconHtml = '';
  let nameHtml = '';
  let countHtml = '';
  let count = [];
  let foodCount = 0;
  let utilityCount = 0;
  let holloweenCount = 0;
  dataList.forEach((item) => {
    if (item) {
      const descriptionHtml = getToolTipHtml(item);
      iconHtml += `
        <img data-toggle='tooltip' data-placement='top' title='${descriptionHtml}' class='icon medium item ${item.rarity}' src='${item.icon}' />
      `;
      nameHtml += `
        <div>${item.count} 
          <span class='bold ${item.rarity}'>${item.name} 
            <span class='small light'>(${item.level})</span>
          </span>
        </div>
      `;
      if (item.details.type == 'Food') {
        foodCount ++;
      } else if (item.details.type == 'Utility') {
        utilityCount ++;
      } else if (item.details.type == 'Halloween') {
        holloweenCount ++;
      }
    }
  });
  if (foodCount > 0) {
    count.push(`${foodCount} food`);
  }
  if (utilityCount > 1) {
    count.push(`${utilityCount} utilities`);
  } else if (utilityCount == 1) {
    count.push(`${utilityCount} utility`);
  }
  if (holloweenCount > 1) {
    count.push(`${holloweenCount} Boosters`);
  } else if (holloweenCount == 1) {
    count.push(`1 Booster`);
  }
  if (count.length > 0) {
    countHtml = `<p>${count.join(', ')}:</p>`;
  }
  return `
    ${countHtml}
    <div class='equipment'>
      ${iconHtml}
    </div>
    <div class='equipment'>
      ${nameHtml}
    </div>
  `;
}

function escapeHtml(data) {

  const entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

  return String(data).replace(/[&<>"'\/]/g, function (s) {
    return entityMap[s];
  });

  let escape = document.createElement('textarea');
  escape.textContent = data;
  let html = escape.innerHTML;
  html = html.replace(/(?:\r\n|\r|\n)/g, '<br />').replace();

}

function getToolTipHtml(item) {
  let html = '';
  if (item.details) {
    if (item.details.infix_upgrade) {
      if (item.details.infix_upgrade.attributes) {
        item.details.infix_upgrade.attributes.forEach((attribute) => {
          html += `${attribute.attribute}: ${attribute.modifier}<br />`;
        });
      }
      if (item.details.infix_upgrade.buff) {
//        item.details.infix_upgrade.buff.forEach((skill) => {
//          const description = skill.description || '';
//          html += escapeHtml(description);
//        });
      }
    }
    if (item.details.stat_choices) {
      
    }
    if (item.details.description) {
      const description = item.details.description || '';
      html += escapeHtml(description);
    } else if (item.description) {
      const description = item.description || '';
      html += escapeHtml(description);
    }
  } else if (item.description) {
    const description = item.description || '';
    html += escapeHtml(description);
  }
  return html;
}
