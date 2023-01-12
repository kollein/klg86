
let get_data = require('./HeThong/get_data');
let get_datadola = require('./HeThong/get_datadola');
let get_widthraw = require('./HeThong/get_widthraw');
let TXBot    = require('./HeThong/TXBot');
let BCBot    = require('./HeThong/BCBot');
let clear    = require('./HeThong/clear');
let doanhthutong = require('./HeThong/doanhthutong');
let fanpage  = require('./HeThong/fanpage');
let updatemomo  = require('./HeThong/updatemomo');
let SendAllTele  = require('./HeThong/tele');
let SendAllHomThu  = require('./HeThong/allhomthu');
let SendHomThu  = require('./HeThong/homthu');
let updatethongbao  = require('./HeThong/updatethongbao');
module.exports = function(client, data) {
	if (!!data) {
		if (void 0 !== data.txbot) {
			TXBot(client, data.txbot);
		}
		if (void 0 !== data.bcbot) {
			BCBot(client, data.bcbot);
		}
		if (!!data.get_data){
			get_data(client);
		}
		if (!!data.get_datadola){
			get_datadola(client, data);
		}
		if (!!data.get_widthraw){
			get_widthraw(client, data);
		}
		if (!!data.doanhthutong){
			doanhthutong(client, data);
		}
		if (!!data.clear){
			clear();
		}
		if (!!data.fanpage){
			fanpage(data.fanpage);
		}
		if (!!data.updatethongbao){
			updatethongbao(client, data.updatethongbao);
		}
		if (!!data.updatemomo){
			updatemomo(client, data.updatemomo);
		}
		if (!!data.SendAllTele){
			SendAllTele(client, data.SendAllTele);
		}
		if (!!data.SendAllHomThu){
			SendAllHomThu(client, data.SendAllHomThu);
		}
		if (!!data.SendHomThu){
			SendHomThu(client, data.SendHomThu);
		}
	}
}
