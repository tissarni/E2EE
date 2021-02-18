/*
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
const clients = [];
const alice = new Client(twakeChannel, "alice");
const bob = new Client(twakeChannel, "bob");
const titou = new Client(twakeChannel, "titou");
clients.push(bob);
clients.push(alice);
clients.push(titou);

const first_client = clients[0];
function run(server) {
  connect(bob, twakeChannel);
  bob.createChannel(twakeChannel);
  connect(alice, twakeChannel);
  connect(titou, twakeChannel);

  while (server.publicKeyCounter < server.database.publicKey.length) {
    first_client.encryptChannelKeyForOther(
      server.database.publicKey[server.publicKeyCounter].publicKey,
      server
    );

    const new_client_name =
      server.database.publicKey[server.publicKeyCounter].name;
    const new_client = clients.filter((e) => e.name === new_client_name)[0];

    new_client.encrypted_channel_privateKey =
      server.database.feed[server.feedCounter];

    server.publicKeyCounter++;
    server.feedCounter++;
  }
}
run(twakeChannel);

console.log("feed", twakeChannel.database.feed);
console.log("publicKey", twakeChannel.database.publicKey);

//step 1
bob.openChannel(); //bob open the channel, he is the first one
bob.sendMessage("I am Bob");
console.log("[step 1]", bob.messages);

//step 2
alice.openChannel();
alice.sendMessage("I am Alice");
console.log("[step 2b]", bob.messages);
console.log("[step 2a]", alice.messages);
console.log("[step 2t]", titou.messages);

//step 3
bob.closeChannel();
titou.openChannel();
titou.sendMessage("Hello team, ca va ?");
bob.openChannel();
console.log("[step 3b]", bob.messages);
console.log("[step 3a]", alice.messages);
console.log("[step 3t]", titou.messages);
