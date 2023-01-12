
var Phone  = require('../../Models/Phone');
var helper = require('../../Helpers/Helpers');
var Userinfo = require('../../Models/UserInfo');
var Telegram = require('../../Models/Telegram');
var OTP       = require('../../Models/OTP');
var validator = require('validator');
var Bank_history = require('../../Models/Bank/Bank_history');

function regPhone(client, data){
	if (!!data.phone) {
		let phone   = ''+data.phone+'';
			if(!helper.checkPhoneValid(phone)) {
				client.red({notice:{title:'LỖI', text:'Số điện thoại không hợp lệ.'}});
			}else{
				let phoneCrack = helper.phoneCrack(phone);
				if (phoneCrack){
					if (phoneCrack.region == '0' || phoneCrack.region == '84') {
						phoneCrack.region = '+84';
					}
					Phone.findOne({'phone':phoneCrack.phone}, function(err3, crack){
						if (crack) {
							client.red({notice:{title:'LỖI', text:'Số điện thoại đã tồn tại trên hệ thống.!'}});
						}else{
							Phone.findOne({'uid':client.UID}, function(err4, check){
								if (check) {
									client.red({user:{phone:helper.cutPhone(check.region+check.phone)}});
								}else{
									try {
										Phone.create({'uid':client.UID, 'phone':phoneCrack.phone, 'region':phoneCrack.region}, function(err, cP){
											if (!!cP) {
												client.red({user:{phone:helper.cutPhone(phone)}});
											}else{
												client.red({notice:{title:'LỖI', text:'Số điện thoại đã tồn tại trên hệ thống.d!'}});
											}
										});
									} catch (error) {
										client.red({notice:{title:'LỖI', text:'Số điện thoại đã tồn tại trên hệ thống.!'}});
									}
								}
							});
						}
					});
				}else{
					client.red({notice:{title:'THÔNG BÁO', text:'Số điện thoại không hợp lệ.!'}});
				}
		}
	}
	client.c_captcha('regOTP');
}

function huyPhone(client, data){
	if (!!data && !!data.phone && !!data.otp){
		if (data.phone.length != 9) {
			client.red({notice: {title: 'LỖI', text: 'Số điện thoại không hợp lệ.!'}});
		}else if (data.otp.length != 4) {
			client.red({notice: {title: 'LỖI', text: 'Mã OTP không hợp lệ.!'}});
		}else if (data.otp == 0000){
				  Userinfo.findOne({id:client.UID}, 'redPlay veryphone veryold lastVip', function(Err, user) {
					  var xacthucsdt = user.veryphone;
					  if (xacthucsdt == false){
						  Phone.deleteOne({'uid': client.UID}).exec();
						  client.red({notice: {title: 'Success', text: 'Xóa phone thành công.!!'}});
					  }else{
						  client.red({notice: {title: 'Thất bại', text: 'Kiểm tra lại thông tin'}});
					  }
				  })
					
				}
			
		else{
			var otp = data.otp;
			Phone.findOne({uid:client.UID}, 'phone', function(Err, phone){
				if(phone){
				OTP.findOne({'uid':client.UID, 'phone':phone.phone}, {}, {sort:{'_id':-1}}, function(err, data_otp){
				if (data_otp && otp == data_otp.code) {
								if (((new Date()-Date.parse(data_otp.date))/1000) > 180 || data_otp.active) {
									client.red({notice:{title:'LỖI', text:'Mã OTP đã hết hạn.!'}});
								}
				var sdt = phone.phone;
				if(sdt === data.phone){
				var phonecancel = data.phone;
	Userinfo.findOne({id:client.UID}, 'redPlay veryphone veryold lastVip', function(Err, user) {
		let vipHT = ((user.redPlay-user.lastVip)/100000)>>0;
		var tongtienchoi = user.redPlay;
		var veryold = user.veryold;
		let redPlay = user.redPlay;
		if (vipHT>49) {
		    client.red({notice: {title: 'Success', text: 'Hủy OTP thành công.!!'}});
			Phone.deleteOne({'uid': client.UID}).exec();
			Userinfo.updateOne({'id': client.UID}, {$set:{'veryphone': false, 'lastVip':redPlay, 'cmt':phonecancel}}).exec();
			Telegram.deleteOne({'phone': phonecancel}).exec();
		
	}else{
		client.red({notice: {title: 'Success', text: 'Bạn cần 50 Vip Point hiện tại để hủy OTP'}});
	}
	});
			}else {
				client.red({notice: {title: 'Err', text: 'Bạn nhập không đúng số điện thoại'}});
			}
				}
				else{
					client.red({notice: {title: 'Err', text: 'Mã OTP không đúng'}});
				}
			});
			}
			
			});
			
		
	}
  }
	
}



module.exports = function(client, data) {
	if (!!data.regPhone) {
		regPhone(client, data.regPhone);
	}else if (!!data.huyPhone) {
		huyPhone(client, data.huyPhone);
	}
	
}
