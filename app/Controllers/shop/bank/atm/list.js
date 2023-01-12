
let request    = require('request');

module.exports = function(client){
	request.get({
		url: 'https://api.baokim.vn/payment/api/v4/bpm/list',
	},
	function(err, httpResponse, body){
		try {
			body = JSON.parse(body);
			body = body.data.filter(function(atm){
				if (atm.type === 1 || atm.type === 2) {
					return true;
				}
				return false;
			});
			body = body.map(function(atm){
				return {id:atm.id, name:atm.name};
			});
			client.red({shop:{bank:{atm:{list:body}}}});
			err = null;
			httpResponse = null;
		} catch(e){
			client.red({notice:{title:'THẤT BẠI', text: 'Nạp tự động ATM đang bảo trì, Vui lòng quay lại sau.!', load: false}});
		}
	});

}
