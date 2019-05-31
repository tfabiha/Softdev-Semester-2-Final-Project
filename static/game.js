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
var discard = [];
var mode = "draw";
var discarding = false;

var svg_width = c.getAttribute("width");
var x_shift = 200;
var card_width = 108.16;
var stable_shift = 125;

var opponent_y = 0;
var gen_y = 125 + (stable_shift / 2);
var nursery_y = 325 + (stable_shift / 2);
var discard_y = 225 + (stable_shift / 2);
var player_y = 450 + stable_shift;

var make_card = function(name, type, att){
  var card = document.createElementNS("http://www.w3.org/2000/svg", "image");
  card.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", "https://raw.githubusercontent.com/tfabiha/unstablepics/master/back.jpg");
  card.setAttribute("width",card_width);
  card.setAttribute("height",150);
  card.setAttribute("x", 0);
  card.setAttribute("y", gen_y);
  card.setAttribute("name", name);
  card.setAttribute("type", type);
  card.setAttribute("att", att);
  card.setAttribute("player", "f") //set player to false
  card.addEventListener("mouseover", function()
			                  {
			                    if (card.getAttribute("player") == "t") //"t" == true
			                    {
			    	                card.setAttribute("width",card_width * 3);
				                    card.setAttribute("height",450);
                            card.setAttribute("y", player_y - 150);
			                    }

			                    var adder = 0
			                    for (i = 0; i < player_hand.length; i++)
			                    {
				                    player_hand[i].setAttribute("x", card_width * i + adder + x_shift);
				                    player_hand[i].setAttribute("align", "left");

				                    if (player_hand[i] == card)
				                    {
				                      adder = card_width * 2;
				                    }
			                    }
			                  }
			                 );
  card.addEventListener("mouseout", function()
			                  {
                          if (card.getAttribute("player") == "t") //"t" == true
			                    {
			    	                card.setAttribute("width", card_width);
			                      card.setAttribute("height", 150);
                            card.setAttribute("y", player_y);
			                    }

			                    for (i = 0; i < player_hand.length; i++)
			                    {
				                    player_hand[i].setAttribute("x", card_width * i + x_shift);
				                    player_hand[i].setAttribute("align", "left");
			                    }
			                  }
			                 );
  return card
};

var discard = function(e)
{
  if (mode == "discard")
  {
	  var card = e.target;
	  player_hand = player_hand.filter(function(n) {return n != card});

	  var i;
	  for(i = 0; i < player_hand.length; i++)
	  {
	    player_hand[i].setAttribute("x", i * card_width + x_shift);
	  }

    card.setAttribute("x", svg_width - card_width - 50);
    card.setAttribute("y", discard_y);
    card.setAttribute("width", card_width);
    card.setAttribute("height", 150);
	  card.setAttribute("player", "f");

	  if (player_hand.length <= 7)
	  {
	    mode = "draw";
	    turn.innerHTML = "OPPONENT TURN";
	    switch_turns();
	  }
  }
}

var play = function(e)
{
  if (mode == "play")
  {
	  var card = e.target;
	  player_hand = player_hand.filter(function(n) {return n != card});

	  var i;
	  for(i = 0; i < player_hand.length; i++)
	  {
	    player_hand[i].setAttribute("x", i * card_width + x_shift);
	  }

	  card.setAttribute("x", svg_width - card_width);
	  card.setAttribute("y", discard_y);
    card.setAttribute("width", card_width);
    card.setAttribute("height", 150);
	  card.setAttribute("player", "f");

	  if (player_hand.length > 7)
	  {
	    turn.innerHTML = "DISCARD A CARD";
	    mode = "discard";
	  }
	  else
	  {
	    turn.innerHTML = "OPPONENT TURN";
	    switch_turns();
	    mode = "draw";
	  }
  }
}

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
	    var x = make_card(d[i]["card_name"], d[i]["card_type"], d[i]["phases"]);

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

  var shuffle = function(deck)
  {
	  var i, j, k;
	  for(i = deck.length - 1; i > 0; i--)
	  {
	    j = Math.floor(Math.random() * (i+1));
	    temp = deck[i];
	    deck[i] = deck[j];
	    deck[j] = temp;
	  }
  };

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

	    card.setAttribute("x", i * card_width + x_shift);
  	  card.setAttribute("y", player_y);
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

	    card.setAttribute("x", i * card_width + x_shift);
  	  card.setAttribute("y", opponent_y);
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
  	c.append(card);
  }
});

drawbutton.addEventListener('click', function()
			                      {
				                      console.log(myturn);
				                      if (mode == "draw" || mode == "play")
				                      {
				                        if (myturn)
				                        {
					                        if (mode == "play")
					                        {
					                          var card = deck.pop();
					                          card.setAttribute("x", player_hand.length * card_width + x_shift);
					                          card.setAttribute("y", player_y);
					                          card.setAttribute("player", "t");
					                          card.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", "https://raw.githubusercontent.com/tfabiha/unstablepics/master/" + card.getAttribute("name") + ".jpg");
					                          card.addEventListener("click", discard);
					                          card.addEventListener("click", play);
					                          player_hand.push(card);

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
					                          var card = deck.pop();
					                          card.setAttribute("x", player_hand.length * card_width + x_shift);
					                          card.setAttribute("y", player_y);
					                          card.setAttribute("player", "t");
					                          card.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", "https://raw.githubusercontent.com/tfabiha/unstablepics/master/" + card.getAttribute("name") + ".jpg");
					                          card.addEventListener("click", discard);
					                          card.addEventListener("click", play);
					                          player_hand.push(card);
					                          mode = "play";
					                          turn.innerHTML = "PLAY A CARD OR DRAW";
					                        }
				                        }
				                        else
				                        {
					                        if(!discarding)
					                        {
					                          var card = deck.pop();
					                          card.setAttribute("x", opponent_hand.length * card_width + x_shift);
					                          card.setAttribute("y", 0);
					                          opponent_hand.push(card);
					                          turn.innerHTML = "OPPONENT IS PLAYING";
					                          discarding = true;
					                          setTimeout(function()
						                                   {
							                                   if (Math.floor(Math.random() * 10) <= 4) {
							                                     var c = opponent_hand[Math.floor(Math.random() * opponent_hand.length)];
							                                     opponent_hand = opponent_hand.filter(function(n) {return n != c});
							                                     var i;
							                                     for(i = 0; i < opponent_hand.length; i++) {
								                                     opponent_hand[i].setAttribute("x", i * card_width + x_shift);
							                                     }
							                                     c.setAttribute("x", svg_width - card_width);
							                                     c.setAttribute("y", discard_y);
							                                     c.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", "https://raw.githubusercontent.com/tfabiha/unstablepics/master/" + c.getAttribute("name") + ".jpg");
							                                     if (opponent_hand.length > 7) {
								                                     turn.innerHTML = "OPPONENT IS DISCARDING CARD";
								                                     setTimeout(function() {
								                                       var c = opponent_hand[Math.floor(Math.random() * 8)];
								                                       opponent_hand = opponent_hand.filter(function(n) {return n != c});
								                                       var i;
								                                       for(i = 0; i < opponent_hand.length; i++) {
									                                       opponent_hand[i].setAttribute("x", i * card_width + x_shift);
								                                       }
								                                       c.setAttribute("x", svg_width - card_width);
								                                       c.setAttribute("y", discard_y);
								                                       c.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", "https://raw.githubusercontent.com/tfabiha/unstablepics/master/" + c.getAttribute("name") + ".jpg");
								                                       turn.innerHTML = "PLAYER TURN";
								                                       switch_turns();
								                                       discarding = false;
								                                     }, 1500);
							                                     }else{
								                                     turn.innerHTML = "PLAYER TURN";
								                                     switch_turns();
								                                     discarding = false;
							                                     }
							                                   }else{
							                                     var card = deck.pop();
							                                     card.setAttribute("x", opponent_hand.length * card_width + x_shift);
							                                     card.setAttribute("y", 0);
							                                     opponent_hand.push(card);
							                                     if (opponent_hand.length > 7) {
								                                     turn.innerHTML = "OPPONENT IS DISCARDING";
								                                     setTimeout(function() {
								                                       while(opponent_hand.length > 7) {
									                                       var c = opponent_hand[Math.floor(Math.random() * 8)];
									                                       opponent_hand = opponent_hand.filter(function(n) {return n != c});
									                                       var i;
									                                       for(i = 0; i < opponent_hand.length; i++) {
									                                         opponent_hand[i].setAttribute("x", i * card_width + x_shift);
									                                       }
                                                         c.setAttribute("x", svg_width - card_width);
									                                       c.setAttribute("y", discard_y);
									                                       c.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", "https://raw.githubusercontent.com/tfabiha/unstablepics/master/" + c.getAttribute("name") + ".jpg");
								                                       }
								                                       turn.innerHTML = "PLAYER TURN";
								                                       switch_turns();
								                                       discarding = false;
								                                     }, 1500);
							                                     }else{
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


var switch_turns = function(){
  if (myturn == false)
  {
	  myturn = true;
  }
  else
  {
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
