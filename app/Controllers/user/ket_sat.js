
var UserInfo = require('../../Models/UserInfo');
var OTP      = require('../../Models/OTP');
var Phone    = require('../../Models/Phone');
var Helper   = require('../../Helpers/Helpers');
var LScuoc   = require('../../Models/LichSu_Cuoc');

function gui(client, data){
	console.log(data);
	var red = data.red>>0;
	if (red < 1) {
		client.red({notice:{text:'Vui lòng nhập số tiền hợp lệ'}});
		//client.red({notice:{text: 'Vui lòng nhập số tiền hợp lệ'}});
	}else{
		
				UserInfo.findOne({id: client.UID}, 'red ketSat', function(err, user){
					if(user){
						if (user.red < red) {
							client.red({notice:{text: 'Vượt quá số tiền bạn có.'}});
						}else{
							UserInfo.updateOne({id: client.UID}, {$inc:{red: -red, ketSat: red}}).exec();
							client.red({notice:{text: 'Đã gửi ' + Helper.numberWithCommas(red) + ' K vào két sắt thành công.!!'}, user:{red:user.red-red, ketSat: user.ketSat*1+red}});
						
						LScuoc.create({uid:client.UID, lswin:-red, chitiet:'Gửi Tiền Vào Két', thanhtoan:0, tienhienco:user.red-red, dichvu:'Két Sắt', time:new Date()});
						}
					}
				});
			

	}
}

function rut(client, data){
	console.log(data);
	var red = data.red>>0;

	if (red < 1) {
		client.red({notice:{text: 'Vui lòng nhập số tiền hợp lệ.'}});
	}else{
		UserInfo.findOne({id: client.UID}, 'red ketSat', function(err, user){
		if (user.ketSat < red) {
										client.red({notice:{text: 'Vượt quá số tiền trong két.'}});
									}else{
										//OTP.updateOne({'_id': data_otp._id.toString()}, {$set:{'active':true}}).exec();
										UserInfo.updateOne({id: client.UID}, {$inc:{red: red, ketSat: -red}}).exec();
										client.red({notice:{text: 'Rút thành công ' + Helper.numberWithCommas(red) + ' K từ két sắt.!!'}, user:{red: user.red*1+red, ketSat: user.ketSat-red}});
										
		                        LScuoc.create({uid:client.UID, lswin:red, chitiet:'Rút Tiền trong Két', thanhtoan:0, tienhienco:user.red*1+red, dichvu:'Két Sắt', time:new Date()});
		
		}                             
								
		});					
					
}
}
module.exports = function(client, data) {
	if (void 0 !== data.gui) {
		gui(client, data.gui)
	}
	if (void 0 !== data.rut) {
		rut(client, data.rut)
	}
};
