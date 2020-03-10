console.log("front-end");
console.log(sessionStorage);

let url;

$(document).ready(function(){
  if (sessionStorage['userName']) {
    console.log('You are logged in');
  } else {
    console.log('Please login');
  }

  $('#adminPage').hide();
  $('#adminBtn').click(function(){
    $('#adminPage').show();
    $('#homePage').hide();
  });

  $('#homePage').hide();
  $('#homeBtn').click(function(){
    $('#adminPage').hide();
    $('#homePage').show();
  });

  //get url and port from config.json
  $.ajax({
    url : 'config.json',
    type : 'GET',
    dataType : 'json',
    success : function(configData){
      console.log(configData);
      url = `${configData.SERVER_URL}:${configData.SERVER_PORT}`
      console.log(url);
    },
    error:function() {
      console.log('ERROR: cannot call API');
    }//error
  });//ajax

  $('#viewUserBtn').click(function(){
    $.ajax({
      url : `${url}/allUsers`,
      type : 'GET',
      dataType : 'json',
      success : function(usersFromMongo){
        console.log(usersFromMongo);
      },
      error:function() {
        console.log('ERROR: cannot call API');
      }//error

    });//ajax
  });

  $('#viewProducts').click(function(){
    $.ajax({
      url : `${url}/allDBProducts`,
      type : 'GET',
      dataType : 'json',
      success : function(productsFromMongo){
        console.log(productsFromMongo);

        for(let i=0; i<productsFromMongo.length; i++){
          document.getElementById('productCards').innerHTML +=
          `<div class="col mt-3">
          <h3 class=""> ${productsFromMongo[i].name}</h3>
          <h4 class="">$${productsFromMongo[i].price}</h4>
          </div>`;
        }

      },
      error:function() {
        console.log('ERROR: cannot call API');
      }//error

    });//ajax
  });

// update product

$('#productForm').submit(function(){
  event.preventDefault();
  let productId = $('#productId').val();
  let productName = $('#productName').val();
  let productPrice = $('#productPrice').val();
  let userId = $('#userId').val();
console.log(productId, productName, productPrice, userId);

  $.ajax({
    url :`${url}/updateProduct/${productId}`,
    type :'PATCH',
    data:{
      name : productName,
      price : productPrice,
      userId : userId
    },
    success : function(data){
      console.log(data);

    },//success
    error:function(){
      console.log('error: cannot call api');
    }//error
  });//ajax
});//submit function for product form

  // login section

  $('#loginForm').submit(function(){
    event.preventDefault();
    let username = $('#username').val();
    let password = $('#password').val();
    console.log(username,password);
    $.ajax({
      url :`${url}/loginUser`,
      type :'POST',
      data:{
        username : username,
        password : password
      },
      success : function(loginData){
        console.log(loginData);
        if (loginData === 'user not found. Please register' ) {
          alert ('Register please');
        } else {
          sessionStorage.setItem('userId',loginData['_id']);
          sessionStorage.setItem('userName', loginData['username']);
          sessionStorage.setItem('userEmail', loginData['email']);
          console.log(sessionStorage);
          document.getElementById('loggedIn').innerHTML +=

          '<div class="col pt-5 pb-5"><h3>Welcome back ' + username + '!</h3></div>';
          $("#loginForm").hide();
          $("#loginBtn").hide();


        }
      },//success
      error:function(){
        console.log('error: cannot call api');
      }//error


    });//ajax

  });//submit function for login form


  $('#logoutBtn').click(function(){
    sessionStorage.clear()
    $("#loginForm").show();
    $("#loginBtn").show();
    $("#loggedIn").empty();
    location.reload("#loginForm");
  });

});  //document ready
