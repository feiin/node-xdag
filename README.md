# node-xdag
node.js communicate with xdag (via unix_sock now)

[![Build Status](https://travis-ci.org/feiin/node-xdag.svg?branch=master)](https://travis-ci.org/feiin/feiin/node-xdag)



## Usage

```shell

> npm install node-xdag --save

```


```node.js

const XDag = require('node-xdag')
const xdag = new XDag({socketFile:'path/xdag/unix_sock.data'})
```

## Options

### socketFile
type: `string`

path of the xdag unix_sock.dat file

## API

 - [getBalance](#get_balance)
 - [getBlock](#get_block)
 - [getStats](#get_stats)

 ### <a id="get_balance">getBalance</a>

> get xdag balance

```javascript
xdag.getBalance("xdagAddress")
    .then((data) => {
        console.log(data.result);// balance
    })
    .catch((err) => {
        console.error(err);//err
    })
```

### <a id="get_block">getBlock</a>

>get the xdag block info

**result**
```json
{
    "account":"4f1Sp/UD55JX5+kQCevUCpyenaPwqmpC",
    "balance":"1024",
    "difficulty":"0000000013147562c",
    "hash":"d6ad0e0cf7b099ff426aaaf0a39d9e9c0ad4eb0910e9e75792e703f5a752fde1",
    "file pos":"7e00",
    "flags":"1c",
    "timestamp":"16a2c094123",
    "time":"2018-02-20",
    "transaction":[
        { "direction": "fee",
        "address":"OwFhTJbCdaj1ZqkJYPxrGDjGSvXlGrv7",
        "amount": "0.000000000" }
        
    ],
    "address":[
        { 
            "direction": "input",
            "address": "81a9+kgFbquw6GGKju/VkS7KiUWmOOxy",
            "amount": "0.003222176",
            "time": "2018-02-20 04:58:40.815"
        }
        
    ]

}
```
example

```javascript
xdag.getBlock('blockAddress')
    .then((data) => {
        console.log(data.result);//block info
    })
    .catch((err) => {
        console.error(err);
    })
```

 ### <a id="get_stats">getStats</a>

> get the xdag's stats

**result**

```json
{ "hosts": "320 of 320",
  "blocks": "14311273 of 14311295",
  "main blocks": "102117 of 102117",
  "orphan blocks": "1",
  "wait sync blocks": "28",
  "chain difficulty": "1d79edf0ecb4d2c0e71859df10 of  1d79edf0ecb4d2c0e71859df10",
  "XDAG supply": "104567808.000000000 of 104567808.000000000",
  "4 hr hashrate MHs": "0.00 of 6397628.62"
}
```

example

```javascript
xdag.getStats().then((data) => {
                console.log(data.result);
            }).catch((err) => {

            })

```


## Buiding

```shell
> git clone  git@github.com:feiin/node-xdag.git
> npm install
> npm test
```
