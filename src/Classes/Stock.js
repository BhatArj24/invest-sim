class Stock {
    constructor(name, ticker, price, change = 0, changePercent = 0) {
        this.name = name;
        this.ticker = ticker;
        this.price = price;
        this.change = change;
        this.changePercent = changePercent;
    }
}

export default Stock;
