const net = require('net');
const commands = require('./commands');
const util = require('util');

class XDag {

    constructor(socketFile) {
        if (!socketFile) {
            throw new Error('Invalid unix socket file');
        }
        this.socketFile = socketFile;
    }

    getBalance(address) {

        var cmd = util.format(commands.balanceCmd, address);

        return this.command(cmd).then((result) => {
            return result
        }).catch((err) => {
            return Promise.reject(err);
        });
    }
    command(cmd) {
        var promise = new Promise((resolve, reject) => {
            var socket = net.connect(this.socketFile);
            socket.on('error', (err) => {
                reject(err);
            });
            socket.on('connect', () => {
                
                socket.write(cmd);
            })

            socket.on('data', (data) => {
                socket.end();
                resolve(data.toString('utf-8'));
            });
        });
        return promise;
    }
}

module.exports = XDag;