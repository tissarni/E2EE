const {newSharedKey} = require('./cryptographie');
class Server {

    
    constructor() {
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

    httpSend(action, body){

        if(action === "message:send"){
            this.socketSend(null, body);
            return "ok, http sent";
            //Some code that represent sending a message to the server
        }

    }

    socketClients = [];

    socketConnect(client, callback){
        this.socketDisconnect(client);
        this.socketClients.push({client: client, callback: callback});
    }

    socketDisconnect(client){
        this.socketClients = this.socketClients.filter((c)=>c.client !== client);
    }

    socketSend(client, body){
        if(!client || this.socketClients.filter((c)=>c.client === client).length > 0){
            this.socketClients.forEach((c)=>{
                c.callback(body);
            });
        }
    }

    
}


module.exports = {Server}