

var msg = 'Content-Type: multipart/alternative;'+
'\n 	boundary="----=_Part_152_15724726.1457955789174"'+
'\n'+
'\n------=_Part_152_15724726.1457955789174'+
'\nContent-Type: text/plain; charset=utf-8'+
'\nContent-Transfer-Encoding: 7bit'+
'\nContent-Disposition: inline'+
'\n'+
'\ndfgdfgdfg'+
'\n------=_Part_152_15724726.1457955789174'+
'\nContent-Type: text/html; charset=utf-8'+
'\nContent-Transfer-Encoding: 7bit'+
'\nContent-Disposition: inline'+
'\n'+
'\n<div style=\'font-family:Times New Roman; color:rgb(0, 0, 0); font-size:13px;\'>dfgdfgdfg<br></div>'+
'\n------=_Part_152_15724726.1457955789174--';





var fs = require('fs');

var openpgp =  require('../../dist/openpgp');

var keyData = fs.readFileSync("key",{encoding:"utf8"});
var privKey = openpgp.key.readArmored(keyData).keys[0];
privKey.decrypt("xxx"); 



openpgp.sign({data:msg,privateKeys:privKey}).then(function(res){
	

			console.log(res);


}).catch(function(err){
	console.log("error");
	console.log(err);
});


