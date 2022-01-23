let signlink = document.getElementById("signlink");
let loglink = document.getElementById("loglink");
let homelink = document.getElementById("homelink");
let sign = document.getElementById("sign");
let log = document.getElementById("log");
let home = document.getElementById("home");

$('.nav-item a').on('click',function(){
    $('button').attr('aria-expanded','false');
    $('button').addClass("collapsed");
    $('#navbarNav').removeClass('show');

});
signlink.addEventListener("click",function(){
    home.style.display="none";
    log.style.display="none";
    sign.style.display="block";
});

loglink.addEventListener("click",function(){
    home.style.display="none";
    sign.style.display="none";
    log.style.display="block";
});

homelink.addEventListener("click",function(){
    sign.style.display="none";
    log.style.display="none";
    home.style.display="block";
});


// home
var animatebox = document.getElementById('mwon');

$(document).on('scroll',function(){
    const windowOffsetTop = window.innerHeight + window.scrollY;
    const animateboxoffset =  animatebox.offsetTop;

    // get target from admin
    var target = 50;
    
    var number = $('#number').text();
    if(windowOffsetTop >= animateboxoffset){
        var interval = setInterval(function() {
        $('#number').text(number);
        if (number >= target) clearInterval(interval);
            number++;
        }, 30);
    }
});
    

//Registration

$('#regbtn').on('click',function(e){
    e.preventDefault();
    let fullname = document.getElementById('name').value;
    let username = document.getElementById('user_name').value;
    let email = document.getElementById('email').value;
    let zipcode = document.getElementById('zipcode').value;
    let password = document.getElementById('pass_word').value;
    let cpass = document.getElementById('confirm-pass').value;

    data = {
        name:fullname,
        user_name:username,
        email:email,
        zip_code:zipcode,
        password:password,
        cpass:cpass
    }
    
    // setup some local variables

    // Serialize the data in the form
    var serializedData = $('#regform').serialize()

    var $form = $(this);

    var $inputs = $form.find("input, select, button, textarea password");


    // Fire off the request to /form.php
    request = $.ajax({
        url: "/ring_about/api/auth/signup",
        type: "post",
        data: data
    });

    // Callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR){
        // Log a message to the console

        console.log(response);
        if(response.status == "ok"){
            document.getElementById("myForm").reset();
            $("#msg").html("Registration Successfully")
        }
        else{
             $("#msg").html("Please Try Again")
        }
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
            var  i=0;
            Object.entries(jqXHR.responseJSON.error.errors).forEach(([key, val]) => {
              if(i==0){
               $("#msg").html(val); 
               i++;
              }     
            });
    });

    // Callback handler that will be called regardless
    // if the request failed or succeeded
    request.always(function () {
        // Reenable the inputs
        $inputs.prop("disabled", false);
    });
});



//Login

$('.logbtn').on('click',function(e){
    e.preventDefault();
    let logusername = document.getElementById('logusername').value;
    let logpassword = document.getElementById('logpassword').value;

    data = {
        email:logusername,
        password:logpassword
    }
    
    // setup some local variables

    var $form = $(this);

    var $inputs = $form.find("input, select, button, textarea password");


    // Fire off the request to /form.php
    request = $.ajax({
        url: "/ring_about/api/auth/login",
        type: "post",
        data: data
    });

    // Callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR){
        // Log a message to the console

        console.log(response);
        if(response.status == "ok"){
            $.removeCookie("token");
            $.removeCookie("userdetails");
            $.cookie("token",response.token);
            $.cookie("userdetails", response.user);
            window.location.href = "main.html"

        }
        else{
             $("#msg").html("Please register yourself")
        }
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
           //console.log(jqXHR.responseJSON);
            var  i=0; 
            Object.entries(jqXHR.responseJSON.error.errors).forEach(([key, val]) => {
              if(i==0){
               $("#msg").html(val); 
               i++;
              }     
            });
    });

    // Callback handler that will be called regardless
    // if the request failed or succeeded
    request.always(function () {
        // Reenable the inputs
        $inputs.prop("disabled", false);
    });
});












