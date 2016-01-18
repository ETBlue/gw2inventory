import {gw2Data} from 'model/gw2Data/gw2Data';
import {apiKey} from 'model/apiKey';

export const app = {
  initialize() {
    // show saved apiKey
    const savedKey = apiKey.getKey();
    if (savedKey) {
      $('#api_key').val(savedKey);
    }
    this.bindEvents();
  },
  bindEvents() {
    $('#api_key').keypress(function(e) {
      if (e.keyCode == 13) {
        const newKey = $(this).val();
        apiKey.setKey(newKey);
        app.showLoading();
        gw2Data.loadCharacters();
        gw2Data.loadAccount();
        gw2Data.loadWallet();
      }
    });

    gw2Data.on('loaded:characters', () => {
      $('#characters-status')
        .html('Characters loaded <span class="glyphicon glyphicon-ok text-success"></span>');
    });
    gw2Data.on('loaded:account', (account) => {
      $('.accountname').text(account.name);
      $('.accountid').text(account.id);
      $('.accountcreated').text(account.created);
      $('.worldname').html(account.world);
      $('.fractal_level').html(account.fractal_level);
      $('.access').html(account.access);

      $('#account-status')
        .html('Account loaded <span class="glyphicon glyphicon-ok text-success"></span>');
    });
    gw2Data.on('loaded:wallet', () => {
      $('#wallet-status')
        .html('Wallet loaded <span class="glyphicon glyphicon-ok text-success"></span>');
    });
    gw2Data.on('loaded:bank', () => {
      $('#bank-status')
        .html('Inventory loaded <span class="glyphicon glyphicon-ok text-success"></span>');
    });
  },
  showLoading() {
    $('#account-status').parent().empty().html(`
      <p id="account-status" class="status" style="display: block;">
        Loading account...
      </p>
      <p id="characters-status" class="status" style="display: block;">
        Loading characters...
      </p>
      <p id="bank-status" class="status" style="display: block;">
        Loading inventory...
      </p>
      <p id="wallet-status" class="status" style="display: block;">
        Loading wallet...
      </p>
    `);
  }
};

$(() => {
  app.initialize();
});