
var Bank = require('../../../../Models/Bank/autoBank');
var list = require('./autolist');

module.exports = function (client, id) {
	Bank.deleteOne({'_id':id}, function(err, bank){
		if (bank.n > 0) {
			list(client);
			client.red({banklist:{remove:true}, notice:{title:'THÀNH CÔNG',text:'XÓA thành công...'}});
		}else{
			client.red({banklist:{remove:true}, notice:{title:'THẤT BẠI',text:'Không tồn tại...'}});
		}
	});
}
