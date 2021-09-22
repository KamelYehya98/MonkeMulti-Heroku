import Card from './Card.js';

function Deck() {

    let suits = ["C", "H", "S", "D"];
    let values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    this.Cards = [];

    for (let i = 0; i < suits.length; i++) {
        for (let x = 0; x < values.length; x++) {
            this.Cards.push(new Card(values[x], suits[i], false, -1));
        }
    }

    this.shuffleCards = function() {
        for (let i = this.Cards.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * i);
            let temp = this.Cards[i];
            this.Cards[i] = this.Cards[j];
            this.Cards[j] = temp;
        }
    }

    this.printCards = function() {
        console.log("Deck is: ");
        for(var i=0; i<this.Cards.length; i++){
            console.log(""+this.Cards[i].Value+this.Cards[i].Suit);
        }
    }
}
let deck = new Deck();
export default deck;