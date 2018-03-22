
function parseAddress(line, block) {
    const reg = /\s*(fee|input|output|earning): ([a-zA-Z0-9\/+]{32})\s*([0-9]*\.[0-9]*)\s*(.*)/i;
    const match = reg.exec(line);
    if (match) {
        let [, direction, address, amount, time] = match;
        block.address.push({
            direction: direction,
            address: address,
            amount: amount,
            time: time
        })
    }
}

function parseBlock(line, block) {
    const reg = /\s*(.*): ([^\s]*)(\s*([0-9]*\.[0-9]*))?/i;
    const match = reg.exec(line);
    if (match) {
        let [, key, value, , value2] = match;

        if (key == 'balance' && value2) {
            block['balance'] = value2;
            block['account'] = value;
        } else {
            block[key] = value;
        }
    }
}

function parseTransaction(line, block) {
    const reg = /\s*(fee|input|output|earning): ([a-zA-Z0-9\/+]{32})\s*([0-9]*\.[0-9]*)/i;
    const match = reg.exec(line);
    if (match) {
        let [, direction, address, amount] = match;
        block.transaction.push({
            direction: direction,
            address: address,
            amount: amount
        });
    }

}


module.exports = { parseBlock, parseTransaction, parseAddress };