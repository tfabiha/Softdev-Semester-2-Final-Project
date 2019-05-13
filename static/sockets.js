var socket = io.connect('http://' + document.domain + ':' + location.port);
var msgbox = document.getElementById('msg');

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

var sendMessage = function() {
  console.log("sending");
  var newMsg = msgbox.value;
  socket.send(newMsg);
  msgbox.value = "";
}

var joinRoom = function() {
  socket.emit('joinRoom', 'lobby');
};

msgbox.addEventListener("keydown", function(event) {
  if(event.keyCode == 13){
    console.log("send")
    event.preventDefault();
    sendMessage();
  }
});

joinRoom();
