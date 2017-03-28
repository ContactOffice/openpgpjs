
var fs = require('fs');


var openpgp =  require('../../dist/openpgp');

var keyData = fs.readFileSync("key.asc",{encoding:"utf8"});


var privKey = openpgp.key.readArmored(keyData).keys[0];
var privSubKey = privKey.subKeys[0];

//var isPassphraseValid = privKey.decrypt("xxx"); 

console.log("inital expiration: "+ privKey.getExpirationTime()   );


var expirationTimeSec = 356*24*3600;

//check version
if(privKey.primaryKey.version !== 4){
	console.log("Not version 4");
	return;
}

//decrypt key
privKey.decrypt("xxx"); 


//update main key
var user = privKey.getPrimaryUser();

if(expirationTimeSec > 0){
	user.selfCertificate.keyNeverExpires =false;
    user.selfCertificate.keyExpirationTime = expirationTimeSec;
}else{
	//never expires
	user.selfCertificate.keyNeverExpires =true;
    user.selfCertificate.keyExpirationTime = 0;
}


//update sub key
if(privSubKey){

	if(expirationTimeSec > 0){
		privSubKey.bindingSignature.keyNeverExpires =false;
		privSubKey.bindingSignature.keyExpirationTime =expirationTimeSec;
	}else{
		//never expires
		privSubKey.bindingSignature.keyNeverExpires =true;
		privSubKey.bindingSignature.keyExpirationTime =0;
	}
	
}



//sign packets 
var keyPackets =privKey.getAllKeyPackets();
var secretKeyPacket = keyPackets[0];
var secretSubkeyPacket =keyPackets[1];

//main key
var dataToSign = {};
dataToSign.userid =privKey.getPrimaryUser().user.userId;
dataToSign.key = secretKeyPacket;
privKey.getPrimaryUser().selfCertificate.sign(secretKeyPacket, dataToSign); 


//subkey
if(secretSubkeyPacket){
	dataToSign = {};
	dataToSign.key = secretKeyPacket;
	dataToSign.bind = secretSubkeyPacket;
	privKey.subKeys[0].bindingSignature.sign(secretKeyPacket, dataToSign);
}



/*
 var keys = privKey2.getAllKeyPackets();
    for (var i = 0; i < keys.length; i++) {
      var ke = keys[i];
      ke.encrypt("xxx");
 }*/



keyData = privKey.armor();


fs.writeFileSync("keyres.asc",keyData);
fs.writeFileSync("keypub.asc",privKey.toPublic().armor());

//console.log(privKey2.decrypt("xxx"));
keyData =privKey.toPublic().armor();
privKey= openpgp.key.readArmored(keyData).keys[0];
console.log("expiration final: "+privKey.getExpirationTime());
console.log("expiration subkey: "+privKey.subKeys[0].getExpirationTime())

//console.log("expiration: "+ privKey2.getExpirationTime()   );

//http://www.g-loaded.eu/2010/11/01/change-expiration-date-gpg-key/

//http://irtfweb.ifa.hawaii.edu/~lockhart/gpg/
//https://www.gnupg.org/gph/en/manual/x56.html
//gpg --import key.asc
//gpg --edit 68ADA995
//key 0
//expire
//key 1
//expire
//gpg --armor --export-secret-key 68ADA995  > pprivate.key


