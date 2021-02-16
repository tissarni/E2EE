const crypto = require("crypto");
const { encrypt, decrypt } = require("../utils/cryptographie");

class Client {
  constructor(name) {
    (this.name = name),
      (this.ecdh = crypto.createECDH("secp256k1")),
      (this.keys = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
      }));
  }

  getId() {
    return this.id;
  }

  send(message, server, client1, client2) {
    this.transmit(message, server, client1);
    this.transmit(message, server, client2);
  }

  encryption(message) {
    return encrypt(message, this.keys.publicKey);
  }

  decryption(encrypted) {
    return decrypt(encrypted, this.keys.privateKey);
  }
}

module.exports = { Client };
