


var fs = require('fs');

var openpgp =  require('../../dist/openpgp');

openpgp.generateKey({userIds:{email:"steph@gmail.com"},passphrase:"xxx",numBits:2048, expiration: 300}).then(function(res){
	

		var armored = res.privateKeyArmored;

		var privKey = openpgp.key.readArmored(armored).keys[0];

	console.log("expiration: "+ privKey.getExpirationTime()   );

	fs.writeFileSync("new.asc",armored,{encoding:"utf8"});



}).catch(function(err){
	console.log("error");
	console.log(err);
});