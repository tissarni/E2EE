/*

[
    "channel_publicKey": "...",
    "members": [
        "bob": [
            "publicKey": "...",
            "encrypted_channel_privateKey": "..."
        ],
        "alice": [
            "publicKey": "...",
            "encrypted_channel_privateKey": "..."
        ],
        ...
    ]
    Alice -> [Keys State]
    Alice -> Message
    Bob -> [Request Keys State for Bob public Key]
    Alice -> [Keys State with Bob encripted key]
    Alice -> Message
]

Step1. Alice alone
- channel_publicKey
- Alice publicKey
- Alice encrypted channel privateKey

Step2. Bob want to join
- channel_publicKey
- Alice publicKey
- Alice encrypted channel privateKey
- Bob publicKey
- There is no Bob encrypted channel privateKey

Step3. Alice want to send a message
- channel_publicKey
- Alice publicKey
- Alice encrypted channel privateKey
- Bob publicKey
- Bob encrypted channel privateKey

*/

const { Client } = require("./client/client");
const {
  createLink,
  connect,
  exchangePrivateKey,
  encrypt,
  decrypt,
} = require("./utils/cryptographie");
const { Server } = require("./database/server");

const twakeChannel = new Server();
const bob = new Client("bob");
const alice = new Client("alice");
const titou = new Client("titou");

createLink(bob, twakeChannel);
connect(alice, twakeChannel);
connect(titou, twakeChannel);
console.log("batatartd", bob);
exchangePrivateKey(bob, alice, twakeChannel);
exchangePrivateKey(bob, titou, twakeChannel);

bob.encrypted_channel_privateKey = bob.decryption(
  Buffer.from(bob.encrypted_channel_privateKey)
);

alice.encrypted_channel_privateKey = alice.decryption(
  Buffer.from(alice.encrypted_channel_privateKey)
);
titou.encrypted_channel_privateKey = titou.decryption(
  Buffer.from(titou.encrypted_channel_privateKey)
);

console.log(
  titou.encrypted_channel_privateKey.toString() ===
    bob.encrypted_channel_privateKey.toString() &&
    titou.encrypted_channel_privateKey.toString() ===
      alice.encrypted_channel_privateKey.toString()
);
