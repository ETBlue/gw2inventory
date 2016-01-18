import {gw2Data} from 'model/gw2Data/gw2Data';

export const wallet = {
  initialize() {
    $('#wallet [data-click]').button('reset');
    this.bindEvents();
  },
  bindEvents() {
    gw2Data.on('loaded:wallet', (walletData) => {
      const dataSet = walletData.map((walletItem) => {
        return [
          walletItem.icon,
          walletItem.name,
          walletItem.value,
          walletItem.description,
          walletItem.order
        ];
      });
      $('#wallet-table').DataTable({
        data: dataSet,
        destroy: true,
        pageLength: 50,
        "order": [[ 4, 'asc' ]],
        "dom":'',
        "columnDefs": []
      });
      $('#wallet .loading').hide();
      var table = $('#wallet-table').DataTable();
      $('#wallet [data-click]').on('click tap', function(){
        $(this).button('loading');
        $(this).parents('.tab-pane').children('.loading').show();
        var action = $(this).attr('data-click');
        if(action == 'refreshwallet'){
          get_render_wallet();
        }
      });
    });
  }
};


$(() => {
  wallet.initialize();
});

export default wallet;
