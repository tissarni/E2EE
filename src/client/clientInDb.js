class ClientInDb {
  constructor(name, encryptedChannelPrivateKey, publicKey) {
    this.name = name;
    this.encrypted_channel_privateKey = encryptedChannelPrivateKey;
    this.publicKey = publicKey;
  }
}

module.exports = { ClientInDb };
