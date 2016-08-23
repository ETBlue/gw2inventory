import {eventful} from 'utils/events';
import {apiKey} from 'model/apiKey';
import {account} from 'model/gw2Data/account';
import {accountTitles} from 'model/gw2Data/accountTitles';
import {characters} from 'model/gw2Data/characters';
import {inventory} from 'model/gw2Data/inventory';
import {wallet} from 'model/gw2Data/wallet';


export const gw2Data = {
  loadAccount() {
    this.trigger('load:account');
    return account.load().done((accountData) => {
      this.trigger('loaded:account', accountData);
    });
  },
  loadAccountTitles() {
    this.trigger('load:accountTitles');
    return accountTitles.load().done((accountTitlesData) => {
      this.trigger('loaded:accountTitles', accountTitlesData);
    });
  },
  loadCharacters() {
    this.trigger('load:characters');
    return characters.load().done((characterList) => {
      this.trigger('loaded:characters', characterList);
    });
  },
  loadInventory() {
    this.trigger('load:inventory');
    return inventory.load().done((inventoryData) => {
      this.trigger('loaded:inventory', inventoryData);
    });
  },
  loadWallet() {
    this.trigger('load:wallet');
    return wallet.load().done((walletData) => {
      this.trigger('loaded:wallet', walletData);
    });
  }
};
export default gw2Data;

eventful(gw2Data);


