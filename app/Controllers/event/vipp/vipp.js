
let TopVip = require('../../../Models/VipPoint/TopVip');
let fs     = require('fs');

module.exports = function(client){
	fs.readFile('./config/topVip.json', 'utf8', function(err, file){
		try{
			if(!err){
				file = JSON.parse(file);
				TopVip.find({}, {}, {sort:{'vip':-1}, limit:file.member}, function(err, result){
					result = result.map(function(top){
						return {name:top.name, vip:(top.vip/100000)>>0};
					});
					result = result.filter(function(top){
						return top.vip > 0 ? true : false;
					});
					client.red({vipp:{config:file, top:result}});
					file = null;
					client = null;
				});
			}
		}catch(e){
		}
	});
};
