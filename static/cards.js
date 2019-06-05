var card_coords = function(card, c_x, c_y){
  card.setAttribute("x", c_x);
  card.setAttribute("y", c_y);
}

var card_dimensions = function(card, c_width, c_height){
  card.setAttribute("width", c_width);
  card.setAttribute("height",c_height);
}

var make_card = function(name, type, att){
    // set all the attributes for the cards
    var card = document.createElementNS("http://www.w3.org/2000/svg", "image");
    card.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href", "https://raw.githubusercontent.com/tfabiha/unstablepics/master/back.jpg");
    card_dimensions(card, card_width, 150);
    card_coords(card, 0, gen_y);
    card.setAttribute("name", name);
    card.setAttribute("type", type);
    card.setAttribute("att", att);
    card.setAttribute("player", "f") //set player to false
    card.addEventListener("mouseover", function()
        {
            // all card alignment
            if (card.getAttribute("player") == "t") //"t" == true
            {
              card_dimensions(card, card_width * 3, 450);
              card_coords(card, card.getAttribute("x"), player_y - 150);
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
            // fix card alignment
                              if (card.getAttribute("player") == "t") //"t" == true
          {
            card_dimensions(card, card_width, 150);
            card_coords(card, card.getAttribute("x"), player_y);
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

// discard a card
var discard = function(e)
{
    if (mode == "discard")
    {
  var card = e.target;
  player_hand = player_hand.filter(function(n) {return n != card}); // remove this card from player's hand

  var i;
  for(i = 0; i < player_hand.length; i++)
  {
      player_hand[i].setAttribute("x", i * card_width + x_shift);
  }

  card_dimensions(card, card_width, 150);
  card_coords(card, svg_width - card_width, discard_y);
  card.setAttribute("player", "f");
  discard_pile.push(card);
  if (player_hand.length <= 7)
  {
      mode = "draw";
      turn.innerHTML = "OPPONENT TURN";
      switch_turns();
  }
    }
}

// play a card
var play = function(e)
{
    if (mode == "play")
    {
  var card = e.target;
  player_hand = player_hand.filter(function(n) {return n != card}); // removes the played card from the hand

  var i;
  for(i = 0; i < player_hand.length; i++)
  {
      player_hand[i].setAttribute("x", i * card_width + x_shift);
  }
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
  }else {
    card_dimensions(card, card_width, 150);
    card_coords(card, svg_width - card_width, discard_y);
    card.setAttribute("player", "f");
    discard_pile.push(card);
    console.log(card);
  }
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

var switch_turns = function()
{
    myturn = !myturn;
};


//card_dimensions(card, card_width, 150);
//card_coords(card, card.getAttribute("x"), player_y);
