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

    this.socket.on('setDrawCard', (plyr2)=>{
        this.Player2 = plyr2;
        if(plyr2.DrawCard != null){
            document.getElementById('player2pick').setAttribute("src", Images['backcard']);
        }
    });

    this.socket.on('removeDrawImage', (plyr2)=>{
        console.log("entering the fucker.....................");
        this.Player2 = plyr2;
        plyr2.DrawCard = null;
        document.getElementById("player2pick").setAttribute("src", "");
    });

    this.socket.on('setGroundCard', (card)=>{
        this.setGroundCard(card);
    });

    this.socket.on('pass turn', ()=>{
        this.Player1.playerTurn();
        console.log("player1 cards: " + this.Player1.Cards.toString());
        console.log("player2 cards: " + this.Player2.Cards.toString());
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

    setGroundCard (card) {
        this.GroundCard = Object.assign({}, card);
        this.GroundCards.push(this.GroundCard);
        let img = document.getElementById("groundcard");
        img.setAttribute("src", Images["" + this.GroundCard.Value + this.GroundCard.Suit]);
        this.socket.emit('setGroundCard', Object.assign({}, card));
    }
    
    removeAnimation (specialtype) {
        return new Promise(resolve => {
            this.Player1.removeClassFromAllElements("addAnimation");
            if (specialtype != "six" && specialtype != "seven" && specialtype != "eight") {
                document.getElementById("specialdivplayer1").classList.add("removeAnimation");
                document.getElementById("specialplayer1").classList.add("removeAnimation");
                document.getElementById("player1pick").classList.add("removeAnimation");
            }
            if (specialtype != "seven" && specialtype != "eight") {
                document.getElementById("cards-container-player2").classList.add("removeAnimation");
            }
            if (specialtype == "eight") {
                document.getElementById("cards-container-player1").classList.add("removeAnimation");
            }
            if (specialtype != "freethrow") {
                document.getElementById("freethrowplayer1").classList.add("removeAnimation");
            }
            if (specialtype != "throwcard") {
                document.getElementById("throwcardplayer1").classList.add("removeAnimation");
            }
            document.getElementById("assets-container-player2").classList.add("removeAnimation");
            document.getElementById("monkeplayer1").classList.add("removeAnimation");
            document.getElementById("endturnplayer1").classList.add("removeAnimation");
    
            setTimeout(() => {
                this.Player1.removeClassFromAllElements("removeAnimation");
                resolve();
            }, 1000);
        });
    }
    
    addAnimation (specialtype) {
    
        this.Player1.removeClassFromAllElements("removeAnimation");
        if (specialtype != "six" && specialtype != "seven" && specialtype != "eight") {
            document.getElementById("specialdivplayer1").classList.add("addAnimation");
            document.getElementById("specialplayer1").classList.add("addAnimation");
            document.getElementById("player1pick").classList.add("addAnimation");
        }
        if (specialtype != "seven" && specialtype != "eight") {
            document.getElementById("cards-container-player2").classList.add("addAnimation");
        }
        if (specialtype == "eight") {
            document.getElementById("cards-container-player1").classList.add("addAnimation");
        }
        if (specialtype != "freethrow") {
            document.getElementById("freethrowplayer1").classList.add("addAnimation");
        }
        if (specialtype != "throwcard") {
            document.getElementById("throwcardplayer1").classList.add("addAnimation");
        }
        document.getElementById("assets-container-player2").classList.add("addAnimation");
        document.getElementById("monkeplayer1").classList.add("addAnimation");
        document.getElementById("endturnplayer1").classList.add("addAnimation");
    }
    
    swapCards () {
        let cardone, cardtwo, aux, player1index, player2index;
        player1index = this.getIndexValue(this.Player1.SwapCard);
        player2index = this.getIndexValue(this.Player2.SwapCard);
    
        cardone = this.Player1.Cards[player1index];
        cardtwo = this.Player2.Cards[player2index];
        aux = Object.assign({}, cardone);
    
        cardone.Value = cardtwo.Value;
        cardone.Suit = cardtwo.Suit;
        cardone.Viewed = false;
    
        cardtwo.Value = aux.Value;
        cardtwo.Suit = aux.Suit;
        cardtwo.Viewed = false;
    
    
        let element;
        element = this.getElement("image-player2", player2index);
        element = this.getElement("image-player1", player1index);
    
        this.Player1.SwapCard = null;
        this.Player2.SwapCard = null;
        //this.NbCardsPickedSeven = 0;
        return;
    }
    
    timerFunction (time) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    }
    
    removeAnimationSeven  () {
        this.Player1.removeClassFromAllElements("image-player2-select");
        this.Player2.removeClassFromAllElements("image-player1-select");
    }
    
    resetSevenSpecial () {
        this.removeAnimationSeven();
        this.Player1.SwapCard = null;
        this.Player2.SwapCard = null;
        this.NbCardsPickedSeven = 0;
    }
    
    monkeyOpacityEnable () {
    
        let el = document.querySelectorAll(".addopacitymonkey");
        for (var i = 0; i < el.length; i++)
            el[i].classList.add("opacityformonkey");
    }
    
    monkeyOpacityDisable () {
        let el = document.querySelectorAll(".opacityformonkey");
        for (var i = 0; i < el.length; i++)
            el[i].classList.remove("opacityformonkey");
    }
    
    removeClassFromAllElements (nm) {
        var elems = document.querySelectorAll("." + nm);
        [].forEach.call(elems, function (el) {
            el.classList.remove(nm);
        });
    }
    
    monkeyEnable () {
        this.MonkeEffect = true;
        this.MonkeDivContent = document.getElementById("grounddisappear").classList.add("disappear");
        let el = document.querySelector(".adddisablemonkey");
        let monk = document.querySelector(".disableformonkey");
    
        this.removeClassFromAllElements("disableformonkey");
        this.removeClassFromAllElements("adddisablemonkey");
    
        monk.classList.add("adddisablemonkey");
        el.classList.add("disableformonkey");
    }
    
    monkeyDisable  () {
        let monk = document.querySelector(".adddisablemonkey");
        let el = document.querySelector(".disableformonkey");
        document.getElementById("grounddisappear").classList.remove("disappear");
    
        this.removeClassFromAllElements("disableformonkey");
        this.removeClassFromAllElements("adddisablemonkey");
    
        el.classList.add("adddisablemonkey");
        monk.classList.add("disableformonkey");
        this.MonkeEffect = false;
    }
    
    calculateResult () {
        setTimeout(this.Player1.showCards(), 2000);
        setTimeout(this.Player2.showCards(), 2000);
        document.getElementById('formBtn').click();
    }
    
    async disableSevenEffects () {
        this.Player1.SwapCard = null;
        this.Player2.SwapCard = null;
        await this.removeAnimation("seven");
        this.removeAnimationSeven();
        this.resetSevenSpecial();
        this.NbCardsPickedSeven = 0;
    }
    
    removeFinishSwapCards  () {
        this.Player1.removeClassFromAllElements("finish-swap-cards");
    }
    
    finishSwapCards  (element1, element2) {
        element1.classList.add("finish-swap-cards");
        element2.classList.add("finish-swap-cards");
    }
    
    removeSelectBorder  (element) {
        element.setAttribute("style", "border: none;");
    }

    async playerAction (element) {
        // if(!this.Player1.didViewCards())
        // {
        // if(this.Player1.isPlayerDiv(element))
        // {
        //     element.classList.add("flip-image");
        //     let i = this.getIndexValue(element);
        //     setTimeout(function(){
        //         element.setAttribute("src", Images[''+this.Player1.Cards[i].Value + this.Player1.Cards[i].Suit]);
        //     }, 100);
        //     setTimeout(function(){
        //         //console.log("OK babe");
        //         element.classList.remove("flip-image");
        //         element.classList.add("unflip-image");
        //         element.setAttribute("src", Images['backcard']);
        //     }, 2000);
        //     setTimeout(function(){
        //             element.classList.remove("unflip-image");
        //         }, 3000);
        //         this.Player1.ViewedCards++;
        //         //INSERT CODE TO DECIDE WHO PLAYS FIRST.
        //         // if(this.Player1.didViewCards())
        //         // {
        //         //     if(NbViewedCardsPlayer <= 2)
        //         //         this.Player1.playerTurn();
        //         //     else{
        //         //         bot.BotTurn();
        //         //         document.getElementById("monke").disabled = true;
        //         //         document.getElementById("throwcard").disabled = true;
        //         //         document.getElementById("endturn").disabled = true;
        //         //     }
        //         // }
        //         this.Player1.playerTurn();
        //         return;
        // }
        // return;
        // }
        if (!this.Player1.isBurntImage(element)) {
            if (this.Player1.Special && this.Player1.SpecialEnabled && this.Player1.Turn && this.Player1.cardsLeft() != 0 && !this.Player1.CantDoAnything) {
                if (this.Player1.DrawCard.cardValue() == 6) {
                    if (this.Player1.isPlayerDiv(element)) {
                        let card = this.Player1.Cards[this.getIndexValue(element)];
                        element.setAttribute("src", Images["" + card.Value + card.Suit]);
                        await this.flipCardBack(element);
                        this.Player1.removeDrawImage();
                        this.setGroundCard(this.Player1.DrawCard);
                        await this.removeAnimation("six");
                        this.Player1.nothingToDo();
                        return;
                    }
                    else
                        return;
                }
                else if (this.Player1.DrawCard.cardValue() == 8) {
                    if (this.Player1.isOppDiv(element)) {
                        let card = this.Player2.Cards[this.getIndexValue(element)];
                        element.setAttribute("src", Images["" + card.Value + card.Suit]);
                        await this.flipCardBack(element);
                        this.Player1.removeDrawImage();
                        this.setGroundCard(this.Player1.DrawCard);
                        await this.removeAnimation("eight");
                        this.Player1.nothingToDo();
                        return;
                    }
                    else
                        return;
                }
                else if (this.Player1.DrawCard.cardValue() == 7) {
                    if (this.NbCardsPickedSeven == 0) {
                        this.NbCardsPickedSeven++;
                        if (this.Player1.isPlayerDiv(element) || this.Player1.isOppDiv(element)) {
                            if (this.Player1.isPlayerDiv(element)) {
                                element.classList.add("image-player1-select");
                                this.Player1.SwapCard = element;
                            }
                            if (this.Player1.isOppDiv(element)) {
                                element.classList.add("image-player1-select");
                                this.Player2.SwapCard = element;
                            }
                        }
                    }
                    else if (this.NbCardsPickedSeven == 1) {
                        if (this.Player1.isOppDiv(element) && this.Player2.SwapCard != null) {
                            this.Player2.SwapCard = element;
                            this.Player2.removeClassFromAllElements("image-player1-select");
                            this.Player2.SwapCard.classList.add("image-player1-select");
                        } else if (this.Player1.isPlayerDiv(element) && this.Player1.SwapCard != null) {
                            this.Player1.SwapCard = element;
                            this.Player1.removeClassFromAllElements("image-player2-select");
                            this.Player1.SwapCard.classList.add("image-player2-select");
                        } else {
                            this.NbCardsPickedSeven++;
                            if (this.Player2.SwapCard == null) {
                                this.Player2.SwapCard = element;
                                this.Player2.SwapCard.classList.add("image-player1-select");
                            } else {
                                this.Player1.SwapCard = element;
                                this.Player1.SwapCard.classList.add("image-player2-select");
                            }
                        }
                    }
                    if (this.NbCardsPickedSeven == 2) {
                        this.NbCardsPickedSeven = 0;
                        this.swapCards();
                        await this.timerFunction(1000);
                        await this.removeAnimation("seven");
                        if (this.GroundCards == undefined || this.GroundCards == null)
                            this.GroundCards = new Array();
                        this.GroundCards.push(Object.assign({}, this.Player1.DrawCard));
                        setTimeout(this.setGroundCard, 1000, this.Player1.DrawCard);
                        this.Player1.removeDrawImage();
                        setTimeout(this.removeAnimationSeven, 1000);
                        setTimeout(this.resetSevenSpecial, 1000);
                        this.Player1.nothingToDo();
                        return;
                    }
                }
                return;
            }
            else if (!this.Player1.isOppDiv(element)) {
                let index = this.getIndexValue(element);
                let pickedcard = this.Player1.Cards[index];
                if (element.getAttribute("id") == "groundcard" && this.Player1.Turn && !this.Player1.CantDoAnything) {
                    this.Player1.removeDrawImage();
                    this.setGroundCard(this.Player1.DrawCard);
                    this.Player1.nothingToDo();
                    return;
                }
                else if (this.Player1.ThrowCard && this.Player1.Turn && !this.Player1.CantDoAnything) {
                    if (pickedcard.cardValue() == this.Player1.DrawCard.cardValue()) {
                        this.setGroundCard(pickedcard);
                        this.Player1.removeCard(this.getIndexValue(element));
                        this.Player1.ThrewCard = true;
                        if (this.Player1.cardsLeft() == 0) {
                            await this.Player1.monke();
                            return;
                        }
                        return;
                    } else {
                        this.Player1.burn(element);
                    }
                } else if (this.Player1.FreeThrow) {
                    if (pickedcard.cardValue() == this.GroundCard.cardValue()) {
                        this.setGroundCard(pickedcard);
                        this.Player1.removeCard(index);
                        if (this.Player1.cardsLeft() == 0) {
                            await this.Player1.monke();
                            return;
                        }
                        return;
                    } else {
                        this.Player1.burn(element);
                    }
                } else if (!this.Player1.FreeThrow && !this.Player1.ThrowCards && this.Player1.Turn && !this.Player1.CantDoAnything) {
                    this.setGroundCard(pickedcard);
                    if (this.Player1.DrawCard.cardValue() == pickedcard.cardValue()) {
                        this.Player1.removeCard(element.getAttribute("index"));
                        if (this.Player1.cardsLeft() == 0) {
                            await this.Player1.monke();
                            return;
                        }
                    } else {
                        pickedcard.Value = this.Player1.DrawCard.Value;
                        pickedcard.Suit = this.Player1.DrawCard.Suit;
                        element.setAttribute("src", Images["" + pickedcard.Value + pickedcard.Suit]);
                        element.setAttribute("src", Images['backcard']);
                    }
                    this.Player1.removeDrawImage();
                    this.Player1.nothingToDo();
                    return;
                } else {
                    console.log("Its doing nothing.....................");
                }
            }
            return;
        }
    }

}

//this.NbViewedCardsplayer1 = 2;
//this.NbViewedCardsplayer2 = 2;
//this.viewedCardsplayer1 = 0;
//this.viewedCardsplayer2 = 0;

let game = new Monke();
export default game;