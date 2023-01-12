let Admin    = require('./Admin');
let Users    = require('./panel/Users');
let NapThe   = require('./panel/NapThe');
let MuaThe   = require('./panel/MuaThe');
let Shop     = require('./panel/Shop');
let BongDa		 = require('./game/bongda');
let GiftCode = require('./panel/GiftCode');
let HeThong  = require('./panel/HeThong');
let TaiXiu       = require('./game/taixiu');
let BauCua       = require('./game/baucua');
let MiniPoker    = require('./game/mini_poker');
let BigBabol     = require('./game/big_babol');
let VuongQuocRed = require('./game/vq_red');
let mini3cay     = require('./game/mini3cay');
let angrybirds   = require('./game/angrybirds');
let XocXoc       = require('./game/xocxoc');
let royale       = require('./game/royale');
let sieuxe       = require('./game/Sieuxe');
let Cowboy       = require('./game/Cowboy');
let dongmauanhhung      = require('./game/dongmauanhhung');
let sexandzen      = require('./game/Sexandzen');
let RongHo       = require('./game/rongho');
let candy        = require('./game/candy');
let longlan      = require('./game/longlan');
let zeus      	 = require('./game/zeus');
let xs           = require('./game/xs');
let eventvip     = require('./panel/eventvip');

module.exports = function(client, data) {
	if (!!data) {
		if (!!data.admin) {
			Admin.onData(client, data.admin)
		}

		// Begin Game
		if (!!data.taixiu) {
			TaiXiu(client, data.taixiu)
		}
		if (!!data.baucua) {
			BauCua(client, data.baucua)
		}
		if (!!data.mini_poker) {
			MiniPoker(client, data.mini_poker)
		}
		if (!!data.bongda) {
			//console.log(data.bongda);
			BongDa(client, data.bongda)
		}
		if (!!data.big_babol) {
			BigBabol(client, data.big_babol)
		}
		if (!!data.vq_red) {
			VuongQuocRed(client, data.vq_red)
		}
		if (!!data.mini3cay) {
			mini3cay(client, data.mini3cay)
		}
		if (!!data.angrybird) {
			angrybirds(client, data.angrybird)
		}
		if (!!data.candy) {
			candy(client, data.candy)
		}
		if (!!data.sieuxe) {
			sieuxe(client, data.sieuxe)
		}
		if (!!data.longlan) {
			longlan(client, data.longlan)
		}
		if(!!data.zeus){
			zeus(client, data.zeus);
		}
		if (!!data.rongho) {
			//console.log(data.bongda);
			RongHo(client, data.rongho)
		}
		if (!!data.royale) {
			//console.log(data.bongda);
			royale(client, data.royale)
		}
		if (!!data.Cowboy) {
			//console.log(data.bongda);
			Cowboy(client, data.Cowboy)
		}
		if (!!data.dongmauanhhung) {
			//console.log(data.bongda);
			dongmauanhhung(client, data.dongmauanhhung)
		}
		if (!!data.sexandzen) {
			//console.log(data.bongda);
			sexandzen(client, data.sexandzen)
		}
		if (!!data.xocxoc) {
			XocXoc(client, data.xocxoc)
		}
		// End Game

		if (!!data.nap_the) {
			NapThe(client, data.nap_the)
		}
		if (!!data.mua_the) {
			MuaThe(client, data.mua_the)
		}
		if (!!data.users) {
			Users(client, data.users)
		}
		if (!!data.shop) {
			Shop(client, data.shop)
		}
		if (!!data.giftcode){
			GiftCode(client, data.giftcode);
		}
		if (!!data.sys){
			HeThong(client, data.sys);
		}
		if (!!data.xs){
			xs(client, data.xs);
		}
		if (!!data.eventvip){
			eventvip(client, data.eventvip);
		}
	}
}
