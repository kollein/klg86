
let UserInfo = require('./app/Models/UserInfo');
let Telegram = require('./app/Models/Telegram');
let MegaJP_user = require('./app/Models/RongHo/RongHo_user');
module.exports = function(){
	UserInfo.updateMany({}, {'$set':{'veryphone':true, 'veryold':true}}).exec();
	Telegram.deleteMany({}).exec();
}
