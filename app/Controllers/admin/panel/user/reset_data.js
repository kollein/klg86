
let UserInfo    = require('../../../../Models/UserInfo');
let TaiXiu_user = require('../../../../Models/TaiXiu_user');
let BauCua_user = require('../../../../Models/BauCua/BauCua_user');
let XocXoc_user = require('../../../../Models/XocXoc/XocXoc_user');
let MiniPoker   = require('../../../../Models/miniPoker/miniPoker_users');
let BigBabol    = require('../../../../Models/BigBabol/BigBabol_users');
let AngryBirds  = require('../../../../Models/AngryBirds/AngryBirds_user');
let CaoThap     = require('../../../../Models/CaoThap/CaoThap_user');
let VuongQuocRed = require('../../../../Models/VuongQuocRed/VuongQuocRed_users');
let Candy        = require('../../../../Models/Candy/Candy_user');
let LongLan      = require('../../../../Models/LongLan/LongLan_user');
let get_info    = require('./get_info');

module.exports = function(client, data) {
	if (!!data.id && !!data.data) {
		let id = data.id;
		data = data.data;
		switch(data){
			case 'tx_play':
				TaiXiu_user.updateOne({uid:id}, {'$set':{'tRedPlay':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'tx_win':
				TaiXiu_user.updateOne({uid:id}, {'$set':{'tWinRed':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'tx_lost':
				TaiXiu_user.updateOne({uid:id}, {'$set':{'tLostRed':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'tx_lai':
				TaiXiu_user.updateOne({uid:id}, {'$set':{'totall':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'tx_dwinmax':
				TaiXiu_user.updateOne({uid:id}, {'$set':{'tLineWinRed':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'tx_dlostmax':
				TaiXiu_user.updateOne({uid:id}, {'$set':{'tLineLostRed':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'tx_dwin':
				TaiXiu_user.updateOne({uid:id}, {'$set':{'tLineWinRedH':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'tx_dlost':
				TaiXiu_user.updateOne({uid:id}, {'$set':{'tLineLostRedH':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;

			// Bau Cua
			case 'bc_play':
				BauCua_user.updateOne({uid:id}, {'$set':{'bet':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'bc_win':
				BauCua_user.updateOne({uid:id}, {'$set':{'win':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'bc_lost':
				BauCua_user.updateOne({uid:id}, {'$set':{'lost':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'bc_lai':
				BauCua_user.updateOne({uid:id}, {'$set':{'totall':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;

			// XocDia
			case 'xocxoc_play':
				XocXoc_user.updateOne({uid:id}, {'$set':{'bet':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'xocxoc_win':
				XocXoc_user.updateOne({uid:id}, {'$set':{'win':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'xocxoc_lost':
				XocXoc_user.updateOne({uid:id}, {'$set':{'lost':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'xocxoc_lai':
				XocXoc_user.updateOne({uid:id}, {'$set':{'totall':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;

			// Mini Poker
			case 'mpoker_hu':
				MiniPoker.updateOne({uid:id}, {'$set':{'hu':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'mpoker_win':
				MiniPoker.updateOne({uid:id}, {'$set':{'win':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'mpoker_lost':
				MiniPoker.updateOne({uid:id}, {'$set':{'lost':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'mpoker_lai':
				MiniPoker.updateOne({uid:id}, {'$set':{'totall':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;

			// Big Babol
			case 'babol_hu':
				BigBabol.updateOne({uid:id}, {'$set':{'hu':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'babol_win':
				BigBabol.updateOne({uid:id}, {'$set':{'win':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'babol_lost':
				BigBabol.updateOne({uid:id}, {'$set':{'lost':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'babol_lai':
				BigBabol.updateOne({uid:id}, {'$set':{'totall':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;

			// AngryBirds
			case 'birds_hu':
				AngryBirds.updateOne({uid:id}, {'$set':{'hu':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'birds_win':
				AngryBirds.updateOne({uid:id}, {'$set':{'win':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'birds_lost':
				AngryBirds.updateOne({uid:id}, {'$set':{'lost':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'birds_lai':
				AngryBirds.updateOne({uid:id}, {'$set':{'totall':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;

			// Cao Thap
			case 'ct_hu':
				CaoThap.updateOne({uid:id}, {'$set':{'hu':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'ct_win':
				CaoThap.updateOne({uid:id}, {'$set':{'win':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'ct_lost':
				CaoThap.updateOne({uid:id}, {'$set':{'lost':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'ct_lai':
				CaoThap.updateOne({uid:id}, {'$set':{'totall':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;

			// Ngo Khong
			case 'vq_hu':
				VuongQuocRed.updateOne({uid:id}, {'$set':{'hu':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'vq_win':
				VuongQuocRed.updateOne({uid:id}, {'$set':{'win':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'vq_lost':
				VuongQuocRed.updateOne({uid:id}, {'$set':{'lost':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'vq_lai':
				VuongQuocRed.updateOne({uid:id}, {'$set':{'totall':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;

			// Candy
			case 'candy_hu':
				Candy.updateOne({uid:id}, {'$set':{'hu':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'candy_win':
				Candy.updateOne({uid:id}, {'$set':{'win':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'candy_lost':
				Candy.updateOne({uid:id}, {'$set':{'lost':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'candy_lai':
				Candy.updateOne({uid:id}, {'$set':{'totall':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;

			// Long Lan
			case 'long_hu':
				LongLan.updateOne({uid:id}, {'$set':{'hu':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'long_win':
				LongLan.updateOne({uid:id}, {'$set':{'win':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'long_lost':
				LongLan.updateOne({uid:id}, {'$set':{'lost':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'long_lai':
				LongLan.updateOne({uid:id}, {'$set':{'totall':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;

			// User Info
			case 'user_red':
				UserInfo.updateOne({id:id}, {'$set':{'red':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'user_ket':
				UserInfo.updateOne({id:id}, {'$set':{'ketSat':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'user_play':
				UserInfo.updateOne({id:id}, {'$set':{'redPlay':0, 'lastVip':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'user_win':
				UserInfo.updateOne({id:id}, {'$set':{'redWin':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'user_lost':
				UserInfo.updateOne({id:id}, {'$set':{'redLost':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'user_lai':
				UserInfo.updateOne({id:id}, {'$set':{'totall':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'user_vip':
				UserInfo.updateOne({id:id}, {'$set':{'redPlay':0, 'lastVip':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'user_tichvip':
				UserInfo.updateOne({id:id}, {'$set':{'vip':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
			case 'user_hu':
				UserInfo.updateOne({id:id}, {'$set':{'hu':0}}).exec(function(err, result){
					get_info(client, id);
					client = null;
					id     = null;
					data   = null;
				});
				break;
		}
	}
}
