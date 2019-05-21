/*
connect to server with socket
*/
var socket = io.connect('http://' + document.domain + ':' + location.port);

var drawbutton = document.getElementById('draw');

var myhand = document.getElementById('myhand');
var otherhand = document.getElementById('otherhand');
var discardpile = document.getElementById('discardpile');

var myturn = false;
var turn = document.getElementById('turn');

/*
when message is received from server
*/

socket.on('drawn', function(msg)
	  {
	      console.log("received message: opp has drawn a card")
	      children = otherhand.children;
	      var placeholder = document.createElement('li');
	      placeholder.innerHTML = "placeholder";
	      otherhand.appendChild(placeholder);		  
	  });

socket.on('removed', function(msg)
	  {
	      console.log("received message: opp has removed a card")
	      children = otherhand.children;
	      
	      otherhand.removeChild(children[0]);
	     
	  });

socket.on('discarded', function(msg)
	  {
	      console.log("received message: card added to discard pile")
	      children = discardpile.children;
	      var placeholder = document.createElement('li');
	      placeholder.innerHTML = msg;
	      discardpile.appendChild(placeholder);		  
	  });

socket.on('myturn', function(msg)
	  {
	      myturn = true;
	      turn.innerHTML = "MY TURN";
	  });

/*
send message to server, calls message function
*/

/*
Sends request to server to call joinRoom with argument lobby so client joins room based on code
*/
var joinRoom = function()
{
    socket.emit('joinRoom', window.location.pathname.slice(6, window.location.pathname.length));
};


var draw = function()
{
    if (!myturn)
	return;
    
    console.log("draw card")

    children = myhand.children;
    var newcard = document.createElement('li');

    newcard.addEventListener("click", function(e)
			     {
				 if (myturn)
				 {
				     
				     console.log( this.innerHTML );
				     socket.emit('removed', this.innerHTML);
				     socket.emit('discarded', this.innerHTML);
				     this.remove();
				 }
			     });
    
    newcard.innerHTML = Math.round( Math.random() * 12 );
    myhand.appendChild(newcard);

    socket.emit('drawn', "card");

    myturn = false;
    turn.innerHTML = "NOT MY TURN";
    socket.emit('myturn', "not me anymore :(")
};


drawbutton.addEventListener("click", draw);

joinRoom();

