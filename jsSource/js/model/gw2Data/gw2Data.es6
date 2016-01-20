import {eventful} from 'utils/events';
import {apiKey} from 'model/apiKey';
import {account} from 'model/gw2Data/account';
import {characters} from 'model/gw2Data/characters';
import {guilds} from 'model/gw2Data/guilds';
import {wallet} from 'model/gw2Data/wallet';
import {bank} from 'model/gw2Data/bank';
import {inventory} from 'model/gw2Data/inventory';


export const gw2Data = {
  loadAccount() {
    this.trigger('load:account');
    return account.load().done((accountData) => {
      this.trigger('loaded:account', accountData);
    });
  },
  loadCharacters() {
    this.trigger('load:characters');
    return characters.load().done((characterList) => {
      this.trigger('loaded:characters', characterList);
    });
  },
  loadWallet() {
    this.trigger('load:wallet');
    return wallet.load().done((walletData) => {
      this.trigger('loaded:wallet', walletData);
    });
  },
  loadBank() {
    this.trigger('load:bank');
    return inventory.load().done((bankData) => {
      this.trigger('loaded:bank', bankData);
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


