function Card(value, suit, viewed, index) {

    this.Value = value;
    this.Suit = suit;
    this.Viewed = viewed;
    this.Index = index;
    this.Locked = false;


    this.isActive = function () {
        if (this.Value === 0)
            return false;
        return true;
    }

    this.deActivate = function () {
        this.Value = 0;
    }

    this.isBurned = function () {
        if (this.Locked === true)
            return true;
        return false;
    }

    this.burnCard = function () {
        this.Locked = true;
    }

    this.cardValue = function () {
        switch (this.Value) {
            case 'J':
                return 11;
            case 'Q':
                return 12;
            case 'K':
                return 13;
            case 'A':
                return 1;
            default:
                return parseInt(this.Value);
        }
    }
}


export default Card;