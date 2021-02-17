const crypto = require("crypto");

function connect(client, server) {
  /*server.socketConnect(client, (message) => {
    //console.log(client.name, "received: ", message);
  });*/
  server.httpSend("connect", client);
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

module.exports = { connect, encrypt, decrypt };
