 	//$(document).ready(function() {
      //setTimeout(function(){
    var datasupport = null;    
    var baseurl = "https://steponexp.net/IHMdata/";
    var mainurl= "https://steponexp.net/IHM/";
    var url = "https://steponexp.net/"
    var apiurl = "https://steponexp.net/IHMbk/";
    var supportids = "supportpanel";
    var imageurl =  null;
    var wordscounting = null;
    function convertUTCDateToLocalDate(date) {
         var newDate = new Date(date.getTime() - date.getTimezoneOffset()*60*1000);
    return newDate; 
    // var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

    // var offset = date.getTimezoneOffset() / 60;
    // var hours = date.getHours();

    // newDate.setHours(hours - offset);

    // return newDate;   
}

    function chunkString (str, len) {
  const size = Math.ceil(str.length/len)
  const r = Array(size)
  let offset = 0
  for (let i = 0; i < size; i++) {
    r[i] = str.substr(offset, len)
    offset += len
  }
  
  return r
}

    $(".supportclick").on("click",function(){
        //createCookie("supporid", "", 1);
        getmessagesupport();
    });


     function callslambook()
     {   
       getmsg();
       //setInterval(getmsg,5000);
         const emojiPicker = new FgEmojiPicker({
            trigger: ["#mytextareaas"],
            removeOnSelection: false,
            closeButton: true,
            position: ['top', 'left'],
            preFetch: true,
            insertInto: document.getElementById('mytextareaslam'),
            emit(obj, triggerElement) {
                var textval = $('#mytextareaslam').val();
                if ((textval.match(/\S+/g)) != null) {
      wordscounting = textval.match(/\S+/g).length;
    }

    console.log(wordscounting);
    if ((textval) != null) {
      cmax = textval.length;
    }

    if (cmax > words) {
      var trimmed =  $('#mytextareaslam').value($(this).val().substr(0, words));
    }
    else {
     // words = words-2;
      
      //$('#mytextareaslam').text(words-cmax);
    }
   $('#display_count').text(words-(cmax-2));
            }
        });
    }
    function saveDetails()
{
    var data = JSON.parse(readCookie("user_detail"));
    userid = data.id;
    var message = $('.chatsupport').val();
    $.ajax({
              url: apiurl+'/api/saveDetails',
              type: "GET",
              data:{userid:userid,message:message}
            }).done(function( data ) {
             createCookie("supporid", userid, 1) ;

                
           console.log("logout");
            });

}

$(".sup-send").on("click",async function(){
    var supporid = await areadCookie("supporid");
        if(supporid == "" || typeof(supporid) === undefined)
        {
            saveDetails();
        }
        var msg = $('.chatsupport').val();
            demo.messageonetoone({ to: supportids, text: {userid :userid ,  msg : msg}, name : namedata  });
        var dateString = getDateString();
        {
            var from = "you";
            //toastr.info('You got a message')
            $('.chat_body').append('<div class="user-msg" style="float:left">'+
                                        '<h5>You</h5><p>' + msg  + " </p> "+
                                        '<div class="chat-time">'+         '<div class="time">' +  dateString +"</div></div>"+        
                                        '</div>'+    
                                "</div>");
                    }
        $('.chat_body').get(0).scrollTop = $('.chat_body').get(0).scrollHeight;
        $('.chatsupport').val('');

        return false;
});
    async function checkEntersupport(field, event,supportperson) {
    var theCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
    //notifym = 2;
    var msg = $('.chatsupport').val();
            msg = msg.trim();
            if(!msg)
            {
                $('.chatsupport').val("");
                return false;
            }
    //$(".circlered"+nameidformessage).removeClass("blink")
    if(theCode == 13) {

       
        //saveDetails();
        var supporid = await areadCookie("supporid");
        if(supporid == "" || typeof(supporid) === undefined)
        {
            saveDetails();
        }
        // Send the chat message
        //supportperson = await getCookie("useridformessage"); 
        
            
            demo.messageonetoone({ to: supportids, text: {userid :userid ,  msg : msg}, name : namedata  });
        var dateString = getDateString();
        {
            var from = "you";
            //toastr.info('You got a message')
            $('.chat_body').append('<div class="user-msg" style="float:left">'+
                                        '<h5>You</h5><p>' + msg  + " </p> "+
                                        '<div class="chat-time">'+         '<div class="time">' +  dateString +"</div></div>"+        
                                        '</div>'+    
                                "</div>");
                    }
        $('.chat_body').get(0).scrollTop = $('.chat_body').get(0).scrollHeight;
        $('.chatsupport').val('');

        return false;
    } else {
        return true;
    }
}


    function callnetwork()
    {
        callwebrtc("allusers");
    
         const emojiPicker = new FgEmojiPicker({
            trigger: ["#mytextareaa"],
            removeOnSelection: false,
            closeButton: true,
            position: ['top', 'right'],
            preFetch: true,
            insertInto: document.getElementById('mytextarea'),
            emit(obj, triggerElement) {
                console.log(obj, triggerElement);
            }
        });
    }

    function submitform()
         {
         //   e.preventDefault();
            var method = "GET";
            var url = baseurl+"authLogin";
            var username = $("input[name='username']").val();
            var rollno = $("input[name='rollno']").val();
            var data = {username:username,rollno:rollno}
            ajaxcall(method,url,data).then((data) => {
     var data = data.data;
     toastr.info(data.message);
     createCookie("user_detail", JSON.stringify(data.user), 1);

     if(data.page != "")
     {
        logs("","login","0")
        window.location.href = data.page;
     }
     else
     {
        logs("",data.message,"0")
     }


  })
  .catch((error) => {
    console.log(error)
  })
    return false;
         }

         function callwebrtc(roomids)
         {
          var user_detail =  readCookie("user_detail")
          if(user_detail != "undefined" && user_detail != "")
          {
          var data = JSON.parse(user_detail);
          if(!data)
          {
            window.location.href = mainurl;
          }
            var method = "GET";
            var url = baseurl+"callwebrtc";
            var username = data.username;
            var companyname = data.organization_name;
            var is_admin = data.is_admin;
            var userid = data.id;
            var data = {username:username,
                companyname:companyname,
                is_admin:is_admin,
                userid:userid,
                roomids:roomids
              }
            ajaxcall(method,url,data).then((data) => {
     createCookie("name",username , 1);
     createCookie("companyname",companyname , 1);
     createCookie("type","teacher" , 1);
     createCookie("useridformessage",userid , 1);
     createCookie("roomid",roomids , 1);
     startwindow();
  })
  .catch((error) => {
    console.log(error)
  })
    //return false;
}
else{
    window.location.href = mainurl;
}
         } 

    function ajaxcall(method,url,data)
    {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      type: method,
      data: data,
      success: function (data) {
        resolve(data)
      },
      error: function (error) {
        reject(error)
      },
    })
  })
    }


 
var words = 100;
var cmax = 0;

   $("#mytextareaslam").on('keyup', function() {
    //words = words -1;
     $("#display_count").css("color","white");
        if ((this.value.match(/\S+/g)) != null) {
      wordscounting = this.value.match(/\S+/g).length;
    }
           var msg = $('#mytextareaslam').val();
            msg = msg.trim();
            if(!msg)
            {
                $('#mytextareaslam').val("");
                //debugger;
                return false;
            }

    console.log(wordscounting);
    if ((this.value) != null) {
      cmax = this.value.length;
    }

    if (cmax > words) {
      var trimmed =  $(this).val($(this).val().substr(0, words));
    }
    else {
      
     // $('#mytextareaslam').text(words-cmax);
    }
    $('#display_count').text(words-(cmax+1));
  });

    $('#mytextareaslam').on('keydown', function(event) {

    if (event.keyCode == 13)
    {
           var msg = $('#mytextareaslam').val();
            msg = msg.trim();
            if(!msg)
            {
                $('.mytextareaslam').val("");
                return false;
            }
        if (!event.shiftKey) {$('#mytextareaslam').submit();}
    }
});

$('#mytextareaslam').on('submit', function() {

    savemsg();
    var words = 100;
var cmax = 0;
});
      

//});

     function Entermessage(field, event) {
     $(".errormsg").html("");    
    var theCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
    if(theCode == 13) {
      //$(".usermsg").append($("input[name=message]").val());
      // $("input[name=message]").val("");
      //savemsg();
        }
    }
   
     function savemsg()
    {
    $(".errormsg").html("");
    var actualmessage = "";
     user_detail = JSON.parse(readCookie("user_detail"));
     var message = $("#mytextareaslam").val() // $(".usermsg").html();
     $array = message.split(" ");
     $.each($array, function(key,value){
     var chuckarray =  chunkString(value,16) ;
     if(chuckarray === null)
     {
        actualmessage += value+" ";
     }
     else{
        $.each(chuckarray, function(key,value){
        actualmessage += value+" ";
    });
     }
     });
     if(actualmessage=="")
     {
        $(".errormsg").html("Please enter the message");
        return true;
     }
     //$("#m1").html(message);
     //$(".usermsg").html("");
     $.ajax({
        type: "GET",
        url: baseurl+'savemessage',//this is only changes
        data: {
            'message': actualmessage,
            'user_id':user_detail.id
        },
        success: function(data) {
            console.log(data);
            getmsg();
            sendmsgall()
            $("#mytextareaslam").val("")
            $('#display_count').html();
        },
    });
    }

    function sendmsgall()
    {
        $.ajax({
        type: "GET",
        url: ' https://steponexp.net:8095/api/sendmessages',//this is only changes
        data: {
            'message': "sendmsgall",
        },
        success: function(data) {
             },
    });
    }
    function getmsg()
    {
        $(".row1").html("");
     $.ajax({
        type: "GET",
        url: baseurl+'getmessage',
        success: function(data) {
           var data = data.data;
          $.each(data, function( key, value ) {
            var html = '<div class="box-left col-5">'+     
                        '<div class="box-msg">'+
                            '<p class="msg-slam">'+value.message+'</p>'+
                        '</div>'+
                        '<div class="box-name">'+
                            '<h4 class="name-slam">'+value.username+'</h4>'+
                        '</div>'+
                    '</div>';
                    
         $(".row1").append(html);
           })

        },
    });
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

    function eraseCookie(key) {
        var keyValue = getCookie(key);
        createCookie(key, keyValue, '-1');
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

$(".log-yes").on("click",function(){
    
    var method ="GET";
    var url = baseurl + "api/logout";
    user_detail = JSON.parse(readCookie("user_detail"));
    var data = {id:user_detail.id};
    ajaxcall(method,url,data).then((data) => {
     console.log(data);
     deleteAllCookies();
     window.location.href = mainurl;
  })
  .catch((error) => {
    console.log(error)
  })
    
})


function mobilecheck() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

$(".log-no").on("click",function(){
    $("#logoutModal").modal("hide");
    $("#logModal").modal("hide");
})



var width = 420; // We will scale the photo width to this
        var height = 360; // This will be computed based on the input stream { width: 300, height: 250 }

        var streaming = false;
        var consts = {
  audio: false,
  video: true
}
        var video = null;
        var canvas = null;
        var photo = null;
        var startbutton = null;

        function startup() {
            video = document.getElementById('vid');
            canvas = document.getElementById('canvas');
            photo = document.getElementById('photo');
            output = document.getElementById('output');
            $("#photo").css("margin-top","700px");
            startbutton = document.getElementById('btn_click');
            startbutton2 = document.getElementById('btn_click2');
            navigator.mediaDevices.getUserMedia(consts)
      .then(function(stream)  {
                    video.srcObject = stream;
                    video.play();
                })
                .catch(function(err) {
                    console.log("An error occurred: " + err);
                });

            video.addEventListener('canplay', function(ev) {
                if (!streaming) {
                    // height = video.videoHeight / (video.videoWidth / width);

                    // if (isNaN(height)) {
                    //     height = width / (4 / 3);
                    // }

                    // video.setAttribute('width', width);
                    // video.setAttribute('height', height);
                    canvas.setAttribute('width', width);

                    canvas.setAttribute('height', height);
                    streaming = true;
                }
            }, false);

            startbutton.addEventListener('click', function(ev) {
                $("#photo").css("margin-top","700px");
                $(".imgvideoss1").css("visibility","hidden");
                $("#photo").removeClass("imgvideoss1");
                
                takepicture();
                ev.preventDefault();
            }, false);
            startbutton2.addEventListener('click', function(ev) {
                $("#photo").css("margin-top","700px");
                $(".imgvideoss1").css("visibility","hidden");
                $("#photo").removeClass("imgvideoss1");
                if(mobilecheck() === true){ 
                    $(".classphoto-screen").css("display","flex");
                } else {
                 $(".classphoto-screen").css("display","block");
                }
                $(".classp-2").css("display","none");
                $(".classp-1").css("display","flex");
                //takepicture();
                ev.preventDefault();
            }, false);

            clearphoto();
        }


        function clearphoto() {
            var context = canvas.getContext('2d');
            context.fillStyle = "#AAA";
            context.fillRect(0, 0, canvas.width, canvas.height);

            var data = canvas.toDataURL('image/png');
            photo.setAttribute('src', data);
        }

        function takepicture() {
           $("#photo").css("visibility", "visible");
            var context = canvas.getContext('2d');
            if (width && height) {
                canvas.width = width;
                canvas.height = height;
                // context.drawImage(video, 0, 0, width, height-70);
                context.drawImage(video, 55, 48, width-110, height-120);
                var data = canvas.toDataURL('image/png');
                photo.setAttribute('src', '/images/classphoto.png');
                 photo.style.backgroundImage = "url('" + data + "')" ;
                photo.style.backgroundRepeat =  "no-repeat";
                //photo.style.zIndex  =  "9999999999999";
                setTimeout(function(){ takeshot(); }, 100);
                
            } else {
                clearphoto();
            }
        }

        
    // })();

    function takeshot() { 
            let disv = 
                document.getElementById('photo'); 
            html2canvas(disv).then( 
                function (canvas) { 
             var data = canvas.toDataURL('image/png');

        var image = new Image();
        image.src = data ;// "data:image/jpg;base64," + data.d;
        var a = document.getElementById("download");
    a.href = data; //Image Base64 Goes here
    $("#photo").css("margin-top","-50px");
    $("#photo").addClass("imgvideoss1");
    
   
    $("#download").css("visibility", "visible");
        user_detail = JSON.parse(readCookie("user_detail"));    
            $.ajax({
        type: "POST",
        url: apiurl+"/api/savephoto",//this is only changes
        data: {
            'photo': data,
            'user_id':user_detail.id
        },
        success: function(data) {
            console.log(data);
        },
    });

                }) 
        } 



 $(".f1").on("click",function(){
    $("#imagetag").attr("src","pngs/Mr. Farhat Jamal 2.png") ;
    $("#closeimg").css("display","none");
    $(".imgvideo").css("background-image",'url(' + "pngs/Mr.%20Farhat%20Jamal%202.png" + ')') ;
    imageurl =  "pngs/Mr. Farhat Jamal 2.png";
      $('.photob-btn').css("display","block");
    });

    $(".f2").on("click",function(){
     $("#imagetag").attr("src","pngs/Mr. Puneet Chhatwal.png") ;
    $("#closeimg").css("display","none");
    $(".imgvideo").css("background-image",'url(' + "pngs/Mr.%20Puneet%20Chhatwal.png" + ')') ;
    imageurl =  "pngs/Mr. Puneet Chhatwal.png";
      $('.photob-btn').css("display","block");
    });
    $(".f3").on("click",function(){
     $("#imagetag").attr("src","pngs/Mr. Beejal Desai.png") ;
    $("#closeimg").css("display","none");
    $(".imgvideo").css("background-image",'url(' + "pngs/Mr.%20Beejal%20Desai.png" + ')') ;
    imageurl =  "pngs/Mr. Beejal Desai.png";
      $('.photob-btn').css("display","block");

    });
    $(".f4").on("click",function(){
    $("#imagetag").attr("src","pngs/Adv. Suhail Nathani.png") ;
    $("#closeimg").css("display","none");
    $(".imgvideo").css("background-image",'url(' + "pngs/Adv.%20Suhail%20Nathani.png" + ')') ;
    imageurl =  "pngs/Adv. Suhail Nathani.png";
      $('.photob-btn').css("display","block");
    });
    $(".f5").on("click",function(){
    $("#imagetag").attr("src","pngs/Mr.Gaurav Pokhariyal.png") ;
    $("#closeimg").css("display","none");
    $(".imgvideo").css("background-image",'url(' + "pngs/Mr.Gaurav%20Pokhariyal.png" + ')') ;
    imageurl =  "pngs/Mr.Gaurav Pokhariyal.png";
      $('.photob-btn').css("display","block");
    });

    $(".f6").on("click",function(){
    $("#imagetag").attr("src","pngs/Mr. Sarabjeet Singh.png") ;
    $("#closeimg").css("display","none");
    $(".imgvideo").css("background-image",'url(' + "pngs/Mr.%20Sarabjeet%20Singh.png" + ')') ;
    imageurl =  "pngs/Mr. Sarabjeet Singh.png";
      $('.photob-btn').css("display","block");
    });


    $(".f7").on("click",function(){
    $("#imagetag").attr("src","pngs/Dr A.G. Khan.png") ;
    $("#closeimg").css("display","none");
    $(".imgvideo").css("background-image",'url(' + "pngs/Dr%20A.G.%20Khan.png" + ')') ;
    imageurl =  "pngs/Dr A.G. Khan.png";
      $('.photob-btn').css("display","block");
    });
    

    $(".f8").on("click",function(){
    $("#imagetag").attr("src","pngs/Dr. Satish Jayaram.png") ;
    $("#closeimg").css("display","none");
    $(".imgvideo").css("background-image",'url(' + "pngs/Dr.%20Satish%20Jayaram.png" + ')') ;
    imageurl =  "pngs/Dr. Satish Jayaram.png";
      $('.photob-btn').css("display","block");
    });


    $(".f9").on("click",function(){
    $("#imagetag").attr("src","pngs/Prof. Anand Iyengar.png") ;
    $("#closeimg").css("display","none");
    $(".imgvideo").css("background-image",'url(' + "pngs/Prof.%20Anand%20Iyengar.png" + ')') ;
    imageurl =  "pngs/Prof. Anand Iyengar.png";
      $('.photob-btn').css("display","block");
    });

    $(".f10").on("click",function(){
    $("#imagetag").attr("src","pngs/Prof. Rushad Kavina.png") ;
    $("#closeimg").css("display","none");
    $(".imgvideo").css("background-image",'url(' + "pngs/Prof.%20Rushad%20Kavina.png" + ')') ;
    imageurl =  "pngs/Prof. Rushad Kavina.png";
      $('.photob-btn').css("display","block");
    });

    $(".f11").on("click",function(){
    $("#imagetag").attr("src","pngs/Dr. Meena Sinha 2.png") ;
    $("#closeimg").css("display","none");
    $(".imgvideo").css("background-image",'url(' + "pngs/Dr.%20Meena%20Sinha%202.png" + ')') ;
    imageurl =  "pngs/Dr. Meena Sinha 2.png";
      $('.photob-btn').css("display","block");
    });


    $(".f12").on("click",function(){
    $("#imagetag").attr("src","pngs/Chef Samir Mulaokar.png") ;
    $("#closeimg").css("display","none");
    $(".imgvideo").css("background-image",'url(' + "pngs/Chef%20Samir%20Mulaokar.png" + ')') ;
    imageurl =  "pngs/Chef Samir Mulaokar.png";
      $('.photob-btn').css("display","block");
    });


    $(".f13").on("click",function(){
    $("#imagetag").attr("src","pngs/Gautam Sen.png") ;
    $("#closeimg").css("display","none");
    $(".imgvideo").css("background-image",'url(' + "pngs/Gautam%20Sen.png" + ')') ;
    imageurl =  "pngs/Gautam Sen.png";
      $('.photob-btn').css("display","block");
    });


    $(".f14").on("click",function(){
    $("#imagetag").attr("src","pngs/Mr.Rakesh Katyani.png") ;
    $("#closeimg").css("display","none");
    $(".imgvideo").css("background-image",'url(' + "pngs/Mr.Rakesh%20Katyani.png" + ')') ;
    imageurl =  "pngs/Mr.Rakesh Katyani.png";
      $('.photob-btn').css("display","block");
    });

    $(".f15").on("click",function(){
    $("#imagetag").attr("src","pngs/Chef T. Pramod.png") ;
    $("#closeimg").css("display","none");
    $(".imgvideo").css("background-image",'url(' + "pngs/Chef%20T.%20Pramod.png" + ')') ;
    imageurl =  "pngs/Chef T. Pramod.png";
      $('.photob-btn').css("display","block");
    });
    
    $(".f16").on("click",function(){
    $("#imagetag").attr("src","pngs/Mr. Arun Kumar Sharma.png") ;
    $("#closeimg").css("display","none");
    $(".imgvideo").css("background-image",'url(' + "pngs/Mr.%20Arun%20Kumar%20Sharma.png" + ')') ;
    imageurl =  "pngs/Mr. Arun Kumar Sharma.png";
      $('.photob-btn').css("display","block");
    });

    $(".f17").on("click",function(){
    $("#imagetag").attr("src","pngs/Chef Anand Marwad.png") ;
    $("#closeimg").css("display","none");
    $(".imgvideo").css("background-image",'url(' + "pngs/Chef%20Anand%20Marwad.png" + ')') ;
    imageurl =  "pngs/Chef Anand Marwad.png";
      $('.photob-btn').css("display","block");
    });

    $(".f18").on("click",function(){
    $("#imagetag").attr("src","pngs/Ms. Fauziya Shariff.png") ;
    $("#closeimg").css("display","none");
    $(".imgvideo").css("background-image",'url(' + "pngs/Ms.%20Fauziya%20Shariff.png" + ')') ;
    imageurl =  "pngs/Ms. Fauziya Shariff.png";
      $('.photob-btn').css("display","block");
    });

    $(".f19").on("click",function(){
    $("#imagetag").attr("src","pngs/Ms. Bhavana Varma.png") ;
    $("#closeimg").css("display","none");
    $(".imgvideo").css("background-image",'url(' + "pngs/Ms.%20Bhavana%20Varma.png" + ')') ;
    imageurl =  "pngs/Ms. Bhavana Varma.png";
      $('.photob-btn').css("display","block");
    });


    $(".f20").on("click",function(){
    $("#imagetag").attr("src","pngs/Mr. Saurabh Krishna.png") ;
    $("#closeimg").css("display","none");
    $(".imgvideo").css("background-image",'url(' + "pngs/Mr.%20Saurabh%20Krishna.png" + ')') ;
    imageurl =  "pngs/Mr. Saurabh Krishna.png";
      $('.photob-btn').css("display","block");
    });

    $(".f21").on("click",function(){
    $("#imagetag").attr("src","pngs/Mr.Vishal Pandey.png") ;
    $("#closeimg").css("display","none");
    $(".imgvideo").css("background-image",'url(' + "pngs/Mr.Vishal%20Pandey.png" + ')') ;
    imageurl =  "pngs/Mr.Vishal Pandey.png";
      $('.photob-btn').css("display","block");
    });

    $(".year-yes").click(function (e) {
        logs("","year-yes","31")
             window.open('/uploads/Graduation_Yearbook_Class_of_2020.pdf', '_blank');
            });

    
    
    $(".year-remind").click(function (e) {
        logs("","year-remind","32")
            message= "We will Notify you later";
            type = 1;
             savenotification(message,type)
             $("#myearbook").modal("hide");
            });

    $("button.close.text-light").click(function (e) {
            logs("","support-close","6")
            createCookie("supporid", "", 1);
            deleteDetails();
            });

    function deleteDetails()
{
     var data = JSON.parse(readCookie("user_detail"));
    userid = data.id;
   // var message = $('.chatsupport').val();
    $.ajax({
              url: apiurl+'/api/deleteDetails',
              type: "POST",
              data:{userid:userid}
            }).done(function( data ) {
           console.log("logout");
            });

}

$(".fa-paperclip").on('click', function() {
       $("#imagefile").click();
    });

$("#imagefile").on('change', function(){
        //readURL(this);
        console.log("dd");
        readURL(this);
    });

 var readURL = function(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
               console.log("gh");
               submitForm();
            }
    
            reader.readAsDataURL(input.files[0]);
        }
    }
    
    function submitForm() {
            console.log("submit event");
            // $(this).attr("disabled", "disabled");
            var fd = new FormData(document.getElementById("fileinfo"));
            fd.append("label", "WEBUPLOAD");
            $.ajax({
              url: "https://steponexp.net/upload1.php",
              type: "POST",
              data: fd,
              processData: false,  // tell jQuery not to process the data
              contentType: false   // tell jQuery not to set contentType
            }).done(function( data ) {
              var obj = JSON.parse(data);
              var name = $("#imagefile").val();
                //console.log("PHP Output:");
                //console.log( data );,
                notifym = 2;
                // demo.messageonetoone({ to: nameidformessage, text: {userid :userid ,  msg : msg}, name : namedata  });
                demo.messageonetoone({ to: supportids, text: {userid :userid ,  msg : "<a style='font-size: 13px !important;' href='"+obj.file+"' target='_blank' > File  :" +   obj.filename +" Download the file</a>" }, name : namedata  });
                 var dateString = getDateString();
    {
      var from = "you";
      //toastr.info('You got a message')
      $('.chat_body').append(
                        '<div class="user-msg">' + "<p><a style='font-size: 13px !important;' href='"+obj.file+"' target='_blank' > File  :" +   obj.filename +" Download the file</a>"  + " </p>"+
                        '<div class="chat-time">'+                                    
                    "</div></div>");
    }
    $('.chat_body').get(0).scrollTop = $('.chat_body').get(0).scrollHeight;
    $('.chatbox').val('');
    
                // demo.message({ to: namedata, text:  });
                $("#imagefile").val('');
                return false;
            });
            //setTimeout('$("#btn").removeAttr("disabled")', 1500);
            return false;
        }

function appendfileupload()
{
   
   $("#poll").html('<script async src="https://www.googletagmanager.com/gtag/js?id=UA-201251654-1"></script><span class="submenu" style="display: none; width: 90px; float: left;">Proceedings</span><i class="i-color" id="icon7"><img src="./assets/icons/agenda.svg"></i>') 
    $("body").append(  '<form method="post" id="fileinfo" name="fileinfo" action="/upload1.php"  onsubmit="return false;" enctype="multipart/form-data">'+
                      '<input type="file" onchange="readURL(this);" name="imagefile" id="imagefile" style="display: none"  >'+
    '</form><div class="backloader" style="display:none ; width:100% ; height:100%; background-color:white;"><div style="display:none" class="loader"></div></div><style type="text/css">'+
    '.disable-click{pointer-events:none;}'+
    '#toast-container > div {'+
  'position: fixed !importrant ; }'+
    '.active-users {'+
    'height: 67%; !important'+
    'overflow-y: scroll;'+
'}'+
'.circle.c-2.removeb.circlered1046.blink {'+
    'position: initial !important;'+
'}'+
'.current-chat-user-name{display:none}'+
    '.loader { position:fixed;'+
  'border: 16px solid #f3f3f3;'+
  'border-radius: 50%;'+
  'border-top: 16px solid #3498db;'+
  'width: 120px;'+
  'height: 120px; left: 50%; top: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%);'+
  '-webkit-animation: spin 2s linear infinite; '+
  'animation: spin 2s linear infinite;'+
'}'+
'@-webkit-keyframes spin {'+
 '0% { -webkit-transform: rotate(0deg); }'+
  '100% { -webkit-transform: rotate(360deg); }'+
'}'+
'@keyframes spin {'+
  '0% { transform: rotate(0deg); }'+
  '100% { transform: rotate(360deg); }'+
'}'+
    '.photob-btn{display:none}'+
    '.bubble-area{height: 90%;overflow-x: hidden;}'+
   // '.chat-box-content{padding:0px !important}'+
    '.modal {'+
    'z-index: 99999999 !important;'+
    '}'+
    '.blink {'+
    'width: 10px;'+
    'height: 10px;position: absolute;'+
    'border-radius: 50%;'+
    'background-color: #4a97e4;'+
    'animation: blinker 1s infinite;'+
    'z-index: 1050;'+
'}'+
'@keyframes blinker {'+
 '50% {'+
    'opacity: 0;'+
  '}'+
'}'+
'.chat_body{'+
 '        overflow: scroll;'+
  '  height: 400px;'+
   ' overflow-x: hidden'+
'}'+
'@media screen and (min-device-height:320px) and (max-device-height :500px) and (orientation : landscape){ .chat_body{height : 170px }}'+
'@media only screen and (min-height:320px) and (max-height :500px) { .chat_body{height : 170px }}'+

'#msupport > .modal-dialog > .modal-content > .modal-body {padding: 0rem !important; padding-top :1em !important;}'+
'#msupport > .modal-dialog > .modal-content > .modal-body > .support-chat {padding: 0rem !important;}'+
'</style>');
$("#msupport .modal-dialog").removeClass("modal-dialog-scrollable")
    $("#notific").append('<span class="notificationblink"></span>')


}        




    function feedbackform()
         {
            var data = JSON.parse(readCookie("user_detail"));
            user_id = data.id;
            var method = "GET";
            var url = baseurl+"saveFeedback";
            var q1 = $("input[type='radio'][name='radio']:checked").attr("class");
            var q2 = $("input[type='radio'][name='radio2']:checked").attr("class");
            var q3 = $("input[type='radio'][name='radio3']:checked").attr("class");            var data = {q1:q1,q2:q2,q3:q3,user_id:user_id}
            ajaxcall(method,url,data).then((data) => {
     var data = data.data;
     console.log(data);
  })
  .catch((error) => {
    console.log(error)
  })
    return false;
         }
$(".logSubmit").on("click",function(){
feedbackform();
});

function getmessagesupport()
{
       var data = JSON.parse(readCookie("user_detail"));
        user_id = data.id;
        $.ajax({
        type: "GET",
        data : {"from" : "supportpanel"  , "to" :user_id },
        url: 'https://steponexp.net:8095/api/getmessagesupport',
        success: function(data) {
           var response = data.response;
           console.log(response);
           if(response.length>0)
           {
            $.each(response, function(key,value){
               value.date = convertdate(value.date);
                if(value.to == user_id)
                {
                    if(value.to.includes("support") === true)
                    {
                       username = "Support";
                    } else {
                        username = value.from.split("_");
                    username = username.slice(-1).pop()
                    }
                    
                    $('.chat_body').append('<div class="supp-msg" style="float:left">'+
                                        '<h5>Support</h5><p>' + value.message  + " </p> "+
                                        '<div class="chat-time">'+     
                                        '<div class="time">' + value.date +"</div></div>"+        
                                        '</div>'+    
                                "</div>");
                    
                }
                //else
                {
                $('.chat_body').append('<div class="user-msg" style="float:right">'+
                                        '<h5>You</h5><p>' + value.message  + " </p> "+
                                        '<div class="chat-time">'+
                                        '<div class="time">' + value.date +"</div></div>"+        
                                        '</div>'+    
                                "</div>");
                }
                $('.chat_body').get(0).scrollTop = $('.chat_body').get(0).scrollHeight;
            });
        
            setTimeout(function(){ 
             $('.chat_body').get(0).scrollTop = $('.chat_body').get(0).scrollHeight;
             }, 1000);
              
           }
        }
    });
}


    function savenotification(message,type)
         {
            var data = JSON.parse(readCookie("user_detail"));
            user_id = data.id;
            var method = "GET";
            var url = apiurl+"api/savenotification";
            // var message = message;
            // var type = type;
            var data = {message:message,user_id:user_id,type:type}
            ajaxcall(method,url,data).then((data) => {
     toastr.info(message);
  })
  .catch((error) => {
    console.log(error)
  })
    return false;
         }

         function savenotificationfrom(message,type,fromuser)
         {
            var data = JSON.parse(readCookie("user_detail"));
            user_id = data.id;
            var method = "GET";
            var url = apiurl+"api/savenotificationfrom";
            // var message = message;
            // var type = type;
            var data = {message:message,user_id:user_id,type:type,fromusers:fromuser}
            ajaxcall(method,url,data).then((data) => {
                console.log(data);
     toastr.info("You got a message " );
  })
  .catch((error) => {
    console.log(error)
  })
    return false;
         }

function logs(userid,Comment,Redirect)
{
var data = JSON.parse(readCookie("user_detail"));
user_id = data.id;
if(Comment == "Notification")
{
 Redirect = 5;   
}

  $.ajax({
        type: "GET",
        data : {"userid" : user_id,"Comment" : Comment,"page_id" : Redirect},
        url: baseurl+"logs",
        success: function(data) {
          console.log(data);
          console.log("logs");
        }
         });
}


  function savelivenotification(message,type)
  {
     savenotification(message,type);
     $(".notificationblink").addClass("blink");

  }
         function getnotification()
         {
            $(".notificationblink").removeClass("blink");
            var data = JSON.parse(readCookie("user_detail"));
            user_id = data.id;
            var method = "GET";
            var url = apiurl+"api/getnotification";
            var data = {user_id:user_id}
            ajaxcall(method,url,data).then((data) => {
    // toastr.info(message);
    data = data.data;
    var msg = "";
    $.each(data,function(key,value){
        console.log(value);
      var date = new Date(value.date_created + ' UTC');
     // console.log(d.toString());
// d.setHours(d.getHours() + 5);
// d.setMinutes(d.getMinutes() + 30);
       // var date = convertUTCDateToLocalDate(value.date_created);
        if(value.type=="1"){
           // var notificationtime = convertdate(value.date_created);
            
        msg += '<article class="notify-article ">'+
                            '<div class="not-msg " onclick="yearbooknoti()">'+
                                '<h5 class="not-heading">Yearbook</h5>'+
                                '<p>Please Download the 2020 Yearbook</p>'+
                            '</div>'+
                            '<div class="not-time">'+
                            '<p>'+ convertdate(date.toLocaleString())+'</p>'+
                            '</div>'+
                        '</article>';
                    }
         if(value.type=="2"){
            var notificationtime = convertdate(value.date_created);
        msg += '<article class="notify-article">'+
                            '<div class="not-msg">'+
                                '<h5 class="not-heading">Admin</h5>'+
                                '<p>'+value.message+'</p>'+
                            '</div>'+
                            '<div class="not-time">'+
                            '<p>'+convertdate(date.toLocaleString())+'</p>'+
                            '</div>'+
                        '</article>';
                    }
                    if(value.type=="3"){
            var notificationtime = convertdate(value.date_created);
        var username = value.username;
       // var datafun = value.user_id + ',"' + username + '"' ;
        var datafun = value.fromusers + "," +"'"+username+"'" ;  
        console.log(datafun);  
        msg += '<article class="notify-article">'+
                            '<div class="not-msg">'+
                                '<h5  onclick="openchatbox('+datafun+')" class="not-heading">You got a message from '+value.username+'</h5>'+
                               // '<p  onclick="openchatbox('+datafun+')" > '+value.message+'</p>'+
                            '</div>'+
                            '<div class="not-time">'+
                            '<p>'+convertdate(date.toLocaleString())+'</p>'+
                            '</div>'+
                        '</article>';
                    }           
    });
    $("#notificationModal>div>.modal-content>.modal-body").html(msg);
  })
  .catch((error) => {
    console.log(error)
  })
    return false;
         }

$("#notific").on("click",function(){
getnotification();
});

function openchatbox(user_id,username){
    createCookie("chat_id",user_id);
    createCookie("chat_username",username);
    window.location.href = "chatroom.html";
}



$(".save-btn").on("click",function(){
$("#photo").css("margin-top","700px");
                $(".imgvideoss1").css("visibility","hidden");
                $("#photo").removeClass("imgvideoss1");
                 $(".classphoto-screen").css("display","block");
                $(".classp-2").css("display","none");
                $(".classp-1").css("display","flex");
});


function modalpopup(){
    supporid = readCookie("supporid");
    if(supporid == "" ||supporid == null)
    {
     
    }
    else
    {
    $("#msupport").modal("show");  
     getmessagesupport(); 
    }
}


function countdownTimeStart(datadate){
var countDownDate = new Date(datadate).getTime();
// Update the count down every 1 second
    // Get todays date and time
    var now = new Date().getTime();
    
    // Find the distance between now an the count down date
    var distance = countDownDate - now;
    
    // Time calculations for days, hours, minutes and seconds
    var hours = Math.floor((distance % (1000 * 60 * 60 * 48)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    console.log("hours", hours);
    console.log("minutes", minutes);
    return hours + minutes + seconds;
}

function countdownTimeStartminutes(datadate){
var countDownDate = new Date(datadate).getTime();
// Update the count down every 1 second
    // Get todays date and time
    var now = new Date().getTime();
    
    // Find the distance between now an the count down date
    var distance = countDownDate - now;
    
    // Time calculations for days, hours, minutes and seconds
    var hours = Math.floor((distance % (1000 * 60 * 60 * 48)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    console.log("hours", hours);
    console.log("minutes", minutes);
    return  minutes;
}

function countdownTimeStarthours(datadate){
var countDownDate = new Date(datadate).getTime();
// Update the count down every 1 second
    // Get todays date and time
    var now = new Date().getTime();
    
    // Find the distance between now an the count down date
    var distance = countDownDate - now;
    
    // Time calculations for days, hours, minutes and seconds
    var hours = Math.floor((distance % (1000 * 60 * 60 * 48)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    console.log("hours", hours);
    console.log("minutes", minutes);
    return hours;
}


function currenttime()
{
    const
  date = new Date();
  hours = date.getHours(),
  isBetween = (hours >= 11) && (hours < 20),
  readableDate = date.toLocaleString();
console.log(`"${readableDate}" is between 11am and 8pm?: ${isBetween}`);

// Calculates minutes until 8pm
  const
    oneMinute = 60 * 1000, // JS times are measured in milliseconds
    eightPM = new Date();
  eightPM.setHours(18, 0, 0, 0); // Sets the new date object's time to 8pm
  const
    millisecsDuration = eightPM - date, // **Assumes it's before 8pm!
    minsDuration = parseInt(millisecsDuration / oneMinute);
  console.log(`Minutes until 8pm: ${minsDuration}`);
   if(window.location.href.indexOf("auditorium") > 11) // This doesn't work, any suggestions?
    {
        if(minsDuration < -31  && minsDuration > -33){
         clearInterval(timerd);
       window.location.reload();
     }
     else if(minsDuration<0 && minsDuration > -30) // This doesn't work, any suggestions?
    { 
      $(".menu2 > a").attr("disabled","disabled");
      $(".menu2 > a").off('click');
       $(".menu2 > a").addClass("disable-click");
      $("#yearbook").unbind("click");
      $("#notific").unbind("click");
      $(".ecertificate").unbind("click");
     }
     

    }
    else
    {
        if(minsDuration<0 && minsDuration > -30) // This doesn't work, any suggestions?
    {
           window.location.href = "/IHM/auditorium.html"
    }
    }
}

function currenttimenotinterval()
{
    const
  date = new Date();
  hours = date.getHours(),
  isBetween = (hours >= 11) && (hours < 20),
  readableDate = date.toLocaleString();
console.log(`"${readableDate}" is between 11am and 8pm?: ${isBetween}`);

// Calculates minutes until 8pm
  const
    oneMinute = 60 * 1000, // JS times are measured in milliseconds
    eightPM = new Date();
  eightPM.setHours(18, 0, 0, 0); // Sets the new date object's time to 8pm
  const
    millisecsDuration = eightPM - date, // **Assumes it's before 8pm!
    minsDuration = parseInt(millisecsDuration / oneMinute);
  console.log(`Minutes until 8pm: ${minsDuration}`);
   if(minsDuration<0 && minsDuration > -30) // This doesn't work, any suggestions?
    { 
      $(".menu2 > a").attr("disabled","disabled");
      $(".menu2 > a").off('click');
       $(".menu2 > a").addClass("disable-click");
      $("#yearbook").unbind("click");
      $("#notific").unbind("click");
      $(".ecertificate").unbind("click");
     }
     

    else
    {
        if(minsDuration<0 && minsDuration > -30) // This doesn't work, any suggestions?
    {
           window.location.href = "/IHM/auditorium.html"
    }
    }
}

function Searchtext() {
  var input = document.getElementById("search");
  var filter = input.value.toLowerCase();
  var nodes = document.getElementsByClassName('person');
  for (i = 0; i < nodes.length; i++) {
    if (nodes[i].innerText.toLowerCase().includes(filter)) {
      nodes[i].style.display = "block";
    } else {
      nodes[i].style.display = "none";
    }
  }
}



function addfooter()
{

    var datafooter = "";

   datafooter =  '<nav class="navbar navbar navbar-expand-sm  nav-bg downbar-wrapper fixed-bottom ">'+
                '<ul class="navbar-nav downbar">'+
                    '<li class="nav-item home menu2 dashboard">'+
                        '<a class="nav-link py-0 lobby-a" href="dashboard.html" onClick='+"'"+
                        'logs("","home","11")'+"'"+
                        '"><i class="bi-color" ><img src="./assets/icons/lobby.svg"></i>'+
                    'Lobby</a>'+
                    '</li>'+
                    '<li class="nav-item menu2 auditorium">'+
                        '<a class="nav-link py-0 audi-a" href="auditorium.html"  onClick='+"'"+
                        'logs("","auditorium","12")'+"'"+
                        '" ><i class="bi-color"><img src="./assets/icons/auditorim.svg" class="audi-img"></i> '+
                        'Auditorium</a>'+
                    '</li>'+
                    '<li class="nav-item menu2 slambook">'+
                        '<a class="nav-link py-0 slam-a" href="slambook.html" onClick='+"'"+
                        'logs("","slambook","13")'+"'"+
                        '" ><i class="bi-color"><img src="./assets/icons/slambook.svg"></i> '+
                    'Slambook</a>'+
                    '</li>'+
                    '<li class="nav-item menu2 chatroom">'+
                        '<a class="nav-link py-0 chat-a" href="chatroom.html" onClick='+"'"+
                        'logs("","chatroom","14")'+"'"+
                        '" ><i class="bi-color"><img src="./assets/icons/chatroom.svg"></i>'+
                    'Chat Room</a>'+
                    '</li>'+
                    '<li class="nav-item menu2 classphoto">'+
                        '<a class="nav-link py-0 p20-a" href="classphoto.html" onClick='+"'"+
                        'logs("","classphoto","15")'+"'"+
                        '" ><i class="bi-color"><img src="./assets/icons/ClassPhoto.svg" class="img2020"></i>'+
                    '2020 Photobooth</a>'+
                    '</li>'+
                    '<li class="nav-item menu2 memorylane">'+
                        '<a class="nav-link py-0 memory-a" onClick='+"'"+
                        'logs("","memorylane","16")'+"'"+
                        '" href="memorylane.html"><i class="bi-color"><img src="./assets/icons/Memorylane.svg"></i> '+
                    'Memory Lane <span class="blink"></span></a>'+
                    '</li>'+
                    '<li class="nav-item menu2 photobooth">'+
                        '<a class="nav-link py-0 photo-a" onclick='+"'"+
                        'logs("","photobooth","17");'+"'"+
                        '" href="photobooth.html"><i class="bi-color"><img src="./assets/icons/photobooth.svg"></i> '+
                    'Photo Booth <span class="blink"></span></a>'+
                    '</li>'+
                    '<li class="nav-item menu2 ambassador">'+
                        '<a class="nav-link py-0 alumni-a" onClick='+"'"+
                        'logs("","ambassadors","18")'+"'"+
                        '" href="ambassador.html"><i class="bi-color"><img src="./assets/icons/ambassadors.svg" class="alumni-img"></i>'+
                    'Ambassadors</a>'+
                    '</li>'+
                    '<li class="nav-item menu2 facultyLounge">'+
                        '<a class="nav-link py-0 break-a" onClick='+"'"+
                        'logs("","faculty lounge","19")'+"'"+
                        '" href="facultyLounge.html" ><i class="bi-color"><img src="./assets/icons/faculty_lounge.svg" class="breakout-img"></i>'+
                    'Faculty Lounge</a>'+
                    '</li>'+
                '</ul>'+
            '</nav>';

       $(".footer").html(datafooter) ; 
       var a = window.location.href
       a = a.split("/");
       a = a.slice(-1).pop()
       a = a.split(".");
       $(".menu2."+a[0]).addClass("active")   
}

//$("ecertificateclick").on()

function adddesktop()
{
    var datasidebar = "";

   datasidebar = '<nav class="navbar nav-bg sidebar-wrapper dsidebar-wrapper" id=" s-theme" onmouseover="mouseover(this)" onmouseout="mouseout(this)">'+
                '<ul class="navbar-nav sidebar menu-categories">'+
                    '<li class="nav-item list menu">'+
                       '<a class="nav-link" href="#"  id="fullScreen" onclick="'+
                       "toggleFullscreen(this); logs('','fullScreen','1')"+
                        '"><span class="submenu">FullScreen </span><i class="fas fa-expand i-color" id="icon2"></i></a>'+
                    '</li>'+
                    '<li class="nav-item list menu">'+
                        '<a class="nav-link ecertificate ecertificateclick" onClick='+'"'+
                        "logs('','Wall of Fame','2')"+"'"+
                        'href="#"  id="ecert"><span class="submenu">Wall of Fame </span><span><i class="i-color" id="icon3"><img src="./assets/icons/e-certifcate.svg"></i></span></a>'+          
                    '</li>'+
                    '<li class="nav-item list menu">'+
                        '<a class="nav-link yearbookclick" id="yearbook" onClick='+"'"+
                        "logs('','yearbook','3')"+"'"+
                        'href="#"><span class="submenu">Yearbook</span><i class="i-color" id="icon5"><img src="./assets/icons/yearbook.svg"></i></a>          '+
                    '</li>'+
                    '<li class="nav-item menu">'+
                        '<a class="nav-link" id="poll" onClick="'+"'"+
                        "logs('','Agenda','4')"+"'"+
                        'href="#"><span class="submenu">Agenda</span ><i class="i-color" id="icon7"><img src="./assets/icons/agenda.svg"></i></a>'+
                    '</li>'+
                    '<li class="nav-item menu notificationModalmenu">'+
                        '<a class="nav-link "  id="notific" href="#" onClick='+"'"+
                        "logs('','Notification','5')"+"'"+
                        '><span class="submenu">Notifications</span><i class="i-color" id="icon4"><img src="./assets/icons/notofication.svg"></i></a>'+
                    '</li>'+
                    '<li class="nav-item menu">'+
                        '<a class="nav-link supportclick" onClick='+"'"+
                        "logs('','Support','6')"+"'"+
                        'id="support" href="#"><span class="submenu">Support </span ><i class="i-color" id="icon6"><img src="./assets/icons/support.svg"></i></a>'+
                    '</li>                       '+
                    '<li class="nav-item list menu">'+
                        '<a class="nav-link" id="logOut" onClick='+"'"+
                        "logs('','logOut','7')"+"'"+
                         'href="#"><span class="submenu">LogOut </span><i class="far fa-times-circle fa-sm  i-color" id="icon1"></i></a>'+
                    '</li>'+
                '</ul>'+
            '</nav>';
            $(".desktop").html(datasidebar) ; 
}


function addmobile(){
    var datasidebar = "";

   datasidebar = '<nav class="navbar nav-bg sidebar-wrapper" id="s-theme"> '+
            '<ul class="navbar-nav sidebar menu-categories">'+
                '<div class="menutag">'+
                    '<h3>Menu</h3>'+
                    '<a href="#" class="menu-close"><i class="fas fa-times"></i></a>'+
                '</div>'+
                '<li class="nav-item list menu">'+
                    '<a class="nav-link ecertificate" href="#" onClick="'+
                    "logs('','wall of fame','111')"+
                    '"  id="ecert"><span class="submenu">Wall of Fame </span><span><i class="i-color" id="icon3"><img src="./assets/icons/e-certifcate.svg"></i></span></a>          '+
                '</li>'+
                '<li class="nav-item list menu">'+
                    '<a class="nav-link ebook" id="yearbook" onClick="'+
                    "logs('','yearbook','222')"+
                    '" href="#"><span class="submenu">Yearbook</span><i class="i-color" id="icon5"><img src="./assets/icons/yearbook.svg"></i></a>          '+
                '</li>'+
                '<li class="nav-item menu">'+
                    '<a class="nav-link iagenda" id="poll" onClick="'+
                    "logs('','Agenda','333')"+
                    '" href="#"><span class="submenu">Agenda</span ><i class="i-color" id="icon7"><img src="./assets/icons/agenda.svg"></i></a>'+
                '</li>'+
                '<li class="nav-item menu notificationModalmenu">'+
                    '<a class="nav-link inotify"  id="notific" onClick="'+
                    "logs('','Notification','444')"+
                    '" href="#" ><span class="submenu">Notifications</span><i class="i-color" id="icon4"><img src="./assets/icons/notofication.svg"></i></a>'+
                '</li>'+
                '<li class="nav-item menu">'+
                    '<a class="nav-link supportclick" id="support" onclick="'+
                    "logs('','support','555')"+
                     '" href="#"><span class="submenu">Support </span ><i class="i-color" id="icon6"><img src="./assets/icons/support.svg"></i></a>'+
                '</li>                       '+
                '<li class="nav-item list menu">'+
                    '<a class="nav-link ilog" id="logOut" onClick="'+
                    "logs('','logOut','666')"+
                    '" href="#"><span class="submenu">LogOut </span><i class="far fa-times-circle fa-sm  i-color" id="icon1"></i></a>'+
                '</li>'+
            '</ul>'+
        '</nav>';
         $(".mobile").html(datasidebar) ;
}


function yearbooknoti() {
             window.open('/uploads/Graduation_Yearbook_Class_of_2020.pdf', '_blank');
            }

$(".memoryp").on("click",function(e){
console.log(e);
$(".mp-i").attr("src",e.target.currentSrc)
$(".downloadp").attr("href",e.target.currentSrc)
$(".downloadp").attr("download","#FeelTheAura");
});



$("#fullScreen").on("click",function(e){
//console.log(e);
logs('','fullScreen','1');
});


$(".ecertificate").on("click",function(e){
//console.log(e);
logs('','wall of fame','2');
});

$("#yearbook").on("click",function(e){
//console.log(e);
logs('','yearbook','3');
});

$("#poll").on("click",function(e){
//console.log(e);
logs('','Proceedings','4');
});

$(".supportclick").on("click",function(e){
//console.log(e);
logs('','support','6');
});

$("#logOut").on("click",function(e){
//console.log(e);
logs('','logout','7');
});

 function noty(){
                            message= "We will Notify you later";
                            type = 1;
                            savenotification(message,type)
                            toastr.info(message);
                            $(".notificationblink").addClass("blink");
                        };
var notifying = setInterval( noty , 900000);

var timerd = setInterval(currenttime,58000);
currenttimenotinterval();
//createCookie("supporid", "", 1);
//deleteDetails();
appendfileupload();
addfooter();
//addmobile();
//adddesktop();
setTimeout(function(){ modalpopup(); }, 500);
$("#notificationModal>div>.modal-content>.modal-body").html("");
$("#agendaModal > .modal-dialog > .modal-content > .modal-header > .modal-title ").html("Proceedings");



  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-201251654-1');

  var element = $(window).width();
if(element<=767){
  $(".change").attr("src","./assets/img/Home/lfpi.png");
}


(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-278006967', 'auto');
ga('send', 'pageview');

// if(mobilecheck() === true){

// }