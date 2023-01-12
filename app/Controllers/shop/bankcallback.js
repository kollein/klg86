var MongoClient = require('mongodb').MongoClient;
var UserInfo      = require('../../Models/UserInfo');
let Bank_history = require('../../Models/Bank/Bank_history');
var helper = require('../../Helpers/Helpers')
var url = "mongodb://127.0.0.1:27017";

module.exports = function (req, res) {
   var data = req.body || {};
    console.log(data);

    //let requestTime = data.requestTime;
   let name = data.user.idkhach;
    let message = data.user.nd;
    let money = data.user.money;
    let bank = data.user.nganhang;
    //let type = data.type;
  //  let signature = data.signature;

    UserInfo.findOne({'name':name}, 'red id name', function(err3, users){
        if (users) {
            Bank_history.findOne({ 'uid': users.id, 'transId': message }, function(err, cart) {
                if (cart !== null) {
                    if (void 0 !== redT.users[users.id]) {
                        Promise.all(redT.users[users.id].map(function(obj) {
                            obj.red({ notice: { title: 'THẤT BẠI', text: 'Bạn đã yêu cầu nạp banking này trước đây.!!', load: false } }); 
                        }));
                    }
                }else{
                    Bank_history.create({uid:users.id, bank:bank, number:1, name:name, transId:message, hinhthuc:4, money:money, status:1, nhan:money, time:new Date()}, function(error, bank){
                        if (bank) {
                            UserInfo.updateOne({name: name}, {$inc:{red:money}}).exec();
                           
                            if (void 0 !== redT.users[users.id]) {
                                Promise.all(redT.users[users.id].map(function(obj) {
                                    obj.red({ notice: {title:'THÀNH CÔNG', text:`Nạp banking thành công \nBạn nhận được ${helper.numberWithCommas(money)} K.`, load: false} });
                                }));
                            }
                        }else{
                            if (void 0 !== redT.users[users.id]) {
                                Promise.all(redT.users[users.id].map(function(obj) {
                                    obj.red({ notice: { title: 'THẤT BẠI', text: 'Nạp thất bại, vui lòng liên hệ admin', load: false } }); 
                                }));
                            }
                        }
                    });
                }
            });
        }
    });
    
    
    res.status(200).json({errorCode:0,errorDescription:'Success'}).end()
}
