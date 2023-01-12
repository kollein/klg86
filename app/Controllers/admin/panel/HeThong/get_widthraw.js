
const Users    = require('../../../../Models/Users');
const Bankww = require('../../../../Models/Bank/Bank_history');
module.exports = function(client, data){
	var sotien = 0;
	
	console.log(data);
	if(!!data){
		Bankww.countDocuments({type:1, status:0}).exec(function(err, total){
				var getCuoc = Bankww.find({type:1, status:0}, {}, function(error, result){
					if (result.length) {
						Promise.all(result.map(function(obj){
							sotien += parseInt(obj.money);
							
							obj = obj._doc;
							var getPhien = Users.findOne({_id:obj.uid}).exec();
							return Promise.all([getPhien]).then(values => {
								Object.assign(obj, values[0]._doc);
								delete obj.__v;
								delete obj._id;
								delete obj.thanhtoan;
								delete obj.id;
								delete obj.uid;
								return obj;
							});
						}))
						.then(function(arrayOfResults) {
							client.red({widthraw:{getrut:{sotien:sotien}}});
							client = null;
							kmess = null;
							page = null;
							total = null;
						});
					}else{
						client.red({widthraw:{getrut:{sotien:sotien}}});
						page = null;
						client = null;
						kmess = null;
					}
				});
			});
	}
}

 