import React from 'react';
import Images from '../game_classes/Images';
//import './css/Game.css';
import './css/Tutorial.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import monkeAudio from '../audio/MONKE.mp3';

const HowToPlay = () => {
    let instructionNumber = 0;
    const instructions = ["<h1>Welcome To Monke!</h1><p>In this tutorial you will learn to play this wonderful game. Strap in and pay close attention...</p>",
                        "<p>Each player starts with 4 cards. The aim of this game is to finish with a lower score than your opponent or to get rid of all your cards.</p>",
                        "<p>The score is calculated as follows: Ace counts for 1 point, Jack counts for 11, Queen for 12 and King for 13 while the rest of the cards' scores are equivalent to their numbers (2 for 2, 3 for 3, etc.) The total score is the sum of your individual cards.</p>",
                        "<p>Each match is at most 5 rounds, and each round is composed of a set of turns. The first to win 3 rounds wins the match.</p>",
                        "<p>At the beginning of a match, you get to reveal two of your cards. If you had lost the previous round you only get to reveal 1; if you won, you get to reveal 3; and after a draw you can reveal 2. Memorize them carefully since this is the only chance to reveal your cards.</p>",
                        "<p>Now we can start with the actual game. <span>Shall we?</span></p>",
                        "<p>First off, let's reveal our cards. Considering this is the start of a match, you can reveal two cards. <span>Click on the highlighted cards to reveal them.</span></p>",
                        "<p>You have revealed cards 2 and 9, so your total amounts for a minimum of 12 plus the sum of the two unrevealed cards.</p>",
                        "<p>After the reveal, a card is drawn from the deck. Replacing one of your unknown cards with this one is a good strategy. You can do that by <span>clicking on an unknown card.</span></p>",
                        "<p>The unknown card you previously had has been thrown to the ground. You must now end your turn by <span>clicking the END TURN button</span>, so your opponent can play.</p>",
                        "<p>It is now your opponent's turn, and he has thrown the 9 card on the ground. Since you have a matching card, you can throw it on the ground. <span>Click FREE THROW then click on your card</span> to do that.</p><p><span>Reminder:</span> always remember what cards you have and where they are place in your hand.</p>",
                        "<p>Now your total has been reduced by 9. The free throw action can be done on your opponent's turn as well as on yours. Also free throwing the wrong card will cause it to be locked preventing you from replacing it and discarding it.</p><p><span>Reminder:</span> To win you must have a lower score than your opponent.</p>",
                        "<p>Your opponent has ended his turn, and now it's your turn to play. You have drawn a 6 or what we call a special card! Drawing a 6 allows you to reveal a card in your hand. <span>Click on ACTIVATE SPECIAL then on the last unrevealed card</span> to reveal it.</p>",
                        "<p>The other special cards are 7 which allows you to swap one card with your opponent and 8 which reveals one of your opponent's cards. However, you can still play these cards as regular ones.</p>",
                        "<p>You now have 2, 4 and an Ace for a combined total of 7. <span>Click 'End Turn'</span> to end your turn.</p>",
                        "<p>After your opponent ended his turn, you have drawn a King card from your deck, you can throw your King card by <span>clicking on the ground card.</span> Throwing this card is advisable since all your cards have a lower value and swapping this with one of them will increase your score.</p>",
                        "<p>You can now <span>end your turn</span> again.</p>",
                        "<p>Your opponent has played his turn, and you have drawn a 4, a card which you already have. <span>Click on THROW CARD then on the 4 card</span> in your hand to throw it to the ground. This will allow you to draw another card and play again. The second card you draw has a higher value than the cards in your hand, so you can discard it by clicking on the ground card.</p>",
                        "<p>You can continue playing, but since you probably have a lower score than your opponent, you can <span>click MONKE</span> which will allow your opponent one more turn before this round ends.</p>",
                        "<p>At the end of the round all the cards are revealed, and the one with a lower score wins.</p>",
                        "<center><h1>Congrats!</h1></center><p>You've finished your tutorial and won your first game! You are now ready to <a href='/welcome'>challenge your friends in a fun and competitive game of MONKE!</a></p>"
                    ];
    function setValues(){
        document.getElementById("tutorialText").innerHTML = instructions[instructionNumber];
    }

    function revealCard(index, card){
        let clickedCard = document.getElementById("card"+(index+1));
        clickedCard.setAttribute("src", Images[""+card]);
        clickedCard.classList.add("flip-image");

        setTimeout(()=>{clickedCard.classList.remove("flip-image");

            clickedCard.setAttribute("src", Images["backcard"]);
            clickedCard.classList.add("unflip-image");   
            setTimeout(()=>{
                clickedCard.classList.remove("unflip-image");
                clickedCard.classList.add("opaque");
            }, 2000);
        
        }, 2000);
    }

    function revealAll(){

        document.getElementById('card1').setAttribute("src", Images["2C"]);
        document.getElementById('card4').setAttribute("src", Images["AS"]);

        document.getElementById('cards-container-player2').childNodes[0].childNodes[0].setAttribute("src", Images["3H"]);
        document.getElementById('cards-container-player2').childNodes[1].childNodes[0].setAttribute("src", Images["JS"]);
        document.getElementById('cards-container-player2').childNodes[2].childNodes[0].setAttribute("src", Images["8C"]);
        document.getElementById('cards-container-player2').childNodes[3].childNodes[0].setAttribute("src", Images["5C"]);

    }

    function unrevealAll(){

        document.getElementById('card1').setAttribute("src", Images["backcard"]);
        document.getElementById('card4').setAttribute("src", Images["backcard"]);

        document.getElementById('cards-container-player2').childNodes[0].childNodes[0].setAttribute("src", Images["backcard"]);
        document.getElementById('cards-container-player2').childNodes[1].childNodes[0].setAttribute("src", Images["backcard"]);
        document.getElementById('cards-container-player2').childNodes[2].childNodes[0].setAttribute("src", Images["backcard"]);
        document.getElementById('cards-container-player2').childNodes[3].childNodes[0].setAttribute("src", Images["backcard"]);

    }

    function reveal1(){
        revealCard(0, "2C");
        document.getElementById("card1").removeEventListener("click", reveal1);
    }

    function reveal2(){
        revealCard(1, "9D");
        document.getElementById("card2").removeEventListener("click", reveal2);
    }

    function replaceCard(){
        document.getElementById("groundcard").setAttribute("src", Images['KD']);
        document.getElementById("ground-container").classList.remove("opaque");
        nextInstruction();
    }

    function freeThrowFunctionThatLetsYouClickOnCard(){
        document.getElementById("card2").classList.remove("opaque");
        document.getElementById("freethrowplayer1").classList.add("opaque");
        document.getElementById("freethrowplayer1").removeEventListener("click", freeThrowFunctionThatLetsYouClickOnCard);
    }

    function freeThrowWhenYouClickOnCard(){
        document.getElementById("card2").parentNode.classList.add("d-none");
        document.getElementById("groundcard").setAttribute("src", Images["9D"]);
        nextInstruction();
        document.getElementById("card2").removeEventListener('click', freeThrowWhenYouClickOnCard);
    }

    function activateSpecialFunctionThatLetsYouClickOnCard(){
        document.getElementById("card4").classList.remove("opaque");
        document.getElementById("card4").addEventListener("click", reveal3);
        document.getElementById("specialplayer1").removeEventListener("click", activateSpecialFunctionThatLetsYouClickOnCard);
    }

    function reveal3(){
        revealCard(3,"AS");
        nextInstruction();
    }

    function card3Throw(){
        document.getElementById("ground-container").classList.remove("opaque");
        document.getElementById("player1pick").setAttribute("src", Images["QH"]);
        document.getElementById("groundcard").setAttribute("src", Images["4S"]);
        document.getElementById("card3").parentNode.classList.add("d-none");
    }

    function throwCardFunctionThatLetsYouClickOnCard(){
        document.getElementById("card3").classList.remove("opaque");
        document.getElementById("card3").addEventListener("click", card3Throw);
        document.getElementById("throwcardplayer1").classList.add("opaque");
        document.getElementById("throwcardplayer1").removeEventListener("click", throwCardFunctionThatLetsYouClickOnCard);
    }

    function monkeCall(){
        setTimeout(()=>{
            nextInstruction();
        }, 1000);
        
        document.getElementById("monkeplayer1").removeEventListener("click", monkeCall);
    }

    function nextInstruction(){
        instructionNumber++;

        switch (instructionNumber){             
            case 1:
                document.getElementById("previous-instruction").style.display = "unset";
                break;
            case 6:
                document.querySelector(".tutorial").style.transform = "translate(40%, -50%)";
                document.querySelector(".tutorial").style.fontSize = "1.125rem";
                document.querySelector(".tutorial").style.width = "40%";
                document.querySelector(".tutorial").style.padding = "3em";
                document.getElementById("card1").classList.remove("opaque");
                document.getElementById("card2").classList.remove("opaque");
                document.getElementById("card1").addEventListener("click", reveal1);
                document.getElementById("card2").addEventListener("click", reveal2);
                break;
            case 7:
                document.querySelector(".tutorial").style.transform = "translate(0, -20%)";
                document.getElementById("card1").classList.add("opaque");
                document.getElementById("card2").classList.add("opaque");
                break;
            case 8:
                document.querySelector(".tutorial").style.transform = "translate(0, -60%)";
                document.getElementById("card3").classList.remove("opaque");
                document.getElementById("player1pick").setAttribute("src", Images["4S"]);
                document.getElementById("card3").addEventListener("click", replaceCard);
                break;
            case 9:
                document.getElementById("card3").removeEventListener("click", replaceCard);
                document.querySelector(".tutorial").style.transform = "translate(35%, -50%)";
                document.getElementById("card3").classList.add("opaque");
                document.getElementById("player1pick").setAttribute("src", Images['transparent']);
                document.getElementById("ground-container").classList.remove("opaque");
                document.getElementById("groundcard").setAttribute("src", Images['KD']);
                document.getElementById("endturnplayer1").classList.remove("opaque");
                document.getElementById("endturnplayer1").addEventListener('click', nextInstruction);
                break;
            case 10:
                document.querySelector(".tutorial").style.transform = "translate(60%, -40%)";
                document.getElementById("endturnplayer1").classList.add("opaque");
                document.getElementById("player2pick").setAttribute("src", Images["backcard"]);
                document.getElementById("next-instruction").classList.add("opaque");
                document.getElementById("previous-instruction").classList.add("opaque");
                setTimeout(()=>{
                    document.getElementById("next-instruction").classList.remove("opaque");
                    document.getElementById("previous-instruction").classList.remove("opaque");
                    document.getElementById("player2pick").setAttribute("src", Images["transparent"]);
                    document.getElementById("groundcard").setAttribute("src", Images["9C"]);
                    document.getElementById("freethrowplayer1").classList.remove("opaque");
                    document.getElementById("freethrowplayer1").addEventListener("click", freeThrowFunctionThatLetsYouClickOnCard);
                    document.getElementById("card2").addEventListener('click', freeThrowWhenYouClickOnCard);
                }, 3000);
                break;
            case 11:
                if(!document.getElementById("freethrowplayer1").classList.contains("opaque"))
                    document.getElementById("freethrowplayer1").classList.add("opaque");
                document.getElementById("groundcard").setAttribute("src", Images["9D"]);
                if(document.getElementById("card2").style.display != "none")
                    document.getElementById("card2").parentNode.classList.add("d-none");
                break;
            case 12:
                document.querySelector(".tutorial").style.transform = "translate(60%, -50%)";
                document.getElementById("ground-container").classList.add("opaque");
                document.getElementById("specialplayer1").classList.remove("opaque");
                document.getElementById("player1pick").setAttribute("src", Images["6C"]);
                document.getElementById("specialplayer1").addEventListener("click", activateSpecialFunctionThatLetsYouClickOnCard);
                break;
            case 13:
                document.getElementById("specialplayer1").classList.add("opaque");
                document.getElementById("card4").classList.add("opaque");
                document.getElementById("groundcard").setAttribute("src", Images["6C"]);
                document.getElementById("player1pick").setAttribute("src", Images["transparent"]);
                break;
            case 14:
                document.querySelector(".tutorial").style.transform = "translate(0%, -40%)";
                document.getElementById("endturnplayer1").classList.remove("opaque");
                break;
            case 15:
                document.querySelector(".tutorial").style.transform = "translate(60%, -50%)";
                document.getElementById("endturnplayer1").classList.add("opaque");
                document.getElementById("player2pick").setAttribute("src", Images["backcard"]);
                document.getElementById("next-instruction").classList.add("opaque");
                document.getElementById("previous-instruction").classList.add("opaque");
                setTimeout(()=>{
                    document.getElementById("next-instruction").classList.remove("opaque");
                    document.getElementById("previous-instruction").classList.remove("opaque");
                    document.getElementById("player2pick").setAttribute("src", Images["transparent"]);
                    document.getElementById("groundcard").setAttribute("src", Images["QS"]);
                    document.getElementById("ground-container").classList.remove("opaque");
                    document.getElementById("player1pick").setAttribute("src", Images["KH"]);
                    document.getElementById("ground-container").addEventListener("click", nextInstruction)
                }, 3000);
                break;
            case 16:
                document.getElementById("player1pick").setAttribute("src", Images["transparent"]);
                document.getElementById("ground-container").classList.remove("opaque");
                document.getElementById("groundcard").setAttribute("src", Images["KH"]);
                document.getElementById("endturnplayer1").classList.remove("opaque");
                break;
            case 17:
                document.getElementById("ground-container").classList.add("opaque");
                document.getElementById("endturnplayer1").classList.add("opaque");
                document.getElementById("player2pick").setAttribute("src", Images["backcard"]);
                document.getElementById("next-instruction").classList.add("opaque");
                document.getElementById("previous-instruction").classList.add("opaque");
                setTimeout(()=>{
                    document.getElementById("next-instruction").classList.remove("opaque");
                    document.getElementById("previous-instruction").classList.remove("opaque");
                    document.getElementById("player2pick").setAttribute("src", Images["transparent"]);
                    document.getElementById("groundcard").setAttribute("src", Images["QD"]);
                    document.getElementById("throwcardplayer1").classList.remove("opaque");
                    document.getElementById("player1pick").setAttribute("src", Images["4H"]);
                    document.getElementById("throwcardplayer1").addEventListener("click", throwCardFunctionThatLetsYouClickOnCard);
                }, 3000);
                break;
            case 18:
                document.getElementById("card3").removeEventListener("click", card3Throw);
                if(document.getElementById("card3").style.display != "none")
                    document.getElementById("card3").parentNode.classList.add("d-none");
                if(!document.getElementById("throwcardplayer1").classList.contains("opaque"))
                    document.getElementById("throwcardplayer1").classList.add("opaque");
                document.getElementById("player1pick").setAttribute("src", Images["transparent"]);
                document.getElementById("groundcard").setAttribute("src", Images["QH"]);
                document.getElementById("monkeplayer1").classList.remove("opaque");
                document.getElementById("monkeplayer1").addEventListener("click", monkeCall);
                break;
            case 19:
                document.getElementById("card3").removeEventListener("click", card3Throw);
                document.getElementById("monkeydivtutorial").classList.remove("disableformonkey");
                document.getElementById("monkeAudio").play();
                document.getElementById("player2pick").setAttribute("src", Images["backcard"]);
                document.getElementById("next-instruction").classList.add("opaque");
                document.getElementById("previous-instruction").classList.add("opaque");
                setTimeout(()=>{
                    document.getElementById("next-instruction").classList.remove("opaque");
                    document.getElementById("previous-instruction").classList.remove("opaque");
                document.getElementById("player2pick").setAttribute("src", Images["transparent"]);
                    document.getElementById("monkeydivtutorial").classList.add("disableformonkey");
                    document.getElementById("monkeplayer1").classList.add("opaque");
                    document.getElementById("card1").classList.remove("opaque");
                    document.getElementById("card4").classList.remove("opaque");
                    document.getElementById("player2Stuff").classList.remove("opaque");
                    document.getElementById("groundcard").setAttribute("src", Images["QC"]);
                    document.getElementById("next-instruction").innerHTML = "Finish";

                    revealAll();
                }, 3000)
                break;
            case 20:
                document.getElementById("card1").classList.add("opaque");
                document.getElementById("card4").classList.add("opaque");
                document.getElementById("player2Stuff").classList.add("opaque");
                document.querySelector(".tutorial-buttons").classList.add("d-none");
                document.querySelector(".tutorial").style.transform = "translate(0%, -20%)";
                document.querySelector(".tutorial").style.fontSize = "1.375rem";
                document.querySelector(".tutorial").style.width = "50%";
                document.querySelector(".tutorial").style.padding = "4rem";
            default:
                break;
        }
        setValues();
    }

    function prevInstruction(){
        instructionNumber--;
        switch (instructionNumber){
            case 0:
                document.getElementById("previous-instruction").style.display = "none";
                break;
            case 5:
                document.querySelector(".tutorial").style.transform = "translate(0%, -20%)";
                document.querySelector(".tutorial").style.fontSize = "1.375rem";
                document.querySelector(".tutorial").style.width = "50%";
                document.querySelector(".tutorial").style.padding = "4rem";
                document.getElementById("card1").classList.add("opaque");
                document.getElementById("card2").classList.add("opaque");
                break;
            case 6:
                document.querySelector(".tutorial").style.transform = "translate(40%, -50%)";
                document.getElementById("card1").classList.remove("opaque");
                document.getElementById("card2").classList.remove("opaque");
                document.getElementById("card1").addEventListener("click", reveal1);
                document.getElementById("card2").addEventListener("click", reveal2);
                break;
            case 7:
                document.querySelector(".tutorial").style.transform = "translate(0, -20%)";
                document.getElementById("card3").classList.add("opaque");
                document.getElementById("player1pick").setAttribute("src", Images["transparent"]);
                break;
            case 8:
                document.querySelector(".tutorial").style.transform = "translate(0, -60%)";
                document.getElementById("ground-container").classList.remove("opaque");
                document.getElementById("groundcard").setAttribute("src", Images['transparent']);
                document.getElementById("endturnplayer1").classList.add("opaque");
                document.getElementById("card3").classList.remove("opaque");
                document.getElementById("card3").addEventListener("click", replaceCard);
                document.getElementById("player1pick").setAttribute("src", Images["4S"]);
                break;
            case 9:
                document.querySelector(".tutorial").style.transform = "translate(35%, -50%)";
                document.getElementById("endturnplayer1").classList.remove("opaque");
                document.getElementById("endturnplayer1").addEventListener('click', nextInstruction);
                document.getElementById("groundcard").setAttribute("src", Images['KD']);
                if(!document.getElementById("freethrowplayer1").classList.contains("opaque"))
                    document.getElementById("freethrowplayer1").classList.add("opaque");
                break;
            case 10:
                document.getElementById("groundcard").setAttribute("src", Images['KD']);
                if(document.getElementById("card2").parentNode.classList.contains("d-none"))
                    document.getElementById("card2").parentNode.classList.remove("d-none");
                document.getElementById("player2pick").setAttribute("src", Images["backcard"]);
                document.getElementById("next-instruction").classList.add("opaque");
                document.getElementById("previous-instruction").classList.add("opaque");
                setTimeout(()=>{
                    document.getElementById("next-instruction").classList.remove("opaque");
                    document.getElementById("previous-instruction").classList.remove("opaque");
                    document.getElementById("ground-container").classList.remove("opaque");
                    document.getElementById("player2pick").setAttribute("src", Images["transparent"]);
                    document.getElementById("groundcard").setAttribute("src", Images["9C"]);
                    document.getElementById("freethrowplayer1").classList.remove("opaque");
                    document.getElementById("freethrowplayer1").addEventListener("click", freeThrowFunctionThatLetsYouClickOnCard);
                    document.getElementById("card2").addEventListener('click', freeThrowWhenYouClickOnCard);
                }, 3000);
                break;
            case 11:
                document.querySelector(".tutorial").style.transform = "translate(60%, -40%)";
                document.getElementById("specialplayer1").classList.add("opaque");
                document.getElementById("player1pick").setAttribute("src", Images["trnasparent"]);
                break;
            case 12:
                document.querySelector(".tutorial").style.transform = "translate(60%, -50%)";
                document.getElementById("specialplayer1").classList.remove("opaque");
                document.getElementById("groundcard").setAttribute("src", Images["9D"]);
                document.getElementById("player1pick").setAttribute("src", Images["6C"]);
                document.getElementById("specialplayer1").addEventListener("click", activateSpecialFunctionThatLetsYouClickOnCard);
                break;
            case 13:
                document.getElementById("endturnplayer1").classList.add("opaque");
                document.getElementById("groundcard").setAttribute("src", Images["6C"]);
                break;
            case 14:
                document.querySelector(".tutorial").style.transform = "translate(0%, -40%)";
                if(!document.getElementById("throwcardplayer1").classList.contains("opaque"))
                    document.getElementById("throwcardplayer1").classList.add("opaque");
                document.getElementById("ground-container").classList.add("opaque");
                document.getElementById("endturnplayer1").classList.remove("opaque");
                document.getElementById("groundcard").setAttribute("src", Images["6C"]);
                document.getElementById("player1pick").setAttribute("src", Images["transparent"]);
                break;
            case 15:
                document.querySelector(".tutorial").style.transform = "translate(60%, -50%)";
                document.getElementById("groundcard").setAttribute("src", Images["6C"]);
                document.getElementById("endturnplayer1").classList.add("opaque");
                document.getElementById("player2pick").setAttribute("src", Images["backcard"]);
                document.getElementById("next-instruction").classList.add("opaque");
                document.getElementById("previous-instruction").classList.add("opaque");
                setTimeout(()=>{
                    document.getElementById("next-instruction").classList.remove("opaque");
                    document.getElementById("previous-instruction").classList.remove("opaque");
                    document.getElementById("player2pick").setAttribute("src", Images["transparent"]);
                    document.getElementById("groundcard").setAttribute("src", Images["QS"]);
                    document.getElementById("ground-container").classList.remove("opaque");
                    document.getElementById("player1pick").setAttribute("src", Images["KH"]);
                    document.getElementById("ground-container").addEventListener("click", nextInstruction)
                }, 3000);
                break;
            case 16:
                document.getElementById("groundcard").setAttribute("src", Images["KH"]);
                document.getElementById("endturnplayer1").classList.remove("opaque");
                document.getElementById("player1pick").setAttribute("src", Images["transparent"]);
                if(!document.getElementById("throwcardplayer1").classList.contains("opaque"))
                    document.getElementById("throwcardplayer1").classList.add("opaque");
                break;
            case 17:
                document.getElementById("groundcard").setAttribute("src", Images["KH"]);
                document.getElementById("card3").parentNode.classList.remove("d-none");
                document.getElementById("monkeplayer1").classList.add("opaque");
                document.getElementById("player2pick").setAttribute("src", Images["backcard"]);
                document.getElementById("next-instruction").classList.add("opaque");
                document.getElementById("previous-instruction").classList.add("opaque");
                setTimeout(()=>{
                    document.getElementById("next-instruction").classList.remove("opaque");
                    document.getElementById("previous-instruction").classList.remove("opaque");
                    document.getElementById("player2pick").setAttribute("src", Images["transparent"]);
                    document.getElementById("groundcard").setAttribute("src", Images["QD"]);
                    document.getElementById("throwcardplayer1").classList.remove("opaque");
                    document.getElementById("player1pick").setAttribute("src", Images["4H"]);
                    document.getElementById("throwcardplayer1").addEventListener("click", throwCardFunctionThatLetsYouClickOnCard);
                }, 3000);
                break;
            case 18:
                document.getElementById("card1").classList.add("opaque");
                document.getElementById("card4").classList.add("opaque");
                document.getElementById("ground-container").classList.add("opaque");
                document.getElementById("player2Stuff").classList.add("opaque");
                document.getElementById("monkeplayer1").classList.remove("opaque");
                document.getElementById("monkeplayer1").addEventListener("click", monkeCall);
                document.getElementById("next-instruction").innerHTML = "Next >";
                document.getElementById("groundcard").setAttribute("src", Images["QH"]);
                unrevealAll();
                break;
            default:
                break;
        }
        setValues();
    }

    return (
        <div className="d-flex justify-content-center align-items-center">
        <audio id="monkeAudio" src={monkeAudio}></audio>
        <div className="tutorial">
        <div id="tutorialText" className="w-100">
            <h1>Welcome To Monke!</h1>
            <p>In this tutorial you will learn to play this wonderful game. Strap in and pay close attention...</p>
        </div>
        <div className="tutorial-buttons w-100">
            <button id="previous-instruction" onClick={prevInstruction}>&lt; Previous</button>
            <button id="next-instruction" onClick={nextInstruction}>Next &gt;</button>
        </div>
        </div>
        <div className="d-flex justify-content-center align-items-center w-100" id="themaincontainertutorial">
            <div className="container w-100">  
                <div className="row d-md-flex flex-md-row justify-content-md-between flex-md-nowrap d-flex flex-column align-content-around opaque" id="player2Stuff">
                    <div className="col-md-6 col-12 col-sm-12 d-flex justify-content-end justify-content-md-between m-0 p-0 order-md-1" id="assets-container-player2">
                        <div className="col-md-3 col-3 m-2 p-0 order-md-3">
                            <img alt="" src={Images["transparent"]} className="img-fluid" id="player2pick" />
                        </div>
                        <div className="col-md-5 col-3 m-2 p-0 d-none order-md-2" id="specialdivplayer2">
                            <p className="text-center text-light" id="specialtextplayer2"></p>
                            <img alt="" src="" className="img-fluid" id="specialimgplayer2" />
                        </div>
                        <div className="col-md-3 col-4 d-none m-1 p-0 order-md-2" id="player2buttons">
                            <button className="btn mt-2 btn-sm throw-card-button" id="throwcardplayer2" >THROW CARD</button>
                            <button className="btn mt-2 btn-sm free-throw-button" id="freethrowplayer2" >FREE THROW</button>
                            <button className="btn mt-2 btn-sm monkey-button" id="monkeplayer2" >MONKE</button>
                            <button className="btn mt-2 btn-sm end-turn-button" id="endturnplayer2" >END TURN</button>
                            <button className="btn mt-2 btn-sm activate-special-button" id="specialplayer2" >ACTIVATE SPECIAL</button>
                        </div>
                        <div className="order-md-0 vertical-line rounded"></div>
                    </div>
                    <div className="col-md-6 d-flex flex-row justify-content-around col-12 m-md-1 m-2 p-0 order-md-0 gap-1" id="cards-container-player2">
                        <div className="col-md-3 col-2 d-flex justify-content-center flex-column">
                            <img alt="" src={Images['backcard']} className="img-fluid image-player2" index="0" player="2" />
                        </div>
                        <div className="col-md-3 col-2 d-flex justify-content-center flex-column">
                            <img alt="" src={Images['backcard']} className="img-fluid image-player2" index="1" player="2" />
                        </div>
                        <div className="col-md-3 col-2 d-flex justify-content-center flex-column">
                            <img alt="" src={Images['backcard']} className="img-fluid image-player2" index="2" player="2" />
                        </div>
                        <div className="col-md-3 col-2 d-flex justify-content-center flex-column">
                            <img alt="" src={Images['backcard']} className="img-fluid image-player2" index="3" player="2" />
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 opaque" id="ground-container">
                        <div className="d-flex justify-content-around flex-row col-md-2 offset-md-2 addopacitymonkey">
                            <div className="col-3 col-md-9 m-1 d-flex justify-content-center flex-row adddisablemonkey">
                                <img alt="" src={Images['transparent']} className="img-fluid" id="groundcard"  />
                            </div>
                        </div>
                        <div className="d-flex justify-content-center flex-row col-12" id="monkeyparentdiv">
                            <div id="monkeydivtutorial" className="m-0 p-0 disableformonkey">
                                <span id="monkeyspan1">MON</span>
                                <span id="monkeyspan2">KE</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row d-md-flex flex-md-row justify-content-md-between flex-md-nowrap d-flex flex-column align-content-around addopacitymonkey">
                    <div className="col-md-6 d-flex flex-row justify-content-around col-12 m-1 p-0 order-md-0 gap-1" id="cards-container-player1">
                        <div className="col-md-3 col-2 d-flex justify-content-center flex-column image">
                            <img alt="" src={Images['backcard']} className="img-fluid image-player1 opaque" id="card1" index="0" player="1" />
                        </div>
                        <div className="col-md-3 col-2 d-flex justify-content-center flex-column image">
                            <img alt="" src={Images['backcard']} className="img-fluid image-player1 opaque" id="card2" index="1" player="1" />
                        </div>
                        <div className="col-md-3 col-2 d-flex justify-content-center flex-column image">
                            <img alt="" src={Images['backcard']} className="img-fluid image-player1 opaque" id="card3" index="2" player="1" />
                        </div>
                        <div className="col-md-3 col-2 d-flex justify-content-center flex-column image">
                            <img alt="" src={Images['backcard']} className="img-fluid image-player1 opaque" id="card4" index="3" player="1" />
                        </div>
                    </div>
                    <div className="col-md-6 col-12 col-sm-12 d-flex justify-content-start justify-content-md-start order-md-1 m-1 p-0" id="assets-container-player1">
                        <div className="col-md-3 col-4 d-flex flex-column justify-content-center m-1 p-0 order-md-2" id="player1buttons">
                            <button className="btn mt-2 btn-sm throw-card-button opaque" id="throwcardplayer1" >THROW CARD</button>
                            <button className="btn mt-2 btn-sm free-throw-button opaque" id="freethrowplayer1" >FREE THROW</button>
                            <button className="btn mt-2 btn-sm monkey-button opaque" id="monkeplayer1" >MONKE</button>
                            <button className="btn mt-2 btn-sm end-turn-button opaque" id="endturnplayer1" >END TURN</button>
                            <button className="btn mt-2 btn-sm activate-special-button opaque" id="specialplayer1" >ACTIVATE SPECIAL</button>
                        </div>
                        <div className="col-md-5 col-3 m-2 p-0 d-flex align-items-center order-md-1" id="specialdivplayer1">
                            <p className="text-center fw-bold text-white" id="specialtextplayer1"></p>
                            <img alt="" src="" className="img-fluid" id="specialimgplayer1" />
                        </div>
                        <div className="col-md-3 col-3 m-2 p-0 d-flex align-items-center order-md-3">
                            <img alt="" src={Images['transparent']} className="img-fluid" id="player1pick" />
                        </div>
                        <div className="order-md-0 vertical-line rounded"></div>
                    </div>
                </div>

            </div>
        </div>
        </div>
    )
}

export default HowToPlay;