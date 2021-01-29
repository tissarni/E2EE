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

const { Client } = require("./client");
const {
  createLink,
  connect,
  exchangePrivateKey,
  encrypt,
  decrypt,
} = require("./cryptographie");
const { Server } = require("./server");

const twakeChannel = new Server();
const bob = new Client("1234232", "bob");
const alice = new Client("1243538", "alice");
const titou = new Client("1243538", "titou");

createLink(bob, twakeChannel);
connect(alice, twakeChannel);
exchangePrivateKey(bob, alice, twakeChannel);

//console.log(twakeChannel);
console.log("clef av chiffrment", bob.encrypted_channel_privateKey);
alice.encrypted_channel_privateKey = decrypt(
  Buffer.from(alice.encrypted_channel_privateKey),
  alice
);

console.log(
  alice.encrypted_channel_privateKey.toString() ===
    bob.encrypted_channel_privateKey.toString()
);

/*
twakeChannel.socketConnect(bob, (message) => {
    console.log("Bob received: ", message);
});

twakeChannel.socketConnect(alice, (message) => {
    console.log("Alice received: ", message);
});

twakeChannel.socketConnect(titou, (message) => {
    console.log("Titou received: ", message);
});
twakeChannel.socketSend(bob, "message sent by socket");

console.log("Bob http result", twakeChannel.httpSend("message:send", "message sent by http"));
console.log(twakeChannel);*/

/*
const message = "Twake E2EE is comming";


console.log("envoyer coté alice: ", message);
alice.send(message, twakeChannel, bob, titou);
console.log(twakeChannel)
bob.receive(twakeChannel, alice);
titou.receive(twakeChannel, alice);
console.log("recu chez bob: ", bob.received);
console.log("recu chez titou: ",titou.received);*/
