
var NhaMang = require('../../Models/NhaMang');
var MenhGia = require('../../Models/MenhGia');
var Bank    = require('../../Models/Bank/Bank');

module.exports = function(client, nap = false){
	if (!!nap) {
		var active1 = NhaMang.find({nap: true}).exec();
		var active2 = MenhGia.find({nap: true}).exec();
		var active3 = Bank.findOne({}).exec();

		Promise.all([active1, active2, active3])
		.then(function(values){
			var data = {nhamang: values[0], menhgia: values[1], momo: values[2]}
			if (!!nap) {
				client.red({shop:{nap_red: {info:data}}});
			}else{
				client.red({shop:{mua_the_nap: {info:data}}});
			}
		});
	}else{
		var active1 = NhaMang.find({mua: true}).exec();
		var active2 = MenhGia.find({mua: true}).exec();

		Promise.all([active1, active2])
		.then(function(values){
			var data = {nhamang: values[0], menhgia: values[1]}
			if (!!nap) {
				client.red({shop:{nap_red: {info:data}}});
			}else{
				client.red({shop:{mua_the_nap: {info:data}}});
			}
		});
	}
}
