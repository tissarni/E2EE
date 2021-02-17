const crypto = require("crypto");
const { encrypt, decrypt, createLink } = require("../utils/cryptographie");

class Client {
  constructor(server, name) {
    this.server = server;
    this.name = name;
    this.messages = [];
    this.ecdh = crypto.createECDH("secp256k1");
    this.keys = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
    });
  }

  openChannel() {
    //Ask server to get list of messages
    //Ask server all my keys "clientInDb"
    //Connect to websockets
    this.server.socketConnect(this, (event) => {
      if (event.type === "message") {
        this.messages.push(event.data);
      }
    });
  }

  closeChannel() {
    //Disconnect from websockets
    this.server.socketDisconnect(this);
    this.messages = [];
  }

  sendMessage(message) {
    //Ask server to add message
    this.server.socketSend(this, {
      type: "message",
      data: { message: message, sender: this.name },
    });
  }

  encryption(message) {
    return encrypt(message, this.keys.publicKey);
  }

  decryption(encrypted) {
    return decrypt(encrypted, this.keys.privateKey);
  }

  createChannel(server) {
    const clientToFind = server.database.member[0];
    //server.socketConnect(this, (message) => {});
    const publicKey = crypto.randomBytes(32);
    server.httpSend("push_feed", publicKey);
    const privateKey_encrypted = this.encryption(crypto.randomBytes(32));
    this.encrypted_channel_privateKey = privateKey_encrypted; // pas forcément utile, Il faut voir si on peu stocké la clef privé chiffré dans l'object
    clientToFind.encrypted_channel_privateKey = privateKey_encrypted;
  }

  encryptChannelKeyForOther(publicKey, server) {
    const privateKey_encrypted = encrypt(
      this.decryption(this.encrypted_channel_privateKey),
      publicKey
    );

    server.httpSend("push_feed", privateKey_encrypted);
  }
}

module.exports = { Client };
