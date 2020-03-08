console.log("front-end");

$(document).ready(function(){
  $('#heading').click(function(){
    $(this).css('background', 'teal');
  });

  $('#adminPage').hide();
  $('#adminBtn').click(function(){
    $('#adminPage').show();
    $('#homePage').hide();
  });

  $('#homePage').hide();
  $('#adminBtn').click(function(){
    $('#adminPage').hide();
    $('#homePage').show();
  });

  $('#viewUserBtn').click(function(){
    $.ajax({
      url : 'http://192.168.33.10:3000/allUsers',
      type : 'GET',
      dataType : 'json',
      success : function(usersFromMongo){
        console.log(usersFromMongo);
      },
      error:function() {
        console.log('ERROR: cannot call API');
      }//error

    });//ajax
  }); //document ready


});
