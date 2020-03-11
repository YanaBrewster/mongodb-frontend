console.log("front-end");
console.log(sessionStorage);

let url;

// when the page loads
$(document).ready(function(){
  // hide the following divs

  if (sessionStorage['userName']) {
    console.log('You are logged in');
    // buttons
    $('#manipulate').show();
    $('#loginBtn').hide();
    $('#registerBtn').hide();
    $('#logoutBtn').show();
    $('#registerBtn').hide();
    $('#viewUserBtn').show();
    // forms
    $('#loginForm').hide();
    $('#registerForm').hide();
    $('#updateUserForm').hide();
    $('#productForm').hide();
    $('#deleteForm').hide();
    $('#addProductForm').hide();
  } else {
    console.log('Please login');
    // buttons
    $('#logoutBtn').hide();
    $('#viewUserBtn').hide();
    $('#manipulate').hide();
    // forms
    $('#loginForm').show();
    $('#registerForm').hide();
    $('#updateUserForm').hide();
    $('#productForm').hide();
    $('#deleteForm').hide();
    $('#addProductForm').hide();
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


  // VIEW USERS BUTTON ===============================================================

  // view users
  $('#viewUserBtn').click(function(){
      $('#manipulate').hide();
    $.ajax({
      url : `${url}/allUsers`,
      type : 'GET',
      dataType : 'json',
      success : function(usersFromMongo){
        console.log(usersFromMongo);
        $('#usersCards').empty();
        document.getElementById('usersCards').innerHTML +=
        '<h2 class="pt-5 pb-4">All Users</h2>'
        for(let i=0; i<usersFromMongo.length; i++){
          document.getElementById('usersCards').innerHTML +=
          `<div class="col mt-3">
          <h4 class=""> ${usersFromMongo[i].username}</h4>
          </div>`;
        }

      },
      error:function() {
        console.log('ERROR: cannot call API');
      }//error

    });//ajax
  });

  // VIEW ALL PRODUCTS FORM =================================================

  // view products
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

  // ADD A PRODUCT FORM ===================================================================

  $('#addProductBtn').click(function(){
    $('#addProductForm').show();
    $('#productForm').hide();
    $('#deleteProductForm').hide();
  });

  $('#addProductForm').submit(function(){
    event.preventDefault();
    if(!sessionStorage['userId']){
          alert('401, permission denied');
          return;
      };

    let name = $('#addProductName').val();
    let price = $('#addProductPrice').val();
    let userId = $('#addProductUserId').val();

      // console.log(name,price, userId);

    if (name == '' || price == '' || userId == ''){
      alert('Please enter all details')
    } else {

      $.ajax({
        url :`${url}/addProduct`,
        type : 'POST',
        data : {
          name : name,
          price : price,
          userId : sessionStorage['userId']
        },
        success:function(product){
          console.log(product);
          if (!(product == 'name taken already, please try another one')) {
            alert('added the product');
          } else {
            alert("name taken already, please try another one")
          }
          $('#addProductName').val();
          $('#addProductPrice').val();
          $('#addProductUserId').val();
        },   // success
        error:function(){
          console.log('error: cannot call api');
        }  //error
      }); //ajax
    } //else
  }); // submit add product




  // UPDATE PRODUCT FORM ===============================================

  $('#updateProductBtn').click(function(){
    $('#addProductForm').hide();
    $('#productForm').show();
    $('#deleteProductForm').hide();
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


// DELETE PRODUCT FORM ==============================================================

$('#deleteProductBtn').click(function(){
  $('#deleteProductForm').show();
  $('#productForm').hide();
  $('#addProductForm').hide();

$('#deleteForm').submit(function(){
  event.preventDefault();
  if(!sessionStorage['userId']){
        alert('401, permission denied');
        return;
    };

  let  productId = $('#deleteProductId').val();

  console.log(productId);

  if (productId == '') {
    alert('Please enter product id');
  } else { $.ajax({
          url :`${url}/deleteProduct/${productId}`,
          type :'DELETE',
          data:{
            userId: sessionStorage['userId']
          },
          success : function(data){
            console.log(data);
            if (data=='deleted'){
              alert('deleted');
              $('#deleteProductId').val('');
            } else {
              alert('Enter a valid id');
            }

          },//success
          error:function(){
            console.log('error: cannot call api');
          }//error


        });//ajax
  }
});//submit function for delete product

});


// REGISTER USER FORM ================================================================

$('#registerBtn').click(function(){
  $('#registerForm').show();
});

// register user
$('#registerForm').submit(function(){
  event.preventDefault();
  let username = $('#registerUsername').val();
  let email = $('#registerEmail').val();
  let password = $('#registerPassword').val();
  console.log(username,email,password);
  $.ajax({
    url :`${url}/registerUser`,
    type :'POST',
    data:{
      username : username,
      email : email,
      password : password
    },
    success : function(user){
      console.log(user);
      if (!(user === 'username taken already. Please try another one' )) {
        alert ('lease log in to add data');
        $('#loginBtn').show();
        $('#registerBtn').hide();
        $('#registerForm').hide();
      } else {
        alert('username taken already. Please try another one');
        $('#registerUsername').val('');
        $('#registerEmail').val('');
        $('#registerPassword').val('');
      }
    },//success
    error:function(){
      console.log('error: cannot call api');
    }//error

  });//ajax
});//submit function for register form


  // LOGIN USER FORM ==================================================================

  // login user
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


  // LOG OUT USER BUTTON ===============================================================

  // log out user
  $('#logoutBtn').click(function(){
    sessionStorage.clear()
    $('#manipulate').hide();
    $('#loginBtn').show();
    $('#logoutBtn').hide();
    $('#registerBtn').show();
    $('#viewUserBtn').hide();
    $('#productForm').hide();
    $('#addProductForm').hide();
    // $('#deleteForm').hide();
    location.reload("#loginForm");
  });




});  //document ready
