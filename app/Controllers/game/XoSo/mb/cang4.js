
let UserInfo  = require('../../../../Models/UserInfo');
let xsmb_cuoc = require('../../../../Models/XoSo/mb/xsmb_cuoc');

let numberPad = require('../../../../Helpers/Helpers').numberPad;

module.exports = function(client, data){
	if (!!data.so && typeof data.so === 'string' && !!data.diem) {
		let diem = data.diem>>0;
		if (diem > 0 && diem < 1000000) {
			let banDate = new Date();
			banDate.setHours(18, 0, 0, 0);
			let timeCL = banDate - new Date();
			if(timeCL > 0){
				// Tách số
				let res = data.so.split(',');
				res = res.map(function(obj){
					obj = obj.trim();
					if (obj.length === 4) {
						return obj;
					}
					return void 0;
				});
				res = res.filter(function(obj){
					return obj !== void 0;
				});
				if (res.length === 0) {
					client.red({XoSo:{notice:'Số chọn không hợp lệ...'}});
				}else if (res.length > 6) {
					client.red({XoSo:{notice:'1 Vé cược tối đa 6 Số...'}});
				}else{
					client.red({XoSo:{notice:'Dịch vụ ngừng hoạt động'}});
				}
			}else{
				client.red({XoSo:{notice:'Thời gian chọn số đã kết thúc, quay lại vào ngày mai...'}});
			}
		}else{
			client.red({XoSo:{notice:'Số điểm tối đa là 1.000.000'}});
		}
	}else{
		client.red({XoSo:{notice:'Dữ liệu không đúng...'}});
	}
};
