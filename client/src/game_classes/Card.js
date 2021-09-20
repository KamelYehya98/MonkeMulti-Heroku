function Card(value, suit, viewed, index) {

    this.Value = value;
    this.Suit = suit;
    this.Viewed = viewed;
    this.Index = index;
    this.Locked = false;

}


export default Card;