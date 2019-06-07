// swap hands with the opponent -- magic / magical uni cards
var switch_hands = function() {
  var p_hand = player_hand;
  player_hand = opponent_hand;
  opponent_hand = p_hand;
};


// return a card to hand from stable
var ret_hand = function(stable, hand, card, card_y) {
  if (stable.includes(card)) {
    card_coords(card, hand.length * card_width + x_shift, card_y);
    hand.push(card);
  }
  stable = stable.filter(function(n) {return n != card});
  shift(hand);
  console.log("shifted hand");
}
