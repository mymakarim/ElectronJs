'use strict'
const path = require('path')
const model = require(path.join(__dirname, 'model.js'))
// Menu Clicks
module.exports.listPeople = function (e) {
  $('a.nav-link').removeClass('active')
  $(e).addClass('active')
  $('#edit-person').hide()
  window.model.getPeople()
  $('#people').show()
}
module.exports.addPerson = function (e) {
  $('a.nav-link').removeClass('active')
  $(e).addClass('active')
  let tableName = $(e).attr('id');
  $('#section_title').html('BRE<U><b>A</b></U>D ('+ tableName +')')
  var columns = ['contact_id', 'first_name', 'last_name', 'email', 'phone'];
  let row = window.model.getTable('contacts', columns , 'contact_id' , 'ASC', '10', '0')
  console.log(row);
  // var formElements = Object.keys(row).map(function(key) {
  //   return [key, row[key]];
  // });
  // $('#section_body').html(createForm(tableName, formElements, 'Submit'));


  // $('#people').hide()
  // $('#edit-person h2').html('Add Person')
  // $('#edit-person-submit').html('Save')
  // $('#edit-person-form input').val('')
  // $('#edit-person-form').removeClass('was-validated')
  // $('#first_name, #last_name')
  //   .removeClass('is-valid is-invalid')
  // $('#person_id').parent().hide()
  // $('#edit-person').show()
}

// Listing Items Backend Staff
module.exports.browseTable = function (rowsObject, tableName, primary) {
  let markup = ''
  for (let rowId in rowsObject) {
    let obj = rowsObject[rowId]
    var result = Object.keys(obj).map(function(key) {
      return [key, obj[key]];
    });
    
    markup += '<div class="row justify-content-start">'
    for(var x=0; x < result.length; x++){
       if(x==0){
        markup += 
        '<div class="col-xs-2 edit-icons"><a href="#"><img data-tableName="'+ tableName +'" data-primary="'+ primary +'" id="edit-pid_' +
        result[x][1] + '" class="icon edit" src="' +
        path.join(__dirname, 'img', 'edit-icon.png') + '"></a>' +
        '<a href="#"><img data-tableName="'+ tableName +'" data-primary="'+ primary +'" id="del-pid_' + result[x][1] +
        '" class="icon delete" src="' + path.join(__dirname, 'img', 'x-icon.png') +
        '"></a></div>'
      }else{
        markup+=
        '<div class="col-xs-2 name">' + result[x][1] + ',&nbsp;</div>'
      }
    }
    markup += '</div>'
  }
  $('#section_title').html('<b><u>B</u></b>READ ('+ tableName + ')')
  $('#section_body').html(markup)
  $('a.nav-link').removeClass('active')
  $('a.nav-link.people').addClass('active')
  $('#people').show()
  $('#section_body img.edit').each(function (idx, obj) {
    $(obj).on('click', function () {
      // console.log($(this));
      let columnValue = this.id.split('_')[1]
      let tableName = $(this).data("tablename");
      let column = $(this).data("primary");
      window.view.editTableRow(tableName, column, columnValue)
    })
  })
  $('#section_body img.delete').each(function (idx, obj) {
    $(obj).on('click', function (e) {
      e.preventDefault();
      var r = confirm("Are you sure?");
      if (r == true) {
        let tableName = $(this).data('tablename');
        let primaryKey = $(this).data('primary');
        window.view.deleteRow(tableName, primaryKey,this.id)
      }
    })
  })
}
// Edit Table Row
module.exports.editTableRow = function (tableName, column, columnValue) {
  $('#section_title').html('BR<U>E</U>AD ('+ tableName +')')
  let row = model.getTableRow(tableName, column, columnValue)[0]
  var formElements = Object.keys(row).map(function(key) {
    return [key, row[key]];
  });
  $('#section_body').html(createForm('edit-form-id', tableName, formElements, 'Submit'));
  $('#section_body #edit-person-submit').each(function (idx, obj) {
    $(obj).on('click', function (e) {
      e.preventDefault()
      $(this).parents('form').find('input, select, textarea').each(function (idx, obj) {
        $(this).attr("disabled", "disabled");
      })
      let formId = $(e.target).parents('form').attr('id')
      let tableName = $(e.target).parents('form').data('tablename')
      let keyValue = window.view.getFormFieldValues(formId)
      window.model.saveFormData(tableName, keyValue, function () {
        // yahya - should get columns adn table from outside (checkboxes to show like voyager)
        var columns = ['contact_id', 'first_name', 'last_name', 'email', 'phone'];
        window.model.getTable('contacts', columns , 'contact_id' , 'ASC', '10', '0')
      })
    })
  })
}

function createForm(id, tableName, formElements, submit){
  let markup = '';
  markup += '<form id="'+ id +'" data-tablename="'+ tableName +'">';
  markup += '<div class="container-fluid">';
  // let params;
  for(var x=0; x < formElements.length; x++){
    var params = [];
    // console.log(formElements[x]);
    // yahya - should work on (make a table like bread table in voyager and put params there)
    params["type"] = 'text';
    params["class"] = 'form-control';
    params["id"] = formElements[x][0];
    params["name"] = formElements[x][0];
    params["value"] = formElements[x][1];
    markup += createFormElement(params);
  }
  markup += '<div class="form-group row"><button class="btn btn-primary mx-auto" id="edit-person-submit" type="submit">'+ submit +'</button></div>';
  markup += '</div>';
  markup += '</form>';
  return markup;
}
function createFormElement(params){
  if(params["type"] == 'text'){
    return createFormElementText(params)
  }
}
function createFormElementText(params){
  let markup = '';
  let attrs = arrayToString(params, '=', ' ');
  markup += '<div class="form-group row">';
  markup += '<label class="col-xs-2 col-form-label" for="'+ params['name'] +'">'+ params['name'] +'</label>';
  markup += '<input '+ attrs +' >';
  markup += '</div>';
  return markup;
}
function arrayToString(params, delemiterBetween, delimeterAfter){
  let attrs = '';
  for (var key in params) { 
    if (params.hasOwnProperty(key)) { 
        // Printing Keys 
        attrs += key + delemiterBetween+ '"'+ params[key]+ '"'+ delimeterAfter; 
    } 
  }
  return attrs;
}

module.exports.deleteRow = function (tableName, primary, pid) {
  model.deleteRow(tableName, primary, pid.split('_')[1], $('#' + pid).closest('div.row').remove())
}

module.exports.getFormFieldValues = function (formId) {
  let keyValue = {columns: [], values: []}
  $('#' + formId).find('input').each(function (idx, obj) {
    keyValue.columns.push($(obj).attr('id'))
    keyValue.values.push($(obj).val())
  })
  return keyValue
}
