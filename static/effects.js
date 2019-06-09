// swap hands with the opponent -- magic / magical uni cards
var switch_hands = function()
{
    var p_hand = player_hand;
    player_hand = opponent_hand;
    opponent_hand = p_hand;
    return true;
};


// return a card to hand from stable
var ret_hand = function(stable, hand, card, card_y) {
    if (stable.includes(card))
    {
	card_coords(card, hand.length * card_width + x_shift, card_y);

	if (!myturn)
	{
	    card.removeAttributeNS("http://www.w3.org/1999/xlink", "xlink:href");
	}
	
	hand.push(card);
	stable = stable.filter(function(n) {return n != card});

	shift(hand);
	shift(stable);
	console.log("shifted hand");

	return true;
    }

    return false;
};

// not implemented
// return a baby unicorn from stable to nursery
var ret_nursery = function(stable, hand, card) {
    if (stable.includes(card) && card.getAttribute("type") == "baby_uni")
    {
	nursery.push(card);
	shuffle(nursery);
	
	stable = stable.filter(function(n) {return n != card});
	shift(stable);
	console.log("returned baby unicorn to nursery");

	return true;
    }

    return false;

};

// not implemented
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
	}
	
	stable.push( card );
	shift(stable);

	return true;
    }

    return false;
};

// not implemented
// checks if the card is a unicorn card and if so,
// pulls from discard to stable
var add_basic_frm_hand = function(stable, hand, card, card_y)
{
    if (hand.includes(card) && card.getAttribute("type") == "basic_uni")
    {
	card_coords(card, hand.length * card_width + x_shift, card_y);
	stable.push(card);

	if (myturn)
	{
	    card.removeEventListener("click", discard);
	    card.removeEventListener("click", play);
	}
	
	hand = hand.filter(function(n) {return n != card});
	shift(hand);
	console.log("added basic unicorn from hand to stable");

	return true;
    }

    return false;    
}

// not implemented
// checks if the card is a unicorn card and if so,
// pulls from discard to stable
var add_uni_frm_discard = function(stable, card, card_y)
{
    if (discard_pile.includes(card) && (card.getAttribute("type") == "basic_uni" || card.getAttribute("type") == "magical_uni"))
    {
	card_coords(card, hand.length * card_width + x_shift, card_y);
	stable.push(card);
	
	discard_pile = discard_pile.filter(function(n) {return n != card});
	shift(hand);
	console.log("added magic card from discard pile to stable");    

	return true;
    }

    return false;
}

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
	    card.addEventListener("click", discard);
	    card.addEventListener("click", play);
	}
	
	discard_pile = discard_pile.filter(function(n) {return n != card});
	shift(hand);
	console.log("added magic card from discard pile to hand");    

	return true;
    }

    return false;
}

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
	    card.addEventListener("click", discard);
	    card.addEventListener("click", play);
	}
	
	discard_pile = discard_pile.filter(function(n) {return n != card});
	shift(hand);
	console.log("added magic card from discard pile to hand");    

	return true;
    }

    return false;
}

