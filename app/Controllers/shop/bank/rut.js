
var Bank_history = require('../../../Models/Bank/Bank_history');
var UserInfo     = require('../../../Models/UserInfo');
var OTP          = require('../../../Models/OTP');
var Phone        = require('../../../Models/Phone');
var validator    = require('validator');

module.exports = function(client, data){
	if (!!data.bank && !!data.number && !!data.name && !!data.rut) {
		if (!validator.isLength(data.bank, {min: 0, max: 32})) {
			client.red({notice: {title:'LỖI', text: 'Ngân hàng không hợp lệ...'}});
		}else if (!validator.isLength(data.number, {min: 8, max: 17})) {
			client.red({notice: {title:'LỖI', text: 'Số tài khoản không hợp lệ...'}});
		}else if (!validator.isLength(data.name, {min: 0, max: 32})) {
			client.red({notice: {title:'LỖI', text: 'Ngân hàng không hợp lệ...'}});
		}else if (!validator.isLength(data.rut, {min: 4, max: 17})) {
			client.red({notice: {title:'LỖI', text: 'Số tiền không hợp lệ...'}});
		}else {
		   Bank_history.findOne({uid:client.UID, type:1}, 'id time', {sort:{'id':-1}}, function(err, last) {
			   if (!!last){
				   if (((new Date()-Date.parse(last.time))/1000) < 1800) {
								client.red({notice:{title:'LỖI', text:'Mỗi GD rút cách nhau ít nhất 30 phút'}});
							}
							else{
			
		                    	UserInfo.findOne({'id':client.UID}, 'red', function(err3, dU){
									if (dU) {
											var rut = data.rut>>0;
											if (rut < 200000) {
												client.red({notice:{title:'THẤT BẠI', text:'Rút tối thiểu là 200.000.!'}});
											}else{
												if (dU.red >= rut) {
													Bank_history.create({uid:client.UID, bank:data.bank, number:data.number, name:data.name, money:rut, type:1, time:new Date()});
													UserInfo.updateOne({id:client.UID}, {$inc:{'red':-rut}}).exec();
													client.red({notice:{title:'THÀNH CÔNG', text:'Yêu cầu rút tiền của quý khách đang được xử lý'}, user:{red:dU.red-rut}});
												}else{
													client.red({notice:{title:'THẤT BẠI', text:'Sô dư không khả dụng.!'}});
												}
											}
										}
							
								});
							}
		   }else{
			   UserInfo.findOne({'id':client.UID}, 'red', function(err3, dU){
									if (dU) {
											var rut = data.rut>>0;
											if (rut < 200000) {
												client.red({notice:{title:'THẤT BẠI', text:'Rút tối thiểu là 200.000.!'}});
											}else{
												if (dU.red >= rut) {
													Bank_history.create({uid:client.UID, bank:data.bank, number:data.number, name:data.name, money:rut, type:1, time:new Date()});
													UserInfo.updateOne({id:client.UID}, {$inc:{'red':-rut}}).exec();
													client.red({notice:{title:'THÀNH CÔNG', text:'Yêu cầu rút tiền của quý khách đang được xử lý'}, user:{red:dU.red-rut}});
												}else{
													client.red({notice:{title:'THẤT BẠI', text:'Sô dư không khả dụng.!'}});
												}
											}
										}
							
								});
		   }
				});
				
		}
		
	}else{
		client.red({notice:{title:'LỖI', text:'Vui lòng nhập đầy đủ các thông tin.!'}});
	}
}
