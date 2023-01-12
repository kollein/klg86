
let TopVip = require('../../../../Models/VipPoint/TopVip');

module.exports = function (client) {
	TopVip.deleteMany({}).exec();
	client.red({notice:{title:'THÀNH CÔNG', text:'Đặt lại dữ liệu thành công...'}});
}
