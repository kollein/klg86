var MongoClient = require('mongodb').MongoClient;
var UserInfo      = require('../../Models/UserInfo');
let Bank_history = require('../../Models/Bank/Bank_history');
var helper = require('../../Helpers/Helpers')
var url = "mongodb://127.0.0.1:27017";
let UserMission = require('../../Models/UserMission');
module.exports = function (req, res) {
    var MomoBonus = require('../../../config/momo.json');
    var BankingBonus = require('../../../config/banking.json');
    let data = req.query;
    let transId = data.code;
	let chagerType = data.type;
    let money = data.finish_amount;
    let status = data.status;
    var nhanInt = parseInt(money);
	console.log(transId);
    if (status == 'success') {
        if (chagerType == 'momo') {
            nhanInt = nhanInt + (nhanInt * MomoBonus.bonus/100);
        }else if (chagerType == 'bank') {
            nhanInt = nhanInt + (nhanInt * BankingBonus.bonus/100);
        }
        Bank_history.findOne({'transId': transId }, function(err, cart) {
			console.log(cart);
            if (!!cart) {
                if (cart.status == 1) {
                    if (void 0 !== redT.users[cart.uid]) {
                        Promise.all(redT.users[cart.uid].map(function(obj) {
                            obj.red({ notice: { title: 'THẤT BẠI', text: 'Nạp thất bại, vui lòng liên hệ admin', load: false } }); 
                        }));
                    }
                }else{
                    UserInfo.findOne({'id': cart.uid}, 'red id name', function(err3, users){
						console.log(users);
                        UserInfo.findOneAndUpdate({id: cart.uid}, {$inc:{red:nhanInt}}).exec();
                                    if (nhanInt > 5000000)
                                    nhanInt = 5000000;
                                    if (chagerType == 'momo') {
                                        UserMission.updateOne({ uid: users.id, name: users.name, type: 2, active: false, achived: false }, { $set: { active: true, totalPay: money, totalAchive: money * global.SKnapthe, current: 0, achived: false, time: new Date((new Date()).getTime() + 1728000000) } }).exec();
                                    }else if (chagerType == 'bank') {
                                        UserMission.updateOne({ uid: users.id, name: users.name, type: 3, active: false, achived: false }, { $set: { active: true, totalPay: money, totalAchive: money * global.SKnapthe, current: 0, achived: false, time: new Date((new Date()).getTime() + 1728000000) } }).exec();
                                    }
                                    cart.status = 1;
                                    cart.save();
                                    if (void 0 !== redT.users[cart.uid]) {
                                        Promise.all(redT.users[cart.uid].map(function(obj) {
                                            obj.red({ notice: {title:'THÀNH CÔNG', text:`Nạp ${data.type} thành công \nBạn nhận được ${helper.numberWithCommas(nhanInt)} XU.`, load: false}, user:{red: users.red*1+nhanInt} });
                                        }));
                                    }
                            });
                }
            }
        });
    }   
    res.status(200).json({errorCode:0,errorDescription:'Success'}).end();
}
