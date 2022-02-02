/*
 * Author:    Lorenzo Miniero
 * Copyright: Meetecho
 *
 */

// Dependencies
require('dotenv').config();
var async = require('async');
var unless = require('express-unless');
var colors = require('colors/safe');
var debug = require('debug');
var express = require('express');
var fs = require('fs');
var low = require('lowdb');
var cors = require('cors');
const btoa = require('btoa');
const requestbota = require('request-promise');
var FileSync = require('lowdb/adapters/FileSync');
var uuid = require('uuid');
var baseurl = 'https://webrtc.monetrewards.com:8090/api';
var addStudent =  [];
const authMiddleware = require('./auth')
const { promisify } = require('util')
var roomid  = {};
var roomdata = {};
var mongoose = require("mongoose");
var messageController = require("./controllers/message.js");
var userController = require("./controllers/users.js");
var examController = require("./controllers/exams.js");
var roomController = require("./controllers/rooms.js");
//mongoose.connect("mongodb://localhost:27017/exams_db");
//mongoose.connect("mongodb://localhost:27017/exams_db", { useNewUrlParser: true });
//mongoose.connect("mongodb://localhost:27017/exams_db?authSource=admin&w=1", {user: "admin", pass: "MonET@v34nMK", useUnifiedTopology: true,useNewUrlParser: true,  useFindAndModify: false }).then(() => console.log('DB Connected!')).catch(err => {console.log(err);});
                    //mongodb+srv://webrtc:Stepone%40021@webrtc.ptqqs.mongodb.net/test?authSource=admin&replicaSet=atlas-wp1obc-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true
                    //mongodb+srv://webrtc:Stepone%40021@webrtc.ptqqs.mongodb.net/test?authSource=admin&replicaSet=atlas-wp1obc-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true
//mongoose.connect("mongodb://webrtc.ptqqs.mongodb.net/test?retryWrites=true&w=majority&authSource=admin&w=1", {user: "webrtc", pass: "Stepone@021", useUnifiedTopology: true,useNewUrlParser: true,  useFindAndModify: false }).then(() => console.log('DB Connected!')).catch(err => {console.log(err);});
mongoose.connect("mongodb+srv://webrtc:Stepone%40021@webrtc.ptqqs.mongodb.net/test?authSource=admin&replicaSet=atlas-wp1obc-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true", {user: "webrtc", pass: "Stepone@021", useUnifiedTopology: true,useNewUrlParser: true,  useFindAndModify: false }).then(
	(function(){
		console.log('DB Connected!');
	}) 
	).catch(err => {console.log(err);});

//cluster0.0id9o.mongodb.net

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://webrtc:Stepone@021@cluster0.0id9o.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, {useUnifiedTopology: true,useNewUrlParser: true,  useFindAndModify: false });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });



// Configuration
var baseConfig = require("./config.js");
var MonetJanus = require("./monet-janus.js");
var noop = function(){};
var addProctor = [];
var addManager = [];
// Debugging
var monet = {
	debug: debug('proctoring:debug'),
	err: debug('proctoring:error'),
	warn: debug('proctoring:warn'),
	timer: debug('proctoring:timer'),
	info: debug('proctoring:info')
};

// Database
var db = null;
// Janus manager
var janus = null;



const { ISSUER, CLIENT_ID, CLIENT_SECRET, SCOPE } = process.env


const sendAPIRequest = async (req,res) => {
  try {
    const token = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)
    //console.log(token);
    uri = `${ISSUER}/v1/token`;
    method = 'POST';
    //console.log(uri);
    const auth = await requestbota({
      uri: uri,
      json: true,
      method: 'POST',
      headers: {
        authorization: `Basic ${token}`
      },
      form: {
        grant_type: 'client_credentials',
        scope: SCOPE
      }
    })
    res.json({ code: 200,error:false, msg:'token', response: auth });
  } catch (error) {
  	res.json({ code: 401,error:true,msg:'token', response: error.message });
     //return error.message;
  }
}

var unless = function(middleware, ...paths) {
  return function(req, res, next) {
    const pathCheck = paths.some(path => path === req.path);
    pathCheck ? next() : middleware(req, res, next);
  };
};
//sendAPIRequest()
// Startup
async.series([
	// 1. Janus, of course!
	function(callback) {
		console.log(colors.yellow("[1. Janus]"));
		console.log("Connecting to Janus:", baseConfig.janus.ws);
		setupJanus(callback);
	},
	// 2. Setup database
	function(callback) {
		console.log(colors.yellow("[2. Database]"));
		if(!baseConfig || !baseConfig.db) {
			callback("Database not properly configured :-(");
			return;
		}
		//console.log("Opening database:", baseConfig.db);
		// adapter = new FileSync(baseConfig.db);
		// db = low(adapter);
		// // Set some defaults
		// db.defaults({ users: [], exams: [] }).write();
		// // TODO Move incomplete user sessions to the respective exam recordings
		// db.set('users', []).write();
		callback(null, "Database OK");
	},
	// 3. Web server and REST API
	function(callback) {
		console.log(colors.yellow("[3. Web server]"));
		if(!baseConfig || !baseConfig.web || !baseConfig.web.port) {
			callback(null, "No Web backend");
			return;
		}

		// Automatically serve the static files in the 'web' folder
		var app1 = app = express();
		app.use(cors());//.unless({ path: ['/gettoken']});
		app1.use(cors());
		var corsOptions = {"Access-Control-Allow-Origin":"*"};
		app.use(express.static('web'));
		app1.use(express.static('web'));
        //app.use(authMiddleware);
		// Setup a REST API as well
		setupRest(app,corsOptions);
		// Set up the HTTP server
		var fs = require('fs');
					 var options = {
					 	key: fs.readFileSync(baseConfig.web.certs.key, 'utf8'),
					 	cert: fs.readFileSync(baseConfig.web.certs.cert, 'utf8'),
					 	passphrase: baseConfig.web.certs.passphrase
					 };
					// var options = {
					// 	key: '',
					// 	cert: '',
					// 	passphrase: baseConfig.web.certs.passphrase
					// };
		var https = require('https').createServer(options, app);
		https.on('error', function(err) {
			console.log('HTTP backend error:', err)
			if(err.code == 'EADDRINUSE') {
				callback('Port ' + baseConfig.web.port + ' for Web server already in use');
			} else {
				callback('Error creating Web server:', err);
			}
		});

		var httpss = require('https').createServer(options, app1);
		httpss.on('error', function(err) {
			console.log('HTTP backend error:', err)
			if(err.code == 'EADDRINUSE') {
				callback('Port ' + baseConfig.web.port + ' for Web server already in use');
			} else {
				callback('Error creating Web server:', err);
			}
		});
		// Finally, add support for WebSockets too
		var WebSocketServer = require('websocket').server;
		var ws = new WebSocketServer({
			httpServer: https,
			autoAcceptConnections: false
		});
		ws.on('request', function(request) {
			try {
				// Decode the base64 path to get the user details
				var token = request.resourceURL.path;
				//console.log('base64' + token)
				while(token.indexOf('/') === 0)
					token = token.substring(1);
				var buff = Buffer.from(token, 'base64');
				var text = buff.toString('utf-8');
				var json = JSON.parse(text);
				var proctor = json.proctor;//(json.proctor === true);
				var uuid = json.uuid;
				var hash = json.hash;
				console.log(hash);
				var name = json.name;
				getuserss({ uuid: uuid }).then(function(response) {
    	        info = response;
                if(response) {
	            	// Get rid of the previous session and its resources
	            //console.log("webrtc" +response + that.uuid)
	            //destroySession(uuid);
	            }
                });
				var roomid = json.roomid;

				if(!uuid) {
					request.reject(400);
					return;
				}
				if(!proctor && !roomid) {
					request.reject(403);
					return;
				}
				console.log("exam data  ")
				if(roomid) {
				    roomController.getRooms({ roomid: roomid }).then(function(response) {
		                if(response) {
		                	for(var data of response)
		                	{
		                		 room = data.room;
							}
		                	}
		                if(!room)
		                {
		                	request.reject(403);
					        return;
		                }	
		                var connection = request.accept(baseConfig.web.wsproto, request.origin);
						//console.log('Connection accepted, creating session');
						//console.log(connection + 'mesageq' +proctor+ 'mesageq' + uuid+ 'mesageq' + exam)
						// Incoming connection, handle user
						var session =  new MonetUser(connection, proctor, uuid, room, roomid , name , hash);
	
					                
			            });
                    }
				} 
				catch(e) {
				console.log('mesage' + e.message)
				monet.err(e.message);
			}
		});
		https.listen(baseConfig.web.port, function() {
			console.log('Web server listening on *:' + baseConfig.web.port + ' (HTTP)');
			callback(null, "Web server OK");
		});
		// promisify(https.listen(baseConfig.web.port, function() {
		// 	console.log('Web server listening on *:' + baseConfig.web.port + ' (HTTP)');
		// 	callback(null, "Web server OK");
		// }));
		  promisify(httpss.listen).bind(httpss)(baseConfig.web.port1)
   //       console.log(`Listening on port ${baseConfig.web.port}`)
	}
],
function(err, results) {
	if(err !== null) {
		console.log(colors.red("Proctoring POC failed to start :-("));
		console.log(err);
		process.exit(1);
	} else {
		// We're up and running
		console.log(colors.cyan("Proctoring POC started!"));
		console.log(results);
	}
});

// Janus setup (manager)
var firstTime = true;
var reconnectingTimer = null;
var noop = function() {};
function setupJanus(callback) {
	callback = (typeof callback == "function") ? callback : noop;
	reconnectingTimer = null;
	if(!janus) {
		var managerConfig = { janus: JSON.parse(JSON.stringify(baseConfig.janus)) };
		janus = new MonetJanus(managerConfig);
		janus.on("disconnected", function() {
			// Event to detect when we loose Janus, try reconnecting
			if(reconnectingTimer != null) {
				monet.warn("A reconnection timer has already been set up");
				return;
			}
			delete janus;
			janus = null;
			// Notify all users
			for(var user in sessions) {
				var session = sessions[user];
				monet.debug("Notifying " + user + " about Janus disconnection");
				if(session) {
					console.log("user",user);
					console.log("session",session);
					session.notify("disconnected");
				}
			}
			monet.warn("Lost connectivity to Janus, reset the manager and try reconnecting");
			reconnectingTimer = setTimeout(function() { setupJanus(firstTime ? callback : undefined); }, 2000);
		});
	}
	janus.connect(function(err) {
		if(err) {
			monet.warn("Error connecting, will retry later:", err.error);
			return;
		}
		// Connected
		monet.info("Connected to Janus:", baseConfig.janus.ws);
		firstTime = false;
		callback(null, "Janus OK");
	});
}

// Helper function to configure the REST APIs
function setupRest(app,corsOptions) {
	var router = express.Router();
	// Just a helper to make sure this API is up and running
	router.get('/healthcheck', function(req, res) {
		monet.info("/healthcheck:", req.params);
		res.json({ result: 200 });
	});

	// Get list of all exams
	router.get('/exams', function(req, res) {
		monet.info("/exams:", req.query);
		// TODO
		var exam = getExamss({ id: req.query.examId }).then(function(response) {
    	            exams = response;
    	           // console.log("exam response  "+ response);
                if(response) {
                	var list = [];
		for(var exam of exams) {
			 if(exam && exam.completed != 'yes')
				list.push(exam.examid);
		}
		res.json({ code: 200,error:false, message:'exams list', response: list });
			                
	            }
                });

		//var exams = db.get('exams').value();
		
	});
	

	router.get('/examsdata', function(req, res) {
  //      var newsessiondata = {}; 
  //      var data = {};
  //      data["publisher"] = 1452;
  //       newsessiondata[114]= data;
	 //    // newsessiondata[114].push({"room":12452});
		// console.log(newsessiondata[114].publisher);
		// return;
		monet.info("/exams:", req.query);

		// TODO
		getExamss({ id: req.query.examId }).then(function(response) {
    	            exams = response;
    	            //console.log("exam response  "+ response);
                if(response) {
                	var list = [];
		for(var exam of exams) {
			if(exam && exam.completed != 'yes')
			{
				var examdata =	{ exam_id: exam.examid , name : exam.name}
				list.push(examdata);
			}
		}
		res.json({ code: 200,error:false, message:'Exam list', response: list });
			                
	            }
                });
	});

    router.get('/createRoom', function(req,response) {
      // var roomid = parseInt(req.query.roomid);
      // var details = {room : roomid} ;
      //console.log(details);
      janus.createRoom({}, function(err, res) {
			if(err) {
				// Something went wrong
				//console.log(err.error);
				response.json({ code: 201,error:true, message:'Room Details', response: err.error  });
				//sendEvent("error", { error: err.error });
				//return;
			}
    	response.json({ code: 200,error:false, message:'Room Details', response: res });
    });

    })

    router.get('/assignRoom', async function(req,response) {
      var room = (req.query.room);
      var roomid = (req.query.roomid);
      var details = {room:room,roomid:roomid};
      var getdata = await roomController.getRooms(details);
      if(getdata.length>0)
      {
      	for(var data of getdata )
      	{
      		var details = {room:data.room,roomid:data.roomid};
      	}

      	 response.json({ code: 200,error:false, message:'Assign successfully', response: details });
      }
      else{
      	 var resdata = await roomController.saveRooms(details);
      	 response.json({ code: 200,error:false, message:'Assign successfully', response: details });
      }

    })


    router.get('/destroyRoom',async function(req,response) {
      var roomid = parseInt(req.query.roomid);
      var details = {roomid : roomid} ;
      // var details = {room : roomid} ;
      var getdata = await roomController.getRooms(details);
      var datadelete = await roomController.roomdelete(details);
      //console.log(getdata);
      if(getdata.length > 0)
      {
      for(var data of getdata) {
      janus.destroyRoom(data, function(err, res) {
			if(err) {
				// Something went wrong
				//console.log(err.error);

				response.json({ code: 201,error:true, message:'Destroy Details', response: err.error  });
				//sendEvent("error", { error: err.error });
				//return;
			}
		
    	response.json({ code: 200,error:false, message:'Destroy Details', response: res });
    });
  }

}
else
{
	response.json({ code: 200,error:false, message:'Destroy Details', response: "no data found" });
}


    })


    router.get('/destroyRoomIFNOTASSIGN', function(req,response) {
      var room = parseInt(req.query.room);
      var details = {room : room} ;
      //roomController.roomdelete(details);
      janus.destroyRoom(details, function(err, res) {
			if(err) {
				// Something went wrong
				//console.log(err.error);
				response.json({ code: 201,error:true, message:'Destroy Details', response: err.error  });
				//sendEvent("error", { error: err.error });
				//return;
			}
    	response.json({ code: 200,error:false, message:'Destroy Details', response: res });
    });

    })


     router.get('/getassignRoom', async function(req,response) {
      var roomid = (req.query.roomid);
      if(roomid){
      	var details = {roomid:roomid};
      	//console.log(details);
      	var getdata = await roomController.getRoomsByAny(details);
      }
      else
      {
      	var details = {};
      	var getdata = await roomController.getRoomsByAny(details);
      } 
      if(getdata.length>0)
      {

      	 response.json({ code: 200,error:false, message:'Fetch successfully', response: getdata });
      }
      else{
      	 
      	 response.json({ code: 200,error:false, message:'Fetch successfully', response: "no data found" });
      }

    })

    router.get('/listRoom', function(req,response) {

     // var details = {room : req.query.roomid} ;
      janus.listRoom({}, function(err, res) {
			if(err) {
				// Something went wrong
				//console.log(err.error);
				response.json({ code: 201,error:true, message:'List Details', response: err.error  });
				//sendEvent("error", { error: err.error });
				//return;
			}
		var list = [];
		//console.log(res);
		var resdata = res.room;
		for(var ress of resdata) {
			
				var resdata =	{ room: ress.room , description : ress.description}
				list.push(resdata);
		
		}
    	response.json({ code: 200,error:false, message:'List Details', response: list });
    });

    })

	router.get('/userRecordings', function(req, res) {
		//console.log("/userRecordings:", req.query);

		getExamss({ id: req.query.examId }).then(function(response) {
    	            exams = response;
    	            //console.log("exam response  "+ response);
                if(response) {
                	var list = [];
		for(var exam of exams) {
			for(var record of exam.recordings){
				if(record.uuid == req.query.userId)
				{
				list.push(record);
				}
				
			}
		}
		res.json({ code: 200,error:false, message:'User Recording', response: list });
			                
	            }
                });

			});

	router.get('/updatest', function(req, res) {
		var s= { 
  proctor: 'false',
  uuid: '1212',
  exam: '111',
  janus: {}
  }
  s.janus.screen = 'true';
		userController.updateUsers({ uuid: '1212' },s )
		res.json({ error: false, message: "Exam list", response: s });
	});

	router.get('/getmessage', function(req, res) {
		
	    var  messages =  messageController.getmessage(req, res); 
		//var list = [];
		// for(var message of messages) {
		// 	//if(exam && !exam.completed)
		// 	{
		// 		//var examdata =	{ exam_id: exam.id , name : exam.name}
		// 		list.push(message);
		// 	}
			   
		// }
		//res.json({ error: false, message: "messages ", response: list });
	});

	router.get('/getmessagesupport', function(req, res) {
		
	    var  messages =  messageController.getmessagesupport(req, res); 
		//var list = [];
		// for(var message of messages) {
		// 	//if(exam && !exam.completed)
		// 	{
		// 		//var examdata =	{ exam_id: exam.id , name : exam.name}
		// 		list.push(message);
		// 	}
			   
		// }
		//res.json({ error: false, message: "messages ", response: list });
	});

	// Create a new exam session
	router.post('/create', function(req, res) {
		monet.info("/create:", req.body);
		// Generate a random ID
		var id = uuid.v4();
		var info = { id: id, recordings: [] };
		db.get('exams').push(info).write();
		res.json({ code: 200,error:false, exam: info });
	});

	router.post('/createExam', function(req, res) {
		//console.log("/create:", req);
		var info = examController.saveExam(req, res);

		//console.log(info);
	});
	router.get('/gettoken', function(req, res) {
		console.log("/gettoken:");
		sendAPIRequest(req, res);
		
		//console.log(info);
	});

router.get('/sendmessages', function(req, res) {
	for(var user in sessions) {
				var session = sessions[user];
				//monet.debug("Notifying " + user + " about Janus disconnection");
				if(session) {
					//console.log("user",user);
					console.log("sendmessages",session);
					//session.notify("disconnected");
					session.notify("sendmessages",  { from: "admin" , text: req.query.message });
				}
			}
			res.json({ code: 200,error:false, exam: "sendmessages" });
});

	router.post('/getRoom', function(req, res) {
		//console.log("/create:", req);
		userController.getUsersbyany({}).then(function(students)
		{
			//console.log(students);
			if(!students) {
			res.status(404);
			res.send('No such exam');
			return;
		}
		var responses = [];
		var info = {
			id: req.query.id,
			students: []
		};
		// for(var s of students) {
		// 	var examdata =	{ std_id : s.uuid}
		// 	info.students.push(examdata);
		// }
		responses.push(info);
		res.json({ code: 200,error:false, message: "Create Room List", response: students });

		});
		//console.log(info);
	});

	router.get('/getsupportUsers', function(req, res) {
		//console.log("/create:", req);
		messageController.getmessageforsupport({}).then(function(students)
		{
			//console.log(students);
			if(!students) {
			res.status(404);
			res.send('No such Student');
			return;
		}
		//var info = [];
		//var dataresponse = [];
		 var info = {
		 	students: []
		 };
		for(var s of students) {
			
			if(s.from  !== "support")
			{
				info.students.push(s.from);
				//console.log(s.from);
			}
			//var examdata =	{ std_id : s.uuid}
			
			//info.students[s.to] = s.to;
		}
		uniqueArray = info.students.filter(function(elem, pos) {
         return info.students.indexOf(elem) == pos;
       })
		//console.log(info);
        //dataresponse.push(info);
		//responses.push(info);
		res.json({ code: 200,error:false, message: "Supported Users List", response: uniqueArray });

		});
		//console.log(info);
	});

	// Get list of currently active students in an existing exam session
	router.get('/students/:id', function(req, res) {
		monet.info("/students:", req.params);

		//var students = db.get('users').filter({ exam: req.params.id }).value();
		userController.getUsersbyany({ exam: req.params.id }).then(function(user) {
			students = user;
				if(user) {
					if(!students) {
			res.status(404);
			res.send('No such exam');
			return;
		}
		var info = {
			id: req.params.id,
			students: []
		};
		for(var s of students) {
			info.students.push(s.uuid);
		}
		res.json({ code: 200,error:false, message:'exam', response: info });
				}
			});
		
	});

	router.get('/students', function(req, res) {
		//console.log("/students:", req.query);
		console.log("/students:", req.query.id);
		//return;
		userController.getUsersbyany({ exam: req.query.id }).then(function(students)
		{
			//console.log(students);
			if(!students) {
			res.status(404);
			res.send('No such exam');
			return;
		}
		var responses = [];
		var info = {
			id: req.query.id,
			students: []
		};
		for(var s of students) {
			var examdata =	{ std_id : s.uuid}
			info.students.push(examdata);
		}
		responses.push(info);
		res.json({ code: 200,error:false, message: "Student list", response: info.students });

		});
		//var students = db.get('users').filter({ exam: req.query.id }).value();
		
		//res.json({ result: 200, exam: info });
	});


	router.get('/student_list', function(req, res) {
		//console.log("/students:", req.query);
		//console.log("/students:", req.query.id);
		userController.getUsersbyany({ $and: [ { roomid: req.query.id  } , { proctor: "student"  } ] }).then(function(students)
		{
			//console.log(students);
			if(!students) {
			res.status(404);
			res.send('No such exam');
			return;
		}
		var responses = [];
		var info = {
			id: req.query.id,
			students: []
		};
		for(var s of students) {

			// stu_list = s.uuid;
			// //if((stu_list.indexOf('poc') === -1) && (stu_list.indexOf('proc') === -1) && (stu_list.indexOf('_') === -1))
			// {
			// 	console.log(stu_list);
			// 	console.log(stu_list.indexOf('proc'));
				var examdata =	{ std_id : s.uuid , roomid : s.roomid,  name : s.name , proctor : s.proctor}
				info.students.push(examdata);
			//}
			
		}
		responses.push(info);
		res.json({ code: 200,error:false, message: "Student list", response: info.students });

		});
		//var students = db.get('users').filter({ exam: req.query.id }).value();
		
		//res.json({ result: 200, exam: info });
	});


	router.get('/user_list', function(req, res) {
		//console.log("/students:", req.query);
		//console.log("/students:", req.query.id);
		userController.getUsersbyany({ roomid: req.query.id  }).then(function(students)
		{
			//console.log(students);
			if(!students) {
			res.status(404);
			res.send('No such exam');
			return;
		}
		var responses = [];
		var info = {
			id: req.query.id,
			students: []
		};
		for(var s of students) {
			// if(s.uuid.indexOf('_') != -1)
			// {
			var examdata =	{ 
				std_id : s.uuid ,
				roomid :s.roomid ,
			    name : s.name ,
			    proctor : s.proctor,
			    webcam : s.janus.webcam ,
			    screen : s.janus.screen ,
			    audio : s.janus.audio,
			}
			info.students.push(examdata);	
			//}
			
		}
		responses.push(info);
		res.json({ code: 200,error:false, message: "user list", response: info.students });

		});
		//var students = db.get('users').filter({ exam: req.query.id }).value();
		
		//res.json({ result: 200, exam: info });
	});


	router.get('/proctor_list', function(req, res) {
		//console.log("/students:", req.query);
		console.log("/students:", req.query.id);
		userController.getUsersbyany({ $and: [ { roomid: req.query.id  } , { proctor: "proctor"  } ] }).then(function(students)
		{
			//console.log(students);
			if(!students) {
			res.status(404);
			res.send('No such exam');
			return;
		}
		var responses = [];
		var info = {
			id: req.query.id,
			students: []
		};
		for(var s of students) {
			// if(s.uuid.indexOf('_') != -1)
			// {
			var examdata =	{ std_id : s.uuid , roomid :s.roomid , name : s.name , proctor : s.proctor}
			info.students.push(examdata);	
			//}
			
		}
		responses.push(info);
		res.json({ code: 200,error:false, message: "proctor list", response: info.students });

		});
		//var students = db.get('users').filter({ exam: req.query.id }).value();
		
		//res.json({ result: 200, exam: info });
	});

	// Destroy an existing exam session
	router.post('/destroy/:id', function(req, res) {
		monet.info("/destroy:", req.body);
		var exam = db.get('exams').find({ id: req.body.id }).value();
		if(!exam || exam.completed) {
			res.status(404);
			res.send('No such exam');
			return;
		}
		// Mark the exam as completed
		exam.completed = true;
		db.get('exams').find({ id: req.body.id }).assign(exam).write();
		// Done
		res.json({ code: 200,error:false,message :'destroy',response:req.body.id  });
	});

	router.get('/destroyAll',function(req,res) {
       //console.log("destroyAll");
		destroyAllSession();
		res.json({ code: 200,error:false,message :'destroyAll',response:"All delete"  });
		// body...
	});



	// Tie the REST API methods to the Web server
	var bodyParser = require('body-parser');
	

    // app.use(unless(authMiddleware, "gettoken", "/api/gettoken"));
	app.use(cors()); //.unless({ path: ['/gettoken']});
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	//app.use(authMiddleware);
	app.use('/api', router);
}

// Monet/Janus user sessions
var sessions = {};


function closelogs(uuid)
{
	try {
		//var procval = sessions[uuid].proctor;
     	//console.log(sessions[uuid]);
     	 //data : {"userid" : userid,"Comment" : Comment,"page_id" : Redirect},
	    //console.log('http://localhost/webrtc/mstreamer/videomp4.php?userid='+uuid+"&type="+procval);
		var rp = require('http');
           rp.get('http://localhost/steponedemo/logs?uuid='+uuid+'userid='+uuid+"&Comment=closeconnection&page_id=30", (res) => {
           res.on('data', (d) => {
        });
        }).on('error', (e) => {
          console.error(e);
        });
			} catch(e) {
				console.log(e.message);
			};
}


function destroySession(uuid) {
   //console.log('delete session' + uuid)
	addProctor = addProctor.filter(item => item != uuid)
	// Disconnect from Janus
	if(janus)
		janus.removeSession({ uuid: uuid });
		// 	console.log(addProctor);
	// TODO

	userController.getUsersbyany({ uuid: uuid }).then(function(user)
		{
			closelogs(uuid);
	//var user = db.get('users').find({ uuid: uuid }).value();
	if(user) {
		for(var u of user)
		{
		var examIds = u.exam;
		//var proctor = u.proctor;
       

		if(examIds) {
			getExamss({ id: examIds }).then(function(response) {
    	            //exam = response;
    	        //console.log("exam response2  "+ response);
                if(response) {
                	for(var exam of response)
                	{
                         var request = {id:examIds,data:user};
                		 //exam.recordings.push(user);
                		 examController.updatepushExam(request)
			             //db.get('exams').find({ id: examId }).assign(exam).write();

                	}
			                
	            }
                });
			//var exam = db.get('exams').find({ id: examId }).value();
			// Mark the student's exam as completed
			// exam.recordings.push(user);
			// db.get('exams').find({ id: examId }).assign(exam).write();
		}
	}
	}
 });
  
     
     try {
				var procval = sessions[uuid].proctor;
     	//console.log(sessions[uuid]);
	    console.log('http://localhost/webrtc/mstreamer/videomp4.php?userid='+uuid+"&type="+procval);
		var rp = require('http');
           rp.get('http://localhost/webrtc/mstreamer/videomp4.php?userid='+uuid+"&type="+procval, (res) => {
           res.on('data', (d) => {
        });
        }).on('error', (e) => {
          console.error(e);
        });
			} catch(e) {
				console.log(e.message);
			};
     
	// Remove user from list
	console.log("delete model"); 
	//console.log({ uuid: uuid });
	const index = addManager.indexOf(uuid);
if (index > -1) {
  addManager.splice(index, 1);
}
	userController.userdelete({ uuid: uuid });
	delete sessions[uuid];
	//delete addManager[uuid];
	delete addStudent[uuid];
	//delete addManager[uuid];
}


function destroyAllSession() {
   console.log('delete session' + uuid)
	addProctor = addProctor.filter(item => item != uuid)
	// Disconnect from Janus
	if(janus)
		janus.removeSession({ uuid: uuid });
		// 	console.log(addProctor);
	// TODO

	userController.getUsersbyany({}).then(function(user)
		{
	//var user = db.get('users').find({ uuid: uuid }).value();
	if(user) {
		for(var u of user)
		{
		var examIds = u.exam;
		if(examIds) {
			getExamss({ id: examIds }).then(function(response) {
    	            //exam = response;
    	        //console.log("exam response2  "+ response);
                if(response) {
                	for(var exam of response)
                	{
                         var request = {id:examIds,data:user};
                		 //exam.recordings.push(user);
                		 examController.updatepushExam(request)
                		 console.log("delete model"); 
	//console.log({ uuid:  u.uuid });
	userController.userdelete({ uuid: u.uuid });
	delete sessions[u.uuid];
			             //db.get('exams').find({ id: examId }).assign(exam).write();

                	}
			                
	            }
                });
			//var exam = db.get('exams').find({ id: examId }).value();
			// Mark the student's exam as completed
			// exam.recordings.push(user);
			// db.get('exams').find({ id: examId }).assign(exam).write();
		}
	}
	}
 });
	// Remove user from list
	
}


async function getuserss(response)
{
	const result = await userController.getUsers(response);
	return result;
}

async function getExamss(response)
{
	//console.log(response);
	const result = await examController.getExams(response);
	return result;
}

async function getExamsbyany(response)
{
	//console.log(response);
	const result = await examController.getExamsbyany(response);
	return result;
}

 function MonetUser(connection, proctor, uuid, room ,roomid,name , hash) {
	
   // console.log("exam data monet user  ")
	// Take note of the details
	this.proctor = proctor;
	this.uuid = uuid;
	this.userid = uuid;
	this.room = room;
	this.name = name;
	this.joined = new Date();
	this.janus = {};
	this.roomid = roomid;
	this.hash = hash;
	console.log(this.hash);
	this.responseusers = null;
	var that = this;
	//console.log("webrtc start" + uuid);
	
	//destroySession(uuid);
	// getuserss({ uuid: uuid }).then(function(response) {
 //    	info = response;
 //    if(response) {
	// 	// Get rid of the previous session and its resources
	// //console.log("webrtc" +response + that.uuid)
	// destroySession(that.uuid);
	// }
 //    });
    //var info = await query.exec();
    
	//var info = db.get('users').find({ uuid: uuid }).value();
	
	// Add new user
	var newinfo = {
		proctor: proctor,
		uuid: uuid,
		roomid:roomid,
		name:name,
		janus: { room: room,webcam: null,screen: null, audio :true}
	};
	console.log(newinfo);
	var request = { uuid: uuid };
	//console.log(newinfo);
	if(proctor == "student" || proctor == "proctor" || proctor == "teacher")
	{
		userController.saveUsers(newinfo)
	}

	if(proctor == "manager") 
	{

		addManager.push(uuid);
		//console.log(addManager);

	}
    //userController.saveUsers(newinfo)
	//db.get('users').push(newinfo).write();
	sessions[uuid] = that;

	// Add the user to Janus as a handle
	this.notify = async function(event, content) {
		// Relay the event
		//console.log("contet", content);
		//console.log("event", event);
		sendEvent(event, content);
		// console.log("notify",uuid);
		 // console.log("notify",this.uuid);
		 //  console.log("notify",that.uuid);
		 // console.log("content",content);
		 // console.log("uuid",uuid);
		// console.log("notify",that.uuid);
		// If this is a 'WebRTC up' event, update the metadata
		if(event === "webrtc" && content) {
		// 	console.log("notifys",uuid);
		// console.log("notifyss",this.uuid);
		// console.log("notifysss",that.uuid);
		//user = await getuserss({ uuid: uuid });
		user = await userController.getUsersbyany({ uuid: that.uuid });
		console.log("user",user);
		if(user) {
    	               //console.log("server" + content.stream);
    	               for(var s of user) {
    	               streamdata = content.stream;
			           s.janus[content.stream] = true;
			           var request = { uuid: that.uuid }
			           console.log("uuid",request);
			           var response = s;
			           //const requestdata = {id : { uuid: that.uuid },data: s};
			           const requestdata = {id : request ,data: s};
			            userController.updateUsers(requestdata);
			           //userController.updateUsers(request,response)
		               }
		           }
		}
	}

	// Handle client transport events
	connection.on('message', function(message) {
		if(message.type == 'utf8') {
			monet.debug('[' + that.uuid + '] Got msg:');
			monet.debug(message.utf8Data);
			try {
				var json = JSON.parse(message.utf8Data);
				handleRequest(json);
			} catch(e) {
				//console.log(message);
				sendError(null, 5, "Invalid JSON data: " + e.message);
			};
		}
	});
	connection.on('close', function(reasonCode, description) {
		console.log('[' + that.uuid + '] User disconnected');
		const idfordeleter = that.uuid;

		setTimeout(logout, 50000, idfordeleter);
		
		if(that.uuid) {
			// Remove user
				for(var user in sessions) {
				var session = sessions[user];
				monet.debug("message " + user + " about Janus disconnection");
				if(session) {
					//console.log("user",user);
					//console.log("session",session);
					//session.notify("message", { from: payload["to"] , text: payload["text"] });
				    session.notify("webrtc", { stream: "down", status: "down" , uuid : uuid});
				}
			}
			//sendSuccess(request, transaction);
			//session.notify("webrtc", { stream: stream, status: "down" , uuid : uuid});
		   //leaveRoomMessage(request,transaction, that.roomid,that.uuid);
           destroySession(that.uuid);
			//(that.roomid,that.uuid);
			//setTimeout(function() {destroySession(that.uuid);}, 100);
			

		}
		that.uuid = null;
		connection = null;
	});
  function logout(idfordeleter)
  {

     var session = sessions[idfordeleter];
     if(session){

     }
     else
     {
     var rp = require('http');
     var queryforlogout = 'http://steponexp.net/IHMdata/logout?id='+idfordeleter;
     console.log(queryforlogout);
        rp.get(queryforlogout, (res) => {
        res.on('data', (d) => {
        //	console.log(d);
  	//body = JSON.parse(d);
    //sendEvent("connected", { proctor : that.proctor, sessionId: that.uuid, iceServers:[body.v.iceServers] });
    //process.stdout.write(d);
  });
});
		}
  }
	// Request handler
 function handleRequest(message) {
		// Take note of when we started handling this request
		var startTime = new Date().getTime();
		// Handle it
		//console.log(message);
		//console.log("request accept from message")
		var transaction = message["id"];
		if(!transaction) {
			sendError(transaction, 1, "No transaction ID (id)");
			return;
		}
		var request = message["monet"];
		if(!request) {
			sendError(transaction, 1, "No request type (monet)");
			return;
		}
		monet.debug("Handling " + request + " request...");
		var payload = message["payload"];
		if(!payload) {
			message["payload"] = {};
			payload = {};
		}
		monet.debug("[" + that.uuid + "] Handling " + request + ":");
		monet.debug(payload);
		if(!that.ready) {
			sendError(transaction, 1, "Session still initializing");
			return;
		}
		switch(request) {
			case "ping":
				// How much did this ping-pong take?
				monet.timer("ping[" + that.uuid + "]: " + (new Date().getTime()-startTime) + "ms");
				// Done
				sendSuccess(request, transaction);
				break;
			case "publish":


			    //console.log("publish");
				if(that.proctor) {
					// Only students publish media
					//sendError(transaction, 5, "Unauthorized (not a student)");
					//return;
				}
				// We need an OFFER
				if(!checkExpected(message, "stream") || !checkExpected(message, "jsep"))
					return;
				if(!janus || !janus.isReady() || janus.getState() !== "connected") {
					sendError(transaction, 6, "Janus is down, try again later");
					return;
				}
				var jsep = payload["jsep"];
				//console.log(that.room + "room stu");
				var details = {			
					room: that.room,		
					uuid: that.uuid,
					roomid: that.roomid,
					hash : that.hash,			
					stream: payload["stream"],	
					when: that.joined.getTime(),  
					jsep: jsep	
				};
				//console.log("details",details)
				janus.publish(details, async function(err, result) {
					// Make sure we got an ANSWER back
					//console.log(result);
					//console.log(result)
					//console.log(request)
					//console.log(transaction)
					monet.timer("publish[" + that.uuid + "]: " + (new Date().getTime()-startTime) + "ms");
					if(err) {
						console.log(transaction, 6, "Error negotiating WebRTC session: " + err.error);
					} else {
						//console.log(result);
						// Done
						sendSuccess(request, transaction, { jsep: result.jsep });

						user = await userController.getUsersbyany({ uuid: that.uuid });
		              console.log("user", that.uuid);
		             if(user) {
    	               //console.log("server" + content.stream);
    	               for(var s of user) {
    	               //streamdata = content.stream;
			           s.janus[payload["stream"]] = true;
			           var request = { uuid: that.uuid }
			           console.log("uuid",request);
			           var response = s;
			           //const requestdata = {id : { uuid: that.uuid },data: s};
			           const requestdata = {id : request ,data: s};
			            userController.updateUsers(requestdata);
			           //userController.updateUsers(request,response)
		               }
		           }

						// If this is the webcam, forward it to a GStreamer pipeline too
						if(payload["stream"] === "webcam") {
							janus.forwardWebcam({ uuid: that.uuid });
						}
					}
				});
				break;

			case "subscribe":
				if(!that.proctor) {
					// Only proctors subscribe to media
					//sendError(transaction, 5, "Unauthorized (not a proctor)");
					//return;
				}
				// We need an OFFER
				if(!checkExpected(message, "feed") || !checkExpected(message, "stream"))
					return;
				var info = getuserss({ uuid: payload["feed"] }).then(function(users) {
					student = users;
				if(!users[0]) {
			       sendError(transaction, 5, "No such student");
					return;
		          }

		  //        getExamsbyany({ examid : users[0].exam }).then(function(response) {
    // 	            ex = response;
    // 	            //console.log(response);
    //             if(response) {
	   //          	if(student[0].exam != payload["exam"] || !ex || ex[0].completed == 'yes') {
				// 	// Exam doesn't exist
				// 	sendError(transaction, 5, "No such exam");
				// 	return;
				// }

	   //          }

	            if(!student[0].janus || !student[0].janus.room) {
					// Room doesn't exist
					sendError(transaction, 5, "Student not currently broadcasting");
					return;
				}
				if(!janus || !janus.isReady() || janus.getState() !== "connected") {
					sendError(transaction, 6, "Janus is down, try again later");
					return;
				}
				var details = {
					uuid: that.uuid,			// The proctor (us)
					feed: student[0].uuid,	
					room: student[0].janus.room, 		// The student
					stream: payload["stream"]	// The student's Mic+Webcam or Screen
				};
				console.log(details);
				janus.subscribe(details, function(err, result) {
					// Make sure we got an OFFER back
					monet.debug(result);
					monet.timer("subscribe[" + that.uuid + "]: " + (new Date().getTime()-startTime) + "ms");
					if(err) {
						sendError(transaction, 6, "Error negotiating WebRTC session: " + err.error);
					} else {
						sendSuccess(request, transaction, { jsep: result.jsep });
					}
				});
               // });
            });
				// var student = db.get('users').find({ uuid: payload["uuid"] }).value();
				// if(!student) {
				// 	// Student doesn't exist
				// 	sendError(transaction, 5, "No such student");
				// 	return;
				// }
				
				// var ex = db.get('exams').find({ id: student.exam }).value();
				// if(student.exam !== payload["exam"] || !ex || ex.completed) {
				// 	// Exam doesn't exist
				// 	sendError(transaction, 5, "No such exam");
				// 	return;
				// }
				
				break;
            case "subscribeproctor":
				
				if(!janus || !janus.isReady() || janus.getState() !== "connected") {
					sendError(transaction, 6, "Janus is down, try again later");
					return;
				}
				var roomname = roomid[payload["exam"]].room;
				var details = {
					uuid: that.uuid,
					room: roomname,			// The proctor (us)
					feed: payload["uuid"],
					exam: payload["exam"],			// The student
					stream: payload["stream"]	// The student's Mic+Webcam or Screen
				};
				console.log("subscribeproctor", details);
				janus.subscribeproc(details, function(err, result) {
					// Make sure we got an OFFER back
					monet.debug(result);
					monet.timer("subscribe[" + that.uuid + "]: " + (new Date().getTime()-startTime) + "ms");
					if(err) {
						sendError(transaction, 6, "Error negotiating WebRTC session: " + err.error);
					} else {
						sendSuccess(request, transaction, { jsep: result.jsep });
					}
				});
				break;	
			case "join":
				if(!that.proctor) {
					// Only proctors subscribe to media
					sendError(transaction, 5, "Unauthorized (not a proctor)");
					return;
				}
				// We need an OFFER
				if(!checkExpected(message, "exam") || !checkExpected(message, "uuid") || !checkExpected(message, "stream"))
					return;
				var info = getuserss({ uuid: payload["uuid"] }).then(function(users) {
					student = users;
				if(!users[0]) {
			       sendError(transaction, 5, "No such student");
					return;
		          }

		         getExamsbyany({ examid : users[0].exam }).then(function(response) {
    	            ex = response;
    	            //console.log(response);
                if(response) {
	            	if(student[0].exam != payload["exam"] || !ex || ex[0].completed == 'yes') {
					// Exam doesn't exist
					sendError(transaction, 5, "No such exam");
					return;
				}

	            }

	            if(!student[0].janus || !student[0].janus.room) {
					// Room doesn't exist
					sendError(transaction, 5, "Student not currently broadcasting");
					return;
				}
				if(!janus || !janus.isReady() || janus.getState() !== "connected") {
					sendError(transaction, 6, "Janus is down, try again later");
					return;
				}
                var roomname = roomid[payload["exam"]].room;
				var details = {
					uuid: that.uuid,
					room: roomname,			// The proctor (us)
					feed: student[0].uuid,			// The student
					stream: payload["stream"],
					exam: payload["exam"],
					when: that.joined.getTime(),
					jsep: payload["jsep"]	// The student's Mic+Webcam or Screen
				};
				//console.log(details);
				janus.join(details, function(err, result) {
					// Make sure we got an OFFER back
					// monet.debug(result);
					//console.log(result)
					//console.log(request)
					//console.log(transaction)
					monet.timer("subscribe[" + that.uuid + "]: " + (new Date().getTime()-startTime) + "ms");
					if(err) {
						sendError(transaction, 6, "Error negotiating WebRTC session: " + err.error);
					} else {
						sendSuccess(request, transaction, { jsep: result.jsep });
						// if(payload["stream"] === "webcam") {
						// 	janus.forwardWebcam({ uuid: that.uuid });
						// }
					}
				});
                });
            });
               break;

			case "start":
				if(!that.proctor) {
					// Only proctors subscribe to media
					sendError(transaction, 5, "Unauthorized (not a proctor)");
					return;
				}
				// We need an OFFER
				if(!checkExpected(message, "stream") || !checkExpected(message, "jsep"))
					return;
				if(!janus || !janus.isReady() || janus.getState() !== "connected") {
					sendError(transaction, 6, "Janus is down, try again later");
					return;
				}
				var details = {
					uuid: that.uuid,			// The proctor (us)
					stream: payload["stream"],	// The student's Mic+Webcam or Screen
					jsep: payload["jsep"]		// The SDP answer
				};
				janus.start(details, function(err, result) {
					monet.debug(result);
					monet.timer("start[" + that.uuid + "]: " + (new Date().getTime()-startTime) + "ms");
					if(err) {
						sendError(transaction, 6, "Error negotiating WebRTC session: " + err.error);
					} else {
						sendSuccess(request, transaction);
					}
				});
				break;
			case "trickle":
				if(!checkExpected(message, "stream") || !checkExpected(message, "candidate"))
					return;
				if(!janus || !janus.isReady() || janus.getState() !== "connected") {
					sendError(transaction, 6, "Janus is down, try again later");
					return;
				}
				janus.trickle({
					uuid: that.uuid,						// The student or proctor
					stream: payload["stream"],				// Mic+Webcam or Screen
					candidate: payload["candidate"]			// The trickle candidated
				});
				// How much did this take?
				monet.timer("trickle[" + that.uuid + "]: " + (new Date().getTime()-startTime) + "ms");
				// Done
				sendSuccess(request, transaction);
				break;
			case "message":
			var details = {roomid:payload["to"]};
			console.log("message", details);
      	    userController.getUsersbyany(details).then(function(getdata) { 
				//var to = sessions[payload["to"]];
				console.log(getdata);
				for(var datafrom of getdata)
				{
				//	console.log(datafrom);
				//var to = sessions[datafrom.uuid];
				var to = sessions[datafrom.uuid];
				if(!to) {
					// User doesn't exist
					sendError(transaction, 5, "No such user");
					//return;
				}
				// if(!that.proctor && !to.proctor) {
				// 	// Only proctors subscribe to media
				// 	sendError(transaction, 5, "Unauthorized (only proctors can message other students)");
				// 	//return;
				// }
				// Relay the message
				// to.notify("sendstatusapi", { from: payload["from"], text: payload["text"] });
				else
				{
				if(datafrom.janus.webcam === true)
				{
				 //console.log(payload["from"] + "_" + datafrom.uuid)
                 to.notify("message",  { from: payload["to"] , text: payload["text"] , name: payload["name"] , details : datafrom });
                 sendSuccess(request, transaction);
				}
				}
				
			} 
		});
				// Done
				//console.log("sendstatusapi : " + payload["from"]);
				

			// 	for(var user in sessions) {
			// 	var session = sessions[user];
			// 	monet.debug("message " + user + " about Janus disconnection");
			// 	if(session) {
			// 		//console.log("user",user);
			// 		//console.log("session",session);
			// 		session.notify("message", { from: payload["to"] , text: payload["text"] });
			// 	}
			// }
			// sendSuccess(request, transaction);
				
				break;
    case "messageall":
			var details = {roomid:payload["to"]};
			console.log("message", details);
      	    userController.getUsersbyany(details).then(function(getdata) { 
				//var to = sessions[payload["to"]];
				console.log(getdata);
				for(var datafrom of getdata)
				{
				//	console.log(datafrom);
				//var to = sessions[datafrom.uuid];
				var to = sessions[datafrom.uuid];
				if(!to) {
					// User doesn't exist
					sendError(transaction, 5, "No such user");
					//return;
				}
				// if(!that.proctor && !to.proctor) {
				// 	// Only proctors subscribe to media
				// 	sendError(transaction, 5, "Unauthorized (only proctors can message other students)");
				// 	//return;
				// }
				// Relay the message
				// to.notify("sendstatusapi", { from: payload["from"], text: payload["text"] });
				else
				{
				//if(datafrom.janus.webcam === true)
				{
				 //console.log(payload["from"] + "_" + datafrom.uuid)
                 to.notify("message",  { from: payload["to"] , text: payload["text"] , name: payload["name"] , details : datafrom });
                 sendSuccess(request, transaction);
				}
				}
				
			} 
		});
      	    break;


      case "messageallsupport":
      var details = {roomid:payload["to"]};
			console.log("messageallsupport", details);
      	    userController.getUsersbyany(details).then(function(getdata) { 
				//var to = sessions[payload["to"]];
				console.log(getdata);
				for(var datafrom of getdata)
				{
				//	console.log(datafrom);
				//var to = sessions[datafrom.uuid];
				var to = sessions[datafrom.uuid];
				if(!to) {
					// User doesn't exist
					sendError(transaction, 5, "No such user");
					//return;
				}
				// if(!that.proctor && !to.proctor) {
				// 	// Only proctors subscribe to media
				// 	sendError(transaction, 5, "Unauthorized (only proctors can message other students)");
				// 	//return;
				// }
				// Relay the message
				// to.notify("sendstatusapi", { from: payload["from"], text: payload["text"] });
				else
				{
				//if(datafrom.janus.webcam === true)
				{
				 //console.log(payload["from"] + "_" + datafrom.uuid)
                 to.notify("messageallsupport",  { from: payload["to"] , text: payload["text"] , name: payload["name"] , details : datafrom });
                 sendSuccess(request, transaction);
				}
				}
				
			} 
		});

      break;	    
			case "messageonetoone":
			var details = {"uuid":payload["to"]};
			var date_ob = new Date();
					var data_ob = {
			          to: payload['to'],
			          from: payload["text"].userid,
			          msg: payload["text"].msg,
			          date_time: date_ob,
			        };
			    messageController.savemessage(data_ob);    
			console.log("message", details);
      	    userController.getUsersbyany(details).then(function(getdata) { 
				//var to = sessions[payload["to"]];
				console.log(getdata);
				for(var datafrom of getdata)
				{

					
			        console.log(data_ob);
			        //console.log({to:payload["to"].split('_')[0], from: that.uuid.split('_')[0], msg: payload["text"],date_time:date_ob });
			        
				//	console.log(datafrom);
				//var to = sessions[datafrom.uuid];
				var to = sessions[datafrom.uuid];
				if(!to) {
					// User doesn't exist
					sendError(transaction, 5, "No such user");
					//return;
				}
				// if(!that.proctor && !to.proctor) {
				// 	// Only proctors subscribe to media
				// 	sendError(transaction, 5, "Unauthorized (only proctors can message other students)");
				// 	//return;
				// }
				// Relay the message
				// to.notify("sendstatusapi", { from: payload["from"], text: payload["text"] });
				else
				{
				//if(datafrom.janus.webcam === true)
				{
				 //console.log(payload["from"] + "_" + datafrom.uuid)
                 to.notify("messageonetoone",  { from: payload["to"] , text: payload["text"] , name: payload["name"] , details : datafrom });
                 sendSuccess(request, transaction);
				}
				}
				
			} 
		});
				// Done
				//console.log("sendstatusapi : " + payload["from"]);
				

			// 	for(var user in sessions) {
			// 	var session = sessions[user];
			// 	monet.debug("message " + user + " about Janus disconnection");
			// 	if(session) {
			// 		//console.log("user",user);
			// 		//console.log("session",session);
			// 		session.notify("message", { from: payload["to"] , text: payload["text"] });
			// 	}
			// }
			// sendSuccess(request, transaction);
				
				break;	
			case "sendstatustudentforone":
				// if(!checkExpected(message, "to") || !checkExpected(message, "text"))
				// 	return;
				//for (var i = 0; i <=addProctor.length-1 ; i++) {
			//console.log("sendstatustudent");
			var details = {roomid:payload["text"]};
			console.log("dasdas",payload);
			var userdatas = null;
      	    var userdetails = {uuid:payload["from"]};
			userController.getUsersbyany(userdetails).then(function(userdata)
				{
					userdatas = userdata;
				// console.log("userdata");
    //   	        userController.getUsersbyany(details).then(function(getdata) { 
				// //var to = sessions[payload["to"]];
				// for(var datafrom of getdata)
				// {
				// 	//console.log(datafrom);
				var to = sessions[payload["to"]];
				if(!to) {
					// User doesn't exist
					sendError(transaction, 5, "No such user");
					//return;
				}
				else
				{
					//if(payload["from"] != datafrom.uuid)
				{
				 //console.log(payload["from"] + "_" + datafrom.uuid)
                 to.notify("sendstatustudent", { from: payload["from"], text: payload["from"] , details : userdata[0] , user_type : payload["user_type"] });
                 sendSuccess(request, transaction);
				}
				}
				// if(!that.proctor && !to.proctor) {
				// 	// Only proctors subscribe to media
				// 	sendError(transaction, 5, "Unauthorized (only proctors can message other students)");
				// 	//return;
				// }
				// Relay the message
				// to.notify("sendstatusapi", { from: payload["from"], text: payload["text"] });
				
			// }
			// 	// Done
			// 	//console.log("sendstatusapi : " + payload["from"]);
				
			// });

    //   	        for(var managerids of addManager)
				// 	{
				// var to = sessions[managerids];
	   //          //console.log("to",to);
				// if(!to) {
				// 	// User doesn't exist
				// 	sendError(transaction, 5, "No such user");
				// 	//return;
				// }
				// //console.log("data", { from: payload["from"], text: userdata[0].proctor , details : userdata[0] , user_type : payload["user_type"] });
				// to.notify("sendstatusmanager", { from: payload["from"], text: userdata[0].proctor , details : userdata[0] , user_type : payload["user_type"] });
                 
				// //to.notify("sendstatusmanager", { from: payload["from"], text: payload["text"], user_type : payload["user_type"] });
				// // Done
				// //console.log("sendstatusapi : " + payload["from"]);
				// sendSuccess(request, transaction);
    //   	    }

				});
            //console.log(addManager);
			
			
      	    
				break;

			case "sendstatustudent":
				// if(!checkExpected(message, "to") || !checkExpected(message, "text"))
				// 	return;
				//for (var i = 0; i <=addProctor.length-1 ; i++) {
			//console.log("sendstatustudent");
			var details = {roomid:payload["text"]};
			console.log(details);
			var userdatas = null;
      	    var userdetails = {uuid:payload["from"]};
			userController.getUsersbyany(userdetails).then(function(userdata)
				{
					userdatas = userdata;
				console.log("userdata");
      	        userController.getUsersbyany(details).then(function(getdata) { 
				//var to = sessions[payload["to"]];
				for(var datafrom of getdata)
				{
					//console.log(datafrom);
				var to = sessions[datafrom.uuid];
				if(!to) {
					// User doesn't exist
					sendError(transaction, 5, "No such user");
					//return;
				}
				else
				{
					if(payload["from"] != datafrom.uuid)
				{
				 //console.log(payload["from"] + "_" + datafrom.uuid)
                 to.notify("sendstatustudent", { from: payload["from"], text: userdata[0].proctor , details : userdata[0] , user_type : payload["user_type"] });
                 sendSuccess(request, transaction);
				}
				}
				// if(!that.proctor && !to.proctor) {
				// 	// Only proctors subscribe to media
				// 	sendError(transaction, 5, "Unauthorized (only proctors can message other students)");
				// 	//return;
				// }
				// Relay the message
				// to.notify("sendstatusapi", { from: payload["from"], text: payload["text"] });
				
			}
				// Done
				//console.log("sendstatusapi : " + payload["from"]);
				
			});

      	        for(var managerids of addManager)
					{
				var to = sessions[managerids];
	            //console.log("to",to);
				if(!to) {
					// User doesn't exist
					sendError(transaction, 5, "No such user");
					//return;
				}
				//console.log("data", { from: payload["from"], text: userdata[0].proctor , details : userdata[0] , user_type : payload["user_type"] });
				to.notify("sendstatusmanager", { from: payload["from"], text: userdata[0].proctor , details : userdata[0] , user_type : payload["user_type"] });
                 
				//to.notify("sendstatusmanager", { from: payload["from"], text: payload["text"], user_type : payload["user_type"] });
				// Done
				//console.log("sendstatusapi : " + payload["from"]);
				sendSuccess(request, transaction);
      	    }

				});
            //console.log(addManager);
			
			
      	    
				break;		
            
            case "sendToggle":
				// if(!checkExpected(message, "to") || !checkExpected(message, "text"))
				// 	return;
				//for (var i = 0; i <=addProctor.length-1 ; i++) {
			var details = {roomid:payload["roomid"]};
			//console.log(details);
      	    var userdetails = {uuid:payload["from"]};
			userController.getUsersbyany(userdetails).then(function(userdata)
				{

				for(var s of userdata)
				{
					   s.janus.audio = payload["status"];
			           //const requestdata = {id : { uuid: that.uuid },data: s};
			           const requestdata = {id : userdetails ,data: s};
			            userController.updateUsers(requestdata);
				}	
				//console.log("userdata",userdata);
      	        userController.getUsersbyany(details).then(function(getdata) { 
				//var to = sessions[payload["to"]];
				for(var datafrom of getdata)
				{
					//console.log(datafrom);
				var to = sessions[datafrom.uuid];
				if(!to) {
					// User doesn't exist
					sendError(transaction, 5, "No such user");
					//return;
				}
				// if(!that.proctor && !to.proctor) {
				// 	// Only proctors subscribe to media
				// 	sendError(transaction, 5, "Unauthorized (only proctors can message other students)");
				// 	//return;
				// }
				// Relay the message
				// to.notify("sendstatusapi", { from: payload["from"], text: payload["text"] });
				if(payload["from"] != datafrom.uuid)
				{
				 //console.log(payload["from"] + "_" + datafrom.uuid)
                 to.notify("sendToggle", { from: payload["from"], details:payload , id : userdata[0].uuid , otherdetails : userdata  });
                 sendSuccess(request, transaction);
				}
			}
				// Done
				//console.log("sendstatusapi : " + payload["from"]);
				
			});

				});

			for(var managerids of addManager)
					{
				var to = sessions[managerids];
				if(!to) {
					// User doesn't exist
					sendError(transaction, 5, "No such user");
					//return;
				}
				to.notify("sendToggle", { from: payload["from"], text: payload["text"], user_type : payload["user_type"] });
				// Done
				//console.log("sendstatusapi : " + payload["from"]);
				sendSuccess(request, transaction);
      	    }
			
      	    
			break;	
			case "sendbackstatus":
				// if(!checkExpected(message, "to") || !checkExpected(message, "text"))
				// 	return;
				//for (var i = 0; i <=addProctor.length-1 ; i++) {
			var details = {roomid:payload["text"]};
			console.log("sendbackstatus", details);
      	    userController.getUsersbyany(details).then(function(getdata) { 
				//var to = sessions[payload["to"]];
				console.log(getdata);
				for(var datafrom of getdata)
				{
				//	console.log(datafrom);
				//var to = sessions[datafrom.uuid];
				var to = sessions[payload["from"]];
				if(!to) {
					// User doesn't exist
					sendError(transaction, 5, "No such user");
					//return;
				}
				// if(!that.proctor && !to.proctor) {
				// 	// Only proctors subscribe to media
				// 	sendError(transaction, 5, "Unauthorized (only proctors can message other students)");
				// 	//return;
				// }
				// Relay the message
				// to.notify("sendstatusapi", { from: payload["from"], text: payload["text"] });
				if(payload["from"] != datafrom.uuid)
				{
				 console.log(payload["from"] + "_" + datafrom.uuid)
                 to.notify("sendbackstatus", { from: datafrom.uuid, text: datafrom.roomid , details : datafrom ,  user_type : payload["user_type"] });
                 sendSuccess(request, transaction);
				}
			}
				// Done
				//console.log("sendstatusapi : " + payload["from"]);
				
			});
      	    
				break;		

			case "sendstatusapi":
				// if(!checkExpected(message, "to") || !checkExpected(message, "text"))
				// 	return;
				//for (var i = 0; i <=addStudent.length-1 ; i++) {
				//var to = sessions[payload["to"]];
				// if(addManager.length>0)
				// {
					//console.log("manager", addManager);
					//for (var i = 0; i <=addManager.length-1 ; i++)
					for(var managerids of addManager)
					{
					//console.log("manager id ", managerids);
				var to = sessions[managerids];

						//console.log("to id ",to);
				if(!to) {
					// User doesn't exist
					sendError(transaction, 5, "No such user");
					//return;
				}
				else{
					to.notify("sendstatusapi", { from: payload["from"], text: payload["text"], user_type : payload["user_type"] });
				// Done
				//console.log("sendstatusapi : " + payload["from"]);
				sendSuccess(request, transaction);
			

				}
				// if(!that.proctor && !to.proctor) {
				// 	// Only proctors subscribe to media
				// 	sendError(transaction, 5, "Unauthorized (only proctors can message other students)");
				// 	//return;
				// }
				// Relay the message
				}
				//}
				
			//}
				break;		
			case "hangup":
				if(!checkExpected(message, "stream"))
					return;
				if(!janus || !janus.isReady() || janus.getState() !== "connected") {
					sendError(transaction, 6, "Janus is down, try again later");
					return;
				}
				var details = {
					uuid: that.uuid,						// The student or proctor
					stream: payload["stream"]				// Mic+Webcam or Screen
				};
				
				leaveRoomMessage(request,transaction, that.roomid,that.uuid);
				setTimeout(function() {destroySession(that.uuid);}, 2000);
				setTimeout(function() {
				janus.hangup(details, function(err) {
					if(err) {
						sendError(transaction, 6, "Error stopping WebRTC sessions: " + err.error);
					} else {
						// How much did this take?
						monet.timer("hangup[" + that.uuid + "]: " + (new Date().getTime()-startTime) + "ms");
						// Done
						sendSuccess(request, transaction);
					}
				});
				}, 2000);
				break;
			default:
				sendError(transaction, 4, "Unknown request type " + request);
				return;
		}
	}

	function checkExpected(message, attribute) {
		var value = message["payload"][attribute];
		if(!value) {
			sendError(message["id"], 3, "Missing mandatory attribute: " + attribute);
			return false;
		}
		return true;
	}

	function leaveRoomMessage(request ,transaction, roomid,uuid)
{
console.log("leave");
var details = {roomid:roomid};
			//console.log(details);
      	    var userdetails = {uuid:uuid};
			userController.getUsersbyany(userdetails).then(function(userdata)
				{
				//console.log("length",userdata);
				if(userdata.length>0)
				{

      	        userController.getUsersbyany(details).then(function(getdata) { 
				//var to = sessions[payload["to"]];
				for(var datafrom of getdata)
				{
					//console.log(datafrom);
				var to = sessions[datafrom.uuid];
				if(!to) {
					// User doesn't exist
					sendError(transaction, 5, "No such user");
					//return;
				}
				// if(!that.proctor && !to.proctor) {
				// 	// Only proctors subscribe to media
				// 	sendError(transaction, 5, "Unauthorized (only proctors can message other students)");
				// 	//return;
				// }
				// Relay the message
				// to.notify("sendstatusapi", { from: payload["from"], text: payload["text"] });
				if(uuid != datafrom.uuid)
				{
				 //console.log(payload["from"] + "_" + datafrom.uuid)
                 to.notify("leave", { from: uuid,  details : userdata[0]  });
                 sendSuccess(request, transaction);
				}
			}
				// Done
				//console.log("sendstatusapi : " + payload["from"]);
				
			});

      	        for(var managerids of addManager)
					{
				var to = sessions[managerids];
				if(!to) {
					// User doesn't exist
					sendError(transaction, 5, "No such user");
					//return;
				}
				to.notify("leave", { from: uuid,details : userdata[0] });
				// Done
				//console.log("sendstatusapi : " + payload["from"]);
				sendSuccess(request, transaction);
      	    }
      	}


				});

			

}

	function sendError(transaction, code, reason) {
		// Send an error message: we need the transaction ID, the error
		// code and a verbose description of the error itself
		monet.err("[" + that.uuid + "] Error #" + code + ": " + reason);
		var error = {
			monet: "error",
			id: transaction,
			payload: {
				code: code,
				reason: reason
			}
		};
		send(error);
	}

	function sendSuccess(type, transaction, payload) {
		// Send a success message: we need the original request, the transaction
		// ID, and the payload of the response to send back to the user
		var message = {
			monet: "success",
			id: transaction,
			payload: payload
		};
		send(message);
	}

	function sendEvent(name, payload) {
		// Send an event: we need the event name and optionally its content
		var message = {
			monet: "event",
			name: name,
			payload: payload
		};
		send(message);
	}

	// Private method to create random identifiers (e.g., transaction)
	function randomString(len) {
		charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var randomString = '';
		for (var i = 0; i < len; i++) {
			var randomPoz = Math.floor(Math.random() * charSet.length);
			randomString += charSet.substring(randomPoz,randomPoz+1);
		}
		return randomString;
	}

	// Private method to send messages from the wrapper
	function send(message) {
		if(connection) {
			monet.debug('Sending response/event:', message);
			connection.sendUTF(JSON.stringify(message));
		}
	}

try {

	// Add the user to the Janus wrapper
	 // console.log(that);
	 // exit();

	console.log({ uuid: that.uuid, notify: that.notify , proctor: that.proctor});
	janus.addSession({ uuid: that.uuid, userid:that.userid, notify: that.notify , proctor: that.proctor});
	if(that.proctor) {
		// We're done
		// if(that.uuid.indexOf("_")==-1)
		// {
		// 	addProctor.push(that.uuid);
		// }
		
		// 	console.log(addProctor);
		that.ready = true;
		var rp = require('http');
        rp.get('http://webrtc.monetrewards.com/iceserver1.php', (res) => {
        //console.log('statusCode:', res.statusCode);
        //console.log('headers:', res.headers);

  res.on('data', (d) => {
  	body = JSON.parse(d);
    sendEvent("connected", { proctor : that.proctor, sessionId: that.uuid, iceServers:[body.v.iceServers] });
    //process.stdout.write(d);
  });

}).on('error', (e) => {
  console.error(e);
});
		//sendEvent("connected");
	} else {

		if(that.uuid.indexOf("_")==-1)
		{
			addStudent.push(that.uuid);
		}
		// Create a VideoRoom for this user
		janus.createRoom({}, function(err, res) {
			if(err) {
				// Something went wrong
				console.log(err.error);
				sendEvent("error", { error: err.error });
				return;
			}
			that.room = res.room;
			roomdata["room"] = res.room ;

			roomid[that.exam] = roomdata ; 
			// console.log(this.uuid);
			// console.log(that.uuid);
			// Update the user details
			// var info = getuserss({ uuid: this.uuid }).then(function(users) {
			// 	//var janus = { room: that.room };
			// 	for(var s of users) {
			//        s.janus.room = that.room;

   //                 console.log(that.room);
			//        const requestdata = {id : { _id: s._id },data: s};
   //                 //console.log(request);
			//        //var response = s;
			//        userController.updateUsers(requestdata,res);
		 //          }
   //  	    //user.janus = { room: that.room }
			
   //          });

			//var user = db.get('users').find({ uuid: that.uuid }).value();
			//user.janus = { room: that.room },
			//db.get('users').find({ uuid: that.uuid }).assign(user).write();
			// We're done
			that.ready = true;
			var rp = require('https');
            rp.get('https://webrtc.monetrewards.com/iceserver1.php', (res) => {
             //console.log('statusCode:', res.statusCode);
  //console.log('headers:', res.headers);

  res.on('data', (d) => {
  	body = JSON.parse(d);
    sendEvent("connected", { sessionId: that.uuid, iceServers:[body.v.iceServers] });
    //process.stdout.write(d);
  });

}).on('error', (e) => {
  console.error(e);
});
			// sendEvent("connected");
		});
	}
}
catch (e) {
	sendEvent("error", { message: e });
}

};
