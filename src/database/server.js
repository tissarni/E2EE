const { ClientInDb } = require("../client/clientInDb");
const { Database } = require("./database");

class Server {
  constructor() {
    this.database = new Database();
  }

  addMember(client) {
    this.database.member.push(client);
  }

  send(sender, receiver1, receiver2) {
    receiver1.receive(this, sender);
    receiver2.receive(this.sender);
  }

  httpSend(action, body) {
    if (action === "message:send") {
      this.socketSend(null, body);
      return "ok, http sent";
      //Some code that represent sending a message to the server
    }
    if (action === "connect") {
      this.socketSend(null, body);
      const userToconnect = this.httpSend("save", body);
      this.database.member.push(userToconnect);
    }

    if (action === "push_DB") {
      this.socketSend(null, body);
      this.database.feed.push(body);
    }

    if (action === "find") {
      this.socketSend(null, body);
      const toFind = body.name.toString();
      return this.database.member.find((element) => element.name === toFind);
    }

    if (action === "save") {
      this.socketSend(null, body);
      var user = new ClientInDb(
        body.name,
        body.encrypted_channel_privateKey,
        body.keys.publicKey
      );
      return user;
    }
  }

  socketClients = [];

  socketConnect(client, callback) {
    this.socketDisconnect(client);
    this.socketClients.push({ client: client, callback: callback });
  }

  socketDisconnect(client) {
    this.socketClients = this.socketClients.filter((c) => c.client !== client);
  }

  socketSend(client, body) {
    if (
      !client ||
      this.socketClients.filter((c) => c.client === client).length > 0
    ) {
      this.socketClients.forEach((c) => {
        c.callback(body);
      });
    }
  }
}

module.exports = { Server };
