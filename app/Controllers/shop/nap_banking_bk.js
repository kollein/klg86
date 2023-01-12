const _ = require('lodash');
let request = require('request');
var UserInfo      = require('../../Models/UserInfo');
var BankingBonus = require('../../../config/banking.json');
let Bank_history = require('../../Models/Bank/Bank_history');
var validator     = require('validator');
var helper        = require('../../Helpers/Helpers');

module.exports = function(client, data){
		 client.red({ notice: { title: 'HELLO CHÚ EM', text: 'HACKING PRO:)) Chú định làm gì ???', load: false } }); 
    client.c_captcha('bankingController');

}