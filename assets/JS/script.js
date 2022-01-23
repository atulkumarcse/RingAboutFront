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
    

// Registration

// function sendData(data){
//     const XHR = new XMLHttpRequest(),
//         FD  = new FormData();

   
//     for( n in data ) {
//         FD.append( n, data[ n ] );
//     }

    
//     XHR.addEventListener( 'load', function( event ) {
//         alert( 'Yeah! Data sent and response loaded.' );
//     } );

    
//     XHR.addEventListener(' error', function( event ) {
//         alert( 'Oops! Something went wrong.' );
//     } );

    
//     XHR.open( 'POST', 'https://steponexp.net/ring_about/api/auth/signup?name=atul&user_name=ask&email=atula.kumar@steponexp.com&zip_code=201001&password=atul' );

    
//     XHR.send( FD );
// }


// $('#regbtn').on('click',function(e){
//     e.preventDefault();
//     let fullname = document.getElementById('name').value;
//     let username = document.getElementById('user_name').value;
//     let email = document.getElementById('email').value;
//     let zipcode = document.getElementById('zipcode').value;
//     let password = document.getElementById('pass_word').value;
//     let cpass = document.getElementById('confirm-pass').value;


//     data = {
//         name:fullname,
//         username:username,
//         email:email,
//         zipcode:zipcode,
//         password:password,
//         cpass:cpass
//     }

//     sendData(data);
// });
















