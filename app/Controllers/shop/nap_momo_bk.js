const _ = require('lodash');
let request = require('request');
var UserInfo      = require('../../Models/UserInfo');
var MomoBonus = require('../../../config/momo.json');
let Bank_history = require('../../Models/Bank/Bank_history');
let getmomoacc = require('../../Models/Bank/accmomo');
var validator     = require('validator');
var helper        = require('../../Helpers/Helpers');

module.exports = function(client, data){
    if (!!data && !!data.sotien && !!data.captcha) {
        let money = data.sotien>>0;
        if (!validator.isLength(data.captcha, { min: 4, max: 4 })) {
            client.red({ notice: { title: '', text: 'Captcha không đúng!', load: false } });
        }else if (validator.isEmpty(data.sotien)) {
            client.red({ notice: { title: '', text: 'Vui lòng nhập số tiền nạp!', load: false } });
        }else if (money < MomoBonus.min) {
			client.red({notice: {title:'LỖI', text: `Nạp tối thiểu ${helper.numberWithCommas(MomoBonus.min)}, tối đa ${helper.numberWithCommas(MomoBonus.max)}`, load: false }});
		}else{
            let checkCaptcha = new RegExp('^' + data.captcha + '$', 'i');
            checkCaptcha = checkCaptcha.test(client.captcha);
            if (checkCaptcha) {
                    try{
                       Bank_history.findOne({uid:client.UID}, 'id status type info name number bank money', {sort:{'id':-1}}, function(err, last) {
				if (!!last){
					let trangthaigd = last.status;
					let noidung = last.info;
					let stk = last.number;
					if (trangthaigd === 0 && last.type === 0){
						UserInfo.findOne({id: client.UID}, 'name', function(err, check){
                                //let data = Buffer.from(body.destinationInfo, 'base64').toString();
                                let nap = new Object();
                                nap.syntax = last.info;
                                nap.phone = last.number;
                                nap.name = last.name;
								nap.sotien = last.money;

                                client.red({ shop:{momo:{nap:nap}}});
                               client.red({notice: {title:'Giao dịch đang chờ xử lý', text: 'Bạn đang có Giao dịch nạp chờ xử lý, Vui lòng chuyển khoản vào *'+last.bank+'* *'+last.number+'* với số tiền *'+last.money+'* nội dung *'+last.info+'* hoặc vào lịch sử để hủy Giao dịch trước đó !  ', load: false }});
                            });
						
					}
					else{
						     getmomoacc.findOne({id:1}, 'phone name', function(err, checkacc){
                              UserInfo.findOne({id: client.UID}, 'name', function(err, check){
                                //let data = Buffer.from(body.destinationInfo, 'base64').toString();
                                let nap = new Object();
                                nap.syntax = helper.randomString(9);
                                nap.phone = checkacc.phone;
                                nap.name = checkacc.name;
								nap.sotien = data.sotien;

                                Bank_history.create({uid:client.UID ,transId: nap.syntax,bank:"momo", number:nap.phone, name:nap.name, info:nap.syntax, namego:check.name, hinhthuc:1, money:money, time:new Date()});
                                
                                client.red({ shop:{momo:{nap:nap}}});
                                client.red({ notice: { title: 'Lệnh nạp được khởi tạo thành công', text: `Vui lòng chuyển tiền tới \n` + nap.phone, load: false } });
                                         });
							});
                        }
						
						}
						else{
							 getmomoacc.findOne({id:1}, 'phone name', function(err, checkacc){
                              UserInfo.findOne({id: client.UID}, 'name', function(err, check){
                                //let data = Buffer.from(body.destinationInfo, 'base64').toString();
                                let nap = new Object();
                                nap.syntax = helper.randomString(9);
                                nap.phone = checkacc.phone;
                                nap.name = checkacc.name;
								nap.sotien = data.sotien;

                                Bank_history.create({uid:client.UID ,transId: nap.syntax,bank:"momo", number:nap.phone, name:nap.name, info:nap.syntax, namego:check.name, hinhthuc:1, money:money, time:new Date()});
                                
                                client.red({ shop:{momo:{nap:nap}}});
                                client.red({ notice: { title: 'Lệnh nạp được khởi tạo thành công', text: `Vui lòng chuyển tiền tới \n` + nap.phone, load: false } });
                                         });
							});
						    }
						
				
			
			});
                    }catch(e){
                        console.log(`??????`);
                        client.red({ notice: { title: '', text: 'Yêu cầu nạp thẻ thất bại', load: false } }); 
                    }
            }
            else{
                client.red({ notice: { title: '', text: 'Mã xác nhận không chính xác!', load: false } });
            }
        }
    }
    client.c_captcha('momoController');

}