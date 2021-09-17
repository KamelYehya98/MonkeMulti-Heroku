import game from './Monke';
import Images from './Images';


class Player {
    constructor() {
        this.Cards = [];
        this.Monkey = false;
        this.Turn = false;
        this.Special = false;
        this.SpecialEnabled = false;
        this.DrawCard = null;
        this.FreeThrow = false;
        this.ThrowCard = false;
        this.ThrewCard = false;
        this.CantDoAnything = false;
        this.SwapCard = null;
        this.ViewedCards = 0;
        // this.NbCardsView = 2;
    }

    isPlayerDiv (element) {
        return element.getAttribute("player") == 1;
    }

    isBurntImage (element) {
        if (this.isPlayerDiv(element)) {
            let card = this.Cards[parseInt(element.getAttribute("index"))];
            //console.log(card);
            if (card.isBurned() == true)
                return true;
            return false;
        }
    }

    cardsLeft () {
        let count = 0;
        for (var i = 0; i < this.Cards.length; i++)
            if (this.Cards[i].isActive()) {
                count++;
            }
        return count;
    }

    nothingToDo () {
        document.getElementById("endturnplayer1").disabled = false;
        document.getElementById("monkeplayer1").disabled = false;
        this.CantDoAnything = true;
        this.flipButtons(false);
    }

    flipButtons (type) {
        document.getElementById("throwcardplayer1").disabled = !type;
        document.getElementById("specialplayer1").disabled = true;
        document.getElementById("specialplayer1").innerHTML = "ACTIVATE SPECIAL";
    }

    removeClassFromAllElements (name) {
        var elems = document.querySelectorAll("." + name);
        [].forEach.call(elems, function (el) {
            el.classList.remove(name);
        });
    }

    removeDrawImage () {
        let element = document.getElementById("player1pick");
        element.setAttribute("src", "");
        game.socket.emit('removeDrawImage', game.Player1);
    }

    isOppDiv (element) {
        return element.getAttribute("player") == 2;
    }
    
    removeCard (ind) {
        let index = parseInt(ind);
        let element = game.getElement("image-player1", index);
        this.Cards[index].deActivate();
        element.parentElement.remove();
        element.remove();
    }
    
    endTurn () {
        if (this.cardsLeft() == 0) {
            this.monke();
        }
        // if (game.NbViewedCardsplayer1 != game.viewedCardsplayer1) {
        //     window.alert("SELECT YOUR GODDAMN CARDS MAN.....TF");
        //     return;
        // }
        let element = document.getElementById("player1pick");
        this.flipButtons(false);
        document.getElementById("endturnplayer1").disabled = true;
        document.getElementById("monkeplayer1").disabled = true;
        this.ThrowCard = false;
        document.getElementById("throwcardplayer1").innerHTML = "THROW CARD";
        this.FreeThrow = false;
        document.getElementById("freethrowplayer1").innerHTML = "FREE THROW";
        this.SpecialEnabled = false;
        this.Special = false;
        document.getElementById("specialplayer1").innerHTML = "ACTIVATE SPECIAL";
        this.Turn = false;
        game.Player2.Turn = true;
        if (element.getAttribute("src") != "") {
            game.setGroundCard(this.DrawCard);
            this.removeDrawImage();
        }
        document.getElementById("specialtextplayer1").innerHTML = "";
        document.getElementById("specialimgplayer1").setAttribute("src", "");
        if (game.Player2.Monkey) {
            game.calculateResult();
            return;
        }
        
        game.socket.emit('pass turn');
    }

    async monke() {
        if (!game.Player2.Monkey) {
            document.getElementById("monkeplayer1").disabled = true;
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

    

    burn (element) {
        let card = null;

        if (this.isPlayerDiv(element))
            card = this.Cards[parseInt(element.getAttribute("index"))];

        if (card != null) {
            card.burnCard();
            element.classList.add("burned-image");
        }
    }

    specialplayerDiv () {
        let text = document.getElementById("specialtextplayer1");
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

    playerTurn () {

        this.Turn = true;
        this.CantDoAnything = false;
        game.Player2.Turn = false;
        this.DrawCard = game.Deck.Cards.pop();
        let playerdiv = document.getElementById("player1pick");
        document.getElementById("monkeplayer1").disabled = false;
        this.addPickCardClass(playerdiv);
        playerdiv.setAttribute("src", Images["" + this.DrawCard.Value + this.DrawCard.Suit]);
        this.flipButtons(true);
        if (this.cardsLeft() == 0)
            return;
        if (this.DrawCard.cardValue() >= 6 && this.DrawCard.cardValue() <= 8) {
            this.Special = true;
            this.specialplayerDiv();
            document.getElementById("specialplayer1").disabled = false;
        }

        game.socket.emit('setDrawCard', this);
    }

    async throwCard () {
        game.disableSevenEffects();
        this.FreeThrow = false;
        document.getElementById("freethrowplayer1").innerHTML = "FREE THROW";
        game.removeAnimation("freethrow", this);
        document.getElementById("specialplayer" + this.Identifier).innerHTML = "ACTIVATE SPECIAL";
        this.SpecialEnabled = false;
        if (this.ThrowCard == true) {
            this.ThrowCard = false;
            game.removeAnimation("throwcard", this);
            document.getElementById("throwcardplayer1").innerHTML = "THROW CARD";
            if (this.ThrewCard) {
                this.ThrewCard = false;
                game.setGroundCard(this.DrawCard);
                this.playerTurn();
            }
        } else {
            this.ThrowCard = true;
            game.addAnimation("throwcard");
            document.getElementById("throwcardplayer1").innerHTML = "CANCEL THROWCARD";
        }
    }

    freeThrow () {
        game.disableSevenEffects();
        this.ThrowCard = false;
        document.getElementById("throwcardplayer1").innerHTML = "THROW CARD";
        game.removeAnimation("throwcard1", this);
        document.getElementById("specialplayer1").innerHTML = "ACTIVATE SPECIAL";
        this.SpecialEnabled = false;
        if (this.FreeThrow == true) {
            this.FreeThrow = false;
            game.removeAnimation("freethrow", this);
            document.getElementById("freethrowplayer1").innerHTML = "FREE THROW";
        } else {
            this.FreeThrow = true;
            game.addAnimation("freethrow");
            document.getElementById("freethrowplayer1").innerHTML = "CANCEL FREETHROW";
        }
    }

    async specialplayer () {
        this.ThrowCard = false;
        document.getElementById("throwcardplayer1").innerHTML = "THROW CARD";
        this.FreeThrow = false;
        document.getElementById("freethrowplayer1").innerHTML = "FREE THROW";
        if (this.SpecialEnabled == false) {
            this.SpecialEnabled = true;
            document.getElementById("specialplayer1").innerHTML = "CANCEL SPECIAL";
            if (this.DrawCard.cardValue() == 6)
                game.addAnimation("six");
            else if (this.DrawCard.cardValue() == 7)
                game.addAnimation("seven");
            else if (this.DrawCard.cardValue() == 8)
                game.addAnimation("eight");
        }
        else {
            this.SpecialEnabled = false;
            document.getElementById("specialplayer1").innerHTML = "ACTIVATE SPECIAL";
            if (this.DrawCard.cardValue() == 6)
                await game.removeAnimation("six");
            else if (this.DrawCard.cardValue() == 7)
                await game.removeAnimation("seven");
            else if (this.DrawCard.cardValue() == 8)
                await game.removeAnimation("eight");
        }
    }

    addPickCardClass (element) {
        return new Promise(resolve => {
            element.classList.add("pick-card-player1");
            setTimeout(() => {
                element.classList.remove("pick-card-player1");
                resolve();
            }, 1000);
        });
    }

    showCards () {
        let els = document.querySelectorAll(".image-player1");
        for (var i = 0; i < els.length; i++) {
            let index = parseInt(els[i].getAttribute('index'));
            els[i].setAttribute("src", Images["" + this.Cards[index].Value + this.Cards[index].Suit]);
        }
    }

    calculateScore () {
        let sum = 0;
        for (var i = 0; i < this.Cards.length; i++)
            sum += this.Cards[i].cardValue();
        return sum;
    }

}

// didViewCards () {
//     return (this.ViewdCards >= this.NbCardsView);
// };

export default Player;
