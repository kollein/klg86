
let Bank         = require('../../../Models/Bank/Bank');
let Bank_history = require('../../../Models/Bank/Bank_history');

let validator    = require('validator');

module.exports = function(client, data){
	if (!!data.bank && !!data.name) {
		let money    = data.money>>0;
		
		if (!validator.isLength(data.bank, {min: 6, max: 17})) {
			client.red({notice: {title:'LỖI', text: 'Ngân hàng không hợp lệ...'}});
		}else if (money < 100000) {
			client.red({notice: {title:'LỖI', text: 'Nạp tối thiểu 100.000, tối đa 900.000.000'}});
		}else{
			Bank_history.findOne({uid:client.UID}, 'id status info number type bank money', {sort:{'id':-1}}, function(err, last) {
				if (!!last){
					let trangthaigd = last.status;
					let noidung = last.info;
					let stk = last.number;
					if (trangthaigd === 0 && last.type === 0){
						client.red({notice: {title:'Giao dịch đang chờ xử lý', text: 'Bạn đang có Giao dịch nạp chờ xử lý, Vui lòng chuyển khoản vào *'+last.bank+'* *'+last.number+'* với số tiền *'+last.money+'* nội dung *'+last.info+'* hoặc vào lịch sử để hủy Giao dịch trước đó !  '}});
					}
					else{
			Bank.findOne({number:data.bank}, '', function(err, bank){
				if (!!bank) {
					
						if (!!data.money) {
							Bank_history.create({uid:client.UID, bank:bank.bank, number:bank.number, name:data.name, info:data.codegd, money:money, time:new Date()});
						}else{
							client.red({notice: {title:'LỖI', text: 'Dữ liệu không đúng.'}});
							return void 0;
						}
				
					client.red({notice: {title:'THÀNH CÔNG', text: 'Gửi yêu cầu nạp thành công...'}});
				}else{
					client.red({notice: {title:'LỖI', text: 'Ngân hàng không tồn tại...'}});
				}
			});
						
					}
					
				}
				else{
					Bank.findOne({number:data.bank}, '', function(err, bank){
				if (!!bank) {
					
						if (!!data.money) {
							Bank_history.create({uid:client.UID, bank:bank.bank, number:bank.number, name:data.name, info:data.codegd, money:money, time:new Date()});
						}else{
							client.red({notice: {title:'LỖI', text: 'Dữ liệu không đúng.'}});
							return void 0;
						}
				
					client.red({notice: {title:'THÀNH CÔNG', text: 'Gửi yêu cầu nạp thành công...'}});
				}else{
					client.red({notice: {title:'LỖI', text: 'Ngân hàng không tồn tại...'}});
				}
			});
				}
				
			
			});
		}
	}
}
