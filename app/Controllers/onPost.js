
let User     = require('./User');
let TaiXiu   = require('./TaiXiu');
let Shop     = require('./Shop');
let GiftCode = require('./GiftCode');
let Game     = require('./Game');
let OTP      = require('./OTP');
let Event    = require('./event/index');
let message  = require('./Message');
let GetNhiemVu    = require('./event/nhiemvu/getinfo_nhiemvu');
let NhiemVu    = require('./event/nhiemvu/nhiemvu');
module.exports = function(client, p){
	if (!!p) {
		if (!!p.signName){
			User.signName(client, p.signName);
		}
		if (!!p.user){
			User.onData(client, p.user);
		}
		if (!!p.taixiu){
			TaiXiu(client, p.taixiu);
		}
		if (!!p.shop){
			Shop(client, p.shop);
		}
		if (!!p.giftcode){
			GiftCode(client, p.giftcode);
		}
		if (!!p.g){
			Game(client, p.g);
		}
		if (!!p.scene && typeof p.scene === 'string'){
			client.scene = p.scene;
			User.next_scene(client);
		}
		if (!!p.otp){
			OTP(client);
		}
		if (!!p.event){
			Event(client, p.event);
		}
		if (!!p.nhiemvu){
			GetNhiemVu(client, p.nhiemvu);
		}
		if (!!p.nhanthuong){
			//client.red({notice:{title:"NHIỆM VỤ", text:'Bảo trì nhiệm vụ.'}});
			NhiemVu(client, p.nhanthuong);
		}
		if (!!p.message){
			message(client, p.message);
		}
	}
	client = null;
	p = null;
}
