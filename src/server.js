const { newSharedKey } = require("./cryptographie");
const { encrypt, decrypt } = require("./cryptographie");
class Server {
  constructor() {
    (this.member = []), (this.publicKey = []), (this.database = []);
  }

  addMember(client) {
    this.member.push(client);
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
      this.member.push(body);
    }

    if (action === "push_DB") {
      this.socketSend(null, body);
      this.database.push(body);
    }

    if (action === "find") {
      this.socketSend(null, body);
      return this.member.find((element) => element === body);
    }

    if (action === "encrypt") {
      let client = this.httpSend("find", body);
      this.socketSend(null, body);
      client.encrypt(client.encrypted_channel_privateKey, client);
    }

    if (action === "decrypt") {
      this.socketSend(null, body);
      let client = this.httpSend("find", body[0]);
      client.encrypt(body[1], client);
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
