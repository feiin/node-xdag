const should = require('should');
const XDag = require('../lib/xdag');

describe('xdag.js', () => {

    var xdag = null;
    const socketFile = '/data/xdag/client/unix_sock.dat';
    before((done) => {
        xdag = new XDag(socketFile);
        done();
    })

    describe('#getBalance', () => {

        it('should be getbalance success', (done) => {
            xdag.command('balance 4f1Sp/UD55JX5+kQCevUCpyenaPwqmpC\0').then((result) => {
                console.log(result);
                done();
            }).catch((err) => {
                done(err);
            })
        })
    })

    after((done) => {
        done();
    });
})