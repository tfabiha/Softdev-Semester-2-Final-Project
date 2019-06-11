async function add_basic(e)
{
    var card = e.target;

    if (mode == "add_basic" && card.getAttribute("type") == "basic_uni")
    {
	player_hand = player_hand.filter(function(n) {return n != card});
	setup_to_stable("player", card);
	card_dimensions(card, card_width, 150);
	card_coords(card, player_stable.length * card_width + x_shift, nursery_y);
	card.setAttribute("player", "f");
  card.addEventListener('click', sacrifice);
	player_stable.push(card);
	mode = "activate";
	if (player_stable.length >= 7) {
	    window.location.href = "/winner";
	}
    }
}

// swap hands with the opponent -- magic / magical uni cards
var switch_hands = function()
{
    var p_hand = player_hand;
    player_hand = opponent_hand;
    opponent_hand = p_hand;

    for (var i = 0; i < player_hand.length; i++)
    {
	var c = player_hand[i];
	card_coords( c, i * card_width + x_shift, player_y);
	c.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", LINKHEAD + c.getAttribute("name") + ".jpg");

	setup_to_hand(c);
	c.setAttribute("player", "t");
    }
    for (var i = 0; i < opponent_hand.length; i++)
    {
	var c = opponent_hand[i];
	card_coords( c, i * card_width + x_shift, opponent_y);
	c.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", "https://raw.githubusercontent.com/tfabiha/unstablepics/master/back.jpg");

	setup_to_hand(c);
	c.setAttribute("player", "f");
    }

    shift(player_hand);
    shift(opponent_hand);

    return true;
};


// return a card to hand from stable
var ret_hand = function(card, moment) {
    // my card was destoryed or sacrificed
    if (moment == "destroyed" && !myturn || moment == "sacrificed" && myturn)
    {
	if (player_stable.includes(card) || discard_pile.includes(card))
	{
	    card_coords(card, hand.length * card_width + x_shift, player_y);

	    if (card.getAttribute("type") == "baby_uni")
	    {
		ret_nursery(stable, hand, card);
	    }
	    else
	    {
		player_hand.push(card);
	    }

	    player_stable = player_stable.filter(function(n) {return n != card});
	    discard_pile = discard_pile.filter(function(n) {return n != card});

	    shift(player_hand);
	    shift(player_stable);
	    console.log("returning card to hand");
	}
    }
    // opponent's card was destroyed or sacrificed
    else
    {
	if (opponentplayer_stable.includes(card) || discard_pile.includes(card))
	{
	    card_coords(card, hand.length * card_width + x_shift, opponent_y);

	    card.removeAttributeNS("http://www.w3.org/1999/xlink", "xlink:href");
	    setup_remove_stable("opponent", card);

	    if (card.getAttribute("type") == "baby_uni")
	    {
		ret_nursery(stable, hand, card);
	    }
	    else
	    {
		opponent_hand.push(card);
	    }

	    opponent_stable = opponent_stable.filter(function(n) {return n != card});
	    discard_pile = discard_pile.filter(function(n) {return n != card});

	    shift(opponent_hand);
	    shift(opponent_stable);
	    console.log("returning card to hand");
	}

    }
};

// return a baby unicorn from stable to nursery
var ret_nursery = function(stable, hand, card)
{

    if (stable.includes(card) && card.getAttribute("type") == "baby_uni")
    {
	card_coords( card, nursery_y, card_y );
	card.removeAttributeNS("http://www.w3.org/1999/xlink", "xlink:href");
	nursery.push(card);
	shuffle(nursery);

	if (stable == opponent_stable)
	{
	    setup_remove_stable("opponent", card);
	    opponent_stable = opponent_stable.filter(function(n) {return n != card});
	    shift(opponent_stable);
	}
	else
	{
	    player_stable = player_stable.filter(function(n) {return n != card});
	    shift(player_stable);
	}

	console.log("returned baby unicorn to nursery");

	return true;
    }

    return false;

};

// adds a baby unicorn to the player's stable
var add_baby_frm_nursery = function(stable, card_y)
{
    if (nursery.length > 0)
    {
	card = nursery.pop();
	card_coors( card, stable.length * card_width + x_shift, card_y );

	if (myturn)
	{
	    card.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", LINKHEAD + card.getAttribute("name") + ".jpg");
	    setup_to_hand(card);
	    player_stable.push(card);
	    shift(player_stable);
	}
	else
	{
	    opponent_stable.push(card);
	    shift(opponent_stable);
	}

    }

};

// not implemented
// checks if the card is a unicorn card and if so,
// pulls from discard to stable
async function add_uni_frm_discard(stable, card, card_y)
{
    if (discard_pile.includes(card) && (card.getAttribute("type") == "basic_uni" || card.getAttribute("type") == "magical_uni"))
    {
	if (!myturn)
	{
	    setup_to_stable("opponent", card);
	}

	card_coords(card, hand.length * card_width + x_shift, card_y);
	stable.push(card);

	discard_pile = discard_pile.filter(function(n) {return n != card});
	shift(hand);

	if (card.getAttribute("type") == "magical_uni")
	{
	    await activate( card, card.getAttribute("att"), card.getAttribute("type"), "enter" );
	}

	console.log("added magic card from discard pile to stable");

	return true;
    }

    return false;
};

// not implemented
// checks if the card is a magic card and if so,
// pulls from discard to hand
var add_magic_frm_discard = function(hand, card, card_y)
{
    if (discard_pile.includes(card) && card.getAttribute("type") == "magic")
    {
	card_coords(card, hand.length * card_width + x_shift, card_y);
	hand.push(card);

	if (!myturn)
	{
	    card.removeAttributeNS("http://www.w3.org/1999/xlink", "xlink:href");
	}
	else
	{
	    setup_to_hand(card);
	}

	discard_pile = discard_pile.filter(function(n) {return n != card});
	shift(hand);
	console.log("added magic card from discard pile to hand");

	return true;
    }

    return false;
};

// not implemented
// checks if the card is a unicorn card and if so,
// pulls from discard to hand
var add_uni_frm_discard_to_hand = function(hand, card, card_y)
{
    if (discard_pile.includes(card) && (card.getAttribute("type") == "basic_uni" || card.getAttribute("type") == "magical_uni"))
    {
	card_coords(card, hand.length * card_width + x_shift, card_y);
	hand.push(card);

	if (!myturn)
	{
	    card.removeAttributeNS("http://www.w3.org/1999/xlink", "xlink:href");
	}
	else
	{
	    setup_to_hand(card);
	}

	discard_pile = discard_pile.filter(function(n) {return n != card});
	shift(hand);
	console.log("added magic card from discard pile to hand");

	return true;
    }

    return false;
};

// sacrifice this card
var sacrifice_this = function(stable, card)
{
    if (stable.includes(card))
    {
	card_coords(card, svg_width - caard_width, discard_y);

	if (myturn)
	{
	    setup_remove_stable("player", card);
	    player_stable = player_stable.filter(function(n) {return n != card});
	}
	else
	{
	    setup_remove_stable("opponent", card);
	    opponent_stable = opponent_stable.filter(function(n) {return n != card});
	}

	discard_pile.push(card);
    }
};

// return to the stable if player's hand is not empty
var ret_stable_if_hand_nempty = function(stable, hand, card, card_y)
{
    if (stable.includes(card))
    {
	if (hand.length > 0)
	{
	    discard_pile = discard_pile.filter(function(n) {return n != card});
	    card_coords(card, stable.length * card_width + x_shift, card_y);
	    stable.push(card)
	    shift(stable);
	}

    }
};

// add you're current hand to the deck
var hand_to_deck = function()
{
    for (var i = 0; i < discard_pile.length; i++)
	{
	    discard_pile[i].setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", "https://raw.githubusercontent.com/tfabiha/unstablepics/master/back.jpg");
	    card_dimensions(discard_pile[i], card_width, 150);
	    card_coords(discard_pile[i], 0, gen_y);
	    discard_pile[i].setAttribute("player", "f");
	}
	deck = deck.concat(discard_pile);
	console.log(deck);
	discard_pile = [];

    if (myturn)
    {
	for (var i = 0; i < player_hand.length; i++)
	{
	    player_hand[i].setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", "https://raw.githubusercontent.com/tfabiha/unstablepics/master/back.jpg");
	    setup_remove_hand(player_hand[i]);
	    card_dimensions(player_hand[i], card_width, 150);
	    card_coords(player_hand[i], 0, gen_y);
	    player_hand[i].setAttribute("player", "f");
	}
	deck = deck.concat(player_hand);
	console.log(deck);
	player_hand = [];
    }
    else
    {
	for (var i = 0; i < opponent_hand.length; i++)
	{
	    card_dimensions(opponent_hand[i], card_width, 150);
	    card_coords(player_hand[i], 0, gen_y);
	    player_hand[i].setAttribute("player", "f");
	}
	deck = deck.concat(opponent_hand);
	console.log(deck);
	opponent_hand = [];
    }



    for (var i = 0; i < deck.length; i++) {
	    if (deck[i].getAttribute("type") == "baby_uni") {
		nursery.push(deck[i]);
		card_coords(deck[i], 0, nursery_y);
		deck = deck.filter(function(n) {return n != deck[i]});
	    }
    }

};

// sacrifice a card
async function sacrifice_all(stable, card)
{
    if (stable.includes(card))
    {
	card_coords(card, hand.length * card_width + x_shift, discard_y);

	if (stable == player_stable)
	{
	    player_stable = player_stable.filter(function(n) {return n != card});
	}
	else
	{
	    opponent_stable = opponent_stable.filter(function(n) {return n != card});
	}

	discard.push(card)

	await activate(card, card.getAttribute("att"), card.getAttribute("type"), "sacrificed");
    }
}


// put a card from the other player's stable to their hand
var other_ret_all_to_hand = function(other_stable, other_hand, other_card, other_y )
{
    if (other_stable.includes(other_card))
    {
	card_coords(card, hand.length * card_width + x_shift, other_y);

	if (!myturn)
	{
	    setup_remove_stable("player", card);
	    setup_to_hand(card);
	    player_stable = player_stable.filter(function(n) {return n != card});
	    player_hand.push(card);
	    shift(player_stable);
	    shift(player_hand);
	}
	else
	{
	    setup_remove_stable("opponent", card);
	    opponent_stable = opponent_stable.filter(function(n) {return n != card});
	    opponent_hand.push(card);
	    shift(opponent_stable);
	    shift(opponent_hand);
	}

    }
};

/////////////////////////////////////////
// ALL CARDS BELOW NOT YET IMPLEMENTED //
/////////////////////////////////////////

// move a unicorn from your stable to the other person's stable
var move_uni_to_other = function(stable, other_stable, card, card_y)
{
    if (stable.includes(card))
    {
	stable = stable.filter(function(n) {return n != card});
	card_coords(card, hand.length * card_width + x_shift, card_y);
	other_stable.push(card);

	shift(stable);
	shift(other_stable);
    }
};

// steal_uni
var steal_uni = function(stable, other_stable, card, card_y)
{
    if (other_stable.includes(card))
    {
	other_stable = other_stable.filter(function(n) {return n != card});
	card_coords(card, hand.length * card_width + x_shift, card_y);
	stable.push(card);

	shift(stable);
	shift(other_stable);
    }
}
