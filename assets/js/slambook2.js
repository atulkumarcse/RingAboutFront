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
    var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

    var offset = date.getTimezoneOffset() / 60;
    var hours = date.getHours();

    newDate.setHours(hours - offset);

    return newDate;   
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
    async function checkEntersupport(field, event,supportperson) {
    var theCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
    //notifym = 2;
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
        
            var msg = $('.chatsupport').val();
            demo.messageonetoone({ to: supportids, text: {userid :userid ,  msg : msg}, name : namedata  });
            // Show the message in the chatroom too
            // msg = msg.replace(new RegExp('<', 'g'), '&lt');
            // msg = msg.replace(new RegExp('>', 'g'), '&gt');
            // var dateString = getDateString();
            // $('#chatroom').append('<p>[' + dateString + '] <b>' + name + ':</b> ' + msg);
            // $('#chatroom').get(0).scrollTop = $('#chatroom').get(0).scrollHeight;
        var dateString = getDateString();
        {
            var from = "you";
            //toastr.info('You got a message')
            $('.chat_body').append('<div class="user-msg" style="float:left">'+
                                        '<h5>You</h5><p>' + msg  + " </p> "+
                                        '<div class="chat-time">'+         '<div class="time">' +  dateString +"</div></div>"+        
                                        '</div>'+    
                                "</div>");
            //$('.bubble-area').append('<p style="float:right">' + msg  + " : " +from   + ' - ' + dateString +"</p><br><br>");
           // $('.bubble-area').append('<p style="float:right; margin-top:5%">' + msg   + " : "+ from +" <br> "+ dateString+ "</p><br><br>"  );
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
        window.location.href = data.page;
     }

  })
  .catch((error) => {
    console.log(error)
  })
    return false;
         }

         function callwebrtc(roomids)
         {
          var data = JSON.parse(readCookie("user_detail"));
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
        if (!event.shiftKey) $('#mytextareaslam').submit();
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
    var url = baseurl + "logout";
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
                 $(".classphoto-screen").css("display","block");
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
    $("#photo").css("margin-top","0px");
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
             window.open('/uploads/Graduation_Yearbook_Class_of_2020.pdf', '_blank');
            });
    $(".year-remind").click(function (e) {
            message= "We will Notify you later";
            type = 1;
             savenotification(message,type)
             $("#myearbook").modal("hide");
            });

    $("button.close.text-light").click(function (e) {
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
   
   $("#poll").html('<span class="submenu" style="display: none; width: 90px; float: left;">Proceedings</span><i class="i-color" id="icon7"><img src="./assets/icons/agenda.svg"></i>') 
    $("body").append(  '<form method="post" id="fileinfo" name="fileinfo" action="/upload1.php"  onsubmit="return false;" enctype="multipart/form-data">'+
                      '<input type="file" onchange="readURL(this);" name="imagefile" id="imagefile" style="display: none"  >'+
    '</form><div class="backloader" style="display:none ; width:100% ; height:100%; background-color:white;"><div style="display:none" class="loader"></div></div><style type="text/css">'+
    //'.msg-slam{font-size:15px !importrant}'+
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
'#msupport > .modal-dialog > .modal-content > .modal-body {padding: 0rem !important;}'+
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
        data : {"from" : user_id  , "to" :"supportpanel" },
        url: 'https://steponexp.net:8095/api/getmessage',
        success: function(data) {
           var response = data.response;
           console.log(response);
           if(response.length>0)
           {
            $.each(response, function(key,value){
               value.date = convertdate(value.date);
                if(value.to == user_id)
                {
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
            });
        if($('.chat_body').get(0) !== undefined)
        {
         $('.chat_body').get(0).scrollTop = $('.chat_body').get(0).scrollHeight;    
        }
              $('.chat_body').get(0).scrollTop = $('.chat_body').get(0).scrollHeight;
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
     toastr.info(message);
  })
  .catch((error) => {
    console.log(error)
  })
    return false;
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
        var date = convertUTCDateToLocalDate(new Date(value.date_created));
        if(value.type=="1"){
           // var notificationtime = convertdate(value.date_created);
            
        msg += '<article class="notify-article">'+
                            '<div class="not-msg">'+
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
                                '<p  onclick="openchatbox('+datafun+')" > '+value.message+'</p>'+
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
  eightPM.setHours(15, 30, 0, 0); // Sets the new date object's time to 8pm
  const
    millisecsDuration = eightPM - date, // **Assumes it's before 8pm!
    minsDuration = parseInt(millisecsDuration / oneMinute);
  console.log(`Minutes until 8pm: ${minsDuration}`);
   if(window.location.href.indexOf("auditorium") > 11) // This doesn't work, any suggestions?
    {
     if(minsDuration<0 && minsDuration > -10) // This doesn't work, any suggestions?
    { 
      $(".menu2 > a").attr("href","#");
      $("#yearbook").unbind("click");
      $("#notific").unbind("click");
      $(".ecertificate").unbind("click");
     }
    }
    else
    {
        if(minsDuration<0 && minsDuration > -10) // This doesn't work, any suggestions?
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

$(".memoryp").on("click",function(e){
console.log(e);
$(".mp-i").attr("src",e.target.currentSrc)
$(".downloadp").attr("href",e.target.currentSrc)
$(".downloadp").attr("download","#FeelTheAura");
});
var timerd = setInterval(currenttime,1000);

//createCookie("supporid", "", 1);
//deleteDetails();
appendfileupload();
setTimeout(function(){ modalpopup(); }, 500);
$("#notificationModal>div>.modal-content>.modal-body").html("");