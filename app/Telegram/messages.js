
let start    = require('./model/start');
let giftcode = require('./model/giftcode');
let otp      = require('./model/otp');
let contact  = require('./model/contact');

module.exports = function(redT, msg) {
	let text = msg.text;
	if(/^otp$/i.test(text)){
		otp(redT.telegram, msg.from.id);
	}else if(/^giftcode$/i.test(text)){
		giftcode(redT.telegram, msg.from.id);
	}else if(msg.contact){
		contact(redT, msg.from.id, msg.contact.phone_number);
	}else{
		start(redT.telegram, msg.from.id);
	}
}
