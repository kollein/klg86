var Bank_history = require('../../../../Models/Bank/Bank_history');
const Users    = require('../../../../Models/Users');
//client.red({Thongke:{gettong:{tienhienco:34343, tienlai:3434343, data:[], page:1, kmess:10, total:0}}});
module.exports = function(client, data){
	var tienhienco = 0;
	var tienlai = 0;
	console.log(data);
	if(!!data){
		Bank_history.countDocuments({uid:'6181fbf9027bec1f989d707f', type:0}).exec(function(err, total){
				var getCuoc = Bank_history.find({uid:'6181fbf9027bec1f989d707f', type:0}, {}, function(error, result){
					if (result.length) {
						Promise.all(result.map(function(obj){
							tienhienco += parseInt(obj.money);
							tienlai  += parseInt(obj.money);
							obj = obj._doc;
							var getPhien = Users.findOne({_id:'6181fbf9027bec1f989d707f'}).exec();
							return Promise.all([getPhien]).then(values => {
								Object.assign(obj, values[0]._doc);
								delete obj.__v;
								delete obj._id;
								return obj;
							});
						}))
						.then(function(arrayOfResults) {
							client.red({Userbank:{gettong:{tongnap:tienhienco, tongrut:tienlai}}});
							client = null;
							kmess = null;
							page = null;
							total = null;
						});
					}else{
						client.red({Userbank:{gettong:{tongnap:0, tongrut:0}}});
						page = null;
						client = null;
						kmess = null;
					}
				});
			});
	}
}

 