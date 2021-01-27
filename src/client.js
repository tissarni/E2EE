const crypto = require('crypto');
const { encrypt, decrypt } = require('./cryptographie');

class Client {
    
    constructor(id, name) {
        this.id = id,
        this.name = name,
        this.ecdh = crypto.createECDH('secp256k1')
        this.sended = []
        this.received = []
    }

    getId() {
        return this.id;
    }

    transmit(message, server, receiver) {
        switch (receiver.name) {
            case "bob": 
                if (this.name === "alice") {
                    const message1 = encrypt(message, this.sharedKey1);
                    server.bobMessages.push(message1);
                }
                if (this.name === "titou") {
                    const message1 = encrypt(message, this.sharedKey1);
                    server.bobMessages.push(message1);
                }
            break;
            case "alice":
                if (this.name === "bob") {
                    const message1 = encrypt(message, this.sharedKey1);
                    server.aliceMessages.push(message1);
                }
                if (this.name === "titou") {
                    const message1 = encrypt(message, this.sharedKey2);
                    server.aliceMessages.push(message1);
                }
            break;
            case "titou":
                if (this.name === "alice") {
                    const message1 = encrypt(message, this.sharedKey2);
                    server.titouMessages.push(message1);
                }
                if (this.name === "bob") {
                    const message1 = encrypt(message, this.sharedKey2);
                    server.titouMessages.push(message1);
                }
            break;
        }
    }

    send(message, server, client1, client2) {
        this.transmit(message, server, client1);
        this.transmit(message, server, client2);
    }

    receive(server, sender){
        switch (sender.name) {
            case "bob": 
                if (this.name === "alice") {
                    const message1 = decrypt(server.aliceMessages[0], this.sharedKey1);
                    this.received.push(message1);
                    
                }
                if (this.name === "titou") {
                    const message1 = decrypt(server.titouMessages[0], this.sharedKey2);
                    this.received.push(message1);
                }
            break;
            case "alice":
                if (this.name === "bob") {
                    const message1 = decrypt(server.bobMessages[0], this.sharedKey1);
                    this.received.push(message1);
                }
                if (this.name === "titou") {
                    const message1 = decrypt(server.titouMessages[0], this.sharedKey2);
                    this.received.push(message1);
                }
            break;
            case "titou":
                if (this.name === "alice") {
                    const message1 = decrypt(server.aliceMessages[0], this.sharedKey2);
                    this.received.push(message1);
                }
                if (this.name === "bob") {
                    const message1 = decrypt(server.bobMessages[0], this.sharedKey1);
                    this.received.push(message1);
                }
            break;
        }
    
    }

}


module.exports = {Client}

