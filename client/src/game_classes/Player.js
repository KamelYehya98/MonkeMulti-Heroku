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
        this.BlockAction = false;
        // this.NbCardsView = 2;
        console.log("NEW PLAYER HAS BEEN CREATED.............................");


    }

}
// didViewCards () {
//     return (this.ViewdCards >= this.NbCardsView);
// };

export default Player;
