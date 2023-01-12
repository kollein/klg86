
let Users_TX           = require('../../../../Models/TaiXiu_user');
let Users_BauCua       = require('../../../../Models/BauCua/BauCua_user');
let Users_XocDia       = require('../../../../Models/XocXoc/XocXoc_user');
let Users_BigBabol     = require('../../../../Models/BigBabol/BigBabol_users');
let Users_CaoThap      = require('../../../../Models/CaoThap/CaoThap_user');
//let Users_Mini3Cay     = require('../../../../Models/Mini3Cay/Mini3Cay_user');
let Users_miniPoker    = require('../../../../Models/miniPoker/miniPoker_users');
let Users_VuongQuocRed = require('../../../../Models/VuongQuocRed/VuongQuocRed_users');
let Users_AngryBirds   = require('../../../../Models/AngryBirds/AngryBirds_user');
let Users_LongLan      = require('../../../../Models/LongLan/LongLan_user');
let Users_Candy        = require('../../../../Models/Candy/Candy_user');

let Users    = require('../../../../Models/Users');
let UserInfo = require('../../../../Models/UserInfo');
let Phone    = require('../../../../Models/Phone');

module.exports = function(client, id){
	if (!!id) {
		var wait_user = new Promise((resolve, reject)=>{
			UserInfo.findOne({'id': id}, function(err, result) {
				if (!!result) {
					Users.findOne({'_id': result.id}, function(error, result2){
						var temp = result._doc
						delete temp._id;
						delete temp.__v;
						temp['username'] = !!result2 ? result2.local.username : '';
						Phone.findOne({'uid': result.id}, function(error2, result3){
							temp['phone'] = !!result3 ? result3.region+result3.phone : '';
							resolve(temp)
						});
					})
				}else{
					reject('RedT Err!!');
				}
			});
		});

		var wait_TX = new Promise((resolve, reject)=>{
			Users_TX.findOne({'uid': id}, function(err, result) {
				if (!!result) {
					result = result._doc;
					delete result._id;
					delete result.uid;
					delete result.__v;
					resolve(result);
				}else{
					reject('RedT Err!!');
				}
			});
		});

		var wait_BauCua = new Promise((resolve, reject)=>{
			Users_BauCua.findOne({'uid': id}, function(err, result) {
				if (!!result) {
					result = result._doc;
					delete result._id;
					delete result.uid;
					delete result.__v;
					resolve(result);
				}else{
					reject('RedT Err!!');
				}
			});
		});

		var wait_XocDia = new Promise((resolve, reject)=>{
			Users_XocDia.findOne({'uid': id}, function(err, result) {
				if (!!result) {
					result = result._doc;
					delete result._id;
					delete result.uid;
					delete result.__v;
					resolve(result);
				}else{
					reject('RedT Err!!');
				}
			});
		});

		var wait_BigBabol = new Promise((resolve, reject)=>{
			Users_BigBabol.findOne({'uid': id}, function(err, result) {
				if (!!result) {
					result = result._doc;
					delete result._id;
					delete result.uid;
					delete result.__v;
					resolve(result);
				}else{
					reject('RedT Err!!');
				}
			});
		});
		var wait_CaoThap = new Promise((resolve, reject)=>{
			Users_CaoThap.findOne({'uid': id}, function(err, result) {
				if (!!result) {
					result = result._doc;
					delete result._id;
					delete result.uid;
					delete result.__v;
					resolve(result);
				}else{
					reject('RedT Err!!');
				}
			});
		});
		var wait_miniPoker = new Promise((resolve, reject)=>{
			Users_miniPoker.findOne({'uid': id}, function(err, result) {
				if (!!result) {
					result = result._doc;
					delete result._id;
					delete result.uid;
					delete result.__v;
					resolve(result);
				}else{
					reject('RedT Err!!');
				}
			});
		});

		var wait_VuongQuocRed = new Promise((resolve, reject)=>{
			Users_VuongQuocRed.findOne({'uid': id}, function(err, result) {
				if (!!result) {
					result = result._doc;
					delete result._id;
					delete result.uid;
					delete result.__v;
					resolve(result);
				}else{
					reject('RedT Err!!');
				}
			});
		});

		var wait_AngryBirds = new Promise((resolve, reject)=>{
			Users_AngryBirds.findOne({'uid': id}, function(err, result) {
				if (!!result) {
					result = result._doc;
					delete result._id;
					delete result.uid;
					delete result.__v;
					resolve(result);
				}else{
					reject('RedT Err!!');
				}
			});
		});

		var wait_LongLan = new Promise((resolve, reject)=>{
			Users_LongLan.findOne({'uid': id}, function(err, result) {
				if (!!result) {
					result = result._doc;
					delete result._id;
					delete result.uid;
					delete result.__v;
					resolve(result);
				}else{
					reject('RedT Err!!');
				}
			});
		});

		var wait_Candy = new Promise((resolve, reject)=>{
			Users_Candy.findOne({'uid': id}, function(err, result) {
				if (!!result) {
					result = result._doc;
					delete result._id;
					delete result.uid;
					delete result.__v;
					resolve(result);
				}else{
					reject('RedT Err!!');
				}
			});
		});

		var active = [wait_user, wait_TX, wait_BauCua, wait_XocDia, wait_BigBabol, wait_CaoThap, wait_miniPoker, wait_VuongQuocRed, wait_AngryBirds, wait_LongLan, wait_Candy];
		Promise.all(active).then(resulf => {
			client.red({users:{get_info:{
				profile:   resulf[0],
				taixiu:    resulf[1],
				baucua:    resulf[2],
				xocxoc:    resulf[3],
				bigbabol:  resulf[4],
				caothap:   resulf[5],
				minipoker: resulf[6],
				vqred:     resulf[7],
				angrybird: resulf[8],
				longlan:   resulf[9],
				candy:     resulf[10],
			}}});
			client = null;
		});
	}
}
