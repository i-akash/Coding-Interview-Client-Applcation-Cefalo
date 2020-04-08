import io from "socket.io-client";
import { CONNECT, ALL_ROOM, ALL_CLIENT_IN_ROOM, JOIN_ROOM, LEFT_ROOM, NEW_JOINING_ROOM, LEAVE_ROOM, RUN_SOLUTION } from "./EventType";
const url = "http://localhost:80";
const cb = (message = "default message") => console.log(message);


export const SocketClient = function () {
  this.socket = io(url);
};

// Connection
SocketClient.prototype.onConnect = function (callback = cb) {
  this.socket.on(CONNECT, callback);
};

SocketClient.prototype.onReconnectAttempt = function (callback = cb) {
  // callback(attemptNumber) invoked by server
  this.socket.on("reconnect_attempt", callback);
};

//
//
//namespace level
//
//

// emit
SocketClient.prototype.fetchFromNamespace = function (eventName, nsp = '/', onResponse = cb) {
  console.log('Fetch From Namespace : ', eventName);
  //callback(rooms) invoked by server
  this.socket.emit(eventName, nsp, onResponse)
}

// listen


//
//
//room level
//
//

//emit
SocketClient.prototype.fetchFromRoom = function (eventName, room = "my room", onResponse = cb) {
  //callback(clients) invoked by server
  this.socket.emit(eventName, room, onResponse)
}

SocketClient.prototype.joinRoom = function (userInfo = {}, serverAck = cb) {
  this.socket.emit(JOIN_ROOM, userInfo, serverAck)
}

SocketClient.prototype.leaveRoom = function (room = "myRoom", serverAck = cb) {
  this.socket.emit(LEAVE_ROOM, room, serverAck)
}

SocketClient.prototype.disconnect = function () {
  this.socket.close();
};


SocketClient.prototype.pushToRoom = function (eventName, room, payload, ackCallback = cb) {
  this.socket.emit(eventName, { room, payload }, ackCallback);
}

SocketClient.prototype.runSolution = function (solution, onResponse = cb) {
  this.socket.emit(RUN_SOLUTION, solution, onResponse)
}


//listen
SocketClient.prototype.listeningOn = function (eventName, callback = cb) {
  this.socket.on(eventName, callback)
}


SocketClient.prototype.onDisconnect = function (callback = cb) {
  this.socket.on("disconnect", reason => callback(reason));
};


const socketClient = new SocketClient();

export default socketClient 
