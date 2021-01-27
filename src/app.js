const { Client } = require('./client');
const {createLink, encrypt, decrypt} = require('./cryptographie');
const { Server } = require('./server');


const twakeChannel = new Server()
const bob = new Client("1234232", "bob");
const alice = new Client("1243538", "alice");
const titou = new Client("1243538", "titou");


createLink(bob, alice, titou, twakeChannel);
//console.log(twakeChannel.member);

const message = "Twake E2EE is comming";
/*console.log(message);
const encryptedMessageforBob = encrypt(message, Buffer.from(alice.sharedKey1 ,'hex'));
const encryptedMessageforTitou = encrypt(message, Buffer.from(alice.sharedKey2 ,'hex'));
const decryptedMessageByBob = decrypt(encryptedMessageforBob, Buffer.from(bob.sharedKey1,'hex'));
const decryptedMessageByTitou = decrypt(encryptedMessageforTitou, Buffer.from(titou.sharedKey2,'hex'));
console.log("bob: ", decryptedMessageByBob);
console.log("titou: ", decryptedMessageByTitou);*/

console.log("envoyer coté alice: ", message);
alice.send(message, twakeChannel, bob, titou);
console.log(twakeChannel)
bob.receive(twakeChannel, alice);
titou.receive(twakeChannel, alice);
console.log("recu chez bob: ", bob.received);
console.log("recu chez titou: ",titou.received);
//console.log(twakeChannel)


