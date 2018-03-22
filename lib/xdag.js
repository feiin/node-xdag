const net = require('net');
const commands = require('./commands');
const util = require('util');
const xdagUtils = require('./utils');
const readline = require('readline');
const fs = require('fs');
const EventEmitter = require('events');
const { PassThrough } = require('stream');

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

            that.readlineCommand(cmd)
                .on('error', (err) => {
                    reject(err)
                })
                .on('line', (line) => {

                })
                .on('finish', () => {
                    resolve('ok');
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