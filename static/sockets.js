var drawbutton = document.getElementById('draw');
var c = document.getElementById("c");
var myturn = true;
var turn = document.getElementById('turn');
var desc = document.getElementById('desc');
var effects = {}
var deck = [];
var nursery = [];
var player_hand = [];
var player_stable = [];
var opponent_hand = [];
var opponent_stable = [];
var discard = [];
var mode = "draw";
var discarding = false;

var opponent_y = 0;
var gen_y = 225;
var player_y = 450;

var description_card = function (att, x, y) {

}

var make_card = function(name, att, type){
    var card = document.createElementNS("http://www.w3.org/2000/svg", "image");
    card.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", "https://raw.githubusercontent.com/tfabiha/unstablepics/master/back.jpg");
    card.setAttribute("width",200);
    card.setAttribute("height",200);
    card.setAttribute("x", 0);
    card.setAttribute("y", gen_y);
    card.setAttribute("name", name);
    card.setAttribute("att", att);
    card.setAttribute("type", type);
    card.setAttribute("player", "f")
    card.addEventListener("mouseover", function(){if (card.getAttribute("player") == "t") {desc.innerHTML = att; card.setAttribute("width",400);card.setAttribute("height",400);}});
    card.addEventListener("mouseout", function(){desc.innerHTML = "<br>"; card.setAttribute("width",200);card.setAttribute("height",200);});
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
    card.setAttribute("y", gen_y);
    card.setAttribute("player", "f");
    mode = "draw";
    turn.innerHTML = "OPPONENT TURN";
    switch_turns()
  }
}

d3.json("https://raw.githubusercontent.com/tfabiha/cerealmafia/master/static/cards.json", function(error, d) {

  var dragHandler = d3.drag()
    .on("drag", function () {
      d3.select(this)
        .attr("x", d3.event.x)
        .attr("y", d3.event.y);
  });

  var i;
  for (i = 0; i < d.length; i++) {
    effects[d[i]["card_name"]] = d[i]["phases"];
    var j;
    for (j = 0; j < d[i]["quantity"]; j++) {
      var x = make_card(d[i]["card_name"], d[i]["description"], d[i]["card_type"]);
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
  	  card.setAttribute("y", player_y);
      card.setAttribute("player","t");
      card.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", "https://raw.githubusercontent.com/tfabiha/unstablepics/master/" + card.getAttribute("name") + ".jpg");
      card.addEventListener("click", discard);
      dragHandler(d3.select(card.getAttribute("name")));
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
  	  card.setAttribute("y", opponent_y);
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
      card.setAttribute("y", player_y);
      card.setAttribute("player", "t");
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
            c.setAttribute("y", gen_y);
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


// opponent hand - check for any instant / upgrade / downgrade / magic cards in hand
// draw cards
// discard cards
// if there are any non uni cards play the cards or something (det. with rand int)


// check if any players have 6 / 7 cards in their stable
// if there's a player with that many cards they win


//
//
//
//
//
