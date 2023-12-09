const _ = require('lodash');
let request = require('request');
var UserInfo = require('../../Models/UserInfo');
var MomoBonus = require('../../../config/momo.json');
let Bank_history = require('../../Models/Bank/Bank_history');
var validator = require('validator');
var helper = require('../../Helpers/Helpers');
let apikey = `3752cd83-604a-4b61-b9be-fcab851c7abd`;
let Push = require('../../Models/Push');

module.exports = function (client, data) {
    if (!!data && !!data.sotien && !!data.captcha) {
        let money = data.sotien >> 0;
        if (!validator.isLength(data.captcha, { min: 4, max: 4 })) {
            client.red({ notice: { title: '', text: 'Captcha không đúng!', load: false } });
        } else
            if (validator.isEmpty(data.sotien)) {
                client.red({ notice: { title: '', text: 'Vui lòng nhập số tiền nạp!', load: false } });
            } else if (money < MomoBonus.min) {
                client.red({ notice: { title: 'LỖI', text: `Nạp tối thiểu ${helper.numberWithCommas(MomoBonus.min)}, tối đa ${helper.numberWithCommas(MomoBonus.max)}`, load: false } });
            } else {
                try {
                    UserInfo.findOne({ id: client.UID }, 'name', function (err, check) {
                        let nap = new Object();
                        nap.syntax = Math.random().toString().slice(2, 6);
                        nap.phone = '0779013586';
                        nap.name = 'Server Momo';

                        Bank_history.create({ uid: client.UID, transId: nap.syntax, bank: "momo", number: nap.phone, name: nap.name, namego: check.name, hinhthuc: 1, money: money, time: new Date() });

                        client.red({ shop: { momo: { nap: nap } } });
                        client.red({ notice: { title: '', text: `Vui lòng chuyển tiền tới \n` + nap.phone, load: false } });
                        Push.create({
                            type: "MomoNap",
                            data: JSON.stringify({ name: check.name, money: money, bank: nap.phone, date: new Date() })
                        });
                    });
                } catch (e) {
                    console.log(e.message);
                    client.red({ notice: { title: '', text: 'Yêu cầu nạp thẻ thất bại', load: false } });
                }
            }
    }
    client.c_captcha('momoController');

}
