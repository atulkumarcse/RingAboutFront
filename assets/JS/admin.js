$('#adhome').on('click',function(){
    $('#challenges').css('display','none');
    $('#leaderboards').css('display','none');
    $('#lottery').css('display','none');
    $('#posts').css('display','block');
});

$('#adchal').on('click',function(){
    $('#leaderboards').css('display','none');
    $('#lottery').css('display','none');
    $('#posts').css('display','none');
    $('#challenges').css('display','block');
});

$('#adleaderboard').on('click',function(){
    $('#lottery').css('display','none');
    $('#posts').css('display','none');
    $('#challenges').css('display','none');
    $('#leaderboards').css('display','block');
});

$('#lotpopup').on('click',function(){
    $('#posts').css('display','none');
    $('#challenges').css('display','none');
    $('#leaderboards').css('display','none');
    $('#lottery').css('display','block');
});

$('#adlogout').on('click',function(){
    $('.logModal').modal();
});


// navbar
$('a.nav-link').on('click', function(e) {
    $(this).parent().addClass('active').siblings().removeClass('active');
});


// Posts selection
$('select').on('click',function(e){
    var optval = e.target.value;
    console.log(optval);
    if(optval==1){
        $('.adposts').css('display','none');
        $('.useposts').css('display','block');
    }
    else if(optval==2){
        $('.useposts').css('display','none');
        $('.adposts').css('display','block');
    }
    else{
        $('.adposts').css('display','none');
        $('.useposts').css('display','none');
    }
});
