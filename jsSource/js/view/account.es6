import {gw2Data} from 'model/gw2Data/gw2Data';
import {apiKey} from 'model/apiKey';

export const app = {
  initialize() {
    // show saved apiKey
    const savedKey = apiKey.getKey();
    if (savedKey) {
      $('#api_key #current').val(savedKey);
      $('#api_key #recent').html(function() {
        const savedKeyHistory = apiKey.getHistory();
        if (savedKeyHistory) {
          let html = '';
          Object.keys(savedKeyHistory).forEach((key) => {
            html += `
              <li>
                <a data-key='${key}'>${savedKeyHistory[key]}</a>
              </li>
            `;
          });
          html += `
              <li role="separator" class="divider"></li>
              <li>
                <a data-action="clear">Clear Hostory</a>
              </li>
          `;
          return html;
        }
      });
    }
    this.bindEvents();
  },
  bindEvents() {
    let newKey;
    function loadpage() {
      app.showLoading();
      gw2Data.loadAccount();
      gw2Data.loadCharacters();
      gw2Data.loadInventory();
      gw2Data.loadWallet();      
    }
    function drawHistory() {
      $('#api_key #recent').html(function() {
        const savedKeyHistory = apiKey.getHistory();
        if (savedKeyHistory) {
          let html = '';
          Object.keys(savedKeyHistory).forEach((key) => {
            html += `
              <li>
                <a data-key='${key}'>${savedKeyHistory[key]}</a>
              </li>
            `;
          });
          html += `
              <li role="separator" class="divider"></li>
              <li>
                <a data-action="clear">Clear Hostory</a>
              </li>
          `;
          return html;
        }
      });
    }
    $('#api_key #current').keypress(function(e) {
      if (e.keyCode == 13) {
        newKey = $(this).val();
        apiKey.setKey(newKey);
        loadpage();
      }
    });
    $('#api_key #recent').on('click tap', '[data-key]', function(e) {
      newKey = $(this).attr('data-key');
      $('#api_key #current').val(newKey);
      apiKey.setKey(newKey);
      loadpage();
    });
    $('#api_key #recent').on('click tap', '[data-action="clear"]', function(e) {
      $('#api_key #current').val('');
      apiKey.clearHistory();
      $('#api_key #recent').html('<li><a>Hmmm. No history yet.</a></li>');
    });

    gw2Data.on('loaded:characters', () => {
      $('#characters-status')
        .html('Characters loaded <span class="glyphicon glyphicon-ok text-success"></span>');
    });
    gw2Data.on('loaded:account', (account) => {
      apiKey.setHistory(newKey, account.name);
      drawHistory();
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
    gw2Data.on('loaded:inventory', () => {
      $('#inventory-status')
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
      <p id="inventory-status" class="status" style="display: block;">
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