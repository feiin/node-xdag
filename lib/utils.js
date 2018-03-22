var xdagUtils = {
    isAddress: function (address) {

        var base64Reg = /^[a-zA-Z0-9\/+]{32}$/;
        if (base64Reg.test(address)) {
            return true
        }
        return false
    }
}


module.exports = xdagUtils