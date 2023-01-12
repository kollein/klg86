const Users    = require('../../../../Models/Users');
const UserInfo = require('../../../../Models/UserInfo');
//client.red({Thongke:{gettong:{tienhienco:34343, tienlai:3434343, data:[], page:1, kmess:10, total:0}}});
const Phone    = require('../../../../Models/Phone');
const isEmpty    = require('../../../../Helpers/Helpers').isEmpty;
const phoneCrack = require('../../../../Helpers/Helpers').phoneCrack;
module.exports = function(client, data){
	var tienhienco = 0;
	var tienlai = 0;
	console.log(data);
	if(!!data){
		UserInfo.countDocuments({}).exec(function(err, total){
				var getCuoc = UserInfo.find({type:false}, {}, function(error, result){
					if (result.length) {
						Promise.all(result.map(function(obj){
							tienhienco += parseInt(obj.red);
							tienlai  += parseInt(obj.totall);
							obj = obj._doc;
							var getPhien = Users.findOne({_id:obj.id}).exec();
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
							client.red({Thongke:{gettong:{tienhienco:tienhienco, tienlai:tienlai}}});
							client = null;
							kmess = null;
							page = null;
							total = null;
						});
					}else{
						client.red({Thongke:{gettong:{tienhienco:tienhienco, tienlai:tienlai}}});
						page = null;
						client = null;
						kmess = null;
					}
				});
			});
	}
}

 