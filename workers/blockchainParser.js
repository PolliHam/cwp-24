const axios = require('axios');

class BlockchainParser {
    constructor(timer = 1000){
        this.timer = timer * 1000;
        this.data = {};
        this.parse();
    }

    setTimer(timer) {
        this.timer = timer * 1000;
    }

    getData(currency) {
        return this.data[currency];
    }

    async parse() {
        try {
            let response = await axios.get('https://blockchain.info/en/ticker');
            this.data = response.data;
            setTimeout(() => {
                this.parse();
            }, this.timer);
        }
        catch (e) {
            console.error(e);
        }
    }
}

module.exports = BlockchainParser;