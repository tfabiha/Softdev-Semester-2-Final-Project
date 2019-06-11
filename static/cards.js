var svg_width = c.getAttribute("width");
var card_width = 108.16;
var x_shift = card_width * 1.5;
var stable_shift = 125;

var opponent_y = 0;
var gen_y = 125 + (stable_shift / 2);
var nursery_y = 325 + (stable_shift / 2);
var discard_y = 225 + (stable_shift / 2);
var player_y = 450 + stable_shift;



// shift card deck (i.e. hands, stables) over -- discarding / destroying / sacrificing cards
var shift = function(card_deck) {
  var i;
  for(i = 0; i < card_deck.length; i++) {
    card_deck[i].setAttribute("x", i * card_width + x_shift);
  }
}

// shuffle deck
var shuffle = function(deck) {
  var i, j;
  for(i = deck.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i+1));
    temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
};

// change coordinates of cards
var card_coords = function(card, c_x, c_y) {
  card.setAttribute("x", c_x);
  card.setAttribute("y", c_y);
}

// change dimensions of cards (i.e. when a player hovers over their hand)
var card_dimensions = function(card, c_width, c_height) {
  card.setAttribute("width", c_width);
  card.setAttribute("height",c_height);
}

var enlarge = function(e) {
  var card = e.target;
  // all card alignment
  if (card.getAttribute("player") == "t") { //"t" == true
    card_dimensions(card, card_width * 3, 450);
    card_coords(card, card.getAttribute("x"), player_y - 150);
  }
  var adder = 0
  for (i = 0; i < player_hand.length; i++) {
    player_hand[i].setAttribute("x", card_width * i + adder + x_shift);
    player_hand[i].setAttribute("align", "left");

    if (player_hand[i] == card) {
      adder = card_width * 2;
    }
  }
};

var shrink = function(e) {
  var card = e.target;
  // fix card alignment
  if (card.getAttribute("player") == "t") { //"t" == true
    card_dimensions(card, card_width, 150);
    card_coords(card, card.getAttribute("x"), player_y);
  }

  for (i = 0; i < player_hand.length; i++) {
    player_hand[i].setAttribute("x", card_width * i + x_shift);
    player_hand[i].setAttribute("align", "left");
  }
};

var make_card = function(name, type, att) {
  // set all the attributes for the cards
  var card = document.createElementNS("http://www.w3.org/2000/svg", "image");
  card.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", "https://raw.githubusercontent.com/tfabiha/unstablepics/master/back.jpg");
  card_dimensions(card, card_width, 150);
  card_coords(card, 0, gen_y);
  card.setAttribute("name", name);
  card.setAttribute("type", type);
  card.setAttribute("att", att);
  card.setAttribute("player", "f") //set player to false
  card.addEventListener("mouseover", enlarge);
  card.addEventListener("mouseout", shrink);
  return card
};

// discard a card
var discard = function(e) {
    // if we are in fact discarding a card
    // this prevents ppl from discarding a card when they're supposed to be, say,
    // playing it on to the stable
    if (mode == "discard" || mode == "discard_effect")
    {
	var card = e.target; // e is the card that we clicked on
	player_hand = player_hand.filter(function(n) {return n != card}); // remove this card from player's hand
	shift(player_hand);

	card_dimensions(card, card_width, 150);
	card.setAttribute("player", "f");

	setup_remove_hand(card);

	if (card.getAttribute("type") == "baby_uni")
	{
	    nursery.push(card);
	    shuffle(nursery);
	}
	else
	{
	    card_coords(card, svg_width - card_width, discard_y);
	    discard_pile.push(card);
	}

	if (mode == "discard")
	{
	    if (player_hand.length <= 7)
	    {
		mode = "draw";
		turn.innerHTML = "OPPONENT TURN";
		switch_turns();
	    }
	}
	else
	{
	    // we now change the mode to active since we've finished
	    // discarding our own cards
	    // now go back to fxn [ discard_effect ]
	    mode = "activate";
	}
    }
};

// destroy an opponent's card
async function opponent_discard(e) {
    if (mode == "opponent_discard")
    {
	var card = e.target;

	setup_remove_stable("opponent", card);

	if (card.getAttribute("type") == "baby_uni")
	{
	    ret_nursery( opponent_stable, opponent_hand, card );
	}
	else
	{

	    opponent_stable = opponent_stable.filter(function(n) {return n != card}); // remove this card from opponent's stable

	    shift(opponent_stable);

	    card_dimensions(card, card_width, 150);

	    card_coords(card, svg_width - card_width, discard_y);
	    card.setAttribute("player", "f");

	    discard_pile.push(card);

	    if (card.getAttribute("type") == "magical_uni")
	    {
		await activate( card, card.getAttribute("att"), "uni", "destroyed" );
	    }
	}

	mode = "activate";
    }
}

// play a card
async function play(e) {
    if (mode == "play") {
	var card = e.target;

	setup_remove_hand(card);

	player_hand = player_hand.filter(function(n) {return n != card}); // removes the played card from the hand

	var t = card.getAttribute("type");
	console.log(t);
	if (t == "baby_uni" || t == "basic_uni" || t == "magical_uni") {
	    setup_to_stable("player", card);

	    card_dimensions(card, card_width, 150);
	    card_coords(card, player_stable.length * card_width + x_shift, nursery_y);
	    card.setAttribute("player", "f");
	    player_stable.push(card);
	    console.log(card);

	    shift(player_stable);
	    shift(player_hand)

	    if (player_stable.length >= 7) {
		window.location.href = "/winner";
	    }
	}
	else {
	    card_dimensions(card, card_width, 150);
	    card_coords(card, svg_width - card_width, discard_y);
	    card.setAttribute("player", "f");
	    discard_pile.push(card);
	    console.log(card);
	}
	mode = "activate";
	if (t == "magical_uni") {
	    await activate( card, card.getAttribute("att"), "uni", "enter" );
	}
	else if (t == "magic") {
	    await activate( card, card.getAttribute("att"), "magic", "magic" );
	}
	if (player_hand.length > 7) {
	    turn.innerHTML = "DISCARD A CARD";
	    mode = "discard";
	}
	else {
	    turn.innerHTML = "OPPONENT TURN";
	    switch_turns();
	    mode = "draw";
	}
    }
}

async function basic_frm_hand()
{
    if (myturn)
    {
	var basic = player_hand.filter(function(n) {return n.getAttribute("type") == "basic_uni" });

	if (basic.length > 0)
	{
	    turn.innerHTML = "ADD A BASIC UNICORN FROM YOUR HAND TO THE STABLE";
	    mode = "add_basic";

	    await check_end();

	}
    }
    else
    {
	var basic = opponent_hand.filter(function(n) {return n.getAttribute("type") == "basic_uni" });
	if (basic.length > 0)
	{
  	    var c = basic[Math.floor(Math.random() * basic.length)];
	    opponent_stable = opponent_stable.filter(function(n) {return n != c});
	    card_coords(c, opponent_stable.length * card_width + stable_shift, gen_y);
	    card_dimensions(c, card_width, 150);
	    c.setAttribute("player", "f");
	    c.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", LINKHEAD + c.getAttribute("name") + ".jpg");

	    setup_to_stable("opponent", c);

	    opponent_stable.push(c);

	    shift(opponent_stable);
	    shift(opponent_hand);

	    if (opponent_stable.length >= 7) {
		window.location.href = "/winner";
	    }

	}
    }
}

async function other_ret_all()
{
    if (myturn)
    {
	turn.innerHTML = "CHOOSE A UNICORN TO RETURN TO THE OPPONENT'S HAND";
	mode = "other_ret_all";

	await check_end();
    }
    else
    {
	var c = player_hand[Math.floor(Math.random() * player_hand.length)];
	other_ret_all_to_hand( player_stable, player_hand, c, player_y );
    }
}

var other_ret_all_helper = function(e)
{
    if (mode == "other_ret_all")
    {
	var card = e.target;

	other_ret_all_hand( opponent_stable, opponent_hand, card, player_hand );
	mode = "activate";
    }
}

// only call this fxn if the player is getting rid of some card
async function discard_effect(player)
{
    if (myturn)
    {
	if (player == "player") // player has to get rid of their own card
	{
	    turn.innerHTML = "DISCARD A CARD";

	    // changed mode to something else
	    // this correlates to a condition in an event listener
	    // go to fxn [ discard ] that is where this value for the mode is checked
	    mode = "discard_effect";

	    // so now that ur back, js isnt going to stop at the previous line
	    // it's going to want to continue regardless so we have to figure out to
	    // tell it how to wait
	    await check_end();

	    // now we have finished waiting for check end
	    // our mode rn is == active so we can move on with our lives
	    // go to fx [ activate ]
	}
	else // player has to get rid of someone else's card
	{
	    if (opponent_stable.length > 0)
	    {
		turn.innerHTML = "DESTROY ONE OF THE OPPONENT'S UNICORN CARDS";
		mode = "opponent_discard";
		await check_end();
	    }
	}
    }
    else // if it's opponent's turn
    {
	if (player == "player")
	{
	    turn.innerHTML = "OPPONENT IS DISCARDING A CARD";

	    setTimeout( function()
			{
			    var c = opponent_hand[Math.floor(Math.random() * opponent_hand.length)];
                            opponent_hand = opponent_hand.filter(function(n) {return n != c});
                            shift(opponent_hand);
                            card_coords(c, svg_width - card_width, discard_y);
                            c.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", LINKHEAD + c.getAttribute("name") + ".jpg");
                            discard_pile.push(c);

			}, 1500);
	}
	else // opponent is getting rid of one of player's unicorn
	{
	    setTimeout( async function()
			{
			    var c = player_stable[Math.floor(Math.random() * player_stable.length)];
                            player_stable = player_stable.filter(function(n) {return n != c});
                            shift(player_stable);
                            card_coords(c, svg_width - card_width, discard_y);

                            discard_pile.push(c);

			    if (c.getAttribute("type") == "magical_uni")
			    {
				await activate( c, c.getAttribute("att"), "uni", "destroyed" );
			    }

			}, 1500);
	}
    }
}

// this fxn says that we promise that at some point the mode
// is going to change to active but until then keep checking to
// see if it's active or not
// when mode == active then u can end the fxn
// so go back to fxn [ discard_effect ]
async function check_end() {
  await new Promise((resolve) => setTimeout(() => {
    if(mode != "activate") {
      return resolve(check_end());
    }else{
      return resolve();
    }
  }, 100));
}

async function check_choice() {
  await new Promise((resolve) => setTimeout(() => {
    if(mode == "yes" || mode == "no") {
      return resolve();
    }else{
      return resolve(check_choice());
    }
  }, 100));
}

async function activate(card, att, type, moment) {
    var x = null;
    if (type == "uni")
    {
	console.log(att);
	x = JSON.parse(att);
	x = x[moment];
    }

    if (type == "magic")
    {
	x = att.split(',');
    }

    for (var i in x) {
	if (x[i] == "draw")
	{
	    console.log(mode);
	    console.log(myturn);
	    if (myturn)
	    {
		await draw("player"); // calls draw fxn and waits for it to finish running
	    }
	    else
	    {
		await draw("opponent");
	    }
	}

	if (x[i] == "discard_all")
	{
    if (myturn) {
      console.log("player_discard");
      if (player_hand.length > 0) {
            await discard_effect("player"); // calls discard_effect fxn and waits for it to finish running
	    // we have come out of discard_effect finally and we can move on to the
	    // next line of the code
      }
    }
    else
    {
      if (opponent_hand.length > 0) {
        console.log("opponent discard");
        var c = opponent_hand[Math.floor(Math.random() * opponent_hand.length)];
        opponent_hand = opponent_hand.filter(function(n) {return n != c});
        card_dimensions(c, card_width, 150);
        card_coords(c, svg_width - card_width, discard_y);
        c.setAttribute("player", "f");
        c.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", LINKHEAD + c.getAttribute("name") + ".jpg");
        discard_pile.push(c);
        shift(opponent_hand);
      }
    }
	}

	if (x[i] == "destroy_uni")
	{
    if (myturn) {
      if (opponent_stable.length > 0) {
            await discard_effect("opponent"); // calls discard_effect fxn and waits for it to finish running
      }
    }
    else
    {
            if (player_stable.length > 0)
            {
              var c = player_stable[Math.floor(Math.random() * player_stable.length)];
              player_stable = player_stable.filter(function(n) {return n != c});
              card_dimensions(c, card_width, 150);
              card_coords(c, svg_width - card_width, discard_y);
              c.setAttribute("player", "f");
              discard_pile.push(c);
              shift(player_stable);
            }
    }
	}

	if (x[i] == "choice")
	{
	    if (myturn)
	    {
		turn.innerHTML = "PRESS YES TO ACTIVATE THIS CARD OR NO TO NOT ACTIVATE IT"
		mode = "waiting_choice";

		await check_choice();
    console.log("Henlo3");
		if (mode == "no")
		{
		    mode = "activate";
		    turn.innerHTML = "YOU MAY MOVE ON WITH YOUR LIFE";
		return;
		}
		turn.innerHTML = "THE REST OF THE CARD WILL PLAY";
		mode = "activate";
	    }
	    else
	    {
		if (Math.floor(Math.random() * 10) < 4)
		    {
			return;
		    }
	    }
	}

	if (x[i] == "switch_hand")
	{
	    switch_hands();
	}

	if (x[i] == "ret_hand")
	{
	    ret_hand( card, moment);
	}

	if (x[i] == "add_baby_frm_nursery")
	{
	    if (myturn)
	    {
		add_baby_frm_nursery(player_stable, card);
	    }
	    else
	    {
		add_baby_frm_nurery(opponent_stable, card);
	    }
	}

	if (x[i] == "add_basic_frm_hand")
	{
	    await basic_frm_hand(); // calls discard_effect fxn and waits for it to finish running
	}

	if (x[i] == "other_ret_all_to_hand")
	{
	    await other_ret_all(); // calls discard_effect fxn and waits for it to finish running
	}

	if (x[i] == "sacrifice_this")
	{
	    if (myturn)
	    {
		sacrifice_this( player_stable, card );
	    }
	    else
	    {
		sacrifice_this( opponent_stable, card );
	    }
	}

	if (x[i] == "ret_stable_if_hand_nempty")
	{
	    if (moment == "destroyed")
	    {
		if (myturn)
		{
		    ret_hand( opponent_stable, opponent_hand, card, gen_y );
		}
		else
		{
		    ret_hand( player_stable, player_hand, card, gen_y + stable_shift );
		}
	    }
	    else if (moment == "sacrificed")
	    {
		if (myturn)
		{
		    ret_hand( player_stable, player_hand, card, gen_y );
		}
		else
		{
		    ret_hand( opponent_stable, opponent_hand, card, gen_y + stable_shift );
		}
	    }

	}

	if (x[i] == "hand_to_deck")
	{
	    hand_to_deck();
	}

	if (x[i] == "shuffle_deck")
	{
    shuffle(deck);
	}
    }

}

var switch_turns = function() {
    myturn = !myturn;

    if (myturn)
    {
	var stable = player_stable;
    }
    else
    {
	var stable = opponent_stable;
    }

    for (var i = 0; i < stable.length; i++)
    {
	activate( stable[i], stable[i].getAttribute("att"), stable[i].getAttribute("type"), "in_stable" );
    }
};

//card_dimensions(card, card_width, 150);
//card_coords(card, card.getAttribute("x"), player_y);
