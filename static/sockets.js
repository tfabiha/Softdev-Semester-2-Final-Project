/*
connect to server with socket
*/
var socket = io.connect('http://' + document.domain + ':' + location.port);

var msgbox = document.getElementById('msg');
var drawbutton = document.getElementById('draw');

/*
when message is received from server
*/
socket.on('message', function(msg) {
  var chat = document.getElementById('chat');
  var newMsg = document.createElement('li');
  var children = chat.children;
  if (children.length > 6) {
    chat.removeChild(children[0]);
  }
  newMsg.innerHTML = msg;
  chat.appendChild(newMsg);
});

/*
send message to server, calls message function
*/
var sendMessage = function() {
  var newMsg = msgbox.value;
  socket.send(newMsg);
  msgbox.value = "";
}

/*
Sends request to server to call joinRoom with argument lobby so client joins room based on code
*/
var joinRoom = function() {
  socket.emit('joinRoom', window.location.pathname.slice(6, window.location.pathname.length));
};

msgbox.addEventListener("keydown", function(event) {
  if(event.keyCode == 13){
    event.preventDefault();
    sendMessage();
  }
});

var draw = function() {
    console.log("draw card")
}
drawbutton.addEventListener("click", draw);

joinRoom();
