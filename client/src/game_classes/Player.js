import game from './Monke';
import Images from './Images';

function Player() {

    this.Cards = [];
    this.Identifier = null; //To distinguish between player1 and player2
    this.Monkey = false;
    this.Turn = false;
    this.Special = false;
    this.SpecialEnabled = false;
    this.DrawCard = null;
    this.FreeThrow = false;
    this.ThrowCard = false;
    this.ThrewCard = false;
    this.SwapCard = null;
    this.ViewedCards = 0;
    this.NbCardsView = 2;

    this.didViewCards = function(){
        return (this.ViewdCards >= this.NbCardsView);
    }

    this.isPlayerDiv = function(element){
        return this.Identifier == element.getAttribute("player");
    }

    this.isBurntImage = function(element) { 
        if (this.isPlayerDiv(element)) {
            let card = this.Cards[parseInt(element.getAttribute("index"))];
            //console.log(card);
            if (card.isBurned() == true)
                return true;
            return false;
        }
    }

    this.cardsLeft = function() {
        let count = 0;
        for (var i = 0; i < this.Cards.length; i++)
            if (this.Cards[i].isActive()){
                count++;
            }
        return count;
    }

    this.nothingToDo = function() {
        console.log(this.Identifier);
        document.getElementById("endturnplayer" + (this).Identifier).disabled = false;
        document.getElementById("monkeplayer" + (this).Identifier).disabled = false;
        (this).flipButtons(false);
    }

    this.flipButtons = function(type) {
        document.getElementById("throwcardplayer" + this.Identifier).disabled = !type;
        document.getElementById("specialplayer" + this.Identifier).disabled = true;
        document.getElementById("specialplayer" + this.Identifier).innerHTML = "ACTIVATE SPECIAL";
    }

    this.removeClassFromAllElements = function(name) {
        var elems = document.querySelectorAll("." + name);
        [].forEach.call(elems, function (el) {
            el.classList.remove(name);
        });
    }

    this.removeDrawImage = function(){
        let element = document.getElementById("player" + this.Identifier + "pick");
        element.setAttribute("src", "");
    }

    this.isOppDiv = function(element){
        let id = this.Identifier == 1 ? 2: 1;
        return id == parseInt(element.getAttribute("player"));
    }

    this.removeCard = function(ind){
        let index = parseInt(ind);
        let element = game.getElement("image-player" + this.Identifier, index);
        this.Cards[index].deActivate();
        element.parentElement.remove();
        element.remove();
    }

    this.endTurn = function() {
        console.log("asdkfjlasjfdlasdf: " + this);
        let target = (this).Identifier === 1 ? game.Player2 : game.Player1;
        if(this.cardsLeft() == 0){
            this.monke();
        }
        // if (game.NbViewedCardsplayer1 != game.viewedCardsplayer1) {
        //     window.alert("SELECT YOUR GODDAMN CARDS MAN.....TF");
        //     return;
        // }
        let element = document.getElementById("player"+ this.Identifier + "pick");
        this.flipButtons(false);
        document.getElementById("endturnplayer" + this.Identifier).disabled = true;
        document.getElementById("monkeplayer" + this.Identifier).disabled = true;
        (this).ThrowCard = false;
        document.getElementById("throwcardplayer" + this.Identifier).innerHTML = "THROW CARD";
        (this).FreeThrow = false;
        document.getElementById("freethrowplayer" + this.Identifier).innerHTML = "FREE THROW";
        (this).SpecialEnabled = false;
        (this).Special = false;
        document.getElementById("specialplayer" + this.Identifier).innerHTML = "ACTIVATE SPECIAL";
        (this).Turn = false;
        target.Turn = true;
        if (element.getAttribute("src") != "") {
            game.setGroundCard(this.DrawCard);
            this.removeDrawImage();
        }
        document.getElementById("specialtextplayer" + this.Identifier).innerHTML = "";
        document.getElementById("specialimgplayer" + this.Identifier).setAttribute("src", "");
        if(target.Monkey){
            game.calculateResult();
            return;
        }
        target.playerTurn();
    }

    this.monke = async function() {
        let target = this.Identifier == 1 ? game.Player2 : game.Player1;
        if(!target.Monkey)
        {
            document.getElementById("monkeplayer"+this.Identifier).disabled = true;
            this.Monkey = true;
            //document.getElementById("monkeyaudio").play();
            game.monkeyOpacityEnable();
            game.monkeyEnable();
            await game.timerFunction(3000);
            game.monkeyDisable();
            game.monkeyOpacityDisable();
            this.endTurn();
        }
    }

    this.burn = function(element) {
        let card = null;

        if (this.isPlayerDiv(element))
            card = this.Cards[parseInt(element.getAttribute("index"))];

        if (card != null) {
            card.burnCard();
            element.classList.add("burned-image");
        }
    }

    this.specialplayerDiv = function() {
        let text = document.getElementById("specialtextplayer" + this.Identifier);
        let str;
        if (this.DrawCard.cardValue() == 6) {
            str = "SELECT A CARD OF YOUR OWN TO VIEW<br>(ENDS TURN)";
        } else if (this.DrawCard.cardValue() == 7) {
            str = "SELECT TWO CARDS<br>(YOUR'S & OPPONENT'S) TO SWAP<br>(ENDS TURN)";
        } else if (this.DrawCard.cardValue() == 8) {
            str = "SELECT A CARD FROM YOUR OPPONENT TO VIEW<br>(ENDS TURN)";
        }
        text.innerHTML = str;
        return;
    }

    this.playerTurn = function() {
        let target = this.Identifier == 1 ? game.Player2 : game.Player1;
        console.log("Player " + target.Identifier + " Turn: " + false);
        console.log("Player " + this.Identifier + " Turn: " + true);
        (this).Turn = true;
        target.Turn = false;
        (this).DrawCard = game.Deck.Cards.pop();
        let playerdiv = document.getElementById("player" + this.Identifier + "pick");
        document.getElementById("monkeplayer" + this.Identifier).disabled = false;
        this.addPickCardClass(playerdiv);
        playerdiv.setAttribute("src", Images[""+this.DrawCard.Value + this.DrawCard.Suit]);
        this.flipButtons(true);
        if(this.cardsLeft() == 0)
            return;
        if (this.DrawCard.cardValue() >= 6 && this.DrawCard.cardValue() <= 8) {
            (this).Special = true;
            this.specialplayerDiv();
            document.getElementById("specialplayer" + this.Identifier).disabled = false;
        }
    }
 
    this.throwCard = async function() {
        game.disableSevenEffects();
        (this).FreeThrow = false;
        document.getElementById("freethrowplayer" + this.Identifier).innerHTML = "FREE THROW";
        game.removeAnimation("freethrow", this);
        document.getElementById("specialplayer" + this.Identifier).innerHTML = "ACTIVATE SPECIAL";
        (this).SpecialEnabled = false;
        if ((this).ThrowCard == true) {
            (this).ThrowCard = false;
            game.removeAnimation("throwcard", this);
            document.getElementById("throwcardplayer" + this.Identifier).innerHTML = "THROW CARD";
            if ((this).ThrewCard) {
                (this).ThrewCard = false;
                game.setGroundCard(this.DrawCard);
                this.playerTurn();
            }
        } else {
            (this).ThrowCard = true;
            game.addAnimation("throwcard", this);
            document.getElementById("throwcardplayer" + this.Identifier).innerHTML = "CANCEL THROWCARD";
        }
    }

    this.freeThrow = function() {
        console.log("in freethrow and player is: " + this.Identifier);
        game.disableSevenEffects();
        (this).ThrowCard = false;
        document.getElementById("throwcardplayer" + this.Identifier).innerHTML = "THROW CARD";
        game.removeAnimation("throwcard" + this.Identifier, this);
        document.getElementById("specialplayer" + this.Identifier).innerHTML = "ACTIVATE SPECIAL";
        (this).SpecialEnabled = false;
        if (this.FreeThrow == true) {
            (this).FreeThrow = false;
            game.removeAnimation("freethrow", this);
            document.getElementById("freethrowplayer" + this.Identifier).innerHTML = "FREE THROW";
        } else {
            (this).FreeThrow = true;
            game.addAnimation("freethrow", this);
            document.getElementById("freethrowplayer" + this.Identifier).innerHTML = "CANCEL FREETHROW";
        }
    }

    this.specialplayer = async function() {
        (this).ThrowCard = false;
        document.getElementById("throwcardplayer" + this.Identifier).innerHTML = "THROW CARD";
        (this).FreeThrow = false;
        document.getElementById("freethrowplayer" + this.Identifier).innerHTML = "FREE THROW";
        if ((this).SpecialEnabled == false) {
            (this).SpecialEnabled = true;
            document.getElementById("specialplayer" + this.Identifier).innerHTML = "CANCEL SPECIAL";
            if ((this).DrawCard.cardValue() == 6)
                game.addAnimation("six", this);
            else if ((this).DrawCard.cardValue() == 7)
                game.addAnimation("seven", this);
            else if ((this).DrawCard.cardValue() == 8)
                game.addAnimation("eight", this);
        }
        else {
            (this).SpecialEnabled = false;
            document.getElementById("specialplayer" + this.Identifier).innerHTML = "ACTIVATE SPECIAL";
            if ((this).DrawCard.cardValue() == 6)
                await game.removeAnimation("six", this);
            else if ((this).DrawCard.cardValue() == 7)
                await game.removeAnimation("seven", this);
            else if ((this).DrawCard.cardValue() == 8)
                await game.removeAnimation("eight", this);
        }
    }

    this.addPickCardClass = function(element) {
        return new Promise(resolve => {
            element.classList.add("pick-card-player" + this.Identifier);
            setTimeout(() => {
                element.classList.remove("pick-card-player" + this.Identifier);
                resolve();
            }, 1000);
        });
    }

    this.showCards = function(){
        let els = document.querySelectorAll(".image-player" + this.Identifier);
        for(var i=0; i<els.length; i++){
            let index = parseInt(els[i].getAttribute('index'));
            els[i].setAttribute("src", Images[""+this.Cards[index].Value + this.Cards[index].Suit]);
        }
    }

    this.calculateScore = function() {
        let sum = 0;
        for (var i = 0; i < this.Cards.length; i++)
            sum += this.Cards[i].cardValue();
        return sum;
    }


    
    
}

export default Player;
