import Deck from './Deck';
import Player from './Player';
import Images from './Images';

function Monke(){
    
    this.Player1 = new Player();
    this.Player2 = new Player();
    this.Deck = Deck;

    this.Started = false;
    this.GroundCards = [];
    this.GroundCard = null;
    this.NbCardsPickedSeven = 0;

    this.NbViewedCardsplayer1 = 2;
    this.NbViewedCardsplayer2 = 2;

    this.viewedCardsplayer1 = 0;
    this.viewedCardsplayer2 = 0;

    this.MonkeEffect = false;

    this.startGame = function(){
        if(game.Started == false){
            game.Started = true;
            game.Player1.Identifier = 1;
            game.Player2.Identifier = 2;
            Deck.shuffleCards();
            game.dealCards();
        }
        //game.setDrawValues(game.NbViewedCardsplayer1, game.NbViewedCardsplayer2);
        //game.enableOnclick();
    }

    this.dealCards = function(){
        let img, card, i;
        let groundcard = document.getElementById('groundcard');
        groundcard.setAttribute("src", Images['transparent']);
        console.log(Deck.Cards);
        console.log("player 2 cards: ");
        for(i=1; i<=4; i++)
        {
            card = game.Deck.Cards.pop();
            game.Player2.Cards.push(Object.assign({}, card));
            img = game.getElement("image-player2", i-1);
            img.setAttribute("src", Images['' + card.Value+card.Suit]);
            console.log("" + card.Value + card.Suit);
        }
        console.log("player1 cards: ");
        for(i=1; i<=4; i++)
        {
            card = game.Deck.Cards.pop();
            game.Player1.Cards.push(Object.assign({}, card));
            img = game.getElement("image-player1", i-1);
            img.setAttribute("src", Images['' + card.Value+card.Suit]);
            console.log("" + card.Value + card.Suit);
        }
        game.Player1.playerTurn();
        //setTimeout(game.getImage, 2000);
    }

    this.getIndexValue = function(element){
        return parseInt(element.getAttribute("index"));
    }

    this.flipCardBack = async function(element) {
        return new Promise(resolve => {
            setTimeout(() => {
                //element.setAttribute("src", Images['backcard']);
                resolve();
            }, 2000);
        });
    }

    this.setGroundCard = function(card) {
        game.GroundCard = Object.assign({}, card);
        game.GroundCards.push(game.GroundCard);
        let img = document.getElementById("groundcard");
        img.setAttribute("src", Images[""+game.GroundCard.Value + game.GroundCard.Suit]);
    }

    this.removeAnimation = function(specialtype, player) {
        let plyr = player.Identifier;
        let opp = plyr == 1 ? 2: 1;
        return new Promise(resolve => {
            player.removeClassFromAllElements("addAnimation");
            if(specialtype != "six" && specialtype != "seven" && specialtype != "eight"){
                document.getElementById("specialdivplayer"+plyr).classList.add("removeAnimation");
                document.getElementById("specialplayer" + plyr).classList.add("removeAnimation");
                document.getElementById("player" + plyr + "pick").classList.add("removeAnimation");
            }
            if(specialtype != "seven" && specialtype != "eight"){
                document.getElementById("cards-container-player"+opp).classList.add("removeAnimation");
            }
            if(specialtype == "eight"){
                document.getElementById("cards-container-player"+plyr).classList.add("removeAnimation");
            }
            if(specialtype != "freethrow"){
                document.getElementById("freethrowplayer" + plyr).classList.add("removeAnimation");
            }
            if(specialtype != "throwcard"){
                document.getElementById("throwcardplayer" + plyr).classList.add("removeAnimation");
            }
            document.getElementById("assets-container-player"+opp).classList.add("removeAnimation");
            document.getElementById("monkeplayer" + plyr).classList.add("removeAnimation");
            document.getElementById("endturnplayer" + plyr).classList.add("removeAnimation");

            setTimeout(()=>{
                player.removeClassFromAllElements("removeAnimation");
                resolve();
            }, 1000);
        });
    }

    this.addAnimation = function(specialtype, player) {
        let plyr = player.Identifier;
        let opp = plyr == 1 ? 2: 1;
        player.removeClassFromAllElements("removeAnimation");
        if(specialtype != "six" && specialtype != "seven" && specialtype != "eight"){
            document.getElementById("specialdivplayer" + plyr).classList.add("addAnimation");
            document.getElementById("specialplayer" + plyr).classList.add("addAnimation");
            document.getElementById("player" + plyr + "pick").classList.add("addAnimation");
        }
        if(specialtype != "seven" && specialtype != "eight"){
            document.getElementById("cards-container-player" + opp).classList.add("addAnimation");
        }
        if(specialtype == "eight"){
            document.getElementById("cards-container-player" + plyr).classList.add("addAnimation");
        }
        if(specialtype != "freethrow"){
            document.getElementById("freethrowplayer" + plyr).classList.add("addAnimation");
        }
        if(specialtype != "throwcard"){
            document.getElementById("throwcardplayer" + plyr).classList.add("addAnimation");
        }
        document.getElementById("assets-container-player" + opp).classList.add("addAnimation");
        document.getElementById("monkeplayer" + plyr).classList.add("addAnimation");
        document.getElementById("endturnplayer" + plyr).classList.add("addAnimation");
    }

    this.swapCards = function() {
        let cardone, cardtwo, aux, player1index, player2index;
        player1index = game.getIndexValue(game.Player1.SwapCard);
        player2index = game.getIndexValue(game.Player2.SwapCard);

        cardone = game.Player1.Cards[player1index];
        cardtwo = game.Player2.Cards[player2index];
        aux = Object.assign({}, cardone);

        cardone.Value = cardtwo.Value;
        cardone.Suit = cardtwo.Suit;
        cardone.Viewed = false;

        cardtwo.Value = aux.Value;
        cardtwo.Suit = aux.Suit;
        cardtwo.Viewed = false;


        let element;
        element = game.getElement("image-player2", player2index);
        element = game.getElement("image-player1", player1index);
        
        game.Player1.SwapCard = null;
        game.Player2.SwapCard = null;
        game.NbCardsPickedSeven = 0;
        return;
    }

    this.timerFunction = function(time) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    }

    this.removeAnimationSeven = function() {
        game.Player1.removeClassFromAllElements("image-player2-select");
        game.Player2.removeClassFromAllElements("image-player1-select");
    }

    this.resetSevenSpecial = function() {
        game.removeAnimationSeven();
        game.Player1.SwapCard = null;
        game.Player2.SwapCard = null;
        game.NbCardsPickedSeven = 0;
    }

    this.monkeyOpacityEnable = function(){

        let el = document.querySelectorAll(".addopacitymonkey");
        for(var i=0; i<el.length; i++)
            el[i].classList.add("opacityformonkey");
    }

    this.monkeyOpacityDisable = function(){

        let el = document.querySelectorAll(".opacityformonkey");
        for(var i=0; i<el.length; i++)
            el[i].classList.remove("opacityformonkey");
    }

    this.removeClassFromAllElements = function(name) {
        var elems = document.querySelectorAll("." + name);
        [].forEach.call(elems, function (el) {
            el.classList.remove(name);
        });
    }

    this.monkeyEnable = function(){
        game.MonkeEffect = true;
        game.MonkeDivContent = document.getElementById("grounddisappear").classList.add("disappear");
        let el = document.querySelector(".adddisablemonkey");
        let monk = document.querySelector(".disableformonkey");

        game.removeClassFromAllElements("disableformonkey");
        game.removeClassFromAllElements("adddisablemonkey");

        monk.classList.add("adddisablemonkey");
        el.classList.add("disableformonkey");
    }

    this.monkeyDisable = function(){
        let monk = document.querySelector(".adddisablemonkey");
        let el = document.querySelector(".disableformonkey");
        document.getElementById("grounddisappear").classList.remove("disappear")

        game.removeClassFromAllElements("disableformonkey");
        game.removeClassFromAllElements("adddisablemonkey");

        el.classList.add("adddisablemonkey");
        monk.classList.add("disableformonkey");  
        game.MonkeEffect = false;
    }

    this.calculateResult = function() {
        setTimeout(game.Player1.showCards(), 2000);
        setTimeout(game.Player2.showCards(), 2000);
        document.getElementById('formBtn').click();
    }

    this.disableSevenEffects = async function(){
        game.Player1.SwapCard = null;
        game.Player2.SwapCard = null;
        //await game.removeAnimation("seven", game.Player1);
        game.removeAnimationSeven();
        game.resetSevenSpecial();
        game.NbCardsPickedSeven = 0;
    }

    this.removeFinishSwapCards = function(player) {
        game.player.removeClassFromAllElements("finish-swap-cards");
    }

    this.finishSwapCards = function(element1, element2) {
        element1.classList.add("finish-swap-cards");
        element2.classList.add("finish-swap-cards");
    }

    this.removeSelectBorder = function(element) {
        element.setAttribute("style", "border: none;");
    }

    this.playerAction = async function(element, player) {
        // if(!player.didViewCards())
        // {
        //    if(player.isPlayerDiv(element))
        //    {
        //        element.classList.add("flip-image");
        //        let i = game.getIndexValue(element);
        //        setTimeout(function(){
        //            element.setAttribute("src", Images[''+player.Cards[i].Value + player.Cards[i].Suit]);
        //        }, 100);
        //        setTimeout(function(){
        //            //console.log("OK babe");
        //            element.classList.remove("flip-image");
        //            element.classList.add("unflip-image");
        //            element.setAttribute("src", Images['backcard']);
        //        }, 2000);
        //        setTimeout(function(){
        //             element.classList.remove("unflip-image");
        //         }, 3000);
        //         player.ViewedCards++;
        //         //INSERT CODE TO DECIDE WHO PLAYS FIRST.
        //         // if(player.didViewCards())
        //         // {
        //         //     if(NbViewedCardsPlayer <= 2)
        //         //         player.playerTurn();
        //         //     else{
        //         //         bot.BotTurn();
        //         //         document.getElementById("monke").disabled = true;
        //         //         document.getElementById("throwcard").disabled = true;
        //         //         document.getElementById("endturn").disabled = true;
        //         //     }
        //         // }

        //         game.Player1.playerTurn();
                    
        //         return;
        //    }
        //    return;
        // }
        if (!player.isBurntImage(element)) {
            if (player.Special && player.SpecialEnabled && player.Turn && player.cardsLeft() != 0) {
                if (player.DrawCard.cardValue() == 6) {
                    if (player.isPlayerDiv(element)) {
                        let card = player.Cards[game.getIndexValue(element)];
                        element.setAttribute("src", Images[""+card.Value + card.Suit]);
                        await game.flipCardBack(element);
                        player.removeDrawImage();
                        game.setGroundCard(player.DrawCard);
                        await game.removeAnimation("six", player);
                        player.nothingToDo();
                        return;
                    } else
                        return;
                }
                else if (player.DrawCard.cardValue() == 8) {
                    if (player.isOppDiv(element)) {
                        let target = player.Identifier == 1 ? game.Player2 : game.Player1;
                        let card = target.Cards[game.getIndexValue(element)];
                        element.setAttribute("src", Images["" + card.Value + card.Suit]);
                        await game.flipCardBack(element);
                        player.removeDrawImage();
                        game.setGroundCard(player.DrawCard);
                        await game.removeAnimation("eight", game.Player1);
                        player.nothingToDo();
                        return;
                    } else
                        return;
                }
                else if (player.DrawCard.cardValue() == 7) {
                    let target = player.Identifier == 1 ? game.Player2 : game.Player1;
                    if (game.NbCardsPickedSeven == 0) {
                        game.NbCardsPickedSeven++;
                        if (player.isPlayerDiv(element) || player.isOppDiv(element)) {
                            if (player.isPlayerDiv(element)){
                                element.classList.add("image-player" + target.Identifier + "-select");
                                player.SwapCard = element;
                            }
                            if (player.isOppDiv(element)){
                                element.classList.add("image-player" + player.Identifier + "-select");
                                target.SwapCard = element;
                            }
                        }
                    }
                    else if (game.NbCardsPickedSeven == 1) {
                        if (player.isOppDiv(element) && target.SwapCard != null) {
                            target.SwapCard = element;
                            target.removeClassFromAllElements("image-player" + player.Identifier + "-select");
                            target.SwapCard.classList.add("image-player" + player.Identifier + "-select");
                        } else if (player.isPlayerDiv(element) && player.SwapCard != null) {
                            player.SwapCard = element;
                            player.removeClassFromAllElements("image-player" + target.Identifier + "-select");
                            player.SwapCard.classList.add("image-player" + target.Identifier + "-select");
                        } else {
                            game.NbCardsPickedSeven++;
                            if(target.SwapCard == null){
                                target.SwapCard = element;
                                target.SwapCard.classList.add("image-player" + player.Identifier + "-select");
                            }else{
                                player.SwapCard = element;
                                player.SwapCard.classList.add("image-player" + target.Identifier + "-select");
                            }   
                        }
                    }
                    if (game.NbCardsPickedSeven == 2) {
                        game.NbCardsPickedSeven = 0;
                        game.swapCards();
                        await game.timerFunction(1000);
                        await game.removeAnimation("seven", game.Player1);
                        if(game.GroundCards == undefined || game.GroundCards == null)
                            game.GroundCards = new Array();
                        game.GroundCards.push(Object.assign({}, player.DrawCard));
                        setTimeout(game.setGroundCard, 1000, player.DrawCard);
                        player.removeDrawImage();
                        setTimeout(game.removeAnimationSeven, 1000);
                        setTimeout(game.resetSevenSpecial, 1000);
                        player.nothingToDo();
                        return;
                    }
                }
                return;
            }
            else if (!player.isOppDiv(element)) {
                let index = game.getIndexValue(element);
                let pickedcard = player.Cards[index];
                if (element.getAttribute("id") == "groundcard" && player.Turn) {
                    player.removeDrawImage();
                    game.setGroundCard(player.DrawCard);
                    player.nothingToDo();
                    return;
                }
                else if (player.ThrowCard && player.Turn) {
                    if (pickedcard.cardValue() == player.DrawCard.cardValue()) {
                        game.setGroundCard(pickedcard);
                        player.removeCard(game.getIndexValue(element));
                        player.ThrewCard = true;
                        if(player.cardsLeft() == 0){
                            await player.monke();
                            return;
                        }
                        return;
                    } else {
                        player.burn(element);
                    }
                } else if (player.FreeThrow) {
                    console.log("lkasjdfkja slkdfjasld");
                    if (pickedcard.cardValue() == game.GroundCard.cardValue()) {
                        game.setGroundCard(pickedcard);
                        player.removeCard(index);
                        if(player.cardsLeft() == 0){
                            await player.monke();
                            return;
                        }
                        return;
                    } else {
                        player.burn(element);
                    }
                } else if (!player.FreeThrow && !player.ThrowCards && player.Turn) {
                    game.setGroundCard(pickedcard);
                    if (player.DrawCard.cardValue() == pickedcard.cardValue()) {
                        player.removeCard(element.getAttribute("index"));
                        if(player.cardsLeft() == 0){
                            await player.monke();
                            return;
                        }
                    } else {
                        pickedcard.Value = player.DrawCard.Value;
                        pickedcard.Suit = player.DrawCard.Suit;
                        element.setAttribute("src", Images["" + pickedcard.Value + pickedcard.Suit]);
                        //element.setAttribute("src", Images['backcard']);
                    }
                    player.removeDrawImage();
                    player.nothingToDo();
                    return;
                }else{
                    console.log("Its doing nothing.....................");
                }
            }
            return;
        }
    }

    this.getElement = function(classname, index) {
        var elements = document.getElementsByClassName(classname);
        for(var i=0; i < elements.length; i++) {
            if(parseInt(elements[i].getAttribute("index")) === index)
                return elements[i];
        }
        return null;
    }

    this.getImage = function(){
        console.log(game.Player1.Cards.length);
        for(var i=0; i<game.Player1.Cards.length; i++){
            game.getElement("image-player1", i).setAttribute("src", Images[''+game.Player1.Cards[i].Value+game.Player1.Cards[i].Suit]);
        }
        for(var i=0; i<game.Player2.Cards.length; i++){
            game.getElement("image-player2", i).setAttribute("src", Images[''+game.Player2.Cards[i].Value+game.Player2.Cards[i].Suit]);
        }
    }

 
}

let game = new Monke();
export default game;