
var fs = require('fs');


var openpgp =  require('../../dist/openpgp');

var keyData = fs.readFileSync("key.asc",{encoding:"utf8"});

var originalPwd="xxx";
var targetPwd="@param  {Array<module:key~Key>} keys Set of keys";


var expirationTimeSec = 356*24*3600;

var privKey = openpgp.key.readArmored(keyData).keys[0];

//check version
if(privKey.primaryKey.version !== 4){
	console.log("Not version 4");
	return;
}

//decrypt key
var ok = privKey.decrypt(originalPwd); 

if(!ok){
	console.log("Key not decrypted")
	return;
}

 var keys = privKey.getAllKeyPackets();
    for (var i = 0; i < keys.length; i++) {
      var ke = keys[i];
      ke.encrypt(targetPwd);
 }


keyData = privKey.armor();
privKey = openpgp.key.readArmored(keyData).keys[0];

console.log(targetPwd,privKey.decrypt(targetPwd));


fs.writeFileSync("keyres.asc",keyData);
fs.writeFileSync("keypub.asc",privKey.toPublic().armor());

