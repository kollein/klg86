
let messages = require('./messages');

var tab_DaiLy = require('../Models/DaiLy');
let TelegramDaiLyBalance = require('../Models/TelegramDaiLyBalance');
let Phone    = require('../Models/Phone');
let helpers  = require('../Helpers/Helpers');
var UserInfo  = require('../Models/UserInfo');

module.exports = function(redT) {
	redT.telegram.on('message', (msg) => {
		messages(redT, msg);
	});
	/*
	redT.telegram_daily.on('message',(msg)=>{
		
        console.log(msg);

        if(msg.hasOwnProperty('contact')){
            console.log("111111")
            let id = msg.from.id;
            console.log("id:"+id);
            let contact = msg.contact.phone_number;

            console.log("contact:"+contact);
            let phoneCrack;
            try{
                phoneCrack = helpers.phoneCrack(contact);
                console.log("phoneCrack"+phoneCrack)
            }catch (e) {
                console.log(e.toString());
            }

            Phone.findOne({'phone':phoneCrack.phone}, {}, function(err, check){
                console.log(check)
                if(check){
                    if (phoneCrack) {
                        console.log("uid:"+check.uid);
                        UserInfo.findOne({'id':check.uid}, {}, function(err, data){
                            console.log(data)
                            if(data){
                                tab_DaiLy.findOne({nickname:data.name},function (err,data) {
                                    console.log(data)
                                    if(data){
                                        TelegramDaiLyBalance.findOne({'phone':phoneCrack.phone}, 'uid region phone', function(err, check1){
                                            if (!check1) {
                                                try {
                                                    
                                                    TelegramDaiLyBalance.create({'form':id, 'phone':phoneCrack.phone}, function(err, cP){
                                                        phoneCrack = null;

                                                        if (!!cP) {
                                                            console.log('id:'+id);
                                                            redT.telegram_daily.sendMessage(id,
                                                                'Bạn nhận được thông báo khi cáo ai chuyển tiền.',
                                                                {parse_mode: 'markdown',reply_markup: {remove_keyboard: true}
                                                                });
                                                        }else{
                                                            redT.telegram_daily.sendMessage(id, '_Thao tác thất bại_', {parse_mode: 'markdown',reply_markup: {remove_keyboard: true}});
                                                        }
                                                    });
                                                } catch (error) {
                                                    redT.telegram_daily.sendMessage(id, '_Thao tác thất bại_', {parse_mode: 'markdown',reply_markup: {remove_keyboard: true}});
                                                }
                                            }
                                        });
                                    }else{
                                        redT.telegram_daily.sendMessage(id, 'Không phải tài khoản đại lý!', {parse_mode: 'markdown',reply_markup: {remove_keyboard: true}});
                                    }
                                })
                            }
                        });
                    }
                }else{
                    redT.telegram_daily.sendMessage(id, 'Số điện thoại không tồn tại hệ thống!', {parse_mode: 'markdown',reply_markup: {remove_keyboard: true}});
                }
            });
        }else{
			
			console.log("ID:"+msg.from.id);
			
            TelegramDaiLyBalance.findOne({'form':msg.from.id}, 'phone', function(err, data){
                if (data) {
                    let opts = {
                        parse_mode: 'markdown',
                        reply_markup: {
                            remove_keyboard: true,
                        }
                    };
                    redT.telegram_daily.sendMessage(msg.from.id, '*HƯỚNG DẪN*' + 'Hệ thống báo chuyển tiền cho đại lý', opts);
                }else{
                    let opts = {
                        parse_mode: 'markdown',
                        reply_markup: {
                            keyboard: [
                                [{text: 'CHIA SẺ SỐ ĐIỆN THOẠI', request_contact: true}],
                            ],
                            resize_keyboard: true,
                        }
                    };
                    redT.telegram_daily.sendMessage(msg.from.id, '*VIN89 CLUB*  Đây là lần đầu tiên bạn sử dụng App DaiLy. Vui lòng ấn CHIA SẺ SỐ ĐIỆN THOẠI để _XÁC THỰC_', opts);
                }
            });
        }
    });*/
}
