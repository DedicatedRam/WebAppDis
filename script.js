

let socket;

function test(){
  const http = new XMLHttpRequest();
const url = 'http://localhost:5555/';
const username = 'user';
const password = 'pass';
const credentials = btoa(username + ':' + password);

http.open("GET", url, true);
http.setRequestHeader("Authorization", "Basic " + credentials);
http.send();

http.onreadystatechange = function() {
    if (http.readyState === XMLHttpRequest.DONE && http.status === 200) {
        console.log(http.responseText);
    } else if (http.readyState === XMLHttpRequest.DONE) {
        console.log('Request failed. Status code: ' + http.status);
    }
};
}

function test2(){
  var socket = new WebSocket("ws://localhost/socket");

socket.onopen = function (event) {
  console.log("WebSocket is open now.");
};

socket.onmessage = function (event) {
  console.log("Received data: " + event.data);
};

socket.onerror = function (error) {
  console.error("WebSocket error: ", error);
};

socket.onclose = function (event) {
  console.log("WebSocket closed with code: " + event.code);
};

}

function getServerConnection() {
  let message = { _class: "Hello" };

  const socket = new WebSocket("ws://localhost:8080");

  socket.onopen = function(event) {
    console.log("WebSocket is open now.");
  };

  socket.onmessage = function(event) {
    console.log("Received message:", event.data);
  };

  socket.onclose = function(event) {
    console.log("WebSocket is closed now.");
  };
  console.log(socket.readyState)
  console.log("after onopen");
}

function sendTestWebSocketMessage(){
  if(socket){
    socket.send(`${new Date()}`);
  }else{
    alert("no websocket");
  }
}

