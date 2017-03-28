
var fs = require('fs');


var openpgp =  require('../../dist/openpgp');

var keyData = fs.readFileSync("key2.asc",{encoding:"utf8"});


var privKey = openpgp.key.readArmored(keyData).keys[0];


//decrypt key
privKey.decrypt("xxx"); 

openpgp.revoke({privateKey:privKey, passphrase:"xxx"}).then(function(k){

		var privKey = k.key;
		keyData = privKey.armor();
		privKey = openpgp.key.readArmored(keyData).keys[0];

		isRevoked = (privKey.verifyPrimaryKey() === openpgp.enums.keyStatus.revoked);
		console.log("Revoked: "+isRevoked);


		console.log("---->Decrypted",privKey.decrypt(""),privKey.decrypt("xxx"));


		fs.writeFileSync("revoked-priv.asc",keyData);
		fs.writeFileSync("revoked-pub.asc",privKey.toPublic().armor());


}).catch(function(err){
	console.log(err);

})







