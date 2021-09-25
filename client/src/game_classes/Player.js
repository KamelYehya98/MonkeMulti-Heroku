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
        this.BlockAction = false;

        this.NbCardsView = 2;
        this.ViewedCards = 0;
        console.log("NEW PLAYER HAS BEEN CREATED.............................");
    }
}

export default Player;
