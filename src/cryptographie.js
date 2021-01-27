const crypto = require('crypto');

//gère l'échange de clefs de diffie hellman
function createLink(client1, client2, client3, server){
    
    server.addMember(client1);
    server.addMember(client2);
    server.addMember(client3);

    client1.ecdh.generateKeys();
    client2.ecdh.generateKeys();
    client3.ecdh.generateKeys();

    client1.publicKey = client1.ecdh.getPublicKey();
    client2.publicKey = client2.ecdh.getPublicKey();
    client3.publicKey = client3.ecdh.getPublicKey();

    client1.sharedKey1 = client1.ecdh.computeSecret(client2.publicKey);
    client2.sharedKey1 = client2.ecdh.computeSecret(client1.publicKey);

    client1.sharedKey2 = client1.ecdh.computeSecret(client3.publicKey);
    client3.sharedKey1 = client3.ecdh.computeSecret(client1.publicKey);

    client2.sharedKey2 = client2.ecdh.computeSecret(client3.publicKey);
    client3.sharedKey2 = client3.ecdh.computeSecret(client2.publicKey);   
}

//chiffre avec aes 256 gcm (gcm demmande auth tag)
function encrypt(message, secretKey) {
    const iv = crypto.randomBytes(16);   
    const cipher = crypto.createCipheriv('aes-256-gcm', secretKey, iv);
    let encrypted = cipher.update(message, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const auth_tag = cipher.getAuthTag().toString('hex');
    
    /*
    console.table({
        iv: iv.toString('hex'),
        encrypted: encrypted,
        auth_tag: auth_tag
    })*/

    const data = iv.toString('hex') + encrypted + auth_tag;
    return Buffer.from(data, 'hex');
}

function decrypt(encrypted, secretKey) {
    const data = Buffer.from(encrypted).toString('hex');
    const iv = data.substring(0, 32);
    const encryptedMessage = data.substring(32, data.length - 32);
    const authTag = data.substring(data.length - 32, data.length);

    /*
    console.table({
        iv: iv,
        decrypt: encryptedMessage,
        authTag: authTag
    })*/

    try {
        const decipher = crypto.createDecipheriv('aes-256-gcm', secretKey, Buffer.from(iv, 'hex'))
        decipher.setAuthTag(Buffer.from(authTag, 'hex'));
        let decrypted = decipher.update(encryptedMessage, 'hex', 'utf8');
        decrypted += decipher.final('utf-8');
        return(decrypted)
    } catch (error) {
        console.log(error.message);
    }
}
/*
function otherPublicKey(client, server) {
    let otherPK = [];
    for(var member in server.member) {
        if (member !== client) {
            otherPK.push(member.sharedKey);
        }
    }
    return otherPK 
}

function newSharedKey(client, server) {
    client.sharedKey = client.ecdh.computeSecret(otherPublicKey(client, server));
}*/
module.exports = {createLink, encrypt, decrypt}