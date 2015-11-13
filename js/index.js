$(document).ready(function(){

  $('#tabs').tab();
  $('#datatable').DataTable();

  var account_key = '';

  var get_data = function(endpoint){
    return $.get('https://api.guildwars2.com/v2'+endpoint+'?access_token='+account_key);
  }

  var compile_data = function(data){
    $.each(data, function(index, value){
      if(value){
        get_data('/items/' + value.id).done(function(item_data){
          console.log('index: ' + index);
          console.log('value: ' + value.id);
          console.log('content: ' + JSON.stringify(item_data));
        });
      }
    });
    return JSON.stringify(data);
  }

  var render_data = function(data){
    var item_template_source ='<p><img src="{{icon}}"/>{{name}}, {{count}}, {{type}}<br/>{{description}}</p>';
    var item_template = Handlebars.compile(item_template_source);
    $.each(data, function(index, value){
      if(value){
        get_data('/items/' + value.id).done(function(item_data){

          var context = {id: item_data.id, count: value.count, type:item_data.type, name: item_data.name, description: item_data.description, icon: item_data.icon};
          var $item_element = $(item_template(context));
          $('article').append($item_element);

          console.log('index: ' + index);
          console.log('value: ' + value.id);
          console.log('content: ' + JSON.stringify(item_data));
        });
      }
    });

  }

  get_data('/account/bank').done(function(data){
    render_data(data);
  });

});
