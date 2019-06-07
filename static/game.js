var start = document.getElementById("start");
var drawbutton = document.getElementById('draw');
var c = document.getElementById("c");
var turn = document.getElementById('turn');
var comm = document.getElementById('commands');

var mode = "beg_of_turn"; //modes: beg_of_turn, draw, action, end_of_turn
var event = "none"
var LINK_HEAD = "https://raw.githubusercontent.com/tfabiha/unstablepics/master/";
var most_cards = 7;
var cards_to_win = 6;

var deck = [];
var nursery = [];
var player_hand = [];
var player_stable = [];
var opponent_hand = [];
var opponent_stable = [];
var discard_pile = [];

var myturn = true;
var inphase = true;
var discarding = false;
var max_in_stable = false;

var card_atts = {};

// CARD FUNCTIONS

// captures major cards events
// when a card is clicked and we know that we need to do something to it,
// such as discarding it or playing it into the stable
// the appropriate function will be called to act on that card
var events = function(e)
{
    c = e.target;
    console.log( c );
    console.log( c.getAttribute("type") );
    console.log( c.getAttribute("name") );
    console.log( c.getAttribute("att") );

    if (event == "discard")
    {
	discard(e, "hand");
    }
    else if (event == "play")
    {
	play_card(e);
    }
};

// covers the wild variety of effects called by cards
var play_effects = function(type, li)
{
    if (type == "magical_uni" && li[0] == "choice")
    {
	li.pop(0);
    }

    if (type == "magic")
    {
	li = li.split(",");
    }

    for (var i = 0; i < li.length; i++)
    {
	if (li[i] == "draw")
	{
	    if (myturn)
	    {
		draw("player");
	    }
	    else
	    {
		draw("opponent");
	    }
	}
	else if (li[i] == "shuffle_deck")
	{
	    shuffle(deck);
	}
    }
};

var shuffle = function(deck)
{
    var i, j;
    for(i = deck.length - 1; i > 0; i--)
    {
	j = Math.floor(Math.random() * (i+1));
	temp = deck[i];
	deck[i] = deck[j];
	deck[j] = temp;
    }
};

var draw = function(player) {
    var card = deck.pop();
    card.addEventListener("click", events);

    if (player == "player") {
	card_coords(card, player_hand.length * card_width + x_shift, player_y);
	card.setAttribute("player", "t");
	card.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", LINK_HEAD + card.getAttribute("name") + ".jpg");
	//card.addEventListener("click", discard);
	//card.addEventListener("click", play);
	player_hand.push(card);
    }
    else
    {
	card_coords(card, opponent_hand.length * card_width + x_shift, 0);
	card.setAttribute("player", "f");
	opponent_hand.push(card);
    }
}

var discard = function(e, type)
{
    console.log("here is discard");
    console.log(type);
    if (myturn && type == "hand")
    {
	var card = e.target;
	console.log( "is card in hand" );
	comm.innerHTML = "card removed"

	player_hand = player_hand.filter(function(n) {return n != card}); // remove this card from player's hand

	//var i;
	//for(i = 0; i < player_hand.length; i++)
	//{
  //          player_hand[i].setAttribute("x", i * card_width + x_shift);
	//}

  shift(player_hand);

	card_dimensions(card, card_width, 150);
	card_coords(card, svg_width - card_width, discard_y);
	card.setAttribute("player", "f");
	discard_pile.push(card);

	if (player_hand.length <= most_cards)
	{
	    event = "none";

	    if (mode = "end_of_turn")
	    {
		mode = "beg_of_turn";
		myturn = !myturn;
		inphase = !inphase;

		comm.innerHTML = "FINISHED END OF TURN PHASE FOR PLAYER. YOU MAY NOW MOVE TO THE NEXT PHASE";
	    }
	}

    }
    else if (!myturn && type == "hand")
    {
	var c = opponent_hand[ Math.floor( Math.random() * opponent_hand.length ) ];
	    opponent_hand = opponent_hand.filter( function(n) {return n != c} );

	    shift(opponent_hand);


	    card_coords(c, svg_width - card_width, discard_y);
	    c.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", LINK_HEAD + c.getAttribute("name") + ".jpg");
	    discard_pile.push(c);
    }
}

var play_card = function(e)
{
    if (myturn)
    {
	var card = e.target;
	player_hand = player_hand.filter(function(n) {return n != card}); // removes the played card from the hand

	//var i;
	//for(i = 0; i < player_hand.length; i++)
	//{
  //          player_hand[i].setAttribute("x", i * card_width + x_shift);
	//}

  shift(player_hand);

	var t = card.getAttribute("type");
	console.log(t);

	if (t == "baby_uni" || t == "basic_uni" || t == "magical_uni")
	{
            card_dimensions(card, card_width, 150);
            card_coords(card, card.getAttribute("x"), nursery_y);
            card.setAttribute("player", "f");
            player_stable.push(card);
            console.log(card);

            for(i = 0; i < player_stable.length; i++)
            {
		player_stable[i].setAttribute("x", i * card_width + x_shift);
            }

	    if (t == "magical_uni")
	    {
		var att = card.getAttribute("att");
		console.log(att);

		if (att["enter"] != undefined)
		{
		    play_effects("magical_uni", att["enter"]);
		}
	    }
	}
	else
	{
            card_dimensions(card, card_width, 150);
            card_coords(card, svg_width - card_width, discard_y);
            card.setAttribute("player", "f");
            discard_pile.push(card);

	    var att = card.getAttribute("att");
	    console.log(att);

	    play_effects("magic", att);
	}

	event = "none";

	if (mode == "action")
	{
	    mode = "end_of_turn";
	    inphase = !inphase;

	    comm.innerHTML = "FINISHED ACTION PHASE FOR PLAYER. YOU MAY NOW MOVE TO THE NEXT PHASE";
	}
    }
    else
    {

    }
};

d3.json("https://raw.githubusercontent.com/tfabiha/cerealmafia/master/static/cards.json", function(error, d) {

    var dragHandler = d3.drag()
	.on("drag", function ()
	    {
		d3.select(this)
		    .attr("x", d3.event.x)
		    .attr("y", d3.event.y);
	    }
	   );

    var i;
    for (i = 0; i < d.length; i++)
    {

	var j;
	for (j = 0; j < d[i]["quantity"]; j++)
	{
	    var x = null;
	    if (Object.keys(d[i]).includes("phases"))
	    {
		console.log(eval(d[i]["phases"]));
		x = make_card(d[i]["card_name"], d[i]["card_type"], JSON.stringify(eval(d[i]["phases"])));
	    }
	    else if (Object.keys(d[i]).includes("effect"))
	    {
		x = make_card(d[i]["card_name"], d[i]["card_type"], d[i]["effect"]);
	    }
	    else
	    {
		x = make_card(d[i]["card_name"], d[i]["card_type"]);
	    }

	    if (d[i]["card_type"] == "baby_uni")
	    {
		x.setAttribute("y", nursery_y);
		nursery.push(x);
	    }
	    else
	    {
		deck.push(x);
	    }
	}
    }

    shuffle(nursery);
    shuffle(deck);

    var make_player_hand = function()
    {
	var i, card;

	for (i = 0; i < 5; i++)
	{
	    if (i == 0)
	    {
		card = nursery.pop();
	    }
	    else
	    {
		card = deck.pop();
	    }
	    card_coords(card, i * card_width + x_shift, player_y);
	    card.setAttribute("player","t");
	    card.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", LINK_HEAD + card.getAttribute("name") + ".jpg");
	    card.addEventListener("click", events);
	    //card.addEventListener("click", discard);
	    //card.addEventListener("click", play);
	    dragHandler(d3.select(card.getAttribute("name")));
	    player_hand.push(card);
	}
    }

    var make_opponent_hand = function()
    {
	var i, card;
	for (i = 0; i < 5; i++)
	{
	    if (i == 0)
	    {
		card = nursery.pop();
	    }
	    else
	    {
		card = deck.pop();
	    }
	    card_coords(card, i * card_width + x_shift, opponent_y);
	    opponent_hand.push(card);
	}
    }

    make_player_hand();
    make_opponent_hand();

    for (i = 0; i < deck.length; i++)
    {
  	var card = deck[i];
  	c.appendChild(card);
    }

    for (i = 0; i < nursery.length; i++)
    {
  	var card = nursery[i];
  	c.appendChild(card);
    }

    for (i = 0; i < 5; i++)
    {
  	var card = player_hand[i];
  	c.appendChild(card);
  	card = opponent_hand[i];
  	c.appendChild(card);
    }
});

start.addEventListener("click", function(e)
		       {
			   var person = "OPPONENT";
			   if (myturn) { person = "PLAYER" };

			   inphase = !inphase;

			   if (mode == "beg_of_turn" && inphase == false)
			   {
			       turn.innerHTML = "BEGINNING OF " + person + "'S TURN";
			       start.innerHTML = "PLAYING PHASE";

			       comm.innerHTML = "PLAYING ALL EFFECTS IN "+person+"'S STABLE";

			       beg_of_turn(e);
			       mode = "draw";
			       inphase = !inphase;

			       comm.innerHTML = "FINISHED PLAYING ALL EFFECTS IN "+person+"'S STABLE. YOU MAY NOW MOVE TO THE NEXT PHASE";
			   }
			   else if (mode == "draw" && inphase == false)
			   {
			       turn.innerHTML = person + "'S DRAW TURN";
			       start.innerHTML = "PLAYING PHASE";

			       draw_turn(e);
			       mode = "action";
			       inphase = !inphase;

			       comm.innerHTML = "FINISHED DRAWING FOR "+person+". YOU MAY NOW MOVE TO THE NEXT PHASE";
			   }
			   else if (mode == "action" && inphase == false)
			   {
			       turn.innerHTML = person + "'S ACTION TURN";
			       start.innerHTML = "PLAYING PHASE";
			       comm.innerHTML = "STARTED ACTION PHASE FOR "+person+". YOU MAY DRAW OR PLAY A CARD";

			       action_turn(e);

			       if (!myturn)
			       {
				   mode = "end_of_turn";
				   inphase = !inphase;

				   comm.innerHTML = "FINISHED ACTION PHASE FOR "+person+". YOU MAY NOW MOVE TO THE NEXT PHASE";
			       }
			   }
			   else if (mode == "end_of_turn" && inphase == false)
			   {
			       turn.innerHTML = "END OF " + person + "'S TURN";
		  	     start.innerHTML = "PLAYING PHASE";
             comm.innerHTML = "STARTED ACTION PHASE FOR "+person+". YOU MAY DRAW OR PLAY A CARD";

			       end_of_turn(person);


			       if (myturn && player_hand.length > most_cards)
			       {

			       }
			       else
			       {
				   mode = "beg_of_turn";
				   myturn = !myturn;
				   inphase = !inphase;

				   comm.innerHTML = "FINISHED END OF PHASE FOR "+person+". YOU MAY NOW MOVE TO THE NEXT PHASE";
			       }
			   }

			   check_for_win();
			   start.innerHTML = "NEXT PHASE";
		       });

// activates all the begin of turn effects of cards in the stable
var beg_of_turn = function(e)
{

};

// draw a card
var draw_turn = function(e)
{
    if (myturn)
    {
	draw("player");
    }
    else
    {
	draw("opponent");
    }
};

// play at least one card or draw a card
var action_turn = function(e)
{
    if (myturn)
    {
	event = "play";
    }
    else
    {
  var x = Math.floor( Math.random() * 10 );
  if ( x <= 7 ) {
    var c = opponent_hand[Math.floor(Math.random() * opponent_hand.length)];
    opponent_hand = opponent_hand.filter(function(n) {return n != c});
    var i;
    for(i = 0; i < opponent_hand.length; i++) {
  opponent_hand[i].setAttribute("x", i * card_width + x_shift);
    }
    var t = c.getAttribute("type");
    if (t == "baby_uni" || t == "basic_uni" || t == "magical_uni")
    {
  card_coords(c, c.getAttribute("x"), gen_y);
  card_dimensions(c, card_width, 150);
  c.setAttribute("player", "f");
    c.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", LINK_HEAD + c.getAttribute("name") + ".jpg");
    opponent_stable.push(c);
    for(i = 0; i < opponent_stable.length; i++)
                                      {
                                          opponent_stable[i].setAttribute("x", i * card_width + x_shift);
                                      }
    }else {
  card_dimensions(c, card_width, 150);
  card_coords(c, svg_width - card_width, discard_y);
  c.setAttribute("player", "f");
  c.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", LINK_HEAD + c.getAttribute("name") + ".jpg");
  discard_pile.push(c);
  console.log(c);
    }
  }
  else
  {
	draw("opponent");
  }
    }
};

// makes sure that the current player has only most_cards cards at most in their hand
var end_of_turn = function(e)
{

    if (myturn)
    {
	if (player_hand.length > most_cards)
	{
	    event = "discard";
	    comm.inner = "Please remove cards until you have only "+most_cards+"left";
	}

    }
    else
    {
	// works but need to adjust opponents cards
	while (opponent_hand.length > most_cards)
	{
	    discard(e, "hand");
	}
    }

};

var check_for_win = function()
{
  if (opponent_stable.length >= cards_to_win)
  {
    //comm.innerHTML += "opponent won";
    //inphase = false;
    //drawbutton.removeEventListener("click");
    window.location.href = "/winner";
  }
  if (player_stable.length >= cards_to_win)
  {
    //comm.innerHTML += "player won";
    //inphase = false;
    //drawbutton.removeEventListener("click");
    window.location.href = "/winner";
  }
};

drawbutton.addEventListener("click", function()
			    {
				if (mode == "action")
				{
				    draw("player");

				    mode = "end_of_turn";
				    inphase = !inphase;

				    comm.innerHTML = "FINISHED ACTION PHASE FOR PLAYER. YOU MAY NOW MOVE TO THE NEXT PHASE";
				}
			    });

/*
drawbutton.addEventListener('click', function()
			    {
				console.log(myturn);
				if (mode == "draw" || mode == "play")
				{
				    if (myturn)
				    {
					if (mode == "play")
					{
					    draw("player");
					    if (player_hand.length > most_cards)
					    {
						mode = "discard";
						turn.innerHTML = "PLEASE DISCARD A CARD";
					    }
					    else
					    {
						turn.innerHTML = "OPPONENT TURN";
						switch_turns();
						mode = "draw";
					    }
					}
					else
					{
					    draw("player");
					    mode = "play";
					    turn.innerHTML = "PLAY A CARD OR DRAW";
					}
				    }
				    else
				    {
					if(!discarding)
					{
					    draw("opponent");
					    turn.innerHTML = "OPPONENT IS PLAYING";
					    discarding = true;
					    setTimeout(function()
						       {
							   if (Math.floor(Math.random() * 10) <= most_cards) {
							       var c = opponent_hand[Math.floor(Math.random() * opponent_hand.length)];
							       opponent_hand = opponent_hand.filter(function(n) {return n != c});
							       var i;
							       for(i = 0; i < opponent_hand.length; i++) {
								   opponent_hand[i].setAttribute("x", i * card_width + x_shift);
							       }
							       var t = c.getAttribute("type");
							       if (t == "baby_uni" || t == "basic_uni" || t == "magical_uni")
							       {
								   card_coords(c, c.getAttribute("x"), gen_y);
								   card_dimensions(c, card_width, 150);
								   c.setAttribute("player", "f");
  								   c.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", LINK_HEAD + c.getAttribute("name") + ".jpg");
  								   opponent_stable.push(c);
  								   for(i = 0; i < opponent_stable.length; i++)
                                                 		   {
                                                 		       opponent_stable[i].setAttribute("x", i * card_width + x_shift);
                                                 		   }
							       }else {
								   card_dimensions(c, card_width, 150);
								   card_coords(c, svg_width - card_width, discard_y);
								   c.setAttribute("player", "f");
								   c.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", LINK_HEAD + c.getAttribute("name") + ".jpg");
								   discard_pile.push(c);
								   console.log(c);
							       }

							       if (opponent_hand.length > most_cards) {
								   turn.innerHTML = "OPPONENT IS DISCARDING CARD";
								   setTimeout(function() {
								       var c = opponent_hand[Math.floor(Math.random() * 8)];
								       opponent_hand = opponent_hand.filter(function(n) {return n != c});
								       var i;
								       for(i = 0; i < opponent_hand.length; i++) {
									   opponent_hand[i].setAttribute("x", i * card_width + x_shift);
								       }
								       card_coords(c, svg_width - card_width, discard_y);
								       c.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", LINK_HEAD + c.getAttribute("name") + ".jpg");
								       discard_pile.push(c);
								       turn.innerHTML = "PLAYER TURN";
								       switch_turns();
								       discarding = false;
								   }, 1500);
							       }
							       else
							       {
								   turn.innerHTML = "PLAYER TURN";
								   switch_turns();
								   discarding = false;
							       }
							   }
							   else
							   {
							       draw("opponent");
							       if (opponent_hand.length > most_cards)
							       {
								   turn.innerHTML = "OPPONENT IS DISCARDING";
								   setTimeout(function()
									      {
										  while(opponent_hand.length > most_cards)
										  {
										      var c = opponent_hand[Math.floor(Math.random() * 8)];
										      opponent_hand = opponent_hand.filter(function(n) {return n != c});
										      var i;
										      for(i = 0; i < opponent_hand.length; i++)
										      {
											  opponent_hand[i].setAttribute("x", i * card_width + x_shift);
										      }
										      card_coords(c, svg_width - card_width, discard_y);
										      c.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", LINK_HEAD + c.getAttribute("name") + ".jpg");
										  }
										  turn.innerHTML = "PLAYER TURN";
										  switch_turns();
										  discarding = false;
									      }, 1500);
							       }
							       else
							       {
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


*/
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
