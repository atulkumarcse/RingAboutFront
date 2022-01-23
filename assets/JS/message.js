/*
 * Author:    Lorenzo Miniero
 * Copyright: Meetecho
 *
 */
var streamsharing = null ;
var arrayuuid = [];
var publishvideoid = 1;
var subscribedemo = null;
var videoid = 1;
var arrayuuidsss = [];
var useridforsupport = null;
var iceServers = null;
var currentid = null;
var nameidformessage = null;
var demo = supportpanel = null;
var screensub = null;
var screenstream = null;
var notifym = 1;
var subscribername = "";
//var subscribercompany = "";
var timeout = 10;
var namestu = null, namevalue = null, examstu = null, proctorstu = null;
var joinsubstu = 1;
var joinsubstus = 1;
var userid = null;
var coonect1stu =1;
var webcamblock = null;
var infosstu = null;
var demoscreen = null;
feedstu = "1123";
var cts = null;
var roomid = null;
var roomiddata  = null;
var count = 1;
var demo = null ;
var hash = null;
var typestreamstu = null;
var names = [];
var idforstu  = null;
var user_name = null;
var userdetails = "";
function startwindow(){
	setTimeout(async function() {
	userdetails =  await getCookie("userdetails");
	userdetails = JSON.parse(userdetails); 	
	getCookie("roomid").then(function(result){	
          roomiddata = roomid  = result;
          })
    getCookie("hash").then(function(result){	
           hash  = result;
          })
    user_name =  userdetails.name;    	
	getCookie("type").then(function(result){
	// 	if(result == "teacher")
	// {
	$(".share_screen").css("display", "block");
	// }	
	console.log(result);
    setTimeout(function() { 
    startvideo("webcam",result,user_name);
} , 500);
	})
      


	}, 2000);
	
    
}

async function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

async function publishvideo(roomid,nameid,type,user_type,name) {
	arrayuuidsss.push(nameid);
	publish = 1;
	arrayuuid.push(nameid);
	currentid = nameid;
    idforstu  =  userid = namevalue =	namestu  = nameid;
   userlist("RingAbout")
    this.namedata = name;
	roomid = roomid;
	supportpanel = demo = new coms();
	//typestreamstu = createtype;
	demo.on("error", function(error) {
		// Something went wrong?
		console.log(error);
	});
	demo.on("connected", function(info) {
		console.log("Connected to the server");
		 var chat_id = (readCookie("chat_id"));
         var chat_username = (readCookie("chat_username"));
         if(chat_id)
         {
            setname(chat_id,chat_username);
            createCookie("chat_id","");
            createCookie("chat_username","");
         }
         $(".loader").css("display","none");
                //$(".loader").css("z-index","1234567565665");
                $(".backloader").css("display","none");
		
		 sendusers("RingAbout",nameid);
        //logs(nameid ,"serverconnect","");
		//publish(type,roomid)
	});
	demo.on("sendToggle", function(info) {
		if(info.details.status===false)
		{
			if(info.details.event=="video" || info.details.event=="webcam")
			{
			$(".vid"+info.from).css("color","red");	
			}
			else{
				$(".mic"+info.from).css("color","red");
			}
			
			//createNotification("stepone",info.otherdetails[0].name + " is not sharing " + info.details.event,"")
		}
		else
		{
			if(info.details.event=="video" || info.details.event=="webcam")
			{
			$(".vid"+info.from).css("color","gray");	
			}
			else{
				$(".mic"+info.from).css("color","gray");
			}
			//createNotification("stepone",info.otherdetails[0].name + " is now sharing " + info.details.event,"")
		}
		
		console.log("sendToggle",info);
	});
	demo.on("consent", function(on) {
		
		console.log("Consent dialog should be " + (on ? "on" : "off") + " now");
	});
    
    demo.on("sendmessages", function(info) {
		if(info.text==="sendmsgall")
		{
			getmsg();
		}
		else{
			savelivenotification(info.text,2);
		}
		//toastr(info.message);
		
	});

	
	demo.on("preview", function(type, stream) {
		// Local stream available/unavailable
		videoid="2";
		console.log("Local " + type + " preview available:", stream);
		if(stream === null || stream === undefined) {
			$('#video' + type).empty();
			return;
		}
		if(type == "webcam")
		{
		if($('#' + type + 'video').length === 0 )
		{
       
		console.log(this.namedata);
		// <div class="title-name" >'+this.namedata+' </div>
		$('.webcamvideo').append('<div  class="videodiv" >   <video id="' + type + 'video" class="videocol" height="auto" width="100%" autoplay muted="muted" /></div><canvas id="canvasfd" style="visibility:hidden; position: absolute; left: 0; top: 0" height="100%" width="100%" autoplay muted></canvas>');
		//$('#joinwebcam').append('<div>'+'<div id="'+namevalue+'"><video id="' + namevalue + type + 'joins" class="videocol '+namevalue+' " width="100%" height="auto" autoplay muted="muted"  /><div class="ex_name"><p style="float:left;padding-left:12">'+namedata+'</p> <i class="fa fa-thumb-tack  '+namevalue+'pin" style="cursor: pointer;" aria-hidden="true" onclick="return pincheck(this , '+namevalue+');" ></i> &nbsp <i class="fas fa-video vid'+namevalue+' "></i> &nbsp <i class="fas fa-microphone mic'+namevalue+'"></i></div></div></div>');
		$('#' + type + 'video').get(0).muted = "muted";
	    }
	 //    else if($('#' + type + 'video').length === 0)
	 //    {
	    	
	 //    	$('.joinwebcamsupport').append('<div  style="width:50%; float:left" class="videodiv" ><video id="' + type + 'video" class="videocol" height="auto" width="100%" autoplay muted="muted" /></div><canvas id="canvasfd" style="visibility:hidden; position: absolute; left: 0; top: 0" height="100%" width="100%" autoplay muted></canvas>');
		// //$('#joinwebcam').append('<div>'+'<div id="'+namevalue+'"><video id="' + namevalue + type + 'joins" class="videocol '+namevalue+' " width="100%" height="auto" autoplay muted="muted"  /><div class="ex_name"><p style="float:left;padding-left:12">'+namedata+'</p> <i class="fa fa-thumb-tack  '+namevalue+'pin" style="cursor: pointer;" aria-hidden="true" onclick="return pincheck(this , '+namevalue+');" ></i> &nbsp <i class="fas fa-video vid'+namevalue+' "></i> &nbsp <i class="fas fa-microphone mic'+namevalue+'"></i></div></div></div>');
		// $('#' + type + 'video').get(0).muted = "muted";
		// $('#chatModal').modal();
	 //    }
		coms.attachMediaStream($('#' + type + 'video').get(0), stream);
		
		}

	});
	demo.on("webrtc", function(info) {
		console.log(info);
		if(info.status == "up"  && publishvideoid === 1)
		{  
			
			
		livecalling++;
		  logs("" ,"startnetworkingcall-to-"+nameid,33);
		       publishvideoid = publishvideoid + 1;
               $(".loading").css("display","none");
                sendStudentss("RingAbout",nameid);
           
			
		}
		if(info.status == "down")
        {
            //logs( "","webrtcdown","");
        	console.log(info);
        	//$("#"+info.uuid).html();
        	//$("."+info.uuid).remove();
        	$(".userlist"+info.uuid).remove();
        	if(info.stream == "webcam")
        	{
        		livecalling = 1;
        		logs("" ,"endnetworkingcall-to-"+nameid,33);
        		window.location.replace(window.location.href + "?code=reload")
        		//window.location.href="/";
        		location.reload();
        	}
        	if(nameidformessage == info.uuid && videoid == "2")
        	{
        		window.location.reload();
        	}
        	if(info.stream == "screen")
        	{
        	screensub = 0;
        	maincheck(userid); //info.uuid
        	var attruuid = $("#webcamvideo").attr("uuid");
		if(attruuid == info.uuid)
		{
			//$("#webcamvideo").get(0).srcObject = streamdata ;
		}
        	var indexs = arrayuuid.indexOf(parseInt(info.uuid));
            if (indexs > -1) {
            arrayuuid.splice(indexs, 1);
            //createNotification("stepone",info.otherinfo.username + " is left","")
           }

           var indexs = arrayuuidsss.indexOf(parseInt(info.uuid));
            if (indexs > -1) {
            arrayuuidsss.splice(indexs, 1);
            //createNotification("stepone",info.otherinfo.username + " is left","")
           }


        	} 
        	
        }
		console.log("The " + info.stream + " WebRTC connection is now " + info.status);
	});

	demo.on("leave", function(info) {
		//logs("" ,"leave","info.uuid");
		var attruuid = $("#webcamvideo").attr("uuid");
		if(nameidformessage == info.uuid)
		{
			$(".joinvideowebcam").html("");
			$(".webcamvideo").html("");

			//$("#webcamvideo").get(0).srcObject = streamdata ;
		}
		console.log(info);
       //createNotification("stepone",info.details.name + " is joined","")
        $("#"+info.uuid).html("");
        //window.location.href="/liveassessment";
		// document.getElementById(info.from+"webcamjoins").style.display = "none";
		// //document.getElementById(info.from+"name").style.display = "none";
		// document.getElementById(info.from+"webcamjoins").nextSibling.style.display = "none"
        var indexs = arrayuuid.indexOf(parseInt(info.uuid));
            if (indexs > -1) {
            arrayuuid.splice(indexs, 1);
            $("#webcamvideo").attr("uuid");
            //createNotification("stepone",info.otherinfo.username + " is left","")
         }
          var indexs = arrayuuidsss.indexOf(parseInt(info.uuid));
            if (indexs > -1) {
            arrayuuidsss.splice(indexs, 1);
            //createNotification("stepone",info.otherinfo.username + " is left","")
           }
		console.log("leave");
		if(info.stream == "screen")
        	{
        	screensub = 0;
        	maincheck(userid);
        	} 
		
	});

	demo.on("sendstatustudentjs", function(info) {
		console.log("info sendstatustudent api response :", info);
		//createNotification("stepone",info.details.name + " is joined","")
		// if(info.text == idforstu)
		 {
		 	infos = info;
			//console.log("subscribe webcam : ", joinsubstu);
            if(info.details.janus.screen === true)
            {   
            	screensub = 1;
            	console.log(infos);

            	subscribevideo(info.details.roomid,Math.floor(Math.random()*100000),"screen",info.from,info.details.proctor,info.details.name)
			
            }
            else if(info.details.janus.webcam === true)
            {
            	//if(webcamblock!=info.from)
            	{
            subscribername = info.details;		
            subscribevideo(info.details.roomid,Math.floor(Math.random()*100000),"webcam",info.from,info.details.proctor,info.details.name)
				}
            }
			//startStudentVideo(examstu,namestu)
			//startStudentVideo("webcam", );
			//subscribe("webcam",info);
			 joinsubstus++;
		  }
		
		
	});
   
   demo.on("sendstatustudent", function(info) {
		console.log("sendstatustudent :", info);
           value = info.details;
			var arrays = value.name.split(",")
			value.std_id = value.uuid;
           	var datafun = value.std_id + "," +'"'+arrays[0].toString()+'"' ;
           	if ($(".userlist"+value.std_id).length === 0)
           {
           	if(value.name.indexOf("support") == -1 && value.uuid.indexOf("support") == -1 && value.std_id != userid && value.std_id != "supportpanel")
           	{
           	console.log(datafun);

           	// +", ID:"+value.std_id
           	// $('#joinwebcam').append('<div class="userlist'+value.std_id+' "><div class="person chat-active '+value.std_id+' " data-chat="person1">'+
            //   '<div class="user-info" '+
            //    "onclick='setname("+datafun+")'>"+ 
            //     '<div class="f-body">'+
            //                         '<div class="meta-info">'+
            //                             '<span class="user-name"  data-name="'+arrays[0]+'">'+arrays[0] +'</span>'+
            //                             '<span class="user-meta-status">'+
            //                             '<div class="circle c-1"></div></span>'+
            //                         '</div>'+
            //                          '<span class="preview"><p>'+arrays[1]+'</p></span><div class="removeb circlered'+value.std_id+'">'+
            //                      '</div>'+
            //   '</div>'+
            // '</div></div>');

            $('#joinwebcam').append('<div class="userlist'+value.std_id+' listuser">'+
           		'<div class="person chat-active '+value.std_id+'" data-chat="person1"'+
                 "onclick='setname("+datafun+")'"+
           		'>'+
							'<div class="user-info">'+
                                '<div class="meta-initial">'+
                                    '<div class="user-initial">'+
                                        '<h2>'+arrays[0].charAt(0)+'</h2>'+
                                    '</div>'+
                                '</div>'+
								'<div class="f-body">'+
                                    '<div class="meta-info">'+
                                        '<span '+
                                       
                                         'class="user-name" data-name="'+arrays[0]+'">'+arrays[0]+'</span>'+
                                        '<span class="user-meta-status">'+
                                            //'<div class="circle c-1"></div>'+
                                            '<div class="circle c-2 removeb circlered'+value.std_id+'"></div>'+
                                        '</span>'+
                                    '</div>'+
                                    '<span class="preview"><p></p></span>'+
                                 '</div>'+
							'</div>'+
						'</div>'+
						'</div>');
           }
           }		
	});
    

	demo.on("sendstatusmanager", function(info) {
		console.log("sendstatusmanager :", info);		
	});
    

    demo.on("sendbackstatus", function(info) {
		console.log("info sendbackstatus details:", info);
		 // // if(joinsubstu === 1)
		 // // {
		 // 	infos = info;
			// //console.log("subscribe webcam : ", joinsubstu);
			// subscribevideo(infos.text,Math.floor(Math.random()*100000),"webcam",info.from,info.details.proctor,info.details.name)
			// //startStudentVideo(examstu,namestu)
			// //startStudentVideo("webcam", );
			// //subscribe("webcam",info);
			infos = info;
			//console.log("subscribe webcam : ", joinsubstu);
            if(info.details.janus.screen === true)
            {   
            	console.log(infos);
            	subscribevideo(info.details.roomid,Math.floor(Math.random()*100000),"screen",info.from,info.details.proctor,info.details.name)
			
            }
            else if(info.details.janus.webcam === true)
            {
            	if(webcamblock!=info.from)
            	{
            subscribevideo(info.details.roomid,Math.floor(Math.random()*100000),"webcam",info.from,info.details.proctor,info.details.name)
				}
            }
			 joinsubstu++;
		 // }
		
		
	});

	
	demo.on("message", function(info) {
		if(notifym === 1)
		{
			//createNotification("stepone","You got a message","")
		}
		var useridn = info.text.userid;
        var htmldataforuser = $(".userlist"+useridn).html();
		$(".userlist"+useridn).remove();
        $('#joinwebcam').prepend('<div class="userlist'+useridn+' ">' + htmldataforuser + 
        	'</div>');
		// We got a chat message, show the chatroom
		$('#chatbox').removeClass('hide').show();
		$('#chatsend').removeAttr('disabled');
		// Only the proctor can send us messages
		proctorstu = info.from;
		var from = info.name;
		
		// Show the message
		var msg = info.text.msg;
		// msg = msg.replace(new RegExp('<', 'g'), '&lt');
		// msg = msg.replace(new RegExp('>', 'g'), '&gt');
		var dateString = getDateString();
		if(useridn == userid)
		{
			$('#'+info.text.userid).append('<p >' + from  + ' : ' + msg  + " - " +  dateString +"</p>");
		}
		else
		{
			//toastr.info('You got a message')
			$('#'+info.text.userid).append('<p style="float:right">'+ from  + ' : ' + msg  + " - " +  dateString +"</p>");
		}
		notifym  = 1;
		//elem.scrollTop = elem.scrollHeight;
		$('.bubble-area').get(0).scrollTop = $('.bubble-area').get(0).scrollHeight;
	});

	demo.on("messageonetoone", function(info) {
		if(notifym === 1)
		{
			//createNotification("stepone","You got a message","")
		}
		
		var useridn = info.text.userid;
        var htmldataforuser = $(".userlist"+useridn).html();
		$(".userlist"+useridn).remove();
        $('#joinwebcam').prepend('<div class="userlist'+useridn+' ">' + htmldataforuser + 
        	'</div>');
		// We got a chat message, show the chatroom
		$('#chatbox').removeClass('hide').show();
		$('#chatsend').removeAttr('disabled');
		// Only the proctor can send us messages
		proctorstu = info.from;
		var from = info.name;
		var useridn = info.text.userid;
          
		// Show the message
		var msg = info.text.msg;
		//toastr.info("you got a message from "+ from);
		// msg = msg.replace(new RegExp('<', 'g'), '&lt');
		// msg = msg.replace(new RegExp('>', 'g'), '&gt');
		var dateString = getDateString();
		if(info.text.userid.includes("support") === true ){
			supportids = useridn;
			username = info.text.userid;
			username = username.split("_");
			username = username[username.length-1]
			// if($('.bubble-areasupport'+info.text.userid).html() == undefined)
			// {
   //           $('.bubble-areasupport').append('<div class="bubble-areasupport'+info.text.userid+'" style="height:200px;overflow-x:auto;"><p>User ID: '+info.text.userid+'</p></div>'+
   //           	'<input type="text" style="width: 98% !important;"'+
   //           	 'onkeypress="return checkEnterssss(this, event , "support",'+info.text.userid+');" placeholder="Write your message..." class="form-control chat_form chatboxsupport pl-2 my-0"/>')
			// }
          //$('.bubble-areasupport'+info.text.userid).append('<div><div class="chats you">'+
          $('.chat_body').append('<div class=" supp-msg"><h5>'+username+'</h5><p>' + msg  + "</p>"+
		      					 		'<div class="chat-time">'+
                                        		'<div class="time"><p class="time">' +  dateString +"</p></div></div>"+
                                		'</div>'
		      					 );
			$('.chat_body').get(0).scrollTop = $('.chat_body').get(0).scrollHeight;
		} else if (info.text.userid == "support" && proctorstu == "support" ) // if(proctorstu == "support")
		{
			supportids = useridn;
			$('.bubble-areasupport').append('<div class="chats you">'+
		      						'<div class="chat-content">'+
		      							'<div class="message-content y-msg">' + msg  + " </div> "+
		      					 		'<div class="chat-time">'+
                                    		'<div>'+
                                        		'<div class="time">' +  dateString +"</div>"+
                                    		'</div>'+
                                		'</div>'+
                            		'</div>'+    
		      					"</div>");
			$('.bubble-areasupport').get(0).scrollTop = $('.bubble-areasupport').get(0).scrollHeight;
		} else {
			pageurl = window.location.href.toString();

			if(pageurl.includes("chatroom") === false )
			{
              //toastr.info(msg);
              savenotificationfrom(msg,"3",info.text.userid);
            $(".notificationblink").addClass("blink");
			}
			//$(".circlered"+info.text.userid).css("background-color","red");
			$(".circlered"+info.text.userid).addClass("blink")
			$('#'+info.text.userid).append('<div class="chats you">'+
		      						'<div class="chat-content">'+
		      							'<div class="message-content y-msg"><p>' + msg  + "</p> "+
		      					 		'<div class="chat-time">'+
                                    		'<div>'+
                                        		'<div class="time"><p class="time">' +  dateString +"</p></div></div> "+
                                    		'</div>'+
                                		'</div>'+
                            		'</div>'+    
		      					"</div>");
		}
		// {
		// 	//toastr.info('You got a message')
		// 	$('.bubble-area').append('<p style="float:right">'  + from + ' :   ' + msg  + " - " +  dateString +"</p>");
		// }
		notifym  = 1;
		if($('.bubble-area').get(0) !== undefined)
		{
		 $('.bubble-area').get(0).scrollTop = $('.bubble-area').get(0).scrollHeight;	
		}
		
		//$('.bubble-area').get(0).scrollTop = $('.bubble-area').get(0).scrollHeight;
	});



	demo.on("messageallsupport", function(info) {

		if(notifym === 1)
		{
			//createNotification("stepone","You got a message","")
		}
		
		var useridn = info.text.userid;
        var htmldataforuser = $(".userlist"+useridn).html();
		$(".userlist"+useridn).remove();
        $('#joinwebcam').prepend('<div class="userlist'+useridn+' ">' + htmldataforuser + 
        	'</div>');
		// We got a chat message, show the chatroom
		$('#chatbox').removeClass('hide').show();
		$('#chatsend').removeAttr('disabled');
		// Only the proctor can send us messages
		proctorstu = info.from;
		var from = info.name;
		var useridn = info.text.userid;
		// Show the message
		var msg = info.text.msg;
		// msg = msg.replace(new RegExp('<', 'g'), '&lt');
		// msg = msg.replace(new RegExp('>', 'g'), '&gt');
		var dateString = getDateString();
		if(info.text.userid.includes("support") === true ){
			// if($('.bubble-areasupport'+info.text.userid).html() == undefined)
			// {
   //           $('.bubble-areasupport').append('<div class="bubble-areasupport'+info.text.userid+'" style="height:200px;overflow-x:auto;"><p>User ID: '+info.text.userid+'</p></div>'+
   //           	'<input type="text" style="width: 98% !important;"'+
   //           	 'onkeypress="return checkEnterssss(this, event , "support",'+info.text.userid+');" placeholder="Write your message..." class="form-control chat_form chatboxsupport pl-2 my-0"/>')
			// }
          //$('.bubble-areasupport'+info.text.userid).append('<div><div class="chats you">'+
          $('.bubble-areasupport').append('<div><div class="chats you">'+
		      						'<div class="chat-content">'+
		      							'<div class="message-content y-msg">' + msg  + " </div> "+
		      					 		'<div class="chat-time">'+
                                    		'<div>'+
                                        		'<div class="time">' +  dateString +"</div>"+
                                    		'</div>'+
                                		'</div>'+
                            		'</div>'+    
		      					"</div></div>"
		      					 );
			$('.bubble-areasupport').get(0).scrollTop = $('.bubble-areasupport').get(0).scrollHeight;
		} else if (info.text.userid == "support" && proctorstu == "support" ) // if(proctorstu == "support")
		{
			$('.bubble-areasupport').append('<div class="chats you">'+
		      						'<div class="chat-content">'+
		      							'<div class="message-content y-msg">' + msg  + " </div> "+
		      					 		'<div class="chat-time">'+
                                    		'<div>'+
                                        		'<div class="time">' +  dateString +"</div>"+
                                    		'</div>'+
                                		'</div>'+
                            		'</div>'+    
		      					"</div>");
			$('.bubble-areasupport').get(0).scrollTop = $('.bubble-areasupport').get(0).scrollHeight;
		} else {
			//$(".circlered"+info.text.userid).css("background-color","red");
			$(".circlered"+info.text.userid).addClass("blink")
			$('#'+info.text.userid).append('<div class="chats you">'+
		      						'<div class="chat-content">'+
		      							'<div class="message-content y-msg">' + msg  + " </div> "+
		      					 		'<div class="chat-time">'+
                                    		'<div>'+
                                        		'<div class="time">' +  dateString +"</div>"+
                                    		'</div>'+
                                		'</div>'+
                            		'</div>'+    
		      					"</div>");
		}
		// {
		// 	//toastr.info('You got a message')
		// 	$('.bubble-area').append('<p style="float:right">'  + from + ' :   ' + msg  + " - " +  dateString +"</p>");
		// }
		notifym  = 1;
		if($('.bubble-area').get(0) !== undefined)
		{
		 $('.bubble-area').get(0).scrollTop = $('.bubble-area').get(0).scrollHeight;	
		}
		
		//$('.bubble-area').get(0).scrollTop = $('.bubble-area').get(0).scrollHeight;
	});

	
	demo.on("disconnected", function() {
		// Lost connection to server
		//logs("" ,"disconnected","");
		//startwindow();
		console.log("Disconnected from the server");
	});

      var detailssstu = { proctor: user_type, uuid: namestu , roomid: roomid,name : name , hash:hash };
	
		demo.connect(detailssstu);
	
	
};


async function publishscreen(roomid,nameid,type,user_type,name) {
	arrayuuid.push(nameid);
	if(screensub == 1 )
    {
    	toastr.info('Screen Already publish');
    	return;
    }
    namevalue =	namestu  = nameid;

    this.namedata = name;
	roomid = roomid;
	demoscreen = new coms();
	//typestreamstu = createtype;
	demoscreen.on("error", function(error) {
		// Something went wrong?
		console.log(error);
	});
	demoscreen.on("connected", function(info) {
		console.log("Connected to the server");
		publish(type,roomid)
	});
	demoscreen.on("consent", function(on) {
		
		console.log("Consent dialog should be " + (on ? "on" : "off") + " now");
	});
	demoscreen.on("preview", function(type, stream) {
		// Local stream available/unavailable
		console.log("Local " + type + " preview available:", stream);
		if(stream === null || stream === undefined) {
			$('#video' + type).empty();
			return;
		}
		//if(type == "webcam")
		{
		if($('#' + namevalue + type + 'joins').length === 0 && namevalue != "support")
		{
		//console.log(this.namedata);
		
		$('#joinwebcam').append('<div style="width:50%; float:left">'+'<div id="'+namevalue+'"><video id="' + namevalue + type + 'joins" class="videocol '+namevalue+' " width="100%" height="auto" autoplay muted="muted"  /><div class="ex_name"><p style="float:left;padding-left:12">'+namedata+'</p> <i class="fa fa-thumb-tack  '+namevalue+'pin" style="cursor: pointer;" aria-hidden="true" onclick="return pincheck(this , '+namevalue+');" ></i></div></div></div>');
		//$('#' + type + 'video').get(0).muted = "muted";
	    }
	    else
	    {
	    $('#joinwebcamsupport').append('<div style="width:50%; float:left">'+'<div id="'+namevalue+'"><video id="' + namevalue + type + 'joins" class="videocol '+namevalue+' " width="100%" height="auto" autoplay muted="muted"  /><div class="ex_name"><p style="float:left;padding-left:12">'+namedata+'</p> <i class="fa fa-thumb-tack  '+namevalue+'pin" style="cursor: pointer;" aria-hidden="true" onclick="return pincheck(this , '+namevalue+');" ></i></div></div></div>');
		
	    }
	    
		
		coms.attachMediaStream($('#' + namevalue + type + 'joins').get(0), stream);
		}

	});
	demoscreen.on("webrtc", function(info) {
		if(info.status == "up" && publishvideoid === 1)
		{
            
               // sendScreen(roomid,nameid);
                sendStudentss("RingAbout",nameid);
			
		}
		if(info.status == "down")
        {
        	//$("#"+info.uuid).html("");
        	$(".userlist"+info.uuid).remove();
        	//$(".userlist"+info.uuid).remove();
        	// if(info.stream == "webcam")
        	// {
        	// 	window.location.href="/liveassessment";
        	// }
        	
        }
		console.log("The " + info.stream + " WebRTC connection is now " + info.status);
	});

	demoscreen.on("leave", function(info) {
       
        //window.location.href="/liveassessment";
		// document.getElementById(info.from+"webcamjoins").style.display = "none";
		// //document.getElementById(info.from+"name").style.display = "none";
		// document.getElementById(info.from+"webcamjoins").nextSibling.style.display = "none"

		console.log("leave");
		
	});

	demoscreen.on("sendstatustudentjs", function(info) {
		console.log("info sendstatustudent api response :", info);
		 // if(joinsubstu === 1)
		 // {
	});

	demoscreen.on("sendstatusmanager", function(info) {
		console.log("sendstatusmanager :", info);		
	});
    

    demoscreen.on("sendbackstatus", function(info) {
		console.log("info sendbackstatus details:", info);
		
	});

	
	demoscreen.on("message", function(info) {
	});
	demoscreen.on("disconnected", function() {
		// Lost connection to server
		console.log("Disconnected from the server");
	});

      var detailssstu = { proctor: user_type, uuid: namestu , roomid: roomid,name : name , hash:hash };
	
		demoscreen.connect(detailssstu);
	
	
};


async function sendStudentss(roomid,nameid) {
			demo.sendstatustudentforone({ to: nameidformessage, text: String(roomid) , from: nameid}); //from: nameid
			//demo.sendstatustudent({ to: nameidformessage, text: String(roomid) , from: nameid}); //from: nameid

			//demo.sendbackstatus({ to: nameid, text: String(roomid) , from: nameid});
}

async function sendusers(roomid,nameid) {
			//demo.sendstatustudentforone({ to: nameidformessage, text: String(roomid) , from: nameid}); //from: nameid
			demo.sendstatustudent({ to: nameidformessage, text: String(roomid) , from: nameid}); //from: nameid

			//demo.sendbackstatus({ to: nameid, text: String(roomid) , from: nameid});
}

async function sendScreen(roomid,nameid) {
			demoscreen.sendStudent({ to: nameid, text: String(roomid) , from: nameid});
			//demo.sendbackstatus({ to: nameid, text: String(roomid) , from: nameid});
}

async function sendback(roomid,nameid) {
			//demo.sendStudent({ to: nameid, text: String(roomid) , from: nameid});
			demo.sendbackstatus({ to: nameid, text: String(roomid) , from: nameid});
}

async function subscribevideo(roomid,nameid,type,feed,user_type,name) {
    arrayuuid.push(nameid);
    $(".namevalues").html(name);
	if(webcamblock==feed)
            	{
            		$("#webcamblock").css("display","none");
                      return;
            	}
    this.feed = feed;
	this.namedatsa = name;
	this.nameid = nameid;
	//names[nameuser] = name;
	var that = this;
	console.log("name",this.namedatsa);
	namestu  = nameid;
	roomid = roomid;
    var nameuser = feed;
    names[nameuser] = name;
    var feedvalue = "";
	
	if(user_type=="manager")
	{
	   mangersubscribe(roomid,Math.floor(Math.random()*10000).toString(),type,"manager");
       feedvalue = feed;
	}
	var detailssstu = { proctor: "subscribevideo", uuid: nameid , roomid: roomid , feed :feed , type : type ,name:this.namedatsa  };
	//console.log(detailssstu);
	let subscribedemo = new coms();
	//typestreamstu = createtype;
	subscribedemo.on("error", function(error) {
		// Something went wrong?
		console.log(error);
	});
	subscribedemo.on("connected", function(info) {
		console.log("Connected to the server");
		subscribe(type,detailssstu,info);
		//timeout = timeout + 1000;
	});
	subscribedemo.on("consent", function(on) {
		
		console.log("Consent dialog should be " + (on ? "on" : "off") + " now");
	});
	subscribedemo.on("preview", function(type, stream) {
		// Local stream available/unavailable
		console.log("Local " + type + " preview available:", stream);
		if(stream === null || stream === undefined) {
			//$('#video' + type).empty();
			return;
		}
		if($('#' + type + nameuser + 'video').length === 0)
		{
			console.log('#joinwebcam'+feedvalue);
			//$('.joinvideowebcam').append('<div><video id="' + type + nameuser + 'video" class="videocol" height="auto" width="100%" autoplay  /><div class="ex_name"><p>'+nameuser+'</p><p onclick="return pincheck('+nameuser+');">Pin</p><i class="fas fa-video vid'+nameuser+' "></i> <i class="fas fa-microphone mic'+nameuser+'"></i></div></div>');
			$('.joinvideowebcam').append('<div><video id="' + type + nameuser + 'video" class="videocol ' + type + nameuser + 'video" height="auto" width="100%" autoplay  /><div class="ex_name"></div></div>');
		}
		screenstream = stream;
		setTimeout(function(){
		 coms.attachMediaStream($('.' + type + nameuser + 'video').get(0), screenstream);
		}, 1000);

		
		//$('#' + type + 'video').get(0).muted = "muted";

	});
	subscribedemo.on("leave", function(info) {
		
		var attruuid = $("#webcamvideo").attr("uuid");
		if(nameidformessage == info.uuid)
		{
			$(".joinvideowebcam").html("");
			$(".webcamvideo").html("");

			//$("#webcamvideo").get(0).srcObject = streamdata ;
		}
		console.log(info);
       //createNotification("stepone",info.details.name + " is joined","")
        //$("#"+info.uuid).html("");
        //window.location.href="/liveassessment";
		// document.getElementById(info.from+"webcamjoins").style.display = "none";
		// //document.getElementById(info.from+"name").style.display = "none";
		// document.getElementById(info.from+"webcamjoins").nextSibling.style.display = "none"
        var indexs = arrayuuid.indexOf(parseInt(info.uuid));
            if (indexs > -1) {
            arrayuuid.splice(indexs, 1);
            $("#webcamvideo").attr("uuid");
            //createNotification("stepone",info.otherinfo.username + " is left","")
         }
          var indexs = arrayuuidsss.indexOf(parseInt(info.uuid));
            if (indexs > -1) {
            arrayuuidsss.splice(indexs, 1);
            //createNotification("stepone",info.otherinfo.username + " is left","")
           }
		console.log("leave");
		if(info.stream == "screen")
        	{
        	screensub = 0;
        	maincheck(userid);
        	} 
		
	});
	subscribedemo.on("webrtc", function(info) {
		if(info.status == "up" && publishvideoid === 1 )
		{ 
		livecalling++;;
		  allhihe();
          $('.network-container').css("display","block");
          var subsname = subscribername.name
          $detailsa = subsname.split(",");
          $('.sub_name').html($detailsa[0]);
          $('.sub_designation').html($detailsa[1]);
          $('#callModal').modal();	
		   //publish = publish + 1;  
		}
		if(info.status == "down")
        {
        	$(".userlist"+info.uuid).remove();
        	//$('#callModal').modal();
        }
         
		console.log("The " + info.stream + " WebRTC connection is now " + info.status);
	});
	subscribedemo.on("remote", function(type, stream) {
		// Local stream available/unavailable
		console.log("Remote " + type + " stream available:", stream);
		if(stream === null || stream === undefined) {
			//$('#join' + type).empty();
			return;
		}
		//if(isd==1 &&  isd == 2)
		{
			if($('.' + nameuser + type + 'joinsub').length === 0 )
			{
				useridforsupport = null;
				console.log(' joinwebcam', this.namedatsa);
				console.log(' joinwebcam', that.namedatsa);
				$('.joinvideowebcam').append('<div>'+'<video class="'+nameuser + type + 'joinsub" class="videocol " width="100%" height="auto" autoplay  /><div class="ex_name"><p style="float:left;padding-left:12">'+names[nameuser]+'</p> <i class="fa fa-thumb-tack  '+nameuser+'pin" style="cursor: pointer;" aria-hidden="true" onclick="return pincheck(this , '+nameuser+');" ></i> &nbsp <i class="fas fa-video vid'+nameuser+' "></i> &nbsp <i class="fas fa-microphone mic'+nameuser+'"></i></div></div>');
			} 
			// else {
			// 	useridforsupport = "support";
			// 	$('.joinwebcamsupport').append('<div style="width:50%; float:right" >'+'<div id="'+nameuser+'"><video id="' + nameuser + type + 'joins" class="videocol '+nameuser+' " width="100%" height="auto" autoplay  /><div class="ex_name"><p style="float:left;padding-left:12">'+names[nameuser]+'</p> <i class="fa fa-thumb-tack  '+nameuser+'pin" style="cursor: pointer;" aria-hidden="true" onclick="return pincheck(this , '+nameuser+');" ></i> &nbsp <i class="fas fa-video vid'+nameuser+' "></i> &nbsp <i class="fas fa-microphone mic'+nameuser+'"></i></div></div></div>');
			// }
        streamremotedata = stream;
		subscribedemo.attachMediaStreamss($('.' + nameuser + type + 'joinsub').get(0), stream);
		//isd++;
		//$('#video' + type).get(0).muted = "muted";
		}
	// 	else if( isd == 3 &&  isd == 4)
	// 	{
	// 	if($('#' + type + 'videoss').length === 0)
	// 		$('#videoss' + type).append('<video id="' + type + 'videoss" width=100% height=100% autoplay muted="muted"/>');
	// 	coms.attachMediaStream($('#' + type + 'videoss').get(0), stream);
	// 	//i=1;
	// 	//$('#video' + type).get(0).muted = "muted";
	// }
		// We're watching a student, show the chatroom
		// $('#chatbox').removeClass('hide').show();
		// $('#chatsend').removeAttr('disabled');
		$('#chat'+'box').removeClass('hide').show();
		$('#chat'+'send').removeAttr('disabled');
	});

	subscribedemo.on("join", function(type, stream) {
		console.log("Local " + type + " preview available:", stream);
		if(stream === null || stream === undefined) {
			$('#video' + type).empty();
			return;
		}
		if($('#' + type + 'video').length === 0)
			$('#joinwebcam').append('<video id="' + type + 'video" width=100% height=100% autoplay />');
		coms.attachMediaStream($('#' + type + 'video').get(0), stream);
		//$('#video' + type).get(0).muted = "muted";
	});

	subscribedemo.on("sendstatustudent", function(info) {
		console.log("info sendstatustudent api response :", info);
		 if(joinsubstu === 1)
		 {
		 	infos = info;
			console.log("subscribe webcam : ", joinsubstu);
			subscribestu(type,info)
			//startStudentVideo(examstu,namestu)
			//startStudentVideo("webcam", );
			//subscribe("webcam",info);
			joinsubstu++;
		 }
		
		
	});
	subscribedemo.on("disconnected", function() {
		// Lost connection to server
		console.log("Disconnected from the server");
	});
   
   async function subscribe(type,details,info) {
   	arrayuuidsss.push(details.feed); 
   	nameidformessage = details.feed;
	var detailsstu = { feed: details.feed, stream: details.type,iceServers : info.iceServers };
	console.log("subscribe", detailsstu);
	subscribedemo.subscribe(detailsstu, function(err) {
		if(err) {
			console.log(err);
			//console.log(err);
		}
		// if(type === "webcam")
		// 	subscribe("screen");
	});
}
      
	
	subscribedemo.connect(detailssstu);
	
	
};



pinchecked  = 1;

function pincheck(thiss, uuid)
{
	if(thiss.style.color == "red")
	{
		$(".fa-thumb-tack").css("color","gray");
        $("#webcamvideo").get(0).srcObject = streamdata ;
        $("#webcamvideo").attr("uuid",userid);
	}
	else
	{
    $(".fa-thumb-tack").css("color","");
	thiss.style.color = "red";
	$("#webcamvideo").attr("uuid",uuid);
	$("#webcamvideo").get(0).srcObject = $('.'+uuid).get(0).srcObject ;
	}
	
	console.log(uuid);

}


function maincheck(uuid)
{
	// if(thiss.style.color == "gray")
	// {
	// 	$(".fa-thumb-tack").css("color","");
 //        $("#webcamvideo").get(0).srcObject = null ;
	// }
	// else
	{
	$(".fa-thumb-tack").css("color","");
	//thiss.style.color = "gray";
	$("."+uuid+"pin").css("color","red");
	$("#webcamvideo").get(0).srcObject = $('.'+uuid).get(0).srcObject ;
	}
	console.log(uuid);

}

function screencheck(uuid)
{
	// if(thiss.style.color == "gray")
	// {
	// 	$(".fa-thumb-tack").css("color","");
 //        $("#webcamvideo").get(0).srcObject = null ;
	// }
	// else
	{
	$(".fa-thumb-tack").css("color","");
	//thiss.style.color = "gray";
	$("."+uuid+"pin").css("color","gray");
	$("#webcamvideo").get(0).srcObject = $('.'+uuid).get(0).srcObject ;
	}

}

function close(type)
{
  $('#callModal').modal('hide');
}

function subscribestu(type) {

	startwebvideoss();
	 
	$('#callModal').modal("hide");
	$("#networkcall").modal({backdrop: 'static', keyboard: false});
	$("#networkcall").css("background-color","black");
	// var detailsstu = {  feed: nameidformessage, stream: "webcam" };
	// console.log(detailsstu);

	// subscribedemo.subscribe(detailsstu, function(err) {
	// 	if(err) {
	// 		console.log(err);
	// 		//console.log(err);
	// 	}
	// 	// if(type === "webcam")
	// 	// 	subscribe("screen");
	// });
}

// Helper function to start publishing
async function publishvideoforuser(type,roomid) {
	
	
    if(type == "screen" )
    {

    	demoscreen.publish({ stream: type, roomid : roomid }, function(err) {
		if(err) {
			console.log(err);
		}
		// if(type === "webcam")
		// 	publish("screen");
	});
    }
    else
    {
    	demo.publish({ stream: type, roomid : roomid }, function(err) {
		if(err) {
			console.log(err);
		}
		// if(type === "webcam")
		// 	publish("screen");
	});
    }
	
}

function joinstu(type) {
	demo.join({ stream: type }, function(err) {
		if(err) {
			console.log(err);
		}
		// if(type === "webcam")
		// 	join("screen");
	});
}

// Callback to intercept keys typed in the chat box
function checkEnter(field, event) {
	if(event == 13)
	{
		theCode = 13
	}
	else {
	var theCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
	}
	notifym = 2;
	$(".circlered"+nameidformessage).removeClass("blink")
	if(theCode == 13) {
		// Send the chat message
		
			var msg = $('#mytextarea').val();
			var useridn = nameidformessage;
        var htmldataforuser = $(".userlist"+useridn).html();
		$(".userlist"+useridn).remove();
        $('#joinwebcam').prepend('<div class="userlist'+useridn+' ">' + htmldataforuser + 
        	'</div>');

			demo.messageonetoone({ to: nameidformessage, text: {userid :userid ,  msg : msg}, name : namedata  });
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
			var html = '<div class="chats me">'+
		      						'<div class="chat-content">'+
		      							'<div class="message-content m-msg"><p><pre>' + msg  + "</pre></p>  "+
		      					 		'<div class="chat-time">'+
                                    		'<div>'+
                                        		'<div class="time"><p class="time">' +  dateString +"</p></div></div>"+
                                    		'</div>'+
                                		'</div>'+
                            		'</div>'+    
		      					"</div>";
			$('.bubble-area').append(html);
			//$('.bubble-area').append('<p style="float:right">' + msg  + " : " +from   + ' - ' + dateString +"</p>");
		   // $('.bubble-area').append('<p style="float:right; margin-top:5%">' + msg   + " : "+ from +"  "+ dateString+ "</p>"  );
		}
		if($('.bubble-area').get(0) !== undefined)
		{
		 $('.bubble-area').get(0).scrollTop = $('.bubble-area').get(0).scrollHeight;	
		}
		//$('.bubble-area').get(0).scrollTop = $('.bubble-area').get(0).scrollHeight;
		$('.chatboxnet').val('');
        $('.chat_form').val("");
       
		return false;

	} else {
		return true;
	}
}

async function checkEnterss(field, event,supportperson) {
	var theCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
	notifym = 2;
	$(".circlered"+nameidformessage).removeClass("blink")
	if(theCode == 13) {
		// Send the chat message
		//supportperson = await getCookie("useridformessage"); 
		
			var msg = $('.chatboxsupport').val();
			demo.messageonetoone({ to: callto, text: {userid :userid ,  msg : msg}, name : namedata  });
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
			$('.bubble-areasupport').append('<div class="chats me" style="float:right">'+
		      						'<div class="chat-content">'+
		      							'<div class="message-content m-msg">' + msg  + " </div> "+
		      					 		'<div class="chat-time">'+
                                    		'<div>'+
                                        		'<div class="time">' +  dateString +"</div>"+
                                    		'</div>'+
                                		'</div>'+
                            		'</div>'+    
		      					"</div>");
			//$('.bubble-area').append('<p style="float:right">' + msg  + " : " +from   + ' - ' + dateString +"</p>");
		   // $('.bubble-area').append('<p style="float:right; margin-top:5%">' + msg   + " : "+ from +"  "+ dateString+ "</p>"  );
		}
		$('.bubble-areasupport').get(0).scrollTop = $('.bubble-areasupport').get(0).scrollHeight;
		$('.chatboxsupport').val('');

		return false;
	} else {
		return true;
	}
}

async function sendstatusapdetail() {
			demo.sendstatusapi({ to: proctor, text: String(name) , from: name});
}

//Helper to format times
function getDateString() {
	var when = new Date();
	when = when.toLocaleTimeString().split(":")
	var dateString =
			when[0] + ":" +
			when[1] + " " +
			when[2].slice(3);
	return dateString;
}

function convertdate(datetime) {
    var localDate = new Date(datetime);
    localDate = localDate.toString();
    when = localDate.split(" ")
    when = when[4].split(":");
    var dateString =
			when[0] + ":" +
			when[1]  //+ " " +
			//when[2].slice(3);
	dateString = tConvert (dateString)
	
	return dateString;
}

function startwebvideo()
{
   // publishvideoid = publishvideoid +1;
   // if(livecalling!==1)
   // {
   // 	return ;
   // }
    $(".fa-videoas").css("display","block");
    $(".fa-videoasw").css("display","none");
    $(".fa-videoa").css("pointerEvents","none"); //auto
    $("#networkcall").modal({backdrop: 'static', keyboard: false});
    $("#networkcall").css("background-color","black");
	publishvideoforuser("webcam","RingAbout");
	hidechatdiv();


}

function startwebvideoss()
{
	// if(livecalling!==1)
 //   {
 //   	return ;
 //   }
    //publishvideoid = publishvideoid +1;
    $(".fa-videoa").css("pointerEvents","none"); //auto
	publishvideoforuser("webcam","RingAbout");
	hidechatdiv();


}

function startwebvideoforsupport(){
	$(".bubble-areasupport").css("display","none");
	$(".fa-videoas").css("display","block");
	$(".fa-videoass").css("display","none");
	$(".chatboxsupport").css("display","none");

	nameidformessage = useridforsupport = callto;
	//publishvideoid = publishvideoid +1;
    $(".fa-videoa").css("pointerEvents","none"); //auto
	publishvideoforuser("webcam","RingAbout");
	hidechatdiv();

}

function hidechatdiv()
{
	$(".video-box-inner").css("display","block");
	$(".chat-box-inner").css("display","none");
}

function hidevideodiv()
{
	$(".video-box-inner").css("display","none");
	$(".chat-box-inner").css("display","block");
}

function tConvert (time) {
  // Check correct time format and split into components
  time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

  if (time.length > 1) { // If time format correct
    time = time.slice (1);  // Remove full string match value
    time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join (''); // return adjusted time or original string
}

async function stopstu(type)
{

  $('#callModal').modal("hide");
	$("#networkcall").modal("hide");
  demo.sendToggle({ roomid: roomiddata, event: "video" , status: false,from: String(idforstu) });
   if(type=="screen")
   {
   	$(".share_screen").css('display', "block");
	$(".stop_screen").css('display', "none");
	demoscreen.hangup(type);
   }
   else
   {
   	demo.hangup(type);
   }
	
}



 function toggleVideo()
 {
 	if(streamdata.getVideoTracks()[0].enabled === true)
 	{
 		streamdata.getVideoTracks()[0].enabled = false
 		//document.getElementsByClassName("videod")[0].innerText = "Show video";
 		$(".vid").css("color","red")
 		//$(".tv").css("color","red")
 		demo.sendToggle({ roomid: roomiddata, event: "video" , status: false,from: String(idforstu)
});
 	}
 	else
 	{
 		streamdata.getVideoTracks()[0].enabled = true
 		//document.getElementsByClassName("videod")[0].innerText = "Hide video";
 		$(".vid").css("color","#007bff")
demo.sendToggle({ roomid: roomiddata, event: "video" , status: true,from: String(idforstu)});

 	}
 	
 }   



function toggleAudio()
 {
 	if(streamdata.getAudioTracks()[0].enabled === true)
 	{
 		streamdata.getAudioTracks()[0].enabled = false
 		//document.getElementsByClassName("mute")[0].innerText = "UnMute";
 		$(".mic").css("color","red")
 		//$(".ta").css("color","red")
 		
 		demo.sendToggle({ roomid: roomiddata, event: "audio" , status: false,from: String(idforstu) });

 	}
 	else
 	{
 		streamdata.getAudioTracks()[0].enabled = true
 		//document.getElementsByClassName("mute")[0].innerText = "Mute";
 		$(".mic").css("color","#007bff")
 		//$(".ta").css("color","white")
 		demo.sendToggle({ roomid: roomiddata, event: "audio" , status: true,from: String(idforstu) });
 		
 	}
 	
 } 



async function startvideo(type,user_type,user_name)
{   
	uuid = userdetails.id
    // uuid = Math.floor(Math.random()*100000000).toString();
	if(type=="screen")
  {
   // webcamblock = uuid;
  }
  if(screensub==1)
  {
   toastr.info('Screen Already publish');
   return;
  }

	if(typeof(user_name) == "undefined")
	{
		user_name =  userdetails.name; 
	}
	if(type == "screen")
	{
		// $(".share_screen").attr("disabled", true);
		$(".share_screen").css('display', "none");
		$(".stop_screen").css('display', "block");
		publishscreen(roomid ,uuid,type,user_type,user_name);
	}
	else{
		publishvideo(roomid ,uuid,type,user_type,user_name)
	}
	$("."+type).attr("disabled", true);
	
}


async function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}


			
            function askForApproval() {
                    Notification.requestPermission(permission => {
                        if(permission === 'granted') {
                            createNotification('stepone', 'Notification is Allowed', '');
                        }
                    });

            }
            
            function createNotification(title, text, icon) {
                const noti = new Notification(title, {
                    body: text,
                    icon
                });
            }

  


askForApproval();
//setTimeout(function(){ supportuserlist("allsupportusers"); userlist('RingAbout'); }, 5000);

//setInterval(function(){ supportuserlist("allsupportusers"); userlist('RingAbout'); }, 10000);

function unreaduserlist(usersida){
	$.ajax({
        type: "GET",
        data : {"to" : usersida},
        url: 'https://steponexp.net:8096/api/notreadMessages',
        success: function(data) {
          console.log(data.response);
           //$('#joinwebcam').html("");
           $.each(data.response, function( key, value ) {
           	var arrays = value.name.split(",")
           	var datafun = value.from + "," +'"'+arrays[0].toString()+'"' ;
           	if(value.from.indexOf("support") == -1  && value.to != "support" && value.from != "" )
           	{
           	//console.log(datafun);
           	if($('.userlist'+value.from).html() === undefined)
           	{
           	$('#joinwebcam').append('<div class="userlist'+value.from+' listuser ">'+
           		'<div class="person chat-active '+value.from+'" data-chat="person1">'+
							'<div class="user-info"'+
                            "onclick='setname("+datafun+")'"+
							'>'+
                                '<div class="meta-initial">'+
                                    '<div class="user-initial">'+
                                        '<h2 >'+arrays[0].charAt(0)+'</h2>'+
                                    '</div>'+
                                '</div>'+
								'<div class="f-body">'+
                                    '<div class="meta-info">'+
                                        '<span '+
                                        //"onclick='setname("+datafun+")'"+
                                         'class="user-name" data-name="'+arrays[0]+'">'+arrays[0]+'</span>'+
                                        '<span class="user-meta-status">'+
                                            //'<div class="circle c-1"></div>'+
                                            '<div class="circle c-2 removeb circlered'+value.from+'"></div>'+
                                        '</span>'+
                                    '</div>'+
                                    '<span class="preview"><p></p></span>'+
                                 '</div>'+
							'</div>'+
						'</div>'+
						'</div>');
           	$(".circlered"+value.from).addClass("blink")
           }
           }
            });
         //$('.bubble-area').get(0).scrollTop = $('.bubble-area').get(0).scrollHeight;
          //qna();
          //alert("question asked for you");
       // userlist('RingAbout');
        }

         });
}

function userlist(usersida){
	$.ajax({
        type: "GET",
        data : {"id" : usersida},
        url: 'https://steponexp.net:8096/api/user_list',
        success: function(data) {
          console.log(data.response);
         $('.onilneusers').html("");
           $.each(data.response, function( key, value ) {
           	var arrays = value.name.split(",")
           	var datafun = value.std_id + "," +'"'+arrays[0].toString()+'"' ;
           	if(value.std_id != userid && value.name.indexOf("support") == -1  && value.std_id != "supportpanel" && value.std_id != "" )
           	{
           	if($('.userlist'+value.std_id).html() === undefined)
           	{
           	$('.onilneusers').append('<a href="#" class="users mb-3 d-block userlist'+value.std_id+'">'+
                                '<div class=" d-flex justify-content-center align-items-center">'+
                                    '<div class="ou_img">'+
                                        '<img src="./assets/IMG/undraw_login_re_4vu2 (1).svg" alt="">'+
                                    '</div>'+
                                    '<h1 class="ou_name ml-2">'+value.name+'</h1>'+
                                '</div>'+
                            '</a>');
           }
           }
            });
         //$('.bubble-area').get(0).scrollTop = $('.bubble-area').get(0).scrollHeight;
          //qna();
          //alert("question asked for you");
          unreaduserlist(userid)
        }
         });
}


function supportuserlist(usersida){
	$.ajax({
        type: "GET",
        data : {"id" : usersida},
        url: 'https://steponexp.net:8096/api/getsupportUsers',
        success: function(data) {
          console.log(data.response);
          $('#joinwebcamsupport').html("");
           $.each(data.response, function( key, value ) {
           	//var arrays = value.name.split(",")
           	//var datafun = value.std_id + "," +'"'+arrays[0].toString()+'"' ;
           //	console.log(datafun);
           	$('#joinwebcamsupport').append('<div class="person chat-active" data-chat="person1">'+
              '<div class="user-info" '+
               "onclick='setname("+value+")'>"+ 
                '<div class="f-body">'+
                                    '<div class="meta-info">'+
                                        '<span class="user-name"  data-name="'+value+'">'+value+'</span>'+
                                        '<span class="user-meta-status">'+
                                        //'<div class="circle c-1"></div>'+
                                        '</span>'+
                                    '</div>'+
                                     //'<span class="preview"><p>'+arrays[1]+'</p></span>'+
                                 '</div>'+
              '</div>'+
            '</div>');
            });

          //qna();
          //alert("question asked for you");
        }
         });
}


function setname(nameidss , namevalue)
{
$(".current-chat-user-name").css("display","flex");	
$(".chat-box-footer").css("display","flex");	
$(".chat-box-inner").css("background-image","none");
	$(".fa-videoasw").css("display","block");
    $(".fa-videoasu").css("display","block");
    $(".formchatdiv").css("display","block");
   	$('.bubble-area').attr("id",nameidss);
	$(".fa-videoa").css("pointerEvents","auto");
	$(".circlered"+nameidss).removeClass("blink")
	$(".listuser").css("background-color","white");
    $(".userlist"+nameidss).css("background-color","#c6b079");
	hidevideodiv();
	$('.bubble-area').html("");
	$(".namevalues").html(namevalue);
	$(".Firstletter").html(namevalue.charAt(0));
	$(".chatbox").val("");
	console.log(nameidss);
	 nameidformessage = nameidss;
    
	$.ajax({
        type: "GET",
        data : {"from" : userid , "to" : nameidss},
        url: 'https://steponexp.net:8096/api/getmessage',
        success: function(data) {
           var response = data.response;
           console.log(response);
           if(response.length>0)
           {
           	$.each(response, function(key,value){
               value.date = convertdate(value.date);
           		if(value.to != nameidss)
           		{
           			$('.bubble-area').append('<div class="chats you">'+
		      						'<div class="chat-content">'+
		      							'<div class="message-content y-msg"><div class="u-name"><p></p></div> <p>' + value.message  + " </p> "+
		      					 		'<div class="chat-time">'+
                                    		'<div>'+
                                        		'<div class="time"><p class="time">' +  value.date +"</p></div></div>"+
                                    		'</div>'+
                                		'</div>'+
                            		'</div>'+    
		      					"</div>");
           		}
           		else{
           		$('.bubble-area').append('<div class="chats me" style="float:right">'+
		      						'<div class="chat-content">'+
		      							'<div class="message-content m-msg"><p>' + value.message  + " </p> "+
		      					 		'<div class="chat-time">'+
                                    		'<div>'+
                                        		'<div class="time"> <p class="time">' +  value.date +"</p></div></div>"+
                                    		'</div>'+
                                		'</div>'+
                            		'</div>'+    
		      					"</div>");
           		}
           	});
        if($('.bubble-area').get(0) !== undefined)
		{
		 $('.bubble-area').get(0).scrollTop = $('.bubble-area').get(0).scrollHeight;	
		}
           //	$('.bubble-area').get(0).scrollTop = $('.bubble-area').get(0).scrollHeight;
           }
        }
    });
    $.ajax({
        type: "GET",
        data : {"from" : nameidss , "to" :  userid},
        url: 'https://steponexp.net:8096/api/updateMessages',
        success: function(data) {
         console.log(data)

        }});
}
