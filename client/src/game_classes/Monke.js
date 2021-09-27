import Deck from './Deck';
import Player from './Player';
import Images from './Images';
import sok from "../services/socket";
import 'bootstrap/dist/css/bootstrap.min.css';
import SERVER_URL from "../constants";
import {getLatestRoundWinner} from "../pages/Room";
import '../style.css'

class Monke {
    constructor() {
    this.socket = sok.getSocket();
    this.Deck = new Deck();
    this.endGame = false;
    this.Player1 = new Player();
    this.Player2 = new Player();
    this.isFirst = false;
    this.Started = false;
    this.GroundCards = [];
    this.GroundCard = null;
    this.NbCardsPickedSeven = 0;
    this.MonkeEffect = false;
    this.Username = "";
    this.OppUsername = "";
    this.drawsFirst = false;
    this.OppViewedCards = false;
    this.OppDisconnect = false;

    this.socket.on('sendUsername', (username) => {
        this.OppUsername = username;    
        console.log("USERRRRRRRRNAMEEE: " + this.Username);
        console.log("OPPPPPPP USERRRRRRRRNAMMME: " + this.OppUsername);    
    });
    this.socket.on('setNbCardsView', (nb) => {
        this.Player1.NbCardsView = nb;
        this.Player2.NbCardsView = 4 - nb;

        console.log(`${this.Username} cards to view is: ${this.Player1.NbCardsView}`);
        console.log(`${this.OppUsername} cards to view is: ${this.Player2.NbCardsView}`);

        document.getElementById("specialtextplayer1").innerHTML = this.Player1.NbCardsView;
        document.getElementById("specialtextplayer2").innerHTML = this.Player2.NbCardsView;
    });
    this.socket.on('start game', (username) => {
        this.Username = username;        
        this.socket.emit('sendUsername', (username));
        this.startGame();
    });
    this.socket.on('first', () => {
        this.isFirst = true;
    });
    this.socket.on('deal', (dealObj) => {
        //console.log(dealObj.deck);
        let img, card, i;
        let groundcard = document.getElementById('groundcard');
        groundcard.setAttribute("src", Images['transparent']);
        this.Player1 = dealObj.plyr;
        this.Deck = dealObj.deck;
        for (i = 1; i <= 4; i++) {
            card = this.Deck.Cards.pop();
            ////console.log('' + card.Value + card.Suit);
            this.Player1.Cards.push(Object.assign({}, card));
            img = this.getElement("image-player1", i - 1);
            img.setAttribute("src", Images['backcard']);
            ////console.log("" + card.Value + card.Suit);
        }
        this.socket.emit('setDeck', this.Deck);
        this.printDeck();
        this.socket.emit('oppPlayer', (this.Player1));
    });

    this.socket.on('oppPlayer', (plyr2) => {
        this.Player2 = plyr2;
        this.showCards();
    });

    this.socket.on('setDrawCard', (plyr2)=>{
        //console.log("entered setDrawCard..............");
        this.Player2 = plyr2;
        if(plyr2.DrawCard != null){
            document.getElementById('player2pick').setAttribute("src", Images['backcard']);
        }
    });

    this.socket.on('removeDrawImage', (plyr2)=>{
        //console.log("entering the  er.....................");
        plyr2.DrawCard = null;
        this.Player2 = plyr2;
        document.getElementById("player2pick").setAttribute("src", Images["transparent"]);
    });

    this.socket.on('setGroundCard', (obj)=>{
        this.Player2 = obj.plyr;
        this.setGroundCard(obj.card);
    });

    this.socket.on('pass turn', (plyr2)=>{
        this.Player2 = plyr2;
        this.playerTurn();
    });
    this.socket.on('removeCard', (obj)=>{
        this.Player2 = obj.plyr;
        this.removeCard(obj.index, obj.id);
    });
    this.socket.on('burnImage', (ind)=>{
        //console.log("burn emit...............");
        let card = this.Player2.Cards[parseInt(ind)];
        let element = this.getElement("image-player2", parseInt(ind));
        if (card != null) {
            this.burnCard(card);
            element.classList.add("burned-image");
        }
        //console.log("reached end.............");
    });
    this.socket.on('freeThrowButton', (str)=>{
        document.getElementById("freethrowplayer2").innerHTML = ""+str;
    });
    this.socket.on('throwCardButton', (str)=>{
        document.getElementById("throwcardplayer2").innerHTML = ""+str;
    });
    this.socket.on('specialButton', (str)=>{
        document.getElementById("specialplayer2").innerHTML = ""+str;
    });

    this.socket.on('addAnimation', (str)=>{
        this.addAnimationOpponent(""+str);        
    });
    this.socket.on('removeAnimation', (str)=>{
        this.removeAnimationOpponent(""+str);
    });

    this.socket.on('addPickCardClassOpponent', ()=>{
        this.addPickCardClassOpponent();
    });

    this.socket.on('flipCardBackOpponent', (obj)=>{
        this.flipCardBackOpponent(obj.el, obj.index);
    });

    this.socket.on('userDisconnected', (name) => {
        if(!this.endGame){
            console.log(`${name} has diconnected`);
            this.Player1.BlockAction = true;
            this.OppDisconnect = true;
            this.endGame = true;
            this.calculateResult();
        }
    });

    this.socket.on('addClassSeven', (obj)=>{
        //console.log("object element and player: "+ obj.el + ", " + obj.plyr);
        let element = this.getElement("image-player"+obj.plyr, parseInt(obj.el));
        let num = obj.plyr == 2 ? 1: 2;
        element.classList.add("image-player" + num + "-select");
    });
    this.socket.on('removeClassFromAllElements', (str)=>{
        //console.log("string is: " + str);
        this.removeClassFromAllElements(str);
    });

    this.socket.on('removeAnimationSeven', (str)=>{
        //console.log("string is: " + str);
        this.removeAnimationSeven(str);
    });

    this.socket.on('setPlayerOpp', (plyr)=>{
        this.Player2 = plyr;
        this.printCards();
    });

    this.socket.on('setDeck', (deck)=>{
        this.Deck = deck;
        getLatestRoundWinner();
    });
    this.socket.on('setOppImage', ()=>{
        this.showCards();
    });
    this.socket.on('unBlockAction', ()=>{
        this.Player1.BlockAction = false;
    });

    this.socket.on('setOppDeck', (deck)=>{
        this.Player2.Cards = Object.assign({}, deck);
        console.log("opponent deck set................................");
    });

    this.socket.on('drawsFirst', ()=>{
        this.drawsFirst = true;
    });

    this.socket.on('oppViewedCards', ()=>{
        this.OppViewedCards = true;
    });

    this.socket.on("swapCards", (obj)=>{
        let cardone = this.Player1.Cards[obj.ind2];
        let cardtwo = this.Player2.Cards[obj.ind1];
        let aux = Object.assign({}, cardone);
    
        cardone.Value = cardtwo.Value;
        cardone.Suit = cardtwo.Suit;
    
        cardtwo.Value = aux.Value;
        cardtwo.Suit = aux.Suit;
        this.showCards();

        //this.getElement('image-player1', parseInt(obj.ind2)).setAttribute("src", Images[''+cardone.Value+cardone.Suit]);
    });

    this.socket.on('monke', ()=>{
        console.log("MOOOOOOOONKKKKKKKEEEEEEEEEEEEE");
        this.Player1.BlockAction = true;
        document.getElementById("monkeplayer1").disabled = true;
        this.Player2.Monkey = true;
        //document.getElementById("monkeyaudio").play();
        this.monkeyOpacityEnable();
        this.monkeyEnable();
        setTimeout(()=>{
            this.monkeyDisable();
            this.monkeyOpacityDisable();
            this.Player1.BlockAction = false;
        }, 3000);
    });

    this.socket.on('oppSelectCard', (index) => {
        let element = this.getElement("image-player2", parseInt(index));
        element.classList.add("opponent-clicked");
        setTimeout(() => {
            element.classList.remove("opponent-clicked");
        }, 1000);
    });

    this.socket.on('calculateResults', ()=>{
        this.Player1.BlockAction = true;
        this.revealAllCards();
    });
}

    async getUsername(){
            console.log('Reacccccccccccccccched getting username');
            const id = this.socket.id;
            const res = await fetch(`${SERVER_URL}/getusername`, {
                method: 'POST',
                body: JSON.stringify( {id} ),
                headers: { 'Content-Type' : 'application/json' },
                credentials: 'include'
            });
            const data = await res.json();
            return data.id;
    }

    startGame() {
        if (this.Started == false) {
            console.log("Starto");
            this.Started = true;
            if (this.isFirst) {
                console.log("Shuffling cards bleep bloop");
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
        //console.log(this.Deck.Cards);
        ////console.log("player1 cards: ");
        for (i = 1; i <= 4; i++) {
            card = this.Deck.Cards.pop();
            ////console.log('' + card.Value + card.Suit);
            this.Player1.Cards.push(Object.assign({}, card));
            img = this.getElement("image-player1", i - 1);
            img.setAttribute("src", Images['backcard']);
            ////console.log("" + card.Value + card.Suit);
        }
        if(this.Player1.NbCardsView == 1 || this.Player1.NbCardsView == 2){
            this.drawsFirst = true;
        }else
            this.socket.emit('drawsFirst');
        this.socket.emit('oppPlayer', (this.Player1));
        this.socket.emit('setDeck', this.Deck);
        this.printDeck();
    }

    getIndexValue (element) {
        return parseInt(element.getAttribute("index"));
    }

    flipCardBack (element, special) {
        element.classList.add("flip-image");
        let i = parseInt(element.getAttribute("index"));
        this.Player1.BlockAction = true;
        setTimeout(()=>{
            if(special == 8)
                element.setAttribute("src", Images[""+this.Player2.Cards[i].Value + this.Player2.Cards[i].Suit]);
            else{
                element.setAttribute("src", Images[""+this.Player1.Cards[i].Value + this.Player1.Cards[i].Suit]);
            }
        }, 100);
        setTimeout(()=>{
            element.classList.remove('flip-image');
            element.classList.add("unflip-image");
            element.setAttribute("src", Images['backcard']);
        }, 1600);
        setTimeout(()=>{
            element.classList.remove("unflip-image");
            this.Player1.BlockAction = false;
        }, 1700);
    }
    
    removeClassFromAllElements (nm) {
        var elems = document.querySelectorAll("." + nm);
        [].forEach.call(elems, function (el) {
            el.classList.remove(nm);
        });
    }


    flipCardBackOpponent (i, index) {
        //console.log("index is: " + i);
        let element = null;
        if(index == 6)
            element = this.getElement("image-player2", parseInt(i));
        else
            element = this.getElement("image-player1", parseInt(i));

        //console.log("element is: " + element);
        element.classList.add("flip-image");
        setTimeout(()=>{
            element.setAttribute("src", Images["white"]);
        }, 100);
        setTimeout(()=>{
            element.classList.remove('flip-image');
            element.classList.add("unflip-image");
            element.setAttribute("src", Images['backcard']);
        }, 1600);
        setTimeout(()=>{
            element.classList.remove("unflip-image");
        }, 1700);
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
        //console.log(this.Player1.Cards.length);
        for (var i = 0; i < this.Player1.Cards.length; i++) {
            this.getElement("image-player1", i).setAttribute("src", Images['backcard']);
        }
        for (var i = 0; i < this.Player2.Cards.length; i++) {
            this.getElement("image-player2", i).setAttribute("src", Images['backcard']);
        }
    }

    setGroundCard(card) {
        this.GroundCard = Object.assign({}, card);
        this.GroundCards.push(this.GroundCard);
        let img = document.getElementById("groundcard");
        console.log("" + this.GroundCard.Value + this.GroundCard.Suit);
        img.setAttribute("src", Images["" + this.GroundCard.Value + this.GroundCard.Suit]);
    }
    
    removeAnimation(specialtype) {
        // return new Promise(resolve => {
            this.removeClassFromAllElements("addAnimation");
            if (specialtype !== "six" && specialtype != "seven" && specialtype != "eight") {
                document.getElementById("specialdivplayer1").classList.add("removeAnimation");
                document.getElementById("specialplayer1").classList.add("removeAnimation");
                document.getElementById("player1pick").classList.add("removeAnimation");
            }
            if (specialtype !== "seven" && specialtype != "eight") {
                document.getElementById("cards-container-player2").classList.add("removeAnimation");
            }
            if (specialtype === "eight") {
                document.getElementById("cards-container-player1").classList.add("removeAnimation");
            }
            if (specialtype !== "freethrow") {
                document.getElementById("freethrowplayer1").classList.add("removeAnimation");
            }
            if (specialtype !== "throwcard") {
                document.getElementById("throwcardplayer1").classList.add("removeAnimation");
            }
            document.getElementById("assets-container-player2").classList.add("removeAnimation");
            document.getElementById("monkeplayer1").classList.add("removeAnimation");
            document.getElementById("endturnplayer1").classList.add("removeAnimation");
            this.removeClassFromAllElements("removeAnimation");

            // setTimeout(() => {
            //     resolve();
            // }, 1100);
        // });
    }

    removeAnimationOpponent(specialtype) {
        // return new Promise(resolve => {
            this.removeClassFromAllElements("addAnimation");
            if (specialtype != "six" && specialtype != "seven" && specialtype != "eight") {
                document.getElementById("specialdivplayer2").classList.add("removeAnimation");
                document.getElementById("specialplayer2").classList.add("removeAnimation");
                document.getElementById("player2pick").classList.add("removeAnimation");
            }
            if (specialtype != "seven" && specialtype != "eight") {
                document.getElementById("cards-container-player1").classList.add("removeAnimation");
            }
            if (specialtype == "eight") {
                document.getElementById("cards-container-player2").classList.add("removeAnimation");
            }
            if (specialtype != "freethrow") {
                document.getElementById("freethrowplayer2").classList.add("removeAnimation");
            }
            if (specialtype != "throwcard") {
                document.getElementById("throwcardplayer2").classList.add("removeAnimation");
            }
            document.getElementById("assets-container-player1").classList.add("removeAnimation");
            document.getElementById("monkeplayer2").classList.add("removeAnimation");
            document.getElementById("endturnplayer2").classList.add("removeAnimation");
            this.removeClassFromAllElements("removeAnimation");

            // setTimeout(() => {
            //     resolve();
            // }, 1100);
        // });
    }
    
    addAnimation (specialtype) {
        this.removeClassFromAllElements("removeAnimation");
        if (specialtype != "six" && specialtype != "seven" && specialtype != "eight") {
            document.getElementById("specialdivplayer1").classList.add("addAnimation");
            document.getElementById("specialplayer1").classList.add("addAnimation");
            if(specialtype == "freethrow")
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

    addAnimationOpponent(specialtype) {
        this.removeClassFromAllElements("removeAnimation");
        if (specialtype != "six" && specialtype != "seven" && specialtype != "eight") {
            document.getElementById("specialdivplayer2").classList.add("addAnimation");
            document.getElementById("specialplayer2").classList.add("addAnimation");
            if(specialtype == "freethrow")
                document.getElementById("player2pick").classList.add("addAnimation");
        }
        if (specialtype != "seven" && specialtype != "eight") {
            document.getElementById("cards-container-player1").classList.add("addAnimation");
        }
        if (specialtype == "eight") {
            document.getElementById("cards-container-player2").classList.add("addAnimation");
        }
        if (specialtype != "freethrow") {
            document.getElementById("freethrowplayer2").classList.add("addAnimation");
        }
        if (specialtype != "throwcard") {
            document.getElementById("throwcardplayer2").classList.add("addAnimation");
        }
        document.getElementById("assets-container-player1").classList.add("addAnimation");
        document.getElementById("monkeplayer2").classList.add("addAnimation");
        document.getElementById("endturnplayer2").classList.add("addAnimation");
    }
    
    swapCards () {
        let cardone, cardtwo, aux, player1index, player2index;
        player1index = this.getIndexValue(this.Player1.SwapCard);
        player2index = this.getIndexValue(this.Player2.SwapCard);
    
        this.socket.emit('swapCards', {ind1: player1index, ind2: player2index});
        cardone = this.Player1.Cards[player1index];
        cardtwo = this.Player2.Cards[player2index];
        aux = Object.assign({}, cardone);
    
        cardone.Value = cardtwo.Value;
        cardone.Suit = cardtwo.Suit;
        cardone.Viewed = false;
    
        cardtwo.Value = aux.Value;
        cardtwo.Suit = aux.Suit;
        cardtwo.Viewed = false;
    
        this.Player1.SwapCard = null;
        this.Player2.SwapCard = null;
        this.NbCardsPickedSeven = 0;

        //this.getElement('image-player1', parseInt(player1index)).setAttribute("src", Images['backcard']);
        //.getElement('image-player2', parseInt(player2index)).setAttribute("src", Images['backcard']);

        return;
    }
    
    timerFunction (time) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    }
    
    removeAnimationSeven() {
        var elems = document.querySelectorAll(".image-player2-select");
        [].forEach.call(elems, function (el) {
            el.classList.remove("image-player2-select");
        });
        elems = document.querySelectorAll(".image-player1-select");
        [].forEach.call(elems, function (el) {
            el.classList.remove("image-player1-select");
        });
    }
    
    resetSevenSpecial () {
        this.Player1.SwapCard = null;
        this.Player2.SwapCard = null;
        this.NbCardsPickedSeven = 0;
        this.Player1.BlockAction = false;
        this.removeAnimationSeven();
        this.socket.emit('removeAnimationSeven');
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
    
    monkeyEnable () {
        this.MonkeEffect = true;
        document.getElementById("monkesound").play();
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
    
    
    async disableSevenEffects () {
        this.Player1.SwapCard = null;
        this.Player2.SwapCard = null;
        this.removeAnimation("seven");
        this.socket.emit('removeAnimation', "seven");

        this.removeAnimationSeven();
        this.socket.emit('removeAnimationSeven');
        this.resetSevenSpecial();
        this.NbCardsPickedSeven = 0;
    }
    
    removeFinishSwapCards  () {
        this.removeClassFromAllElements("finish-swap-cards");
    }
    
    finishSwapCards  (element1, element2) {
        element1.classList.add("finish-swap-cards");
        element2.classList.add("finish-swap-cards");
    }
    
    removeSelectBorder  (element) {
        element.setAttribute("style", "border: none;");
    }

    async playerAction (element) {
        if(this.Player1.BlockAction === false)
        {
            if(!this.didViewCards())
            {
                if(this.isPlayerDiv(element))
                {
                    element.classList.add("flip-image");
                    let i = this.getIndexValue(element);
                    setTimeout(()=>{
                        element.setAttribute("src", Images[''+this.Player1.Cards[i].Value + this.Player1.Cards[i].Suit]);
                        this.socket.emit('flipCardBackOpponent', {el:i, index: 6});
                    }, 100);
                    setTimeout(()=>{
                        element.classList.remove("flip-image");
                        element.classList.add("unflip-image");
                        element.setAttribute("src", Images['backcard']);
                    }, 2000);
                    setTimeout(()=>{
                        element.classList.remove("unflip-image");
                    }, 3000);
                    this.Player1.ViewedCards++;
                    if(this.didViewCards()){
                        if(this.OppViewedCards == false){
                            this.Player1.BlockAction = true;
                            this.socket.emit('oppViewedCards');
                        }
                        else{
                            this.socket.emit('unBlockAction');
                            if(this.drawsFirst){
                                this.playerTurn();
                            }else{
                                this.socket.emit('pass turn', (this.Player1));
                            }
                        }
                    }
                    console.log(this.Player1.ViewedCards);
                    return;
                }
            return;
            }
            if (!this.isBurntImage(element)) {
                if (this.Player1.Special && this.Player1.SpecialEnabled && this.Player1.Turn && this.cardsLeft() != 0 && !this.Player1.CantDoAnything) {
                    if (this.cardValue(this.Player1.DrawCard) == 6) {
                        if (this.isPlayerDiv(element)) {
                            let card = this.Player1.Cards[this.getIndexValue(element)];
                            //this.socket.emit('oppSelectCard', (this.getIndexValue(element)));
                            element.setAttribute("src", Images["" + card.Value + card.Suit]);
                            this.flipCardBack(element, 6);
                            this.socket.emit('flipCardBackOpponent', {el:element.getAttribute("index"), index: 6});
                            this.removeDrawImage();
                            this.socket.emit('removeDrawImage', (this.Player1));
                            this.setGroundCard(this.Player1.DrawCard);
                            this.socket.emit('setGroundCard', {card:this.Player1.DrawCard, plyr:this.Player1});
                            this.removeAnimation("six");
                            this.socket.emit('removeAnimation', 'six');
                            this.printCards();
                            this.nothingToDo();
                            return;
                        }
                        else
                            return;
                    }
                    else if (this.cardValue(this.Player1.DrawCard) === 8) {
                        if (this.isOppDiv(element)) {
                            let card = this.Player2.Cards[this.getIndexValue(element)];
                            element.setAttribute("src", Images["" + card.Value + card.Suit]);
                            this.flipCardBack(element, 8);
                            this.socket.emit('flipCardBackOpponent', {el: element.getAttribute("index"), index: 8});
                            this.removeDrawImage();
                            this.socket.emit('removeDrawImage', (this.Player1));
                            this.setGroundCard(this.Player1.DrawCard);
                            this.socket.emit('setGroundCard', {card:this.Player1.DrawCard, plyr:this.Player1});
                            this.removeAnimation("eight");
                            this.socket.emit('removeAnimation', 'eight');

                            //this.socket.emit('setPlayerOpp', (this.Player1));
                            this.printCards();
                            this.nothingToDo();
                            return;
                        }
                        else
                            return;
                    }
                    else if (this.cardValue(this.Player1.DrawCard) === 7) {
                        if (this.NbCardsPickedSeven === 0) {
                            this.NbCardsPickedSeven++;
                            if (this.isPlayerDiv(element) || this.isOppDiv(element)) {
                                if (this.isPlayerDiv(element)) {

                                    element.classList.add("image-player2-select");
                                    this.socket.emit("addClassSeven", {el:element.getAttribute("index"), plyr: 2});

                                    this.Player1.SwapCard = element;
                                }
                                if (this.isOppDiv(element)) {

                                    element.classList.add("image-player1-select");
                                    this.socket.emit("addClassSeven", {el:element.getAttribute("index"), plyr: 1});

                                    this.Player2.SwapCard = element;
                                }
                            }
                        }
                        else if (this.NbCardsPickedSeven === 1) {
                            if (this.isOppDiv(element) && this.Player2.SwapCard != null) {
                                this.Player2.SwapCard = element;

                                this.removeClassFromAllElements("image-player1-select");
                                this.socket.emit('removeClassFromAllElements', "image-player2-select");

                                this.Player2.SwapCard.classList.add("image-player1-select");
                                this.socket.emit("addClassSeven", {el:element.getAttribute("index"), plyr:1});

                            } else if (this.isPlayerDiv(element) && this.Player1.SwapCard != null) {
                                this.Player1.SwapCard = element;

                                this.removeClassFromAllElements("image-player2-select");
                                this.socket.emit('removeClassFromAllElements', "image-player1-select");

                                this.Player1.SwapCard.classList.add("image-player2-select");
                                this.socket.emit("addClassSeven", {el:element.getAttribute("index"), plyr:2});

                            } else {
                                this.NbCardsPickedSeven++;
                                if (this.Player2.SwapCard == null) {
                                    this.Player2.SwapCard = element;

                                    this.Player2.SwapCard.classList.add("image-player1-select");
                                    this.socket.emit("addClassSeven", {el:element.getAttribute("index"), plyr:1});

                                } else {
                                    this.Player1.SwapCard = element;

                                    this.Player1.SwapCard.classList.add("image-player2-select");
                                    this.socket.emit("addClassSeven", {el:element.getAttribute("index"), plyr:2});

                                }
                            }
                        }
                        if (this.NbCardsPickedSeven === 2) {
                            this.Player1.BlockAction = true;
                            this.NbCardsPickedSeven = 0;
                            this.swapCards();
                            await this.timerFunction(1000);
                            this.removeAnimation("seven");
                            this.socket.emit('removeAnimation', 'seven');

                            if (this.GroundCards === undefined || this.GroundCards == null)
                                this.GroundCards = [];
                            //this.GroundCards.push(Object.assign({}, this.Player1.DrawCard));
                            this.setGroundCard(this.Player1.DrawCard);
                            setTimeout(()=>{this.socket.emit('setGroundCard', {card:this.Player1.DrawCard, plyr:this.Player1})}, 1005);
                            this.removeDrawImage();
                            this.socket.emit('removeDrawImage', (this.Player1));

                            setTimeout(this.removeAnimationSeven, 1000);
                            setTimeout(()=>{
                                this.socket.emit('removeAnimationSeven');
                            }, 1005);

                            setTimeout(()=>{
                                this.Player1.SwapCard = null;
                                this.Player2.SwapCard = null;
                                this.NbCardsPickedSeven = 0;
                                this.Player1.BlockAction = false;
                                this.removeAnimationSeven();
                                this.socket.emit('removeAnimationSeven');
                                this.printCards();
                            }, 1200);
                            this.nothingToDo();
                            return;
                        }
                    }
                    return;
                }
                else if (!this.isOppDiv(element)) {
                    let index = this.getIndexValue(element);
                    let pickedcard = this.Player1.Cards[index];
                    if (element.getAttribute("id") == "groundcard" && this.Player1.Turn && !this.Player1.CantDoAnything) {
                        this.removeDrawImage();
                        this.socket.emit('removeDrawImage', (this.Player1));
                        this.setGroundCard(this.Player1.DrawCard);
                        this.socket.emit('setGroundCard', {card:this.Player1.DrawCard, plyr:this.Player1});
                        this.nothingToDo();
                        return;
                    }
                    else if (this.Player1.ThrowCard && this.Player1.Turn && !this.Player1.CantDoAnything && this.isPlayerDiv(element)) {
                        if (this.cardValue(pickedcard) == this.cardValue(this.Player1.DrawCard)) {
                            this.socket.emit('oppSelectCard', (this.getIndexValue(element)));
                            this.setGroundCard(pickedcard);
                            this.socket.emit('setGroundCard', {card:pickedcard, plyr:this.Player1});
                            this.removeCard(this.getIndexValue(element), 1);
                            this.socket.emit('removeCard', {index:this.getIndexValue(element), id:2, plyr:this.Player1});
                            this.printCards();
                            this.Player1.ThrewCard = true;

                            this.socket.emit('setOppDeck', (this.Player1.Cards));

                            if (this.cardsLeft() == 0) {
                                //this.socket.emit('setPlayerOpp', (this.Player1));
                                this.printCards();
                                                            
                                this.socket.emit('setOppDeck', (this.Player1.Cards));

                                this.monke();
                                this.socket.emit('monke');
                                return;
                            }
                            //this.socket.emit('setPlayerOpp', (this.Player1));
                            return;
                        } else {
                            this.burn(element, 1);
                            this.socket.emit('oppSelectCard', (this.getIndexValue(element)));
                            console.trace();
                            this.socket.emit('burnImage', (element.getAttribute("index")));

                            this.socket.emit('setOppDeck', (this.Player1.Cards));

                            //this.socket.emit('setPlayerOpp', (this.Player1));
                            this.printCards();
                        }
                    } else if (this.Player1.FreeThrow && this.isPlayerDiv(element)) {
                        if (this.cardValue(pickedcard) == this.cardValue(this.GroundCard)) {
                            this.socket.emit('oppSelectCard', (this.getIndexValue(element)));
                            this.setGroundCard(pickedcard);
                            this.socket.emit('setGroundCard', {card:pickedcard, plyr:this.Player1});
                            this.removeCard(index, 1);
                            this.socket.emit('removeCard', {index:index, id:2, plyr:this.Player1});

                                                        
                            this.socket.emit('setOppDeck', (this.Player1.Cards));

                            if (this.cardsLeft() == 0) {
                                this.monke();
                                this.socket.emit('monke');

                                //this.socket.emit('setPlayerOpp', (this.Player1));
                                                            
                                this.socket.emit('setOppDeck', (this.Player1.Cards));

                                this.printCards();
                                return;
                            }
                            //this.socket.emit('setPlayerOpp', (this.Player1));
                            this.printCards();
                            return;
                        } else {
                            this.burn(element, 1);
                            this.socket.emit('oppSelectCard', (this.getIndexValue(element)));
                            console.trace();
                            this.socket.emit('burnImage', (element.getAttribute("index")));
                                                        
                            this.socket.emit('setOppDeck', (this.Player1.Cards));

                            //this.socket.emit('setPlayerOpp', (this.Player1));
                            this.printCards();
                        }
                    } else if (!this.Player1.FreeThrow && !this.Player1.ThrowCards && this.Player1.Turn && !this.Player1.CantDoAnything && this.isPlayerDiv(element)) {
                        this.setGroundCard(pickedcard);
                        this.socket.emit('setGroundCard', {card:pickedcard, plyr:this.Player1});
                        this.socket.emit('oppSelectCard', (this.getIndexValue(element)));
                        if (this.cardValue(this.Player1.DrawCard) == this.cardValue(pickedcard)) {
                            this.removeCard(element.getAttribute("index"), 1);
                            this.socket.emit('removeCard', {index:element.getAttribute("index"), id:2, plyr:this.Player1});
                                                        
                            if (this.cardsLeft() == 0) {
                                this.monke();
                                this.socket.emit('monke');

                                //this.socket.emit('setPlayerOpp', (this.Player1));
                                this.socket.emit('setOppDeck', (this.Player1.Cards));

                                this.printCards();
                                return;
                            }

                            this.socket.emit('setOppDeck', (this.Player1.Cards));

                        } else {
                            pickedcard.Value = this.Player1.DrawCard.Value;
                            pickedcard.Suit = this.Player1.DrawCard.Suit;
                            element.setAttribute("src", Images['backcard']);

                            this.socket.emit('setOppDeck', (this.Player1.Cards));

                            //this.socket.emit('setPlayerOpp', (this.Player1));
                            //element.setAttribute("src", Images['backcard']);
                        }
                        this.removeDrawImage();
                        this.socket.emit('removeDrawImage', (this.Player1));
                        //this.socket.emit('setPlayerOpp', (this.Player1));
                        this.printCards();
                        this.socket.emit('setOppImage');
                        this.nothingToDo();
                        return;
                    } else {
                        //console.log("Its doing nothing.....................");
                    }
                }
                return;
            }
        }
    }






































    didViewCards () {
        return (this.Player1.ViewedCards >= this.Player1.NbCardsView);
    }
    
    isPlayerDiv (element) {
        return element.getAttribute("player") == 1;
    }

    isBurntImage (element) {
        if (this.isPlayerDiv(element)) {
            let card = this.Player1.Cards[parseInt(element.getAttribute("index"))];
            ////console.log(card);
            if (this.isBurned(card) == true)
                return true;
            return false;
        }
    }

    cardsLeft() {
        let count = 0;
        for (var i = 0; i < this.Player1.Cards.length; i++)
            if (this.Player1.Cards[i].Value != false) {
                count++;
            }
        return count;
    }

    nothingToDo() {
        document.getElementById("endturnplayer1").disabled = false;
        document.getElementById("monkeplayer1").disabled = false;
        this.Player1.CantDoAnything = true;
        this.flipButtons(false);
    }

    flipButtons(type) {
        document.getElementById("throwcardplayer1").disabled = !type;
        document.getElementById("specialplayer1").disabled = true;
        document.getElementById("specialplayer1").innerHTML = "ACTIVATE SPECIAL";
    }

    removeDrawImage() {
        let element = document.getElementById("player1pick");
        element.setAttribute("src", Images["transparent"]);
    }

    isOppDiv(element) {
        return element.getAttribute("player") == 2;
    }
    
    removeCard(ind, identifier) {
        this.printCards();
        let index = parseInt(ind);
        //console.log("index is: " + ind);
        let element = this.getElement("image-player" + identifier, index);
        //console.log(this.Player1.Cards[index]);
        if(identifier == 1)
            this.deActivate(this.Player1.Cards[index]);
        element.parentElement.remove();
        element.remove();
    }

    printCards(){
        // //console.log("player1 cards: ");
        // for(let i=0; i<4; i++){
        //     if(this.isActive(this.Player1.Cards[i]))
        //         //console.log(""+this.Player1.Cards[i].Value+this.Player1.Cards[i].Suit);
        // }
        // //console.log("player2 cards: ");
        // for(let i=0; i<4; i++){
        //     if(this.isActive(this.Player1.Cards[i]))
        //         //console.log(""+this.Player2.Cards[i].Value+this.Player2.Cards[i].Suit);
        // }
    }
    
    playerTurn() {

        this.Player1.Turn = true;
        this.Player1.CantDoAnything = false;
        this.Player2.Turn = false;
        this.Player1.DrawCard = this.Deck.Cards.pop();
        let playerdiv = document.getElementById("player1pick");
        document.getElementById("monkeplayer1").disabled = false;
        this.addPickCardClass(playerdiv);
        this.socket.emit('addPickCardClassOpponent');
        playerdiv.setAttribute("src", Images["" + this.Player1.DrawCard.Value + this.Player1.DrawCard.Suit]);
        this.flipButtons(true);
        if (this.cardsLeft() == 0){
            this.monke();
            this.socket.emit('monke');
            return;
        }
        if (this.cardValue(this.Player1.DrawCard) >= 6 && this.cardValue(this.Player1.DrawCard) <= 8) {
            this.Player1.Special = true;
            this.specialplayerDiv();
            document.getElementById("specialplayer1").disabled = false;
        }

        this.socket.emit('setDrawCard', (this.Player1));
        this.socket.emit('setDeck', this.Deck);
        this.socket.emit('setOppImage');
        this.printDeck();
    }

    printDeck(){
        console.log({d:this.Deck.Cards});
        this.printCards();
    }

    endTurn() {
        //console.log("Inside EndTurn function........");
        if (this.cardsLeft() == 0) {
            this.monke();
            this.socket.emit('monke');
        }
        let element = document.getElementById("player1pick");
        this.flipButtons(false);
        document.getElementById("endturnplayer1").disabled = true;
        document.getElementById("monkeplayer1").disabled = true;
        this.Player1.ThrowCard = false;
        document.getElementById("throwcardplayer1").innerHTML = "THROW CARD";
        this.socket.emit("throwCardButton", "THROW CARD");

        this.Player1.FreeThrow = false;
        document.getElementById("freethrowplayer1").innerHTML = "FREE THROW";
        this.socket.emit("freeThrowButton", "FREE THROW");

        this.Player1.SpecialEnabled = false;
        this.Player1.Special = false;
        document.getElementById("specialplayer1").innerHTML = "ACTIVATE SPECIAL";
        this.socket.emit("specialButton", "ACTIVATE SPECIAL");

        this.Player1.Turn = false;
        this.Player2.Turn = true;
        if (element.getAttribute("src") != Images["transparent"]) {
            this.setGroundCard(this.Player1.DrawCard);
            this.socket.emit('setGroundCard', {card:this.Player1.DrawCard, plyr:this.Player1});
            this.removeDrawImage();
        }
        document.getElementById("specialtextplayer1").innerHTML = "";
        document.getElementById("specialimgplayer1").setAttribute("src", "");
        if (this.Player2.Monkey) {
            this.calculateResult();
            return;
        }
        //console.log("Emmiting Pass Turn Socket........");
        this.socket.emit('pass turn', this.Player1);
    }

    monke() {
        if (!this.Player2.Monkey) {
            this.socket.emit('monke');
            this.Player1.BlockAction = true;
            document.getElementById("monkeplayer1").disabled = true;
            this.Player1.Monkey = true;
            this.monkeyOpacityEnable();
            this.monkeyEnable();
            setTimeout(()=>{
                this.monkeyDisable();
                this.monkeyOpacityDisable();
                this.endTurn();
                this.Player1.BlockAction = false;
            }, 3000);
        }
    }

    calculateResult(){
        this.Player1.BlockAction = true;
        this.revealAllCards();
        if(!this.OppDisconnect)
            this.socket.emit('calculateResults');
        setTimeout(()=>{
            if(!this.endGame)
                document.getElementById("formBtn").click();
        }, 4000);
    }

    revealAllCards(){
        console.log(this.Player1);
        let length = this.Player1.Cards.length;
        for(var i=0; i<length; i++){
            if(this.isActive(this.Player1.Cards[i]))
                this.getElement("image-player1", i).setAttribute('src', Images[""+this.Player1.Cards[i].Value+this.Player1.Cards[i].Suit]);
        }
        length = this.Player2.Cards.length;

        for(i=0; i<length; i++){
            if(this.isActive(this.Player2.Cards[i]))
                this.getElement("image-player2", i).setAttribute('src', Images[""+this.Player2.Cards[i].Value+this.Player2.Cards[i].Suit]);
        }
    }

    burn(element, id) {
        
        let card = null;
        //console.log("burn function........ id: " + id);
        if (id == 1)
            card = this.Player1.Cards[parseInt(element.getAttribute("index"))];
        //console.log("passed id 1 check............");
        if(id == 2){
            //console.log("inside burn function id = 2");
            card = this.Player2.Cards[parseInt(element.getAttribute("index"))];
            //console.log("before get Element..........");
            element = this.getElement("image-player2", parseInt(element.getAttribute("index")));
            //console.log("after get Element..........");
        }
        if (card != null) {
            this.burnCard(card);
            element.classList.add("burned-image");
        }
        //console.log("reached end.............");
    }

    specialplayerDiv() {
        let text = document.getElementById("specialtextplayer1");
        let str;
        if (this.cardValue(this.Player1.DrawCard) == 6) {
            str = "SELECT A CARD OF YOUR OWN TO VIEW<br>(ENDS TURN)";
        } else if (this.cardValue(this.Player1.DrawCard) == 7) {
            str = "SELECT TWO CARDS<br>(YOUR'S & OPPONENT'S) TO SWAP<br>(ENDS TURN)";
        } else if (this.cardValue(this.Player1.DrawCard) == 8) {
            str = "SELECT A CARD FROM YOUR OPPONENT TO VIEW<br>(ENDS TURN)";
        }
        text.innerHTML = str;
        return;
    }



    async throwCard() {
        this.disableSevenEffects();
        this.Player1.FreeThrow = false;
        document.getElementById("freethrowplayer1").innerHTML = "FREE THROW";
        this.socket.emit('freeThrowButton', "FREE THROW");

        this.removeAnimation("freethrow");
        this.socket.emit('removeAnimation', 'freethrow');

        document.getElementById("specialplayer1").innerHTML = "ACTIVATE SPECIAL";
        this.socket.emit("specialButton", "ACTIVATE SPECIAL");

        this.Player1.SpecialEnabled = false;
        
        if (this.Player1.ThrowCard == true) {
            this.Player1.ThrowCard = false;
            this.removeAnimation("throwcard");
            this.socket.emit('removeAnimation', 'throwcard');

            document.getElementById("throwcardplayer1").innerHTML = "THROW CARD";
            this.socket.emit("throwCardButton", "THROW CARD");

            if (this.Player1.ThrewCard) {
                this.Player1.ThrewCard = false;
                this.setGroundCard(this.Player1.DrawCard);
                this.socket.emit('setGroundCard', {card:this.Player1.DrawCard, plyr:this.Player1});
                this.playerTurn();
            }
        } else {
            this.Player1.ThrowCard = true;
            this.addAnimation("throwcard");
            this.socket.emit('addAnimation', 'throwcard');

            document.getElementById("throwcardplayer1").innerHTML = "CANCEL THROWCARD";
            this.socket.emit("throwCardButton", "CANCEL THROWCARD");
        }
    }

    freeThrow() {
        this.disableSevenEffects();
        this.Player1.ThrowCard = false;
        document.getElementById("throwcardplayer1").innerHTML = "THROW CARD";
        this.socket.emit("throwCardButton", "THROW CARD");

        this.removeAnimation("throwcard");
        document.getElementById("specialplayer1").innerHTML = "ACTIVATE SPECIAL";
        this.socket.emit("specialButton", "ACTIVATE SPECIAL");

        this.Player1.SpecialEnabled = false;
        if (this.Player1.FreeThrow == true) {
            this.Player1.FreeThrow = false;
            this.removeAnimation("freethrow");
            this.socket.emit('removeAnimation', 'freethrow');

            document.getElementById("freethrowplayer1").innerHTML = "FREE THROW";
            this.socket.emit("freeThrowButton", "FREE THROW");

        } else {
            this.Player1.FreeThrow = true;
            this.addAnimation("freethrow");
            this.socket.emit('addAnimation', 'freethrow');

            document.getElementById("freethrowplayer1").innerHTML = "CANCEL FREETHROW";
            this.socket.emit("freeThrowButton", "CANCEL FREETHROW");

        }
    }

    async specialplayer() {
        this.Player1.ThrowCard = false;
        document.getElementById("throwcardplayer1").innerHTML = "THROW CARD";
        this.socket.emit("throwCardButton", "THROW CARD");

        this.Player1.FreeThrow = false;
        document.getElementById("freethrowplayer1").innerHTML = "FREE THROW";
        this.socket.emit("freeThrowButton", "FREE THROW");
        if (this.Player1.SpecialEnabled == false) {
            this.Player1.SpecialEnabled = true;
            document.getElementById("specialplayer1").innerHTML = "CANCEL SPECIAL";
            this.socket.emit("specialButton", "CANCEL SPECIAL");

            if (this.cardValue(this.Player1.DrawCard) == 6){
                this.addAnimation("six");
                this.socket.emit('addAnimation', 'six');
            }
            else if (this.cardValue(this.Player1.DrawCard) == 7){
                this.addAnimation("seven");
                this.socket.emit('addAnimation', 'seven');
            }
            else if (this.cardValue(this.Player1.DrawCard) == 8){
                this.addAnimation("eight");
                this.socket.emit('addAnimation', 'eight');

            }
        }
        else {
            this.Player1.SpecialEnabled = false;
            document.getElementById("specialplayer1").innerHTML = "ACTIVATE SPECIAL";
            this.socket.emit("specialButton", "ACTIVATE SPECIAL");

            if (this.cardValue(this.Player1.DrawCard) == 6){
                this.removeAnimation("six");
                this.socket.emit('removeAnimation', 'six');
            }
            else if (this.cardValue(this.Player1.DrawCard) == 7){
                this.removeAnimation("seven");
                this.socket.emit('removeAnimation', 'seven');
            }
            else if (this.cardValue(this.Player1.DrawCard) == 8){
                this.removeAnimation("eight");
                this.socket.emit('removeAnimation', 'eight');
            }
        }
    }

    addPickCardClass(element) {
        return new Promise(resolve => {
            element.classList.add("pick-card-player1");
            setTimeout(() => {
                element.classList.remove("pick-card-player1");
                resolve();
            }, 1000);
        });
    }

    addPickCardClassOpponent() {
        //console.log("hasagi...........");
        document.getElementById("player2pick").classList.add("pick-card-player2");
        setTimeout(() => {
            document.getElementById("player2pick").classList.remove("pick-card-player2");
        }, 1000);
    }

    showCards() {
        
        let els = document.querySelectorAll(".image-player2");
        console.log("player 2 cards....");
        for (var i = 0; i < els.length; i++) {
            let index = parseInt(els[i].getAttribute('index'));
            console.log({c:this.Player2.Cards[index]});
            els[i].setAttribute("src", Images['backcard']);
        }
    }

    calculateScore() {
        let sum = 0;
        if(this.OppDisconnect)
            return -1;
        for (var i = 0; i < this.Player1.Cards.length; i++)
            sum += this.cardValue(this.Player1.Cards[i]);
        return sum;
    }

    calculateScoreOpp() {
        let sum = 0;
        for (var i = 0; i < this.Player2.Cards.length; i++)
            sum += this.cardValue(this.Player2.Cards[i]);
        return sum;
    }

    async getNbCardsToView(){
        console.log("do nothing");
    }

    





















    isActive(card) {
        if (card.Value === 0)
            return false;
        return true;
    }

    deActivate(card) {
        card.Value = 0;
    }

    isBurned(card) {
        if (card.Locked === true)
            return true;
        return false;
    }

    burnCard(card) {
        card.Locked = true;
    }

    cardValue(card) {
        switch (card.Value) {
            case 'J':
                return 11;
            case 'Q':
                return 12;
            case 'K':
                return 13;
            case 'A':
                return 1;
            default:
                return parseInt(card.Value);
        }
    }

    nextRound(first) {
        this.socket = sok.getSocket();
        this.Deck = new Deck();
        this.endGame = false;
        this.Player1 = new Player();
        this.Player2 = new Player();
        this.Started = false;
        this.GroundCards = [];
        this.GroundCard = null;
        this.NbCardsPickedSeven = 0;
        this.MonkeEffect = false;
        this.drawsFirst = false;
        this.OppViewedCards = false;
        this.OppDisconnect = false;
        // let user1 = this.Username;
        // let user2 = this.OppUsername;
        // game = new Monke();
        // this.Username = user1;
        // this.OppUsername = user2;
        this.isFirst = first;
        getLatestRoundWinner();
        this.startGame();
    }

    // remPlayer2Comp() {
    //     console.log("Removed PLayer 2 components");
    //     document.getElementById("assets-container-player2").parentNode.classList.add("d-none");
    //     document.getElementById("assets-container-player2").parentNode.classList.remove("d-flex");
    //     document.getElementById("assets-container-player2").parentNode.classList.remove("d-md-flex");
    // }

}

//this.NbViewedCardsplayer1 = 2;
//this.NbViewedCardsplayer2 = 2;
//this.viewedCardsplayer1 = 0;
//this.viewedCardsplayer2 = 0;

let game = new Monke();
export default game;