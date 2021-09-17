import Deck from './Deck';
import Player from './Player';
import Images from './Images';
import sok from "../services/socket";

class Monke {
    constructor() {
    this.socket = sok.getSocket();
    this.Deck = Deck;
    this.Player1 = new Player();
    this.Player2 = new Player();
    this.isFirst = false;
    this.Started = false;
    this.GroundCards = [];
    this.GroundCard = null;
    this.NbCardsPickedSeven = 0;
    this.MonkeEffect = false;

    this.socket.on('start game', () => {
        console.log("Game started");
        this.startGame();
    });
    this.socket.on('first', () => {
        this.isFirst = true;
    });
    this.socket.on('deal', (dealObj) => {
        console.log(dealObj.deck);
        let img, card, i;
        let groundcard = document.getElementById('groundcard');
        groundcard.setAttribute("src", Images['transparent']);
        this.Player1 = dealObj.plyr;
        this.Deck = dealObj.deck;
        for (i = 1; i <= 4; i++) {
            card = this.Deck.Cards.pop();
            console.log('' + card.Value + card.Suit);
            this.Player1.Cards.push(Object.assign({}, card));
            img = this.getElement("image-player1", i - 1);
            img.setAttribute("src", Images['' + card.Value + card.Suit]);
            console.log("" + card.Value + card.Suit);
        }
        this.socket.emit('oppPlayer', (this.Player1));
    });
    this.socket.on('oppPlayer', (plyr2) => {
        this.Player2 = plyr2;
        this.getImage();
    });
    }

    startGame () {
        if (this.Started == false) {
            console.log("Starto");
            this.Started = true;
            if (this.isFirst) {
                this.Deck.shuffleCards();
                this.dealCards();
                this.socket.emit('deal', { plyr: this.Player2, deck: this.Deck });
            }
        }
    }

    dealCards () {
        let img, card, i;
        let groundcard = document.getElementById('groundcard');
        groundcard.setAttribute("src", Images['transparent']);
        console.log(this.Deck.Cards);
        console.log("player1 cards: ");
        for (i = 1; i <= 4; i++) {
            card = this.Deck.Cards.pop();
            console.log('' + card.Value + card.Suit);
            this.Player1.Cards.push(Object.assign({}, card));
            img = this.getElement("image-player1", i - 1);
            img.setAttribute("src", Images['' + card.Value + card.Suit]);
            console.log("" + card.Value + card.Suit);
        }
        this.Player1.playerTurn();
        this.socket.emit('oppPlayer', (this.Player1));
    }

    getIndexValue (element) {
        return parseInt(element.getAttribute("index"));
    }

    async flipCardBack (element) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 2000);
        });
    }

    
    getElement (classname, index) {
        var elements = document.getElementsByClassName(classname);
        for (var i = 0; i < elements.length; i++) {
            if (parseInt(elements[i].getAttribute("index")) === index)
                return elements[i];
        }
        return null;
    }

    getImage () {
        console.log(this.Player1.Cards.length);
        for (var i = 0; i < this.Player1.Cards.length; i++) {
            this.getElement("image-player1", i).setAttribute("src", Images['' + this.Player1.Cards[i].Value + this.Player1.Cards[i].Suit]);
        }
        for (var i = 0; i < this.Player2.Cards.length; i++) {
            this.getElement("image-player2", i).setAttribute("src", Images['' + this.Player2.Cards[i].Value + this.Player2.Cards[i].Suit]);
        }
    }
}

//this.NbViewedCardsplayer1 = 2;
//this.NbViewedCardsplayer2 = 2;
//this.viewedCardsplayer1 = 0;
//this.viewedCardsplayer2 = 0;

// this.setGroundCard = function (card) {
//     this.GroundCard = Object.assign({}, card);
//     this.GroundCards.push(this.GroundCard);
//     let img = document.getElementById("groundcard");
//     img.setAttribute("src", Images["" + this.GroundCard.Value + this.GroundCard.Suit]);
// };

// this.removeAnimation = function (specialtype, player) {
//     let plyr = player.Identifier;
//     let opp = plyr == 1 ? 2 : 1;
//     return new Promise(resolve => {
//         player.removeClassFromAllElements("addAnimation");
//         if (specialtype != "six" && specialtype != "seven" && specialtype != "eight") {
//             document.getElementById("specialdivplayer" + plyr).classList.add("removeAnimation");
//             document.getElementById("specialplayer" + plyr).classList.add("removeAnimation");
//             document.getElementById("player" + plyr + "pick").classList.add("removeAnimation");
//         }
//         if (specialtype != "seven" && specialtype != "eight") {
//             document.getElementById("cards-container-player" + opp).classList.add("removeAnimation");
//         }
//         if (specialtype == "eight") {
//             document.getElementById("cards-container-player" + plyr).classList.add("removeAnimation");
//         }
//         if (specialtype != "freethrow") {
//             document.getElementById("freethrowplayer" + plyr).classList.add("removeAnimation");
//         }
//         if (specialtype != "throwcard") {
//             document.getElementById("throwcardplayer" + plyr).classList.add("removeAnimation");
//         }
//         document.getElementById("assets-container-player" + opp).classList.add("removeAnimation");
//         document.getElementById("monkeplayer" + plyr).classList.add("removeAnimation");
//         document.getElementById("endturnplayer" + plyr).classList.add("removeAnimation");

//         setTimeout(() => {
//             player.removeClassFromAllElements("removeAnimation");
//             resolve();
//         }, 1000);
//     });
// };

// this.addAnimation = function (specialtype, player) {
//     let plyr = player.Identifier;
//     let opp = plyr == 1 ? 2 : 1;
//     player.removeClassFromAllElements("removeAnimation");
//     if (specialtype != "six" && specialtype != "seven" && specialtype != "eight") {
//         document.getElementById("specialdivplayer" + plyr).classList.add("addAnimation");
//         document.getElementById("specialplayer" + plyr).classList.add("addAnimation");
//         document.getElementById("player" + plyr + "pick").classList.add("addAnimation");
//     }
//     if (specialtype != "seven" && specialtype != "eight") {
//         document.getElementById("cards-container-player" + opp).classList.add("addAnimation");
//     }
//     if (specialtype == "eight") {
//         document.getElementById("cards-container-player" + plyr).classList.add("addAnimation");
//     }
//     if (specialtype != "freethrow") {
//         document.getElementById("freethrowplayer" + plyr).classList.add("addAnimation");
//     }
//     if (specialtype != "throwcard") {
//         document.getElementById("throwcardplayer" + plyr).classList.add("addAnimation");
//     }
//     document.getElementById("assets-container-player" + opp).classList.add("addAnimation");
//     document.getElementById("monkeplayer" + plyr).classList.add("addAnimation");
//     document.getElementById("endturnplayer" + plyr).classList.add("addAnimation");
// };

// this.swapCards = function () {
//     let cardone, cardtwo, aux, player1index, player2index;
//     player1index = this.getIndexValue(this.Player1.SwapCard);
//     player2index = this.getIndexValue(this.Player2.SwapCard);

//     cardone = this.Player1.Cards[player1index];
//     cardtwo = this.Player2.Cards[player2index];
//     aux = Object.assign({}, cardone);

//     cardone.Value = cardtwo.Value;
//     cardone.Suit = cardtwo.Suit;
//     cardone.Viewed = false;

//     cardtwo.Value = aux.Value;
//     cardtwo.Suit = aux.Suit;
//     cardtwo.Viewed = false;


//     let element;
//     element = this.getElement("image-player2", player2index);
//     element = this.getElement("image-player1", player1index);

//     this.Player1.SwapCard = null;
//     this.Player2.SwapCard = null;
//     this.NbCardsPickedSeven = 0;
//     return;
// };

// this.timerFunction = function (time) {
//     return new Promise(resolve => {
//         setTimeout(() => {
//             resolve();
//         }, time);
//     });
// };

// this.removeAnimationSeven = function () {
//     this.Player1.removeClassFromAllElements("image-player2-select");
//     this.Player2.removeClassFromAllElements("image-player1-select");
// };

// this.resetSevenSpecial = function () {
//     this.removeAnimationSeven();
//     this.Player1.SwapCard = null;
//     this.Player2.SwapCard = null;
//     this.NbCardsPickedSeven = 0;
// };

// this.monkeyOpacityEnable = function () {

//     let el = document.querySelectorAll(".addopacitymonkey");
//     for (var i = 0; i < el.length; i++)
//         el[i].classList.add("opacityformonkey");
// };

// this.monkeyOpacityDisable = function () {

//     let el = document.querySelectorAll(".opacityformonkey");
//     for (var i = 0; i < el.length; i++)
//         el[i].classList.remove("opacityformonkey");
// };

// this.removeClassFromAllElements = function (name) {
//     var elems = document.querySelectorAll("." + name);
//     [].forEach.call(elems, function (el) {
//         el.classList.remove(name);
//     });
// };

// this.monkeyEnable = function () {
//     this.MonkeEffect = true;
//     this.MonkeDivContent = document.getElementById("grounddisappear").classList.add("disappear");
//     let el = document.querySelector(".adddisablemonkey");
//     let monk = document.querySelector(".disableformonkey");

//     this.removeClassFromAllElements("disableformonkey");
//     this.removeClassFromAllElements("adddisablemonkey");

//     monk.classList.add("adddisablemonkey");
//     el.classList.add("disableformonkey");
// };

// this.monkeyDisable = function () {
//     let monk = document.querySelector(".adddisablemonkey");
//     let el = document.querySelector(".disableformonkey");
//     document.getElementById("grounddisappear").classList.remove("disappear");

//     this.removeClassFromAllElements("disableformonkey");
//     this.removeClassFromAllElements("adddisablemonkey");

//     el.classList.add("adddisablemonkey");
//     monk.classList.add("disableformonkey");
//     this.MonkeEffect = false;
// };

// this.calculateResult = function () {
//     setTimeout(this.Player1.showCards(), 2000);
//     setTimeout(this.Player2.showCards(), 2000);
//     document.getElementById('formBtn').click();
// };

// this.disableSevenEffects = async function () {
//     this.Player1.SwapCard = null;
//     this.Player2.SwapCard = null;
//     await this.removeAnimation("seven", this.Player1);
//     this.removeAnimationSeven();
//     this.resetSevenSpecial();
//     this.NbCardsPickedSeven = 0;
// };

// this.removeFinishSwapCards = function (player) {
//     this.player.removeClassFromAllElements("finish-swap-cards");
// };

// this.finishSwapCards = function (element1, element2) {
//     element1.classList.add("finish-swap-cards");
//     element2.classList.add("finish-swap-cards");
// };

// this.removeSelectBorder = function (element) {
//     element.setAttribute("style", "border: none;");
// };

// this.playerAction = async function (element, player) {
//     if(!player.didViewCards())
//     {
//        if(player.isPlayerDiv(element))
//        {
//            element.classList.add("flip-image");
//            let i = this.getIndexValue(element);
//            setTimeout(function(){
//                element.setAttribute("src", Images[''+player.Cards[i].Value + player.Cards[i].Suit]);
//            }, 100);
//            setTimeout(function(){
//                //console.log("OK babe");
//                element.classList.remove("flip-image");
//                element.classList.add("unflip-image");
//                element.setAttribute("src", Images['backcard']);
//            }, 2000);
//            setTimeout(function(){
//                 element.classList.remove("unflip-image");
//             }, 3000);
//             player.ViewedCards++;
//             //INSERT CODE TO DECIDE WHO PLAYS FIRST.
//             // if(player.didViewCards())
//             // {
//             //     if(NbViewedCardsPlayer <= 2)
//             //         player.playerTurn();
//             //     else{
//             //         bot.BotTurn();
//             //         document.getElementById("monke").disabled = true;
//             //         document.getElementById("throwcard").disabled = true;
//             //         document.getElementById("endturn").disabled = true;
//             //     }
//             // }
//             this.Player1.playerTurn();
//             return;
//        }
//        return;
//     }
//     if (!player.isBurntImage(element)) {
//         if (player.Special && player.SpecialEnabled && player.Turn && player.cardsLeft() != 0) {
//             if (player.DrawCard.cardValue() == 6) {
//                 if (player.isPlayerDiv(element)) {
//                     let card = player.Cards[this.getIndexValue(element)];
//                     element.setAttribute("src", Images["" + card.Value + card.Suit]);
//                     await this.flipCardBack(element);
//                     player.removeDrawImage();
//                     this.setGroundCard(player.DrawCard);
//                     await this.removeAnimation("six", player);
//                     player.nothingToDo();
//                     return;
//                 }
//                 else
//                     return;
//             }
//             else if (player.DrawCard.cardValue() == 8) {
//                 if (player.isOppDiv(element)) {
//                     let target = player.Identifier == 1 ? this.Player2 : this.Player1;
//                     let card = target.Cards[this.getIndexValue(element)];
//                     element.setAttribute("src", Images["" + card.Value + card.Suit]);
//                     await this.flipCardBack(element);
//                     player.removeDrawImage();
//                     this.setGroundCard(player.DrawCard);
//                     await this.removeAnimation("eight", this.Player1);
//                     player.nothingToDo();
//                     return;
//                 }
//                 else
//                     return;
//             }
//             else if (player.DrawCard.cardValue() == 7) {
//                 let target = player.Identifier == 1 ? this.Player2 : this.Player1;
//                 if (this.NbCardsPickedSeven == 0) {
//                     this.NbCardsPickedSeven++;
//                     if (player.isPlayerDiv(element) || player.isOppDiv(element)) {
//                         if (player.isPlayerDiv(element)) {
//                             element.classList.add("image-player" + target.Identifier + "-select");
//                             player.SwapCard = element;
//                         }
//                         if (player.isOppDiv(element)) {
//                             element.classList.add("image-player" + player.Identifier + "-select");
//                             target.SwapCard = element;
//                         }
//                     }
//                 }
//                 else if (this.NbCardsPickedSeven == 1) {
//                     if (player.isOppDiv(element) && target.SwapCard != null) {
//                         target.SwapCard = element;
//                         target.removeClassFromAllElements("image-player" + player.Identifier + "-select");
//                         target.SwapCard.classList.add("image-player" + player.Identifier + "-select");
//                     } else if (player.isPlayerDiv(element) && player.SwapCard != null) {
//                         player.SwapCard = element;
//                         player.removeClassFromAllElements("image-player" + target.Identifier + "-select");
//                         player.SwapCard.classList.add("image-player" + target.Identifier + "-select");
//                     } else {
//                         this.NbCardsPickedSeven++;
//                         if (target.SwapCard == null) {
//                             target.SwapCard = element;
//                             target.SwapCard.classList.add("image-player" + player.Identifier + "-select");
//                         } else {
//                             player.SwapCard = element;
//                             player.SwapCard.classList.add("image-player" + target.Identifier + "-select");
//                         }
//                     }
//                 }
//                 if (this.NbCardsPickedSeven == 2) {
//                     this.NbCardsPickedSeven = 0;
//                     this.swapCards();
//                     await this.timerFunction(1000);
//                     await this.removeAnimation("seven", this.Player1);
//                     if (this.GroundCards == undefined || this.GroundCards == null)
//                         this.GroundCards = new Array();
//                     this.GroundCards.push(Object.assign({}, player.DrawCard));
//                     setTimeout(this.setGroundCard, 1000, player.DrawCard);
//                     player.removeDrawImage();
//                     setTimeout(this.removeAnimationSeven, 1000);
//                     setTimeout(this.resetSevenSpecial, 1000);
//                     player.nothingToDo();
//                     return;
//                 }
//             }
//             return;
//         }
//         else if (!player.isOppDiv(element)) {
//             let index = this.getIndexValue(element);
//             let pickedcard = player.Cards[index];
//             if (element.getAttribute("id") == "groundcard" && player.Turn) {
//                 player.removeDrawImage();
//                 this.setGroundCard(player.DrawCard);
//                 player.nothingToDo();
//                 return;
//             }
//             else if (player.ThrowCard && player.Turn) {
//                 if (pickedcard.cardValue() == player.DrawCard.cardValue()) {
//                     this.setGroundCard(pickedcard);
//                     player.removeCard(this.getIndexValue(element));
//                     player.ThrewCard = true;
//                     if (player.cardsLeft() == 0) {
//                         await player.monke();
//                         return;
//                     }
//                     return;
//                 } else {
//                     player.burn(element);
//                 }
//             } else if (player.FreeThrow) {
//                 console.log("lkasjdfkja slkdfjasld");
//                 if (pickedcard.cardValue() == this.GroundCard.cardValue()) {
//                     this.setGroundCard(pickedcard);
//                     player.removeCard(index);
//                     if (player.cardsLeft() == 0) {
//                         await player.monke();
//                         return;
//                     }
//                     return;
//                 } else {
//                     player.burn(element);
//                 }
//             } else if (!player.FreeThrow && !player.ThrowCards && player.Turn) {
//                 this.setGroundCard(pickedcard);
//                 if (player.DrawCard.cardValue() == pickedcard.cardValue()) {
//                     player.removeCard(element.getAttribute("index"));
//                     if (player.cardsLeft() == 0) {
//                         await player.monke();
//                         return;
//                     }
//                 } else {
//                     pickedcard.Value = player.DrawCard.Value;
//                     pickedcard.Suit = player.DrawCard.Suit;
//                     element.setAttribute("src", Images["" + pickedcard.Value + pickedcard.Suit]);
//                     element.setAttribute("src", Images['backcard']);
//                 }
//                 player.removeDrawImage();
//                 player.nothingToDo();
//                 return;
//             } else {
//                 console.log("Its doing nothing.....................");
//             }
//         }
//         return;
//     }
// };

let game = new Monke();
export default game;