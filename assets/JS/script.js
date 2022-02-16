let signlink = document.getElementById("signlink");
let loglink = document.getElementById("loglink");
let homelink = document.getElementById("homelink");
let sign = document.getElementById("sign");
let log = document.getElementById("log");
let home = document.getElementById("home");
let imgurl = "/ring_about/";
let dollarinfo = ""
$('.nav-item a').on('click',function(){
    $('button').attr('aria-expanded','false');
    $('button').addClass("collapsed");
    $('#navbarNav').removeClass('show');

});
if(signlink != null)
{
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
}


// Navbar
$('a.nav-link').on('click', function(e) {
    $(this).parent().addClass('active').siblings().removeClass('active');
});

// home
// var animatebox = document.getElementById('mwon');

// $(document).on('scroll',function(){
//     const windowOffsetTop = window.innerHeight + window.scrollY;
//     const animateboxoffset =  animatebox.offsetTop;

    
//     var target = 55000;
    
//     var number = $('#number').text();
//     if(windowOffsetTop >= animateboxoffset){
//         var interval = setInterval(function() {
//         $('#number').text(number);
//         if (number >= target) clearInterval(interval);
//             number++;
//         }, 30);
//     }
// });
    

//Registration

$('#regbtn').on('click',function(e){
    e.preventDefault();
    let fullname = document.getElementById('name').value;
    let username = document.getElementById('user_name').value;
    let email = document.getElementById('email').value;
    let zipcode = document.getElementById('zipcode').value;
    let password = document.getElementById('pass_word').value;
    let cpass = document.getElementById('confirm-pass').value;
   if(password != cpass){
    $("#msg").html("Password does not match")
    return true;
   }
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
            //document.getElementById("myForm").reset();
            $("#msg").html("Registration Successful")
        }
        else{
             $("#msg").html("Please Try Again")
        }
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
            if(jqXHR.responseJSON.error)
            var  i=0;
          if(jqXHR.responseJSON.error.code == "23000"){
            $("#msg").html("User is Already Register");
          }
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



//logout

$('.logout').on('click',function(e){
   bearertoken = readCookie('token');
    // Fire off the request to /form.php
    request = $.ajax({
        url: "/ring_about/api/logout",
        type: "post",
         headers: {
            "Authorization": "Bearer  " + bearertoken 
          },

        data: ""
    });

    // Callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR){
        // Log a message to the console

        console.log(response);
        if(response.status == "ok"){
             eraseCookie('token');
             eraseCookie('userdetails');
             deleteAllCookies();
            window.location.href = "/RingAbout"

        }
        else{
             $("#msglogout").html("Please register yourself")
        }
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
           //console.log(jqXHR.responseJSON);
           if(jqXHR.responseJSON.error.status_code == 403)
           {
            $("#msglogout").html("Please Register yourself"); 
            return true;
           }
    });

});


$('.logbtn').on('click',function(e){
    e.preventDefault();
    let logusername = document.getElementById('logusername').value;
    let logpassword = document.getElementById('logpassword').value;

    data = {
        email:logusername,
        password:logpassword
    }

    eraseCookie('token');
    eraseCookie('userdetails');
    deleteAllCookies();
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
            setCookie("token",response.token,1)
            setCookie("roomid","RingAbout",1)
            setCookie("type","student",1)
            setCookie("userdetails",JSON.stringify(response.user),1)
            window.location.href = "main.html"

        } else if(response.status == "fail"){
         $("#loginmsg").html(response.msg)
        }else{
             $("#loginmsg").html("Please register yourself")
        }
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
           //console.log(jqXHR.responseJSON);
           if(jqXHR.responseJSON.error.status_code == 403)
           {
            $("#loginmsg").html("Please Register yourself"); 
            return true;
           }
            var  i=0; 
            Object.entries(jqXHR.responseJSON.error.errors).forEach(([key, val]) => {
              if(i==0){
               $("#loginmsg").html(val); 
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


function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

  function createCookie(key, value, expiry) {
        var expires = new Date();
        expires.setTime(expires.getTime() + (expiry * 24 * 60 * 60 * 1000));
        document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
    }

    function readCookie(key) {
        var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
        return keyValue ? keyValue[2] : null;
    }


   async function areadCookie(key) {
        var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
        return keyValue ? keyValue[2] : null;
    }

function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}



$('.submitbtnadv').on('click',function(e){
    e.preventDefault();
    //var formData = $("#formadv").serialize();
    var form = $('#formadv')[0];
    var formData = new FormData(form);
    bearertoken = readCookie('token');
    // Fire off the request to /form.php
    request = $.ajax({
        url: "/ring_about/api/AdvertiseStore",
        type: "post",
        processData: false,
        contentType: false,
        headers: {
            "Authorization": "Bearer  " + bearertoken 
          },
        data: formData
    });

    // Callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR){
        // Log a message to the console
        if(response.status == true || response.status == 'true')
           {
            $("#exampleModalLong").modal('hide');
            $("#adafterModal").modal();
            //$("#uploadmsg").html("Advertise Created Succefully"); 
            //window.location.reload();
            //return true;
           }
        else{
             
        }
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
           if(jqXHR.responseJSON.error == "token_expired" || jqXHR.responseJSON.error == "token_not_provided" || jqXHR.responseJSON.error == "token_invalid"){
            window.location.href = "/RingAbout";
           }

           
           //  var  i=0; 
           //  Object.entries(jqXHR.responseJSON.error.errors).forEach(([key, val]) => {
           //    if(i==0){
           //     $("#loginmsg").html(val); 
           //     i++;
           //    }     
           //  });
    });

    // Callback handler that will be called regardless
    // if the request failed or succeeded
    request.always(function () {
        // Reenable the inputs
       // $inputs.prop("disabled", false);
    });
});


$('.subpassbtn').on('click',function(e){
    // e.preventDefault();
      e.preventDefault();
    pass1 = $(".cpass1").val() ;
    pass2 = $(".cpass2").val() ;
    pass3 = $(".cpass3").val() ;
    var formData = { "password" : pass1, "cpassword":pass2 }

    if(pass1 == "" || pass2 == "" || pass3 == "" ){
        $(".pmsg").html("Please Enter all Details");
        return true;
    }
    if(pass2 != pass3){
        $(".pmsg").html("Password does not match");
        return true;
    }
    
    bearertoken = readCookie('token');
    // Fire off the request to /form.php
    request = $.ajax({
        url: "/ring_about/api/changePassword",
        type: "post",
        dataType: 'json',
        headers: {
            "Authorization": "Bearer  " + bearertoken 
          },
        data: formData
    });

    // Callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR){
        // Log a message to the console
        if(response.status == true || response.status == 'true')
           {
            $(".pmsg").html(response.msg); 
            $('.logout').click();
           }
        else{
             $(".pmsg").html(response.msg); 
        }
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
           if(jqXHR.responseJSON.error == "token_expired" || jqXHR.responseJSON.error == "token_not_provided" || jqXHR.responseJSON.error == "token_invalid"){
            window.location.href = "/RingAbout";
           }
    });

    // Callback handler that will be called regardless
    // if the request failed or succeeded
    request.always(function () {
        // Reenable the inputs
       // $inputs.prop("disabled", false);
    });
});

$('.pattsubmitbtn').on('click',function(e){
    e.preventDefault();
    //var formData = $("#formadv").serialize();
    var form = $('#formadvimg')[0];
    var formData = new FormData(form);
    bearertoken = readCookie('token');
    // Fire off the request to /form.php
    request = $.ajax({
        url: "/ring_about/api/AdvertiseStorepattern",
        type: "post",
        processData: false,
        contentType: false,
        headers: {
            "Authorization": "Bearer  " + bearertoken 
          },
        data: formData
    });

    // Callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR){
        // Log a message to the console
        if(response.status == true || response.status == 'true')
           {
            $("#uploadmsg").html("Advertise Created Succefully"); 
            window.location.reload();
            //return true;
           }
        else{
             
        }
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
           if(jqXHR.responseJSON.error == "token_expired" || jqXHR.responseJSON.error == "token_not_provided" || jqXHR.responseJSON.error == "token_invalid"){
            window.location.href = "/RingAbout";
           }

           
           //  var  i=0; 
           //  Object.entries(jqXHR.responseJSON.error.errors).forEach(([key, val]) => {
           //    if(i==0){
           //     $("#loginmsg").html(val); 
           //     i++;
           //    }     
           //  });
    });

    // Callback handler that will be called regardless
    // if the request failed or succeeded
    request.always(function () {
        // Reenable the inputs
       // $inputs.prop("disabled", false);
    });
});



function advlist(){
    bearertoken = readCookie('token');
    // Fire off the request to /form.php
    request = $.ajax({
        url: "/ring_about/api/Advertiselist",
        type: "get",
        processData: false,
        contentType: false,
        headers: {
            "Authorization": "Bearer  " + bearertoken 
          },
        data: ""
    });

    // Callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR){
        // Log a message to the console
        console.log(response);
      
        if(response.status == "true"){
           $(".classifiedrow").html("");
             $.each(response.data, function (key, val) {
             img = text = "";     
                if(response.data[key].url != null){
                    img = '<img src="'+imgurl+response.data[key].url+'" class="img-fluid w-100"  alt="">'
                } else {
                    text = '<p class="img-fluid w-100 u-para " style=" display:block">'+response.data[key].detail+'</p>';
                }
                  if(response.data[key].detail != null && response.data[key].url != null){
                   img = "";
                   text = '<p class="img-fluid w-100 u-para " style=" display:block">'+response.data[key].detail+'</p>';
                }
                $data = '<div class="col-md-3 " style="height: 200px; margin-bottom:30px; ">'+
                        '<div class="h-100 d-flex imgbackground " style="border:2px solid #ffffff;">'+
                       img + text + '</div>'+
                    '</div>'
                $(".classifiedrow").append($data);
                if(response.data[key].detail != null && response.data[key].url != null){
                   $(".imgbackground").css('background-image', 'url('+ response.data[key].url + ')' );
                    }
                });
            //$("#uploadmsg").html("Advertise Created Succefully"); 
            //return true;
           } else {

        }
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
           console.log(jqXHR.responseJSON);
           if(jqXHR.responseJSON.error == "token_expired" || jqXHR.responseJSON.error == "token_invalid"){
            window.location.href = "/RingAbout";
           }

           
           //  var  i=0; 
           //  Object.entries(jqXHR.responseJSON.error.errors).forEach(([key, val]) => {
           //    if(i==0){
           //     $("#loginmsg").html(val); 
           //     i++;
           //    }     
           //  });
    });

    // Callback handler that will be called regardless
    // if the request failed or succeeded
    request.always(function () {
        // Reenable the inputs
       // $inputs.prop("disabled", false);
    });
}

function mnylist(){
    bearertoken = readCookie('token');
    // Fire off the request to /form.php
    request = $.ajax({
        url: "/ring_about/api/Moneylist",
        type: "get",
        processData: false,
        contentType: false,
        headers: {
            "Authorization": "Bearer  " + bearertoken 
          },
        data: ""
    });

    // Callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR){
        // Log a message to the console
        console.log(response);
        if(response.status === true){
          
             $.each(response.data.data, function (key, val) {
                if(key == 0){
                  $(".high_money").html(response.data.data[key].money) 
                   $(".high_user").html(response.data.data[key].name)  
                }
                
                });
            //$("#uploadmsg").html("Advertise Created Succefully"); 
            //return true;
           } else {

        }
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
        console.log(jqXHR.responseJSON);
          if(jqXHR.responseJSON.error == "token_expired" || jqXHR.responseJSON.error == "token_not_provided"){
            window.location.href = "/RingAbout";
           }

           
           //  var  i=0; 
           //  Object.entries(jqXHR.responseJSON.error.errors).forEach(([key, val]) => {
           //    if(i==0){
           //     $("#loginmsg").html(val); 
           //     i++;
           //    }     
           //  });
    });

    // Callback handler that will be called regardless
    // if the request failed or succeeded
    request.always(function () {
        // Reenable the inputs
       // $inputs.prop("disabled", false);
    });
}


function alluserList(){
    bearertoken = readCookie('token');
    // Fire off the request to /form.php
    request = $.ajax({
        url: "/ring_about/api/userList",
        type: "get",
        processData: false,
        contentType: false,
        headers: {
            "Authorization": "Bearer  " + bearertoken 
          },
        data: ""
    });

    // Callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR){
        // Log a message to the console
        //console.log(response);
        if(response.status === true){
          
             $.each(response.data, function (key, value) {
            var datafun = value.id + "," +'"'+value.name.toString()+'"' ;
            if($('.userlist'+value.id).html() === undefined)
            {
            $('#joinwebcam').append('<div class="userlist'+value.id+' listuser ">'+
                '<div class="person chat-active '+value.id+'" data-chat="person1">'+
                            '<div class="user-info"'+
                            "onclick='setname("+datafun+")'"+
                            '>'+
                                '<div class="meta-initial">'+
                                    '<div class="user-initial">'+
                                        '<h2 >'+value.name.charAt(0)+'</h2>'+
                                    '</div>'+
                                '</div>'+
                                '<div class="f-body">'+
                                    '<div class="meta-info">'+
                                        '<span '+
                                        //"onclick='setname("+datafun+")'"+
                                         'class="user-name" data-name="'+value.name+'">'+value.name+'</span>'+
                                        '<span class="user-meta-status">'+
                                            //'<div class="circle c-1"></div>'+
                                            '<div class="circle c-2 removeb circlered'+value.id+'"></div>'+
                                        '</span>'+
                                    '</div>'+
                                    '<span class="preview"><p></p></span>'+
                                 '</div>'+
                            '</div>'+
                        '</div>'+
                        '</div>');
            $(".circlered"+value.id).addClass("blink")
           }
                
                });
           } else {

        }
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
        console.log(jqXHR.responseJSON);
          if(jqXHR.responseJSON.error == "token_expired" || jqXHR.responseJSON.error == "token_not_provided"){
            window.location.href = "/RingAbout";
           }
    });
    request.always(function () {
        // Reenable the inputs
       // $inputs.prop("disabled", false);
    });
}

function chllist(){
    bearertoken = readCookie('token');
    // Fire off the request to /form.php
    request = $.ajax({
        url: "/ring_about/api/challengeslist",
        type: "get",
        processData: false,
        contentType: false,
        headers: {
            "Authorization": "Bearer  " + bearertoken 
          },
        data: ""
    });

    // Callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR){
        // Log a message to the console
        console.log(response);
        if(response.status === true){
          $(".carousel-indicators").html("");
          $(".carousel-inner").html("");
             $.each(response.data.data, function (key, val) {
                active = "";
                if(key == 0){
                    active = "active";
                }
                if(response.data.data[key].url != null){
                var htmldata = '<div class="carousel-item h-100 position-relative '+active+'">'+
                                    '<img src="'+imgurl+response.data.data[key].url+'" class="d-block img-fluid w-100 h-100 position-absolute " alt="...">'+
                                    '</div>';
                $(".carousel-inner").append(htmldata) 
                }  else {
                    var htmldata = '<div class="carousel-item h-100 position-relative '+active+'">'+
                                    
                                    '<p class="text-white text-center p-5 d-block img-fluid w-100 h-100 position-absolute">'+response.data.data[key].detail+'</p>'+
                                '</div>';
                $(".carousel-inner").append(htmldata)
                }              
                               

                if(key == 0){
                  $(".carousel-indicators").append('<li data-target="#carouselSlidesOnly" data-slide-to="'+key+'" class="active"></li>')   
                }else{
                    $(".carousel-indicators").append('<li data-target="#carouselSlidesOnly" data-slide-to="'+key+'" ></li>')   
                }
                
                });
            //$("#uploadmsg").html("Advertise Created Succefully"); 
            //return true;
           } else {

        }
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
           console.log(jqXHR.responseJSON);
           if(jqXHR.responseJSON.error == "token_expired"){
            window.location.href = "/RingAbout";
           }

           
           //  var  i=0; 
           //  Object.entries(jqXHR.responseJSON.error.errors).forEach(([key, val]) => {
           //    if(i==0){
           //     $("#loginmsg").html(val); 
           //     i++;
           //    }     
           //  });
    });

    // Callback handler that will be called regardless
    // if the request failed or succeeded
    request.always(function () {
        // Reenable the inputs
       // $inputs.prop("disabled", false);
    });
}

function profilelist($id){
    bearertoken = readCookie('token');
    // Fire off the request to /form.php
    request = $.ajax({
        url: "/ring_about/api/userProfile/"+$id,
        type: "get",
        processData: false,
        contentType: false,
        headers: {
            "Authorization": "Bearer  " + bearertoken 
          },
        data: ""
    });

    // Callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR){
        // Log a message to the console
        console.log(response);
        $(".tweet").html("");
        $(".insta").html("");
        $(".others").html("");
        if(response.status === true){
          $(".name1").html(response.data[0].name);
            var url = new URL(window.location.href);
            var uid = url.searchParams.get("id");
           if(uid){
             if(response.data[0].emailstatus === 1){
            $(".email1").html(response.data[0].email);
            $("#socialstatus").attr("checked","checked")
            } else {
             $(".email").html("") 
            }
           if(response.data[0].zipstatus === 1){
            $(".zip1").html(response.data[0].zip_code);
            }else { 
                $(".zipcode").html("") 
            }
            if(response.data[0].socialstatus === 1){
             if( response.data[0].twitter !== null){
             $arr = response.data[0].twitter.split(",");
              if($arr.length>0){
              $.each($arr,function(key,value){
                if(value.includes("https://") ===  true){
                    addhttps = "";
                  }
                  else {
                    addhttps = "https://"
                  }
                   $(".addsocial").append('<a href="'+addhttps+value+'" target="_blank"><h4 class="tweet mb-2 ml-4">'+value+'</h4></a>');
              });
              }
          }
            } else { 
              $(".social_links").html("") 
            }
           } else {

            $(".email1").html(response.data[0].email);
            $("#socialstatus").attr("checked","checked")
            
          
            $(".zip1").html(response.data[0].zip_code);
          if( response.data[0].twitter !== null){
             $arr = response.data[0].twitter.split(",");
              if($arr.length>0){
              $.each($arr,function(key,value){
                  if(value.includes("https://") ===  true){
                    addhttps = "";
                  }
                  else {
                    addhttps = "https://"
                  }
                   $(".addsocial").append('<a href="'+addhttps+value+'" target="_blank"><h4 class="tweet mb-2 ml-4">'+value+'</h4></a>');
              });
              }
              }
           }
          
          
          $(".user_name").html(response.data[0].user_name);
          if(response.data[0].url !== null){
           $(".profpic").attr("src",imgurl+response.data[0].url); 
          }
          // $(".tweet").html(response.data[0].tweet);
          // $(".insta").html(response.data[0].insta );
          // $(".others").html(response.data[0].linkedin );
           } else {

        }
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
           console.log(jqXHR.responseJSON);
           if(jqXHR.responseJSON.error == "token_expired"){
            window.location.href = "/RingAbout";
           }
    });

}

//Registration

$('.updbtn').on('click',function(e){
    e.preventDefault();
     var form = $('#updprofile')[0];
    var formData = new FormData(form);
    bearertoken = readCookie('token');
    // Fire off the request to /form.php
    request = $.ajax({
        url: "/ring_about/api/updateProfile",
        type: "post",
        processData: false,
        contentType: false,
        headers: {
            "Authorization": "Bearer  " + bearertoken 
          },
        data: formData
    });

    // Callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR){
        // Log a message to the console
        if(response.status == "ok"){
            // document.getElementById("#updprofile").reset();
            $(".popmsgtxt").html("Profile Edited Successfully")
            $("#popmsg").modal();
        }
        else{
             $("#msgedit").html("Please Try Again")
        }
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
            if(jqXHR.responseJSON.error)
            var  i=0;
            Object.entries(jqXHR.responseJSON.error.errors).forEach(([key, val]) => {
              if(i==0){
               $("#msgedit").html(val); 
               i++;
              }     
            });
    });

    // Callback handler that will be called regardless
    // if the request failed or succeeded
    request.always(function () {
        // Reenable the inputs
       // $inputs.prop("disabled", false);
    });
});




function editlist($id){
    bearertoken = readCookie('token');
    // Fire off the request to /form.php
    request = $.ajax({
        url: "/ring_about/api/userProfile/"+$id,
        type: "get",
        processData: false,
        contentType: false,
        headers: {
            "Authorization": "Bearer  " + bearertoken 
          },
        data: ""
    });

    // Callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR){
        // Log a message to the console
        console.log(response);
        $(".tweet").html("");
        $(".insta").html("");
        $(".socials").html("");
        if(response.status === true){
          $("input[name='name']").val(response.data[0].name);
          $("input[name='email']").val(response.data[0].email);
          $("input[name='zip_code']").val(response.data[0].zip_code);
          $("input[name='user_name']").val(response.data[0].user_name);
          if(response.data[0].url !== null){
           $(".profpic").attr("src",imgurl+response.data[0].url); 
          }
           
           if(response.data[0].emailstatus === 1){
            $("#socialstatus").attr("checked","checked")
           }
           if(response.data[0].zipstatus === 1){
            $("#zipstatus").attr("checked","checked")
           }
           if(response.data[0].socialstatus === 1){
            $("#socialstatus").attr("checked","checked")
           }
           if( response.data[0].twitter !== null){
            $arr = response.data[0].twitter.split(",");
          if($arr.length>0){
          $.each($arr,function(key,value){
               if(value !="," && value != ""){
               $(".socials").append('<input type="text" name="others[]" value="'+value+'" class="inp mb-2" placeholder="enter social link">');
              } 
          });
          }
      }
          // $("input[name='others']").val(response.data[0].twitter );
           } else {

        }
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
           console.log(jqXHR.responseJSON);
           if(jqXHR.responseJSON.error == "token_expired"){
            window.location.href = "/RingAbout";
           }
    });

}

$('.prize_submit').on('click',function(e){
    e.preventDefault();
    clearInterval(intervald);
     var form = $('#awardform')[0];
    var formData = new FormData(form);
    bearertoken = readCookie('token');
    // Fire off the request to /form.php
    request = $.ajax({
        url: "/ring_about/api/Awards",
        type: "post",
        processData: false,
        contentType: false,
        headers: {
            "Authorization": "Bearer  " + bearertoken 
          },
        data: formData
    });

    // Callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR){
        // Log a message to the console
        if(response.status == "ok"){
           closemodal()
        }
        else{
            senddollar()
        }
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
            console.log(jqXHR.responseJSON.error)
           
    });

    // Callback handler that will be called regardless
    // if the request failed or succeeded
    request.always(function () {
        // Reenable the inputs
       // $inputs.prop("disabled", false);
    });
});




function startinter(delay, repetitions) {
var countinr = 0;

// function creation
var intervald = setInterval(function(){

    // increasing the count by 1
    countinr++;

    // when count equals to 5, stop the function
    if(countinr === repetitions){
        clearInterval(intervald);
        senddollar();
        
    }

    // display the current time
    let dateTime= new Date();
    let time = dateTime.toLocaleTimeString();
    console.log(time);

}, delay);
}

function senddollarmessage(info){
    dollarinfo = info;
    $("input[name='info']").val(JSON.stringify(dollarinfo));
    startinter(3000, 10);
    $(".giftimg").attr("src","./assets/IMG/gift-present.gif")
    $(".giftimg").attr("onclick","openmodel()")
    
}
function openmodel(){
    $("#eModalLong").modal();
}
function closemodal(){
     $("#eModalLong").modal('hide');
     dollarinfo = "";
     $(".giftimg").removeAttr("onclick");
     $(".giftimg").attr("src","./assets/IMG/gift.jpg")
}
function senddollar(){
     $("input[name='info']").val("");
     bearertoken = readCookie('token');
    // Fire off the request to /form.php
    if(dollarinfo == ""){
        return true;
    }
    dollarinfo.ids = dollarinfo.ids.filter(function(entry) { return /\S/.test(entry); });
    dollarinfo.ids.push(userid);
    var ids = dollarinfo.ids.toString()
    $.ajax({
        url: "https://steponexp.net:8096/api/senddollarmessage?message=122&ids="+ids,
        type: "get",
        processData: false,
        contentType: false,
        headers: {
            "Authorization": "Bearer  " + bearertoken 
          },
        data: ""
    });
    closemodal();
}


function getleaderboard(){
    bearertoken = readCookie('token');
    // Fire off the request to /form.php
    request = $.ajax({
        url: "/ring_about/api/leaderboarddata",
        type: "get",
        processData: false,
        contentType: false,
        headers: {
            "Authorization": "Bearer  " + bearertoken 
          },
        data: ""
    });

    // Callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR){
        // Log a message to the console
        $(".leaderboarddata").html("");
        $(".tweet").html("");
        $(".insta").html("");
        $(".others").html("");
        if(response.status === true){
            i=1;
          $.each(response.data.data,function(key,value){
               $(".leaderboarddata").append('<tr>'+
                        ' <td class="py-3 rank">'+(i++)+'</td>'+
                        ' <td class="py-3 rank-user">'+value.name+'</td>'+
                        ' <td class="py-3 rank-usermoney">'+value.money+'</td>'+
                    '</tr>');
          });
           } else {

        }
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
           console.log(jqXHR.responseJSON);
           if(jqXHR.responseJSON.error == "token_expired"){
            window.location.href = "/RingAbout";
           }
    });

}

function toggle(e){
    $keyname = $(e).attr("key");
     bearertoken = readCookie('token');
    var status = 0
    if(e.checked === true){
        status = 1
    } else {
        status = 0
    }
    $.ajax({
        url: "/ring_about/api/userstatus/"+$keyname+"/"+status,
        type: "post",
        processData: false,
        contentType: false,
        headers: {
            "Authorization": "Bearer  " + bearertoken 
          },
        data: ""
    });
}


$('.fgpbutton').on('click',function(e){
    e.preventDefault();
    let fpemail = document.getElementById('fpemail').value;
    
    data = {
        email:fpemail,
    }

    eraseCookie('token');
    eraseCookie('userdetails');
    deleteAllCookies();
    // setup some local variables

    // Fire off the request to /form.php
    request = $.ajax({
        url: "/ring_about/api/auth/mailsend",
        type: "get",
        data: data
    });

    // Callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR){
        // Log a message to the console

        console.log(response);
        if(response.status == "ok"){
           $("#faModalLong").modal();
            $('#fModalLong').modal();
           //$("#fgmsg").html("Please check your email")
        }
        else{
             $("#fgmsg").html("Please register yourself")
        }
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
           //console.log(jqXHR.responseJSON);
           if(jqXHR.responseJSON.error.status_code == 403)
           {
            $("#fgmsg").html("Please register your email"); 
            return true;
           }
            var  i=0; 
            Object.entries(jqXHR.responseJSON.error.errors).forEach(([key, val]) => {
              if(i==0){
               $("#fgmsg").html(val); 
               i++;
              }     
            });
    });

    // Callback handler that will be called regardless
    // if the request failed or succeeded
    request.always(function () {
        // Reenable the inputs
       
    });
});

function advtopmiddle(){
    bearertoken = readCookie('token');
    // Fire off the request to /form.php
    request = $.ajax({
        url: "/ring_about/api/AdvertiselistTop",
        type: "get",
        processData: false,
        contentType: false,
        headers: {
            "Authorization": "Bearer  " + bearertoken 
          },
        data: ""
    });

    // Callback handler that will be called on success
    request.done(function (response, textStatus, jqXHR){
        // Log a message to the console
        console.log(response);
        if(response.status == "true"){
             $.each(response.data, function (key, val) {
                if(val.detail == "Top"){
                    $(".TopHead").attr("src",imgurl+response.data[key].url)
                } else if(val.detail == "Middle"){
                    $(".MiddleHead").attr("src",imgurl+response.data[key].url)
                } else if(val.detail == "Bottom"){
                    $(".BottomHead").attr("src",imgurl+response.data[key].url)
                } else {
                    
                }
               
                });
           
           } else {

        }
    });

    // Callback handler that will be called on failure
    request.fail(function (jqXHR, textStatus, errorThrown){
           console.log(jqXHR.responseJSON);
           if(jqXHR.responseJSON.error == "token_expired" || jqXHR.responseJSON.error == "token_invalid"){
            window.location.href = "/RingAbout";
           }

           
           //  var  i=0; 
           //  Object.entries(jqXHR.responseJSON.error.errors).forEach(([key, val]) => {
           //    if(i==0){
           //     $("#loginmsg").html(val); 
           //     i++;
           //    }     
           //  });
    });

    // Callback handler that will be called regardless
    // if the request failed or succeeded
    request.always(function () {
        // Reenable the inputs
       // $inputs.prop("disabled", false);
    });
}

$('.closemodal').on('click',function(e){
window.location.reload();
});

if(window.location.pathname == '/RingAbout/main.html')
{
  advlist();
  mnylist(); 
  chllist();
  advtopmiddle(); 
}
//









