/*
 * Author:    Lorenzo Miniero
 * Copyright: Meetecho
 *
 */

var pcpublish = null;
var pcsubscribe = null;
var streamdata = null;
var livecalling = 0;
var urlwebsite = location.href.substring(0, location.href.lastIndexOf("/")+1);
coms.noop = function() {};
//debugger;
// Adapter

coms.webRTCAdapter = adapter;
if(window.location.protocol=="http:")
{
  // window.location.href = urlwebsite;
}
// Helper method to check whether WebRTC is supported by this browser
// coms.isWebrtcSupported = function() {
// 	return !!window.RTCPeerConnection;
// };
coms.isWebrtcSupported = function() {
	return window.RTCPeerConnection !== undefined && window.RTCPeerConnection !== null &&
		navigator.mediaDevices.getUserMedia !== undefined && navigator.mediaDevices.getUserMedia !== null;
};

// Helper methods to attach/reattach a stream to a video element (previously part of adapter.js)
coms.attachMediaStream = function(element, stream) {
	try {
		element.srcObject = stream;
	} catch (e) {
		try {
			element.src = URL.createObjectURL(stream);
		} catch (e) {
			console.error("Error attaching stream to element");
		}
	}
};
coms.reattachMediaStream = function(to, from) {
	try {
		to.srcObject = from.srcObject;
	} catch (e) {
		try {
			to.src = from.src;
		} catch (e) {
			console.error("Error reattaching stream to element");
		}
	}
};

function coms() {

	var that = this;

	// We use this method to register callbacks
	this.callbacks = {};
	this.on = function(event, callback) {
		that.callbacks[event] = callback;
	}

	// Connection to server
	this.server = null;
    var pc = {};
    var pc1 = {};
    var pc2 = {}
	// WebRTC stuff
	var myStream = {};
	var iceServers = "";
	//var iceServers = [{ urls: "stun:stun.l.google.com:19302" }];
	
	var sdpSent = {};
	// theUrl = "https://webrtc.monetrewards.com/iceserver1.php";
	// var request = new XMLHttpRequest();
 //    request.open('GET', theUrl, false);  // `false` makes the request synchronous
 //    request.send(null);

 //    if (request.status === 200) {
 //      iceServers = request.responseText ;
 //      iceServers = JSON.parse(iceServers);
 //      iceServers = [iceServers.v.iceServers];
 //      //iceServers = [{"iceServers" :iceServers}];
 //    }
    

	//

	// Wrapper

	this.attachMediaStreamss = async function(element, stream) {
	try {
		element.srcObject = stream;
	} catch (e) {
		try {
			element.src = URL.createObjectURL(stream);
		} catch (e) {
			console.error("Error attaching stream to element");
		}
	}
};

	this.connect = async function(details, callback) {
		callback = (typeof callback == "function") ? callback : coms.noop;
		if(!details || !details.uuid) {

			
			console.error("Invalid arguments");
			callback("Invalid arguments");
			//window.location.href = urlwebsite ;
			return;
		}
		if(details.proctor)
			that.proctor = true;
		var protocol = (window.location.protocol == "https:" ? "wss" : "ws");
		protocol = "wss";
		var address = protocol + "://steponexp.net:8096/" + btoa(JSON.stringify(details));
		//var address = protocol + "://ngnx.monetrewards.com:/many/" + btoa(JSON.stringify(details));
		//this.server = new WebSocket(address, 'monet-proctoring-protocol');
		async function socketcon()
		{
		let con =  new WebSocket(address, 'monet-proctoring-protocol');	
		return con;
		}
		this.server  = await socketcon();
		this.server.onerror = function(error) {
			console.log("Rejected by server:", error);
			server = null;
			callback(error);
		};
		this.server.onclose = function(event) {
			console.log("Disconnected from server (closed):", event);
			server = null;
			var disconnectedCB = (typeof that.callbacks["disconnected"] == "function") ? that.callbacks["disconnected"] : coms.noop;
			disconnectedCB();
		};
		this.server.onmessage = function(message) {
			// console.log(message);
			var json = JSON.parse(message.data);
			var transaction = json["id"];
			if(transaction) {
				// This is a response
				var reportResult = transactions[transaction];
				if(reportResult)
					reportResult(json);
				delete transactions[transaction];
			} else if(json["monet"] === "event") {
				// This is an event
				var event = json["name"];
				if(event === "connected") {
					var info = json["payload"];
					//console.log('Connected event: ' + info);
					if(info.iceServers)
						iceServers = info.iceServers;
					var connectedCB = (typeof that.callbacks["connected"] == "function") ? that.callbacks["connected"] : coms.noop;
					connectedCB(info);
				} else if(event === "error") {
					var info = json["payload"];
					console.log('Error:', info);
					var errorCB = (typeof that.callbacks["error"] == "function") ? that.callbacks["error"] : coms.noop;
					errorCB(info);
				} else if(event === "webrtc") {
					var info = json["payload"];
					console.log('WebRTC event:', info);
					var webrtcCB = (typeof that.callbacks["webrtc"] == "function") ? that.callbacks["webrtc"] : coms.noop;
					webrtcCB(info);
					if(info.status === "down")
					{
						//that.hangup(info.stream);
					}
				} else if(event === "join") {
					var info = json["payload"];
					console.log('WebRTC event:', info);
					var webrtcCB = (typeof that.callbacks["join"] == "function") ? that.callbacks["join"] : coms.noop;
					webrtcCB(info);
					if(info.status === "down")
					{
						//that.hangup(info.stream);
					}
				}  else if(event === "sendToggle") { 
					var info = json["payload"];
					//console.log('Message event', info);
					var messageCB = (typeof that.callbacks["sendToggle"] == "function") ? that.callbacks["sendToggle"] : MonetDemo.noop;
					messageCB(info);
				}
				else if(event === "subscribeproctor") {
					var info = json["payload"];
					console.log('WebRTC event:', info);
					var webrtcCB = (typeof that.callbacks["join"] == "function") ? that.callbacks["join"] : coms.noop;
					webrtcCB(info);
					if(info.status === "down")
					{
						//that.hangup(info.stream);
					}
				} else if(event === "message") {
					var info = json["payload"];
					//console.log('Message event', info);
					var messageCB = (typeof that.callbacks["message"] == "function") ? that.callbacks["message"] : coms.noop;
					messageCB(info);
				} else if(event === "sendmessages") {
					var info = json["payload"];
					//console.log('Message event', info);
					var messageCB = (typeof that.callbacks["sendmessages"] == "function") ? that.callbacks["sendmessages"] : coms.noop;
					messageCB(info);
				} else if(event === "messageallsupport") {
					var info = json["payload"];
					//console.log('Message event', info);
					var messageCB = (typeof that.callbacks["messageallsupport"] == "function") ? that.callbacks["messageallsupport"] : coms.noop;
					messageCB(info);
				} else if(event === "senddollarmessage") {
					var info = json["payload"];
					//console.log('Message event', info);
					//var messageCB = (typeof that.callbacks["senddollarmessage"] == "function") ? that.callbacks["senddollarmessage"] : coms.noop;
					senddollarmessage(info);
				}  else if(event === "messageonetoone") {
					var info = json["payload"];
					if(info.text.userid === "supportpanel")
					{
                       //var messageCB = (typeof that.callbacks["supportpanel"] == "function") ? that.callbacks["supportpanel"] : coms.noop;
					   supportpanelmsg(info);
					}
					else
					{
						var messageCB = (typeof that.callbacks["messageonetoone"] == "function") ? that.callbacks["messageonetoone"] : coms.noop;
					    messageCB(info);
					}
					//console.log('Message event', info);
					
					
				} else if(event === "sendstatusapi") {
					var info = json["payload"];
					//console.log('sendstatusapi', info);
					var messageCB = (typeof that.callbacks["sendstatusapi"] == "function") ? that.callbacks["sendstatusapi"] : coms.noop;
					messageCB(info);
				}else if(event === "sendstatustudent") {
					var info = json["payload"];
					//console.log('sendstatustudent', info);  
					var messageCB = (typeof that.callbacks["sendstatustudent"] == "function") ? that.callbacks["sendstatustudent"] : coms.noop;
					messageCB(info);
					var messageCB = (typeof that.callbacks["sendstatustudentjs"] == "function") ? that.callbacks["sendstatustudentjs"] : coms.noop;
					messageCB(info);
				}else if(event === "sendbackstatus") {
					var info = json["payload"];
					console.log('sendbackstatus', info);
					var messageCB = (typeof that.callbacks["sendbackstatus"] == "function") ? that.callbacks["sendbackstatus"] : coms.noop;
					messageCB(info);
				}else if(event === "leave") {
					var info = json["payload"];
					//console.log('leave', info);
					var messageCB = (typeof that.callbacks["leave"] == "function") ? that.callbacks["leave"] : coms.noop;
					messageCB(info);
				}else if(event === "destroyed") {
					console.log('Destroyed event');
					var destroyedCB = (typeof that.callbacks["destroyed"] == "function") ? that.callbacks["destroyed"] : coms.noop;
					destroyedCB();
				} else if(event === "sendstatusmanager") {
					var info = json["payload"];
					//console.log('sendbackstatus', info);
					var messageCB = (typeof that.callbacks["sendstatusmanager"] == "function") ? that.callbacks["sendstatusmanager"] : coms.noop;
					messageCB(info);
				} else { 
					
					console.log("Unhandled event", event);
				}
			}
		};
		this.server.onopen = function() {
			callback();
		};
	}

	// Setup a WebRTC PeerConnection to publish something
	this.publish = function(details, callback) {
		callback = (typeof callback == "function") ? callback : coms.noop;
		if(!details || !details.stream || (details.stream !== "webcam" && details.stream !== "screen")) {
			callback("Invalid arguments");
			return;
		}
		var type = details.stream;
		//if(that.proctor) {
		//	callback("Only students can publish");
		//	return;
		//}
		if(pc[type]) {
			callback("Already publishing the " + type);
			return;
		}
		if(type === "webcam") {
			publishWebcam(callback);
		} else if(type === "screen") {
			publishScreen(callback);
		} else {
			callback("Unsupported media type " + type);
			return;
		}
	}
	// Private method to publish the webcam
	function publishWebcams(callback) {
		var consentCB = (typeof that.callbacks["consent"] == "function") ? that.callbacks["consent"] : coms.noop;
		consentCB(true);
		navigator.mediaDevices.getUserMedia({ audio: true, video: true })
			.then(function(stream) {
				streamdata = stream;
				consentCB(false);
				myStream["webcam"] = stream;
				// Create PeerConnection
				var pc_config = iceServers;
				var pc_constraints = {
					"optional": [{"DtlsSrtpKeyAgreement": true}]
				};
				pc["webcam"] = new RTCPeerConnection({
					"iceServers": iceServers,
					pc_constraints,
				});
				pc["webcam"].onicecandidate = function(event) {
					// Trickle candidate (or the end of the gathering process)
					var candidate = null;
					if(event.candidate === null) {
						candidate = { completed: true };
					} else {
						candidate = {
							candidate: event.candidate.candidate,
							sdpMid: event.candidate.sdpMid,
							sdpMLineIndex: event.candidate.sdpMLineIndex
						};
					}
					console.log("Trickling candidate:", candidate);
					var msg = {
						monet: "trickle",
						id: randomString(16),
						payload: {
							stream: "webcam",
							candidate: candidate
						}
					};
					sendMsg(msg);
				};
				pc["webcam"].addStream(stream);
				var previewCB = (typeof that.callbacks["preview"] == "function") ? that.callbacks["preview"] : coms.noop;
				previewCB("webcam", stream);

				pc["webcam"].ontrack = function(event) {
			console.log("Handling Remote Track:", event);
			if(!event.streams)
				return;
			var remoteCB = (typeof that.callbacks["remote"] == "function") ? that.callbacks["remote"] : coms.noop;
			remoteCB("webcam", event.streams[0]);
		};
				// Create offer
				pc["webcam"].createOffer(
					function(offer) {
						if(sdpSent["webcam"] === true) {
							console.log("Offer already sent, not sending it again");
							return;
						}
						sdpSent["webcam"] = true;
						pc["webcam"].setLocalDescription(offer);
						var jsep = {
							type: offer.type,
							sdp: offer.sdp
						};
						// Send the publish request
						var msg = {
							monet: "publish",
							id: randomString(16),
							payload: {
								stream: "webcam",
								jsep: jsep
							}
						};
						sendMsg(msg, function response(result) {
							console.log("Got answer to offer");
							if(result["monet"] === "error") {
								that.hangup("webcam");
								console.log(result["payload"]["reason"]);
								callback(result["payload"]["reason"]);
								return;
							}
							var remoteJsep = result["payload"]["jsep"];
							console.log(remoteJsep);
							pc["webcam"].setRemoteDescription(
								new RTCSessionDescription(remoteJsep),
								function() {
									console.log("Remote description accepted!");
									callback();
								}, function(error) {
									that.hangup("webcam");
									console.log(error);
									callback(error);
								});
						});
					}, function(error) {
						that.hangup("webcam");
						console.log(error);
						callback(error);
					});
			},
			function(error) {
				consentCB(false);
				console.log(error);
				callback(error);
			});
	}


	this.join = function(details, callback) {
		callback = (typeof callback == "function") ? callback : coms.noop;
		if(!details || !details.stream || (details.stream !== "webcam" && details.stream !== "screen")) {
			callback("Invalid arguments");
			return;
		}
		var type = details.stream;
		// if(that.proctor) {
		// 	callback("Only students can publish");
		// 	return;
		// }
		if(pc[type]) {
			callback("Already publishing the " + type);
			return;
		}
		if(type === "webcam") {
			joinWebcam(callback);
		} else if(type === "screen") {
			joinScreen(callback);
		} else {
			callback("Unsupported media type " + type);
			return;
		}
	}
	// Private method to publish the webcam
	this.joinwebcams =  function (details, callback) {
		var consentCB = (typeof that.callbacks["consent"] == "function") ? that.callbacks["consent"] : coms.noop;
		consentCB(true);
		navigator.mediaDevices.getUserMedia({ audio: true, video: true })
			.then(function(stream) {
				//streamdata = stream;
				consentCB(false);
				myStream["webcam"] = details.stream;
				var exam = details.exam;
		       var feed = details.feed;
		      // var stream = details.stream;
				// Create PeerConnection
				var pc_config = iceServers;
				var pc_constraints = {
					"optional": [{"DtlsSrtpKeyAgreement": true}]
				};
				pc["webcam"] = new RTCPeerConnection({
					"iceServers": iceServers,
					pc_constraints,
				});
				pc["webcam"].onicecandidate = function(event) {
					// Trickle candidate (or the end of the gathering process)
					var candidate = null;
					if(event.candidate === null) {
						candidate = { completed: true };
					} else {
						candidate = {
							candidate: event.candidate.candidate,
							sdpMid: event.candidate.sdpMid,
							sdpMLineIndex: event.candidate.sdpMLineIndex
						};
					}
					console.log("Trickling candidate:", candidate);
					var msg = {
						monet: "trickle",
						id: randomString(16),
						payload: {
							stream: "webcam",
							candidate: candidate
						}
					};
					sendMsg(msg);
				};
				pc["webcam"].addStream(stream);
				var previewCB = (typeof that.callbacks["join"] == "function") ? that.callbacks["join"] : coms.noop;
				previewCB("webcam", stream);

				pc["webcam"].ontrack = function(event) {
			 console.log("Handling Remote Track:", event);
			if(!event.streams)
				return;
			var remoteCB = (typeof that.callbacks["remote"] == "function") ? that.callbacks["remote"] : coms.noop;
			remoteCB(stream, event.streams[0]);
		};
				// Create offer
				pc["webcam"].createOffer(
					function(offer) {
						if(sdpSent["webcam"] === true) {
							console.log("Offer already sent, not sending it again");
							return;
						}
						sdpSent["webcam"] = true;
						pc["webcam"].setLocalDescription(offer);
						var jsep = {
							type: offer.type,
							sdp: offer.sdp
						};
						// Send the publish request
						var msg = {
							monet: "join",
							id: randomString(16),
							// payload: {
							// 	stream: "webcam",
							// 	jsep: jsep
							// }
							payload: {
				                   exam: exam,
				                   uuid: feed,
				                   stream: "webcam",
				                   jsep  : jsep
			                   }
						};
						sendMsg(msg, function response(result) {
							console.log("Got answer to offer");
							if(result["monet"] === "error") {
								that.hangup("webcam");
								console.log(result["payload"]["reason"]);
								callback(result["payload"]["reason"]);
								return;
							}
							var remoteJsep = result["payload"]["jsep"];
							console.log(remoteJsep);
							pc["webcam"].setRemoteDescription(
								new RTCSessionDescription(remoteJsep),
								function() {
									console.log("Remote description accepted!");
									callback();
								}, function(error) {
									that.hangup("webcam");
									console.log(error);
									callback(error);
								});
						});
					
					}, function(error) {
						that.hangup("webcam");
						console.log(error);
						callback(error);
					});
			},
			function(error) {
				consentCB(false);
				console.log(error);
				callback(error);
			});
	}

	function joinScreen(callback) {
		var consentCB = (typeof that.callbacks["consent"] == "function") ? that.callbacks["consent"] : coms.noop;
		consentCB(true);
		navigator.mediaDevices.getDisplayMedia({ video: {} })
			.then(function(stream) {
				consentCB(false);
				myStream["screen"] = stream;
				// Create PeerConnection
				var pc_config = iceServers;
				var pc_constraints = {
					"optional": [{"DtlsSrtpKeyAgreement": true}]
				};
				pc["screen"] = new RTCPeerConnection({
					"iceServers": iceServers,
					pc_constraints,
				});
				pc["screen"].onicecandidate = function(event) {
					// Trickle candidate (or the end of the gathering process)
					var candidate = null;
					if(event.candidate === null) {
						candidate = { completed: true };
					} else {
						candidate = {
							candidate: event.candidate.candidate,
							sdpMid: event.candidate.sdpMid,
							sdpMLineIndex: event.candidate.sdpMLineIndex
						};
					}
					console.log("Trickling candidate:", candidate);
					var msg = {
						monet: "trickle",
						id: randomString(16),
						payload: {
							stream: "screen",
							candidate: candidate
						}
					};
					sendMsg(msg);
				};
				pc["screen"].addStream(stream);
				var previewCB = (typeof that.callbacks["join"] == "function") ? that.callbacks["join"] : coms.noop;
				previewCB("screen", stream);
				// Create offer
				pc["screen"].createOffer(
					function(offer) {
						if(sdpSent["screen"] === true) {
							console.log("Offer already sent, not sending it again");
							return;
						}
						sdpSent["screen"] = true;
						pc["screen"].setLocalDescription(offer);
						var jsep = {
							type: offer.type,
							sdp: offer.sdp
						};
						// Send the publish request
						var msg = {
							monet: "join",
							id: randomString(16),
							payload: {
								stream: "screen",
								jsep: jsep
							}

						};
						sendMsg(msg, function response(result) {
							console.log("Got answer to offer");
							if(result["monet"] === "error") {
								that.hangup("screen");
								//console.log(result["payload"]["reason"]);
								callback(result["payload"]["reason"]);
								return;
							}
							var remoteJsep = result["payload"]["jsep"];
							console.log(remoteJsep);
							pc["screen"].setRemoteDescription(
								new RTCSessionDescription(remoteJsep),
								function() {
									console.log("Remote description accepted!");
									callback();
								}, function(error) {
									that.hangup("screen");
									console.log(error);
									callback(error);
								});
						});
					}, function(error) {
						that.hangup("screen");
						console.log(error);
						callback(error);
					});
			},
			function(error) {
				consentCB(false);
				console.log(error);
				callback(error);
			});
	}
	// Private method to publish the webcam
	function publishScreen(callback) {
		var consentCB = (typeof that.callbacks["consent"] == "function") ? that.callbacks["consent"] : coms.noop;
		consentCB(true);
		navigator.mediaDevices.getDisplayMedia({ video: {} })
			.then(function(stream) {
				consentCB(false);
				streamsharing = myStream["screen"] = stream;
		// 		streamsharing.getVideoTracks()[0].onended = function () {
  //   alert("stop_screen");
  // };

  streamsharing.oninactive = function () {
    stopstu("screen");
  };
				// Create PeerConnection
				var pc_config = iceServers;
				var pc_constraints = {
					"optional": [{"DtlsSrtpKeyAgreement": true}]
				};
				pc["screen"] = new RTCPeerConnection({
					"iceServers": iceServers,
					pc_constraints,
				});
				pc["screen"].onicecandidate = function(event) {
					// Trickle candidate (or the end of the gathering process)
					var candidate = null;
					if(event.candidate === null) {
						candidate = { completed: true };
					} else {
						candidate = {
							candidate: event.candidate.candidate,
							sdpMid: event.candidate.sdpMid,
							sdpMLineIndex: event.candidate.sdpMLineIndex
						};
					}
					console.log("Trickling candidate:", candidate);
					var msg = {
						monet: "trickle",
						id: randomString(16),
						payload: {
							stream: "screen",
							candidate: candidate
						}
					};
					sendMsg(msg);
				};
				pc["screen"].addStream(stream);
				var previewCB = (typeof that.callbacks["preview"] == "function") ? that.callbacks["preview"] : coms.noop;
				previewCB("screen", stream);
				// Create offer
				pc["screen"].createOffer(
					function(offer) {
						if(sdpSent["screen"] === true) {
							console.log("Offer already sent, not sending it again");
							return;
						}
						sdpSent["screen"] = true;
						pc["screen"].setLocalDescription(offer);
						var jsep = {
							type: offer.type,
							sdp: offer.sdp
						};
						// Send the publish request
						var msg = {
							monet: "publish",
							id: randomString(16),
							payload: {
								stream: "screen",
								jsep: jsep
							}
						};
						sendMsg(msg, function response(result) {
							console.log("Got answer to offer");
							if(result["monet"] === "error") {
								that.hangup("screen");
								console.log(result["payload"]["reason"]);
								callback(result["payload"]["reason"]);
								return;
							}
							var remoteJsep = result["payload"]["jsep"];
							console.log(remoteJsep);
							pc["screen"].setRemoteDescription(
								new RTCSessionDescription(remoteJsep),
								function() {
									console.log("Remote description accepted!");
									callback();
								}, function(error) {
									that.hangup("screen");
									console.log(error);
									callback(error);
								});
						});
					}, function(error) {
						that.hangup("screen");
						console.log(error);
						callback(error);
					});
			},
			function(error) {
				consentCB(false);
				console.log(error);
				callback(error);
			});
	}

	// Setup a WebRTC PeerConnection to subscribe something
	this.subscribe = async function(details, callback) {
		callback = (typeof callback == "function") ? callback : coms.noop;
		if(!details  || !details.feed || !details.stream || (details.stream !== "webcam" && details.stream !== "screen")) {
			callback("Invalid arguments");
			return;
		}
		// if(!that.proctor) {
		// 	callback("Only proctors can subscribe");
		// 	return;
		// }
		//var exam = details.exam;
		var feed = details.feed;
		var stream = details.stream;
		var subscribefeed = stream +""+feed;
		if(pc1[subscribefeed]) {
			//callback("Already subscribed to a " + stream);
			//return;
		}
		iceServers = details.iceServers;
		console.log(iceServers);
		// Create PeerConnection
		var pc_config = iceServers;
		var pc_constraints = {
			"optional": [{"DtlsSrtpKeyAgreement": true}]
		};
		// pc1[stream] = new RTCPeerConnection({
		// 			"iceServers": iceServers,
		// 			pc_constraints,
		// 		});


		 async function rtc() {
		  let pc1 =  new RTCPeerConnection({
					"iceServers": iceServers,
					pc_constraints,
				});
		   return pc1;
         }
        rtc().then(function(){console.log("hello")});
        pc1[subscribefeed] =  await  rtc();
		pcsubscribe = pc1[subscribefeed]
		pc1[subscribefeed].onicecandidate = function(event) {
			// Trickle candidate (or the end of the gathering process)
			var candidate = null;
			if(event.candidate === null) {
				candidate = { completed: true };
			} else {
				candidate = {
					candidate: event.candidate.candidate,
					sdpMid: event.candidate.sdpMid,
					sdpMLineIndex: event.candidate.sdpMLineIndex
				};
			}
			console.log("Trickling candidate:", candidate);
			var msg = {
				monet: "trickle",
				id: randomString(16),
				payload: {
					stream: stream,
					candidate: candidate
				}
			};
			sendMsg(msg);
		};
		pc1[subscribefeed].ontrack = function(event) {
			console.log("Handling Remote Track:", event);
			if(!event.streams)
				return;
			var remoteCB = (typeof that.callbacks["remote"] == "function") ? that.callbacks["remote"] : coms.noop;
			remoteCB(stream, event.streams[0]);
		};
		// Send the subscribe request
		var msg = {
			monet: "subscribe",
			id: randomString(16),
			payload: {
				//exam: exam,
				feed: feed,
				stream: stream
			}
		};
		sendMsg(msg, function response(result) {
			console.log("Got answer to our subscription");
			if(result["monet"] === "error") {
				if(result["payload"]["code"] == 6)
				{
				// console.log(result["payload"]["reason"]);
				// callback(result["payload"]["reason"]);	
				}
				else
				{
					that.hangup(stream);
                    
				}
				callback(result["payload"]["reason"]);
				return;
			}
			var remoteJsep = result["payload"]["jsep"];
			console.log(remoteJsep);
			pc1[subscribefeed].setRemoteDescription(
				new RTCSessionDescription(remoteJsep),
				function() {
					console.log("Remote description accepted!");
					var mediaConstraints = null;
					if(adapter.browserDetails.browser === "firefox" || adapter.browserDetails.browser === "edge") {
						mediaConstraints = {
							offerToReceiveAudio: true, offerToReceiveVideo: true
						};
					} else {
						mediaConstraints = {
							mandatory: {
								OfferToReceiveAudio: true, OfferToReceiveVideo: true
							}
						};
					}
					pc1[subscribefeed].createAnswer(mediaConstraints)
						.then(function(answer) {
							console.debug(answer);
							if(sdpSent[stream] === true) {
								// console.log("Answer already sent, not sending it again");
								// return;
							}
							sdpSent[stream] = true;
							pc1[subscribefeed].setLocalDescription(answer);
							var jsep = {
								type: answer.type,
								sdp: answer.sdp
							};
							// Send the publish request
							var msg = {
								monet: "start",
								id: randomString(16),
								payload: {
									stream: stream,
									jsep: jsep
								}
							};
							sendMsg(msg, function response(result) {
								// We're done
								callback();
							});
						}, function(error) {
							that.hangup("webcam");
							console.log(error);
							callback(error);
						});
				}, function(error) {
					that.hangup("webcam");
					console.log(error);
					callback(error);
				});
		});
	}

	this.subscribeproc = function(details, callback) {
		callback = (typeof callback == "function") ? callback : coms.noop;
		if(!details || !details.exam || !details.feed || !details.stream || (details.stream !== "webcam" && details.stream !== "screen")) {
			//callback("Invalid arguments");
			//return;
		}
		console.log("subscribeproc" , details);
		// if(!that.proctor) {
		// 	callback("Only proctors can subscribe");
		// 	return;
		// }
		var exam = details.exam;
		var feed = details.feed;
		console.log(feed);
		var stream = details.stream;
		if(pc2[stream]) {
			console.log("Already subscribed to a " + stream);
		//	return;
		}
		// Create PeerConnection
		var pc_config = iceServers;
		var pc_constraints = {
			"optional": [{"DtlsSrtpKeyAgreement": true}]
		};
		pc2[stream] = new RTCPeerConnection({
					"iceServers": iceServers,
					pc_constraints,
				});
		pcsubscribe = pc2[stream];
		pc2[stream].onicecandidate = function(event) {
			// Trickle candidate (or the end of the gathering process)
			console.log(event);
			var candidate = null;
			if(event.candidate === null) {
				candidate = { completed: true };
			} else {
				candidate = {
					candidate: event.candidate.candidate,
					sdpMid: event.candidate.sdpMid,
					sdpMLineIndex: event.candidate.sdpMLineIndex
				};
			}
			console.log("Trickling candidate:", candidate);
			var msg = {
				monet: "trickle",
				id: randomString(16),
				payload: {
					stream: stream,
					candidate: candidate
				}
			};
			sendMsg(msg);
		};
		pc2[stream].ontrack = function(event) {
			console.log("Handling Remote Track:", event);
			if(!event.streams)
				return;
			var remoteCB = (typeof that.callbacks["remote"] == "function") ? that.callbacks["remote"] : coms.noop;
			remoteCB(stream, event.streams[0]);
		};
		// Send the subscribe request
		var msg = {
			monet: "subscribeproctor",
			id: randomString(16),
			payload: {
				exam: exam,
				uuid: feed,
				stream: stream
			}
		};

		sendMsg(msg, function response(result) {
			console.log("Got answer to our subscribeproctor");
			if(result["monet"] === "error") {
				that.hangup(stream);
				console.log(result["payload"]["reason"]);
				callback(result["payload"]["reason"]);
				return;
			}
			var remoteJsep = result["payload"]["jsep"];
			console.log(remoteJsep);
			pc2[stream].setRemoteDescription(
				new RTCSessionDescription(remoteJsep),
				function() {
					console.log("Remote description accepted!");
					var mediaConstraints = null;
					if(adapter.browserDetails.browser === "firefox" || adapter.browserDetails.browser === "edge") {
						mediaConstraints = {
							offerToReceiveAudio: true, offerToReceiveVideo: true
						};
					} else {
						mediaConstraints = {
							mandatory: {
								OfferToReceiveAudio: true, OfferToReceiveVideo: true
							}
						};
					}
					pc2[stream].createAnswer(mediaConstraints)
						.then(function(answer) {
							console.log("answer" , answer);
							if(sdpSent[stream] === true) {
								// console.log("Answer already sent, not sending it again");
								// return;
							}
							sdpSent[stream] = true;
							pc2[stream].setLocalDescription(answer);
							var jsep = {
								type: answer.type,
								sdp: answer.sdp
							};
							// Send the publish request
							var msg = {
								monet: "start",
								id: randomString(16),
								payload: {
									stream: stream,
									jsep: jsep
								}
							};
							sendMsg(msg, function response(result) {
								// We're done
								console.log("we are done")
								callback();
							});
						}, function(error) {
							that.hangup("webcam");
							console.log(error);
							callback(error);
						});
				}, function(error) {
					that.hangup("webcam");
					console.log(error);
					callback(error);
				});
		});
	}


	function publishWebcam(callback) {
		var consentCB = (typeof that.callbacks["consent"] == "function") ? that.callbacks["consent"] : coms.noop;
		consentCB(true);
		navigator.mediaDevices.getUserMedia({ audio: true, video: true })
			.then(function(stream) {
				streamdata = stream;
				consentCB(false);
				myStream["webcam"] = stream;
				// Create PeerConnection
				var pc_config = iceServers;
				var pc_constraints = {
					"optional": [{"DtlsSrtpKeyAgreement": true}]
				};
				pc["webcam"] = new RTCPeerConnection({
					"iceServers": iceServers,
					pc_constraints,
				});
				pcpublish = pc["webcam"];
				pc["webcam"].onicecandidate = function(event) {
					// Trickle candidate (or the end of the gathering process)
					var candidate = null;
					if(event.candidate === null) {
						candidate = { completed: true };
					} else {
						candidate = {
							candidate: event.candidate.candidate,
							sdpMid: event.candidate.sdpMid,
							sdpMLineIndex: event.candidate.sdpMLineIndex
						};
					}
					console.log("Trickling candidate:", candidate);
					var msg = {
						monet: "trickle",
						id: randomString(16),
						payload: {
							stream: "webcam",
							candidate: candidate
						}
					};
					sendMsg(msg);
				};
				pc["webcam"].addStream(stream);
				var previewCB = (typeof that.callbacks["preview"] == "function") ? that.callbacks["preview"] : coms.noop;
				previewCB("webcam", stream);

				pc["webcam"].ontrack = function(event) {
			console.log("Handling Remote Track:", event);
			if(!event.streams)
				return;
			var remoteCB = (typeof that.callbacks["remote"] == "function") ? that.callbacks["remote"] : coms.noop;
			remoteCB("webcam", event.streams[0]);
		};
				// Create offer
				pc["webcam"].createOffer(
					function(offer) {
						if(sdpSent["webcam"] === true) {
							console.log("Offer already sent, not sending it again");
							return;
						}
						sdpSent["webcam"] = true;
						pc["webcam"].setLocalDescription(offer);
						var jsep = {
							type: offer.type,
							sdp: offer.sdp
						};
						// Send the publish request
						var msg = {
							monet: "publish",
							id: randomString(16),
							payload: {
								stream: "webcam",
								jsep: jsep
							}
						};
						sendMsg(msg, function response(result) {
							console.log("Got answer to offer");
							if(result["monet"] === "error") {
								that.hangup("webcam");
								console.log(result["payload"]["reason"]);
								callback(result["payload"]["reason"]);
								return;
							}
							var remoteJsep = result["payload"]["jsep"];
							console.log(remoteJsep);
							pc["webcam"].setRemoteDescription(
								new RTCSessionDescription(remoteJsep),
								function() {
									console.log("Remote description accepted!");
									callback();
								}, function(error) {
									that.hangup("webcam");
									console.log(error);
									callback(error);
								});
						});
					}, function(error) {
						that.hangup("webcam");
						console.log(error);
						callback(error);
					});
			},
			function(error) {
				consentCB(false);
				console.log(error);
				callback(error);
			});
	}

	this.joinwebcam =  function (details, callback) {
		var consentCB = (typeof that.callbacks["consent"] == "function") ? that.callbacks["consent"] : coms.noop;
		consentCB(true);
		navigator.mediaDevices.getUserMedia({ audio: true, video: true })
			.then(function(stream) {
				streamdata = stream;
				consentCB(false);
				myStream["webcam"] = details.stream;
				var exam = details.exam;
		       var feed = details.feed;
		      // var stream = details.stream;
				// Create PeerConnection
				var pc_config = iceServers;
				var pc_constraints = {
					"optional": [{"DtlsSrtpKeyAgreement": true}]
				};
				pc["webcam"] = new RTCPeerConnection({
					"iceServers": iceServers,
					pc_constraints,
				});
				pcpublish = pc["webcam"];
				pc["webcam"].onicecandidate = function(event) {
					// Trickle candidate (or the end of the gathering process)
					var candidate = null;
					if(event.candidate === null) {
						candidate = { completed: true };
					} else {
						candidate = {
							candidate: event.candidate.candidate,
							sdpMid: event.candidate.sdpMid,
							sdpMLineIndex: event.candidate.sdpMLineIndex
						};
					}
					console.log("Trickling candidate:", candidate);
					var msg = {
						monet: "trickle",
						id: randomString(16),
						payload: {
							stream: "webcam",
							candidate: candidate
						}
					};
					sendMsg(msg);
				};
				pc["webcam"].addStream(stream);
				var previewCB = (typeof that.callbacks["join"] == "function") ? that.callbacks["join"] : coms.noop;
				previewCB("webcam", stream);

		
		
		pc["webcam"].createOffer(
					function(offer) {
						if(sdpSent["webcam"] === true) {
							console.log("Offer already sent, not sending it again");
							return;
						}
						sdpSent["webcam"] = true;
						pc["webcam"].setLocalDescription(offer);
						var jsep = {
							type: offer.type,
							sdp: offer.sdp
						};
						var msg = {
								monet: "join",
								id: randomString(16),
								payload: {
									exam: exam,
									uuid: feed,
									stream: "webcam",
									jsep: jsep
								}
							};
						sendMsg(msg, function response(result) {
							console.log("Got answer to offer");
							if(result["monet"] === "error") {
								that.hangup("webcam");
								console.log(result["payload"]["reason"]);
								callback(result["payload"]["reason"]);
								return;
							}
							var remoteJsep = result["payload"]["jsep"];
							console.log(remoteJsep);
							pc["webcam"].setRemoteDescription(
								new RTCSessionDescription(remoteJsep))
							  .then( function(){
								console.log("Remote description accepted!");
								callback();
								});
						});
					}, function(error) {
						that.hangup("webcam");
						console.log(error);
						callback(error);
					});
			},
			function(error) {
				consentCB(false);
				console.log(error);
				callback(error);
			});
	}

	// Public method to hangup a stream
	this.hangup = function(type) {
		// var previewCB = (typeof that.callbacks["preview"] == "function") ? that.callbacks["preview"] : coms.noop;
		// previewCB(type, null);
		// var remoteCB = (typeof that.callbacks["remote"] == "function") ? that.callbacks["remote"] : coms.noop;
		// remoteCB(type, null);
		if(myStream) {
			console.log("Stopping local " + type + " stream");
			try {
				// Try a MediaStream.stop() first
				myStream[type].stop();
				//streamdata.stop();
			} catch(e) {
				// Do nothing if this fails
			}
			try {
				var tracks = myStream[type].getTracks();
				for(var i in tracks) {
					var mst = tracks[i];
					if(mst)
						mst.stop();
				}
				// var tracks = streamdata.getTracks();
				// for(var i in tracks) {
				// 	var mst = tracks[i];
				// 	if(mst)
				// 		mst.stop();
				// }
			} catch(e) {
				// Do nothing if this fails
			}
		}
		myStream[type] = null;
		// Close PeerConnection
		try {
			pc[type].close();
		} catch(e) {
			// Do nothing
		}
		pc[type] = null;
		sdpSent[type] = null;
		var msg = {
			monet: "hangup",
			id: randomString(16),
			payload: {
				stream: type
			}
		};
		sendMsg(msg);
	}


    this.sendbackstatus = function(details, callback) {
		callback = (typeof callback == "function") ? callback : coms.noop;
		if(!details  || !details.text) {
			callback("Invalid message");
			return;
		}
		var msg = {
			monet: "sendbackstatus",
			id: randomString(16),
			payload: {
				from:details.from,
				to: details.to,
				text: details.text
			}
		};
		//console.log(msg);
		sendMsg(msg, function response(result) {
			if(result["monet"] === "error") {
				callback(result["payload"]["reason"]);
				return;
			}
			callback();
		});
	}

	// Helper method to send a chat message
	this.message = function(details, callback) {
		callback = (typeof callback == "function") ? callback : coms.noop;
		if(!details || !details.to || !details.text) {
			callback("Invalid message");
			return;
		}
		var msg = {
			monet: "message",
			id: randomString(16),
			payload: {
				to: details.to,
				name : details.name,
				text: details.text
			}
		};
		sendMsg(msg, function response(result) {
			if(result["monet"] === "error") {
				callback(result["payload"]["reason"]);
				return;
			}
			callback();
		});
	}

  this.messageonetoone = function(details, callback) {
		callback = (typeof callback == "function") ? callback : coms.noop;
		if(!details || !details.to || !details.text) {
			callback("Invalid message");
			return;
		}
		var msg = {
			monet: "messageonetoone",
			id: randomString(16),
			payload: {
				to: details.to,
				name : details.name,
				text: details.text
			}
		};
		sendMsg(msg, function response(result) {
			if(result["monet"] === "error") {
				callback(result["payload"]["reason"]);
				return;
			}
			callback();
		});
	}

	
  this.messageall = function(details, callback) {
		callback = (typeof callback == "function") ? callback : coms.noop;
		if(!details || !details.to || !details.text) {
			callback("Invalid message");
			return;
		}
		var msg = {
			monet: "messageall",
			id: randomString(16),
			payload: {
				to: details.to,
				name : details.name,
				text: details.text
			}
		};
		sendMsg(msg, function response(result) {
			if(result["monet"] === "error") {
				callback(result["payload"]["reason"]);
				return;
			}
			callback();
		});
	}
	


	this.messageallsupport = function(details, callback) {
		callback = (typeof callback == "function") ? callback : coms.noop;
		if(!details || !details.to || !details.text) {
			callback("Invalid message");
			return;
		}
		var msg = {
			monet: "messageallsupport",
			id: randomString(16),
			payload: {
				to: details.to,
				name : details.name,
				text: details.text
			}
		};
		sendMsg(msg, function response(result) {
			if(result["monet"] === "error") {
				callback(result["payload"]["reason"]);
				return;
			}
			callback();
		});
	}

    //sendstatusapi
	this.sendstatusapi = function(details, callback) {
		callback = (typeof callback == "function") ? callback : coms.noop;
		if(!details  || !details.text) {
			callback("Invalid message");
			return;
		}
		var msg = {
			monet: "sendstatusapi",
			id: randomString(16),
			payload: {
				from:details.from,
				to: details.to,
				text: details.text,
                                user_type : details.user_type

			}
		};
		//console.log(msg);
		sendMsg(msg, function response(result) {
			if(result["monet"] === "error") {
				callback(result["payload"]["reason"]);
				return;
			}
			callback();
		});
	}


    this.sendToggle = function(details, callback) {
		callback = (typeof callback == "function") ? callback : coms.noop;
		if(!details) {
			callback("Invalid message");
			return;
		}
		var msg = {
			monet: "sendToggle",
			id: randomString(16),
			payload: details
		};
		//console.log(msg);
		sendMsg(msg, function response(result) {
			if(result["monet"] === "error") {
				callback(result["payload"]["reason"]);
				return;
			}
			callback();
		});
	}

	this.sendStudent = function(details, callback) {
		callback = (typeof callback == "function") ? callback : coms.noop;
		if(!details  || !details.text) {
			callback("Invalid message");
			return;
		}
		var msg = {
			monet: "sendstatustudent",
			id: randomString(16),
			payload: {
				from:details.from,
				to: details.to,
				text: details.text
			}
		};
		//console.log(msg);
		sendMsg(msg, function response(result) {
			if(result["monet"] === "error") {
				callback(result["payload"]["reason"]);
				return;
			}
			callback();
		});
	}
    

    this.sendstatustudentforone = function(details, callback) {
		callback = (typeof callback == "function") ? callback : coms.noop;
		if(!details  || !details.text) {
			callback("Invalid message");
			return;
		}
		var msg = {
			monet: "sendstatustudentforone",
			id: randomString(16),
			payload: {
				from:details.from,
				to: details.to,
				text: details.text
			}
		};
		//console.log(msg);
		sendMsg(msg, function response(result) {
			if(result["monet"] === "error") {
				callback(result["payload"]["reason"]);
				return;
			}
			callback();
		});
	}  

	this.sendstatustudent = function(details, callback) {
		callback = (typeof callback == "function") ? callback : coms.noop;
		if(!details  || !details.text) {
			callback("Invalid message");
			return;
		}
		var msg = {
			monet: "sendstatustudent",
			id: randomString(16),
			payload: {
				from:details.from,
				to: details.to,
				text: details.text
			}
		};
		//console.log(msg);
		sendMsg(msg, function response(result) {
			if(result["monet"] === "error") {
				callback(result["payload"]["reason"]);
				return;
			}
			callback();
		});
	}  
	// Private helper to send messages to the server
	var transactions = {};
	async function sendMsg(message, callback) {
		callback = (typeof callback == "function") ? callback : coms.noop;
		if(!that.server) {
			callback({ response: "error", payload: { reason: "Invalid server" } });
			return;
		}
		if(!message["id"])
			message["id"] = randomString(16);
		//console.log('Sending message to Wrapper:', message);
		// Subscribe to the response and send to the server
		transactions[message["id"]] = callback;
		that.server.send(JSON.stringify(message));
	}

	function randomString(len) {
		charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var randomString = '';
		for (var i = 0; i < len; i++) {
			var randomPoz = Math.floor(Math.random() * charSet.length);
			randomString += charSet.substring(randomPoz,randomPoz+1);
		}
		return randomString;
	}
};





function supportpanelmsg(info) {
		if(notifym === 1)
		{
			//createNotification("stepone","You got a message","")
		}
		
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
          $('.chat_body').append('<div><div class="chats you">'+
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
			$('.chat_body').get(0).scrollTop = $('.chat_body').get(0).scrollHeight;
	 } 
	//	else if (info.text.userid == "support" && proctorstu == "support" ) // if(proctorstu == "support")
		// {
		// 	$('.bubble-areasupport').append('<div class="chats you">'+
		//       						'<div class="chat-content">'+
		//       							'<div class="message-content y-msg">' + msg  + " </div> "+
		//       					 		'<div class="chat-time">'+
  //                                   		'<div>'+
  //                                       		'<div class="time">' +  dateString +"</div>"+
  //                                   		'</div>'+
  //                               		'</div>'+
  //                           		'</div>'+    
		//       					"</div>");
		// 	$('.bubble-areasupport').get(0).scrollTop = $('.bubble-areasupport').get(0).scrollHeight;
		// } else {
		// 	//$(".circlered"+info.text.userid).css("background-color","red");
		// 	$(".circlered"+info.text.userid).addClass("blink")
		// 	$('#'+info.text.userid).append('<div class="chats you">'+
		//       						'<div class="chat-content">'+
		//       							'<div class="message-content y-msg">' + msg  + " </div> "+
		//       					 		'<div class="chat-time">'+
  //                                   		'<div>'+
  //                                       		'<div class="time">' +  dateString +"</div>"+
  //                                   		'</div>'+
  //                               		'</div>'+
  //                           		'</div>'+    
		//       					"</div>");
		// }
		// {
		// 	//toastr.info('You got a message')
		// 	$('.bubble-area').append('<p style="float:right">'  + from + ' :   ' + msg  + " - " +  dateString +"</p><br><br>");
		// }
		notifym  = 1;
		if($('.bubble-area').get(0) !== undefined)
		{
		 $('.bubble-area').get(0).scrollTop = $('.bubble-area').get(0).scrollHeight;	
		}
		
		//$('.bubble-area').get(0).scrollTop = $('.bubble-area').get(0).scrollHeight;
	}
