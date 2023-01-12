const _ = require('lodash');
let request    = require('request');

module.exports = function(client){
	request.get({
		url: 'http://mmconnect.vnm.bz/api/getBankAvailable?apiKey=fa31a9cd-ba9c-4dfb-93e4-c3f4ad0996a2',
	},
	function(err, httpResponse, body){
		console.log(body);
			let data = JSON.parse(body);
			client.red({shop:{banking:{banklist:data.message =="OK"?data.data:[]}}});
	});

}