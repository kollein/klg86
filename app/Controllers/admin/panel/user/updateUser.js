
var Users    = require('../../../../Models/Users');
var UserInfo = require('../../../../Models/UserInfo');
var Phone    = require('../../../../Models/Phone');
var Telegram = require('../../../../Models/Telegram');
var OTP      = require('../../../../Models/OTP');
var validator = require('validator');
var Helper    = require('../../../../Helpers/Helpers');

module.exports = function(client, data){
	if (!!data && !!data.id && !!data.data) {
		let uData = data.data;
		let id = data.id;
		let update = {};
		let password = null;
		if (!!uData.red && !validator.isEmpty(uData.red)) {
			update['red'] = Helper.getOnlyNumberInString(uData.red);
		}
		if (!!uData.type && uData.type != '0') {
			update['type'] = uData.type == '1' ? true : false;
		}
		if (!!uData.rights && uData.rights != '0') {
			update['rights'] = uData.rights == '1' ? 0 : 1;
		}
		if (!!uData.pass && validator.isLength(uData.pass, {min:6, max: 32})) {
			password = Helper.generateHash(uData.pass);
			Users.updateOne({'_id': data.id}, {$set:{'local.password':password}}).exec();
			client.red({notice:{title:'NGƯỜI DÙNG', text:'Thay đổi Thành Công...'}});
			password = null;
		}
		UserInfo.findOne({'id':data.id}, function(err, check) {
			if (check) {
				client.red({notice:{title:'NGƯỜI DÙNG', text:'Thay đổi Thành Công...'}});
				if (!!Object.entries(update).length) {
					UserInfo.updateOne({'id':data.id}, {$set:update}).exec();
				}
				if (!!uData.phone && Helper.checkPhoneValid(uData.phone)) {
					let phoneCrack = Helper.phoneCrack(uData.phone);
					if (phoneCrack) {
						if (phoneCrack.region == '0' || phoneCrack.region == '84') {
							phoneCrack.region = '+84';
						}
						Phone.findOne({'phone':phoneCrack.phone}, function(err3, crack){
							if (!crack) {
								Phone.findOne({'uid':check.id}, function(err4, checkP){
									if (checkP) {
										Telegram.deleteOne({'phone':checkP.phone}).exec();
										OTP.deleteMany({'uid':id, 'phone':checkP.phone}).exec();
										UserInfo.updateOne({'id':id}, {$set:{veryphone:false}}).exec();
										checkP.phone = phoneCrack.phone;
										checkP.region = phoneCrack.region;
										checkP.save();
									}else{
										Phone.create({'uid':check.id, 'phone':phoneCrack.phone, 'region':phoneCrack.region});
									}
									id = null;
									client = null;
								});
							}else{
								id = null;
								client.red({notice:{title:'LỖI.!', text:'Số điện thoại đã tồn tại...'}});
								client = null;
							}
						});
					}else{
						id = null;
						client = null;
					}
				}else{
					id = null;
					client = null;
				}
			}else{
				client.red({notice:{title:'NGƯỜI DÙNG', text:'Người dùng không tồn tại...'}});
				id = null;
				client = null;
			}
			data   = null;
			update = null;
			uData  = null;
		});
	}
}
