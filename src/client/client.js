const crypto = require("crypto");
const { encrypt, decrypt, createLink } = require("../utils/cryptographie");

class Client {
  constructor(server, name) {
    this.server = server;
    this.name = name;
    this.messages = [];
    this.ecdh = crypto.createECDH("secp256k1");
    this.keys = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
    });
  }

  openChannel() {
    //Ask server to get list of messages
    //Ask server all my keys "clientInDb"
    //Connect to websockets
    this.server.socketConnect(this, (event) => {
      if (event.type === "message") {
        const message = event.data;
        try {
          message.message = this.decryptMessages(message.message).toString();
        } catch (err) {}
        this.messages.push(message);
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
    const encrypted_message = this.encryptMessages(message);
    this.server.socketSend(this, {
      type: "message",
      data: { message: encrypted_message, sender: this.name },
    });
  }

  encryption(message) {
    return encrypt(message, this.keys.publicKey);
  }

  decryption(encrypted) {
    return decrypt(encrypted, this.keys.privateKey);
  }

  encryptMessages(message) {
    return encrypt(message, this.server.database.feed[0]);
  }

  decryptMessages(ecnrypted) {
    const decrypted_chennel_key = this.decryption(
      this.encrypted_channel_privateKey
    );

    const private_channel_key = crypto.createPrivateKey({
      key: decrypted_chennel_key,
      format: "der",
      type: "pkcs8",
    });
    return decrypt(ecnrypted, private_channel_key);
  }
  createChannel(server) {
    const clientToFind = server.database.member[0];
    //server.socketConnect(this, (message) => {});
    const serverKey = crypto.generateKeyPairSync("rsa", {
      modulusLength: 680,
      privateKeyEncoding: {
        type: "pkcs8",
        format: "der",
      },
    });
    server.httpSend("push_feed", serverKey.publicKey);

    const privateKey_encrypted = this.encryption(serverKey.privateKey);
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
