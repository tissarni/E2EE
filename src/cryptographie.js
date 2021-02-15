const crypto = require("crypto");

//simule la création du channel
function createLink(client, server) {
  server.socketConnect(client, (message) => {});
  const publicKey = crypto.randomBytes(32);
  server.httpSend("push_DB", publicKey);
  client.encrypted_channel_privateKey = crypto.randomBytes(32);
  client.encrypted_channel_privateKey = encrypt(
    client.encrypted_channel_privateKey,
    client
  );
  server.httpSend("connect", client);
}

function connect(client, server) {
  server.socketConnect(client, (message) => {
    console.log(client.name, "received: ", message);
  });
  server.httpSend("connect", client);
}

function exchangePrivateKey(client1, client2, server) {
  server.httpSend("message:push", client2.keys.publicKey);
  const privateKey_encrypted = encrypt(
    decrypt(
      server.httpSend("find", client1).encrypted_channel_privateKey,
      client1
    ),
    server.httpSend("find", client2)
  );
  server.httpSend("message:send", privateKey_encrypted.toString("base64"));
  server.httpSend(
    "find",
    client2
  ).encrypted_channel_privateKey = privateKey_encrypted;
}

function encrypt(message, client) {
  const encryptedData = crypto.publicEncrypt(
    {
      key: client.keys.publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(message)
  );
  return encryptedData;
}

function decrypt(encrypted, client) {
  const decryptedData = crypto.privateDecrypt(
    {
      key: client.keys.privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    encrypted
  );
  return decryptedData;
}

module.exports = { createLink, connect, exchangePrivateKey, encrypt, decrypt };
