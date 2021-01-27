const {newSharedKey} = require('./cryptographie');
class Server {

    
    constructor() {
        this.bobMessages = [],
        this.aliceMessages = [],
        this.titouMessages = [],
        this.member = [],
        this.publicKey = []
        
    }

    addMember(client) {
        this.member.push(client);
    }

    send(sender, receiver1, receiver2){
        receiver1.receive(this, sender);
        receiver2.receive(this.sender)
    }
}


module.exports = {Server}