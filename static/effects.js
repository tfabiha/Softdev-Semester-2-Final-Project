
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
var ret_hand = function(stable, hand, card, card_y) {
    if (stable.includes(card) || discard_pile.includes(card))
    {
	card_coords(card, hand.length * card_width + x_shift, card_y);

	if (myturn)
	{
	    card.removeAttributeNS("http://www.w3.org/1999/xlink", "xlink:href");
	    setup_remove_stable("opponent", card);
	}

	if (card.getAttribute("type") == "baby_uni")
	{
	    ret_nursery(stable, hand, card);
	}
	else
	{
	    hand.push(card);
	}

	stable = stable.filter(function(n) {return n != card});
	discard_pile = discard_pile.filter(function(n) {return n != card});

	shift(hand);
	shift(stable);
	console.log("returning card to hand");

	return true;
    }

    return false;
};

// return a baby unicorn from stable to nursery
var ret_nursery = function(stable, hand, card) {
    if (stable.includes(card) && card.getAttribute("type") == "baby_uni")
    {
	nursery.push(card);
	shuffle(nursery);

	if (stable == opponent_stable)
	{
	    setup_remove_stable("opponent", card);
	}
	
	stable = stable.filter(function(n) {return n != card});
	shift(stable);
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
	}

	stable.push( card );
	shift(stable);

	return true;
    }

    return false;
};

// checks if the card is a basic unicorn card and if so,
// pulls from hand to stable
var add_basic_frm_hand = function(stable, hand, card, card_y)
{
    if (hand.includes(card) && card.getAttribute("type") == "basic_uni")
    {
	card_coords(card, hand.length * card_width + x_shift, card_y);
	stable.push(card);

	if (myturn)
	{
	    setup_remove_hand(card);
	}

	hand = hand.filter(function(n) {return n != card});
	shift(hand);
	console.log("added basic unicorn from hand to stable");

	return true;
    }

    return false;
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
	stable = stable.filter(function(n) {return n != card});

	if (myturn)
	{
	    setup_remove_stable("player", card);
	}
	else
	{
	    setup_remove_stable("opponent", card);
	}
	
	card_coords(card, hand.length * card_width + x_shift, discard_y);
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
    if (myturn)
    {	
	for (var i = 0; i < player_hand.length; i++)
	{
	    discard_pile[i].removeAttributeNS("http://www.w3.org/1999/xlink", "xlink:href");
	    setup_remove_hand();

	    deck = deck + player_hand;
	    player_hand = [];
	}
    }
    else
    {
	deck = deck + opponent_hand;
	opponent_hand = [];
    }
	    
    shift(discard_pile);
}


// add the discard pile to the deck
var discard_to_deck = function()
{
    for (var i = 0; i < discard_pile.length; i++)
    {
	discard_pile[i].removeAttributeNS("http://www.w3.org/1999/xlink", "xlink:href");
    }
    
    deck = deck + discard_pile;
    discard_pile = [];
    shift(discard_pile);
}

// sacrifice a card
async function sacrifice_all(stable, card)
{
    if (stable.includes(card))
    {
	stable = stable.filter(function(n) {return n != card});\
	card_coords(card, hand.length * card_width + x_shift, discard_y);	
	discard.push(card)

	await activate(card, card.getAttribute("att"), card.getAttribute("type"), "sacrificed");
    }
}


/////////////////////////////////////////
// ALL CARDS BELOW NOT YET IMPLEMENTED //
/////////////////////////////////////////


// put a card from the other player's stable to their hand
var other_ret_all_to_hand = function(other_stable, other_hand, other_card, other_y )
{
    if (other_stable.includes(other_card))
    {
	other_stable = other_stable.filter(function(n) {return n != card});

	if (!myturn)
	{
	    setup_remove_stable("player", card);
	    setup_to_hand(card);
	}
	else
	{
	    setup_remove_stable("opponent", card);
	}

	card_coords(card, hand.length * card_width + x_shift, other_y);
	other_hand.push(card);
	shift(other_hand);
    }
};

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


