var drawbutton = document.getElementById('draw');
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

var svg_width = c.getAttribute("width");
var card_width = 108.16;
var x_shift = card_width * 1.5;
var stable_shift = 125;

var opponent_y = 0;
var gen_y = 125 + (stable_shift / 2);
var nursery_y = 325 + (stable_shift / 2);
var discard_y = 225 + (stable_shift / 2);
var player_y = 450 + stable_shift;

var card_atts = {};

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
      x = make_card(d[i]["card_name"], d[i]["card_type"], eval(d[i]["phases"]));
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
	    card.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", "https://raw.githubusercontent.com/tfabiha/unstablepics/master/" + card.getAttribute("name") + ".jpg");
	    card.addEventListener("click", discard);
	    card.addEventListener("click", play);
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

var draw = function(player) {
  if (player == "player") {
    var card = deck.pop();
    card_coords(card, player_hand.length * card_width + x_shift, player_y);
    card.setAttribute("player", "t");
    card.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", "https://raw.githubusercontent.com/tfabiha/unstablepics/master/" + card.getAttribute("name") + ".jpg");
    card.addEventListener("click", discard);
    card.addEventListener("click", play);
    player_hand.push(card);
  }else{
    var card = deck.pop();
    card_coords(card, opponent_hand.length * card_width + x_shift, 0);
    opponent_hand.push(card);
  }
}
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
					    if (player_hand.length > 7)
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
							   if (Math.floor(Math.random() * 10) <= 7) {
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
  							       c.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", "https://raw.githubusercontent.com/tfabiha/unstablepics/master/" + c.getAttribute("name") + ".jpg");
  							       opponent_stable.push(c);
  							       for(i = 0; i < opponent_stable.length; i++)
                                                 		       {
                                                 			   opponent_stable[i].setAttribute("x", i * card_width + x_shift);
                                                 		       }
                     }else {
                       card_dimensions(c, card_width, 150);
                       card_coords(c, svg_width - card_width, discard_y);
                       c.setAttribute("player", "f");
                       c.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", "https://raw.githubusercontent.com/tfabiha/unstablepics/master/" + c.getAttribute("name") + ".jpg");
                       discard_pile.push(c);
                       console.log(c);
                     }

							       if (opponent_hand.length > 7) {
								   turn.innerHTML = "OPPONENT IS DISCARDING CARD";
								   setTimeout(function() {
								       var c = opponent_hand[Math.floor(Math.random() * 8)];
								       opponent_hand = opponent_hand.filter(function(n) {return n != c});
								       var i;
								       for(i = 0; i < opponent_hand.length; i++) {
									   opponent_hand[i].setAttribute("x", i * card_width + x_shift);
								       }
                       card_coords(c, svg_width - card_width, discard_y);
								       c.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", "https://raw.githubusercontent.com/tfabiha/unstablepics/master/" + c.getAttribute("name") + ".jpg");
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
							       if (opponent_hand.length > 7)
							       {
								   turn.innerHTML = "OPPONENT IS DISCARDING";
								   setTimeout(function()
									      {
										  while(opponent_hand.length > 7)
										  {
										      var c = opponent_hand[Math.floor(Math.random() * 8)];
										      opponent_hand = opponent_hand.filter(function(n) {return n != c});
										      var i;
										      for(i = 0; i < opponent_hand.length; i++)
										      {
											  opponent_hand[i].setAttribute("x", i * card_width + x_shift);
										      }
                     card_coords(c, svg_width - card_width, discard_y);
									   c.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", "https://raw.githubusercontent.com/tfabiha/unstablepics/master/" + c.getAttribute("name") + ".jpg");
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
