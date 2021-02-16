const crypto = require("crypto");

//simule la création du channel
function createLink(client, server) {
  server.httpSend("connect", client);
  const clientFinded = server.httpSend("find", client);
  server.socketConnect(client, (message) => {});
  const publicKey = crypto.randomBytes(32);
  server.httpSend("push_DB", publicKey);
  const privateKey_encrypted = client.encryption(crypto.randomBytes(32));
  client.encrypted_channel_privateKey = privateKey_encrypted; // pas forcément utile, Il faut voir si on peu stocké la clef privé chiffré dans l'object
  clientFinded.encrypted_channel_privateKey = privateKey_encrypted;
}

function connect(client, server) {
  /*server.socketConnect(client, (message) => {
    console.log(client.name, "received: ", message);
  });*/
  server.httpSend("connect", client);
}

function exchangePrivateKey(client1, client2, server) {
  //server.httpSend("message:push", client2.keys.publicKey);
  const clientFinded1 = server.httpSend("find", client1);
  const clientFinded2 = server.httpSend("find", client2);
  const privateKey_encrypted = client2.encryption(
    client1.decryption(clientFinded1.encrypted_channel_privateKey)
  );
  server.httpSend("message:send", privateKey_encrypted.toString("base64"));

  client2.encrypted_channel_privateKey = privateKey_encrypted;
  clientFinded2.encrypted_channel_privateKey = privateKey_encrypted;
}

function encrypt(message, publicKey) {
  const encryptedData = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(message)
  );
  return encryptedData;
}

function decrypt(encrypted, privateKey) {
  const decryptedData = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    encrypted
  );
  return decryptedData;
}

module.exports = { createLink, connect, exchangePrivateKey, encrypt, decrypt };
