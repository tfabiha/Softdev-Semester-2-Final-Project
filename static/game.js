var drawbutton = document.getElementById('draw');

var yes = document.getElementById('yes');
var no = document.getElementById('no');

var c = document.getElementById("c");
var myturn = true;
var turn = document.getElementById('turn');
var deck = [];
var nursery = [];
var player_hand = [];
var player_stable = [];
var opponent_hand = [];
var opponent_stable = [];
var discard_pile = [];
var mode = "draw"; //modes: beg_of_turn, draw, action, end_of_turn
var discarding = false;

var LINKHEAD = "https://raw.githubusercontent.com/tfabiha/unstablepics/master/";
var card_atts = {};

var setup_to_hand = function(card)
{
    card.addEventListener("click", discard);
    card.addEventListener("click", play);
    card.addEventListener("click", add_basic);
    card.addEventListener("mouseover", enlarge);
    card.addEventListener("mouseout", shrink);

};

var setup_remove_hand = function(card)
{
    card.removeEventListener("click", discard);
    card.removeEventListener("click", play);
    card.removeEventListener("click", add_basic);
    card.removeEventListener("mouseover", enlarge);
    card.removeEventListener("mouseout", shrink);

};

var setup_to_stable = function(player, card)
{
    if (player == "player")
    {
      card.addEventListener("click", sacrifice);
    }
    else
    {
        card.addEventListener("click", opponent_discard);
	card.addEventListener("click", other_ret_all_helper);
    }
};

var setup_remove_stable = function(player, card)
{
    if (player == "player")
    {

    }
    else
    {
        card.removeEventListener("click", opponent_discard);
	card.removeEventListener("click", other_ret_all_helper);
    }
};

yes.addEventListener("click", function()
		     {
			 if (mode == "waiting_choice")
			 {
			     mode = "yes";
			 }
     });

no.addEventListener("click", function()
		     {
			 if (mode == "waiting_choice")
			 {
			     mode = "no";
			 }
     });

d3.json("https://raw.githubusercontent.com/tfabiha/cerealmafia/master/static/cards.json", function(error, d) {

  var dragHandler = d3.drag()
	.on("drag", function () {
		d3.select(this)
		  .attr("x", d3.event.x)
		  .attr("y", d3.event.y);
	});

  var i;
  for (i = 0; i < d.length; i++) {
	  var j;
	  for (j = 0; j < d[i]["quantity"]; j++) {
      var x = null;
      if (Object.keys(d[i]).includes("phases")) {
        console.log(eval(d[i]["phases"]));
        x = make_card(d[i]["card_name"], d[i]["card_type"], JSON.stringify(eval(d[i]["phases"])));
      }
      else if (Object.keys(d[i]).includes("effect")) {
        x = make_card(d[i]["card_name"], d[i]["card_type"], d[i]["effect"]);
      }
      else {
        x = make_card(d[i]["card_name"], d[i]["card_type"]);
      }

	    if (d[i]["card_type"] == "baby_uni") {
		    x.setAttribute("y", nursery_y);
		    nursery.push(x);
	    }
	    else {
		    deck.push(x);
	    }
	  }
  }
  shuffle(nursery);
  shuffle(deck);

  var make_player_hand = function() {
	  var i, card;

	  for (i = 0; i < 5; i++) {
	    if (i == 0) {
		    card = nursery.pop();
	    }
	    else {
		    card = deck.pop();
	    }
	      card_coords(card, i * card_width + x_shift, player_y);
	      card.setAttribute("player","t");
	      card.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", LINKHEAD + card.getAttribute("name") + ".jpg");
	      setup_to_hand(card);
	      dragHandler(d3.select(card.getAttribute("name")));
	      player_hand.push(card);
	  }
  }

  var make_opponent_hand = function() {
	  var i, card;
	  for (i = 0; i < 5; i++) {
	    if (i == 0) {
		    card = nursery.pop();
	    }
	    else {
		    card = deck.pop();
	    }
      card_coords(card, i * card_width + x_shift, opponent_y);
	    opponent_hand.push(card);
	  }
  }

  make_player_hand();
  make_opponent_hand();

  for (i = 0; i < deck.length; i++) {
  	var card = deck[i];
  	c.appendChild(card);
  }

  for (i = 0; i < nursery.length; i++) {
  	var card = nursery[i];
  	c.appendChild(card);
  }

  for (i = 0; i < 5; i++) {
  	var card = player_hand[i];
  	c.appendChild(card);
  	card = opponent_hand[i];
  	c.appendChild(card);
  }
});

var draw = function(player) {
    if (player == "player") {
	var card = deck.pop();
	card_coords(card, player_hand.length * card_width + x_shift, player_y);
	card.setAttribute("player", "t");
	card.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", LINKHEAD + card.getAttribute("name") + ".jpg");
	setup_to_hand(card);
	player_hand.push(card);
    }
    else {
	var card = deck.pop();
	card_coords(card, opponent_hand.length * card_width + x_shift, 0);
    opponent_hand.push(card);
    }
}

drawbutton.addEventListener('click', function() {
	console.log(myturn);

	if (mode == "draw" || mode == "play") {

    // player's turn
		if (myturn) {
			if (mode == "play") {
        draw("player");
				if (player_hand.length > 7) {
					mode = "discard";
					turn.innerHTML = "PLEASE DISCARD A CARD";
				}
				else {
					turn.innerHTML = "OPPONENT TURN";
					switch_turns();
					mode = "draw";
				}
			}
			else {
				draw("player");
				mode = "play";
				turn.innerHTML = "PLAY A CARD OR DRAW";
			}
		}

    // opponent's turn
		else {
			if(!discarding) {
				draw("opponent");
				turn.innerHTML = "OPPONENT IS PLAYING";
				discarding = true;

				setTimeout(async function() {
				    if (Math.floor(Math.random() * 10) <= 7) {
					var c = opponent_hand[Math.floor(Math.random() * opponent_hand.length)];
					opponent_hand = opponent_hand.filter(function(n) {return n != c});

					var t = c.getAttribute("type");

					// add a unicorn to opponent's stable
					if (t == "baby_uni" || t == "basic_uni" || t == "magical_uni") {
					    card_coords(c, c.getAttribute("x"), gen_y);
					    card_dimensions(c, card_width, 150);
					    c.setAttribute("player", "f");
  					  c.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", LINKHEAD + c.getAttribute("name") + ".jpg");

					    setup_to_stable("opponent", c);

					    opponent_stable.push(c);

              if (opponent_stable.length >= 7) {
						    window.location.href = "/winner";
					    }

					    shift(opponent_stable);
					    shift(opponent_hand);

              await activate( c, c.getAttribute("att"), c.getAttribute("type"), "enter" );

					    if (opponent_stable.length >= 7) {
						    window.location.href = "/winner";
					    }
					}
					// play a magic card
					else {
					    card_dimensions(c, card_width, 150);
					    card_coords(c, svg_width - card_width, discard_y);
					    c.setAttribute("player", "f");
					    c.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", LINKHEAD + c.getAttribute("name") + ".jpg");

					    // play opponent's magic card
              discard_pile.push(c);
					    shift(opponent_hand)
              await activate( c, c.getAttribute("att"), "magic", "magic" );
					    console.log(c);
					    }

					// remove a card if greater than 7
					if (opponent_hand.length > 7) {
					    turn.innerHTML = "OPPONENT IS DISCARDING CARD";

					    setTimeout(function() {
						var c = opponent_hand[Math.floor(Math.random() * opponent_hand.length)];

						if ( t == "baby_uni" )
						{
						    ret_nursery( opponent_stable, opponent_hand, c );
						}
						else
						{
						    opponent_hand = opponent_hand.filter(function(n) {return n != c});
						    shift(opponent_hand);

						    discard_pile.push(c);
						    card_coords(c, svg_width - card_width, discard_y);
						    c.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", LINKHEAD + c.getAttribute("name") + ".jpg");
						}

						turn.innerHTML = "PLAYER TURN";
						switch_turns();
						discarding = false;
					    }, 1500);
					}

					else {
					    turn.innerHTML = "PLAYER TURN";
					    switch_turns();
					    discarding = false;
					}
				    }

				    // opponent does not play but draws
				    else {
					draw("opponent");
						if (opponent_hand.length > 7) {
						    turn.innerHTML = "OPPONENT IS DISCARDING";
						    setTimeout(function() {
							while(opponent_hand.length > 7) {
							    var c = opponent_hand[Math.floor(Math.random() * 8)];

							    if ( t == "baby_uni" )
							    {
								ret_nursery( opponent_stable, opponent_hand, c );
							    }
							    else
							    {
								opponent_hand = opponent_hand.filter(function(n) {return n != c});
								shift(opponent_hand);
								discard_pile.push(c);
								card_coords(c, svg_width - card_width, discard_y);
								c.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", LINKHEAD + c.getAttribute("name") + ".jpg");
							    }
							}
							turn.innerHTML = "PLAYER TURN";
							switch_turns();
							discarding = false;
						    }, 1500);
						}

					else {
					    turn.innerHTML = "PLAYER TURN";
					    switch_turns();
					    discarding = false;
					}
				    }
				}, 1500);
			}
		}
	}
	console.log(myturn);
});




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
