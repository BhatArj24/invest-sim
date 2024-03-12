import Stock from './Stock.js';

class myStock extends Stock{
    constructor(name, ticker, price, shares) {
        super(name, ticker, price);
        this.shares = shares;
    }
}

export default myStock;

