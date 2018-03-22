const net = require('net');
const commands = require('./commands');
const util = require('util');
const xdagUtils = require('./utils');
const readline = require('readline');
const fs = require('fs');
const EventEmitter = require('events');
const { parseBlock, parseAddress, parseTransaction } = require('./block');

class XDag {

    constructor(options) {
        if (!options.socketFile) {
            throw new Error('Invalid unix socket file');
        }
        this.socketFile = options.socketFile;
    }

    getBalance(address) {

        if (!xdagUtils.isAddress(address)) {
            return Promise.reject(new Error('Invalid XDAG address!'))
        }

        var cmd = util.format(commands.balanceCmd, address);

        return this.command(cmd).then((result) => {
            var values = result.split(' ');
            return { result: values[1] };
        });
    }

    getBlock(address) {
        var that = this;
        if (!xdagUtils.isAddress(address)) {
            return Promise.reject(new Error('Invalid block address!'))
        }
        const cmd = util.format(commands.blockCmd, address);
        var p = new Promise((resolve, reject) => {
            var block = {
                address: [], //block as address: details
                transaction: [] //Block as transaction: details
            };

            var currentPart = '';
            that.readlineCommand(cmd)
                .on('error', (err) => {
                    reject(err)
                })
                .on('line', (line) => {
                    const notFoundReg = /Block is not found/i;
                    const transactionReg = /Block as transaction: details/i;
                    const addressReg = /block as address: details/i;

                    if (currentPart == '') {
                        if (notFoundReg.test(line)) {
                            const err = new Error('Block is not found');
                            reject(err);
                            return;
                        }
                    }
                    
                    // Block as transaction
                    if (currentPart != 'transaction' && transactionReg.exec(line)) {
                        currentPart = 'transaction';
                        return;
                    }

                    // block as address
                    if (currentPart != 'address' && addressReg.exec(line)) {
                        currentPart = 'address';
                        return;
                    }

                    switch (currentPart) {
                        case 'transaction':
                            parseTransaction(line, block);
                            break;
                        case 'address':
                            parseAddress(line, block);
                            break;
                        default:
                            parseBlock(line, block);
                            break;
                    }

                })
                .on('finish', () => {
                    resolve(block);
                });
        })

        return p;
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


    readlineCommand(cmd) {

        var eventEmitter = new EventEmitter();
        var socket = net.connect(this.socketFile);
        var rl = readline.createInterface({
            input: socket
        });

        rl.on('line', (line) => {
            eventEmitter.emit('line', line);
        });
        rl.on('close', () => {
            eventEmitter.emit('finish');
        });


        socket.on('connect', () => {
            socket.write(cmd);
        });
        socket.on('finish', () => {
            socket.end();
            rl.close();
        });


        socket.on('error', (err) => {
            console.log('error', err);
            eventEmitter.emit('error', err);
        });

        return eventEmitter;
    }
}

module.exports = XDag;