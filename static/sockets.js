var drawbutton = document.getElementById('draw');
var c = document.getElementById("c");

var myturn = true;
var turn = document.getElementById('turn');
var effects = {}
var deck = [];
var nursery = [];
var player_hand = [];
var opponent_hand = [];
var discard = [];
var mode = "draw";
var discarding = false;

var make_card = function(name, att){
    var card = document.createElementNS("http://www.w3.org/2000/svg", "image");
    card.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", "https://raw.githubusercontent.com/tfabiha/unstablepics/master/back.jpg");
    card.setAttribute("width",200);
    card.setAttribute("height",200);
    card.setAttribute("x", 0);
    card.setAttribute("y", 200);
    card.setAttribute("name", name);
    card.setAttribute("att", att);
    return card
};
var discard = function(e) {
  if (mode == "discard") {
    var card = e.target;
    player_hand = player_hand.filter(function(n) {return n != card});
    var i;
    for(i = 0; i < player_hand.length; i++) {
      player_hand[i].setAttribute("x", i * 150);
    }
    card.setAttribute("x", 400);
    card.setAttribute("y", 200);
    mode = "draw";
    turn.innerHTML = "OPPONENT TURN";
    switch_turns()
  }
}
d3.json("https://raw.githubusercontent.com/tfabiha/cerealmafia/master/static/cards.json", function(error, d) {
  var i;
  for (i = 0; i < d.length; i++) {
    effects[d[i]["card_name"]] = d[i]["phases"];
    var j;
    for (j = 0; j < d[i]["quantity"]; j++) {
      var x = make_card(d[i]["card_name"], d[i]["description"]);
      if (d[i]["card_type"] == "baby_uni") {
        x.setAttribute("x", 200);
        nursery.push(x);
      }else{
        deck.push(x);
      }
    }
  }
  var shuffle = function(deck) {
    var i, j, k;
    for(i = deck.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i+1));
      temp = deck[i];
      deck[i] = deck[j];
      deck[j] = temp;
    }
  };

  shuffle(nursery);
  shuffle(deck);

  var make_player_hand = function() {
    var i, card;
    for (i = 0; i < 5; i++) {
      if (i == 0) {
        card = nursery.pop();
      }else{
        card = deck.pop();
      }
      card.setAttribute("x", i * 150);
  	  card.setAttribute("y", 400);
      card.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", "https://raw.githubusercontent.com/tfabiha/unstablepics/master/" + card.getAttribute("name") + ".jpg");
      card.addEventListener("click", discard);
      player_hand.push(card);
    }
  }

  var make_opponent_hand = function() {
    var i, card;
    for (i = 0; i < 5; i++) {
      if (i == 0) {
        card = nursery.pop();
      }else{
        card = deck.pop();
      }
      card.setAttribute("x", i * 150);
  	  card.setAttribute("y", 0);
      opponent_hand.push(card);
    }
  }

  make_player_hand();
  make_opponent_hand();

  for (i = 0; i < deck.length; i++){
  	var card = deck[i];
  	c.appendChild(card);
  }
  for (i = 0; i < nursery.length; i++){
  	var card = nursery[i];
  	c.appendChild(card);
  }
  for (i = 0; i < 5; i++){
  	var card = player_hand[i];
  	c.appendChild(card);
  	card = opponent_hand[i];
  	c.append(card);
  }
});

drawbutton.addEventListener('click', function() {
  console.log(myturn);
  if (mode == "draw") {
    var card = deck.pop();
    if (myturn) {
      card.setAttribute("x", player_hand.length * 150);
      card.setAttribute("y", 400);
      card.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", "https://raw.githubusercontent.com/tfabiha/unstablepics/master/" + card.getAttribute("name") + ".jpg");
      card.addEventListener("click", discard);
      player_hand.push(card);
      if (player_hand.length > 7) {
        turn.innerHTML = "DISCARD A CARD";
    		mode = "discard";
    	}
    	if (player_hand.length <= 7) {
        turn.innerHTML = "OPPONENT TURN";
        switch_turns();
    	}
    }else{
      if(!discarding){
        card.setAttribute("x", opponent_hand.length * 150);
        card.setAttribute("y", 0);
        opponent_hand.push(card);
        if (opponent_hand.length > 7) {
          turn.innerHTML = "OPPONENT IS DISCARDING CARD";
          discarding = true;
          setTimeout(function() {
            var c = opponent_hand[Math.floor(Math.random() * 8)];
            opponent_hand = opponent_hand.filter(function(n) {return n != c});
            var i;
            for(i = 0; i < opponent_hand.length; i++) {
              opponent_hand[i].setAttribute("x", i * 150);
            }
            c.setAttribute("x", 400);
            c.setAttribute("y", 200);
            c.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", "https://raw.githubusercontent.com/tfabiha/unstablepics/master/" + c.getAttribute("name") + ".jpg");
            turn.innerHTML = "PLAYER TURN";
            switch_turns();
            discarding = false;
          }, 1500);
        }else{
          turn.innerHTML = "PLAYER TURN";
          switch_turns();
        }
      }
    }
  }
  console.log(myturn);
});


var switch_turns = function(){
	if (myturn == false){
    myturn = true;
	}else{
    myturn = false;
	}
};
