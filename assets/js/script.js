$(document).ready(function () {
  
    $('.sidebar > li')
            .click(function (e) {
        $('.sidebar > li')
            .removeClass('active');
        $(this).addClass('active');
    });
  
    $(this).on('hidden.bs.modal', function () {
    // Load up a new modal...
    $('.sidebar > li')
            .removeClass('active');
  })
   
  
    // mobile modal open
    $('.ebook').on('click', function(e){
        $('#myearbook').modal();
    });

    $('.iagenda').on('click', function(e){
        $('#agendaModal').modal();
    });
        
    $('.inotify').on('click', function(e){
        $('#notificationModal').modal();
    });
    $('.ilog').on('click', function(e){
        $('#logoutModal').modal();
    });

    $('.m-burger').on('click', function(e){
        $('.mobile').css("display","block");
        $('.m-burger').css("display","none");
    });

    $('.menu-close').on('click', function(e){
        $('.mobile').css("display","none");
        $('.m-burger').css("display","block");
    });

});