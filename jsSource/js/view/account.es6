import {gw2Data} from 'model/gw2Data/gw2Data';
import {apiKey} from 'model/apiKey';

export const accounts = {
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
        accounts.showLoading();
        gw2Data.loadCharacters();
      }
    });

    gw2Data.on('loaded:characters', () => {
      $('#characters-status')
        .html('Characters loaded <span class="glyphicon glyphicon-ok text-success"></span>');
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
  accounts.initialize();
});