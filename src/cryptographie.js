const crypto = require("crypto");

//gère l'échange de clefs de diffie hellman
function createLink(client, server) {
  server.socketConnect(client, (message) => {
    console.log(client.name, "received: ", message);
  });
  const publicKey = crypto.randomBytes(32);
  server.publicKey.push(publicKey);
  client.channel_PublicKey = publicKey;
  client.encrypted_channel_privateKey =
    "c565631329405f4c5796c29b0e4bc3c82078828f89e7fa43938ae09e2369535a";
}

function connect(client, server) {
  server.socketConnect(client, (message) => {
    console.log(client.name, "received: ", message);
  });
  client.channel_PublicKey = server.publicKey;
}

function exchangePrivateKey(client1, client2, server) {
  server.httpSend("message:send", client2.keys.publicKey);
  console.log("coucou", client2.keys.publicKey);
  const privateKey_encrypted = encrypt(
    client1.encrypted_channel_privateKey,
    client2
  );
  server.httpSend("message:send", privateKey_encrypted.toString("base64"));
  client2.encrypted_channel_privateKey = privateKey_encrypted;
}

//chiffre avec aes 256 gcm (gcm demmande auth tag)
function encrypt(message, client) {
  const encryptedData = crypto.publicEncrypt(
    {
      key: client.keys.publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(message)
  );

  console.log("encypted data: ", encryptedData);
  return encryptedData;
}

function decrypt(encrypted, client) {
  console.log("clef cryptée recu: ", encrypted);
  const decryptedData = crypto.privateDecrypt(
    {
      key: client.keys.privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    encrypted
  );
  console.log("clef déchifrée: ", decryptedData.toString());
  return decryptedData;
}

module.exports = { createLink, connect, exchangePrivateKey, encrypt, decrypt };
