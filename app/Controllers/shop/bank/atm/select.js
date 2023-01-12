
let request      = require('request');
let crypto       = require('crypto');
let jsonwebtoken = require('jsonwebtoken');

var Phone        = require('../../../../Models/Phone');
var OTP          = require('../../../../Models/OTP');
let Bank_history = require('../../../../Models/Bank/Bank_history');
let Helpers      = require('../../../../Helpers/Helpers');

module.exports = function(client, data){
	if (!!data.otp) {
		let otp    = ''+data.otp+'';
		if (otp.length < 4 || otp.length > 8) {
			client.red({notice:{title:'LỖI', text:'Mã OTP không đúng.!', load:false}});
			return void 0;
		}
		///**
		Phone.findOne({uid:client.UID}, {}, function(err, dPhone){
			if (!!dPhone) {
				OTP.findOne({'uid':client.UID, 'phone':dPhone.phone}, {}, {sort:{'_id':-1}}, function(err2, data_otp){
					if (data_otp && otp === data_otp.code) {
						if (((new Date()-Date.parse(data_otp.date))/1000) > 180 || data_otp.active) {
							client.red({notice:{title:'LỖI', text:'Mã OTP đã hết hạn.!', load:false}});
						}else{
							//*/
							let id     = data.id>>0;
							let amount = data.amount>>0;
							if (!!id && !!data.name && amount >= 50000) {
								let tokenId = crypto.randomBytes(32).toString('hex');
								tokenId = Buffer.from(tokenId).toString('base64');
								let issuedAt = (new Date().getTime()/1000)>>0;
								let notBefore = issuedAt;
								let expire    = notBefore+60;

								let config = Helpers.getConfig('bank');

								Bank_history.create({uid:client.UID, bank:data.name, hinhthuc:1, money:amount, time:new Date()}, function(err, info){
									if (!!info){
										let mrc_order_id = info._id.toString();
										let form = {
											mrc_order_id:mrc_order_id,
											total_amount:amount,
											description:'thanh toan don hang ' + Helpers.numberWithCommas(amount),
											url_success:config.url_success,
											lang:'vi',
											bpm_id:id,
											webhooks:config.url_callback,
											accept_qrpay:0,
											customer_email:'devkien90@gmail.com',
											customer_phone:'0943934466',
											customer_name:'Kien Nguyen',
											customer_address:'TP HCM',
										};
										let dataBase = {
											'iat': issuedAt,
											'jti': tokenId,
											'iss': config.API_KEY,
											'nbf': notBefore,
											'exp': expire,
											'form_params': form,
										};

										let jwt = jsonwebtoken.sign(dataBase, config.API_SEC, {algorithm:'HS256'});

										request.post({
											url: 'https://api.baokim.vn/payment/api/v4/order/send?jwt='+jwt,
											form: form
										}, function(err, httpResponse, body){
											try{
												body = JSON.parse(body);
												if (body.code === 0) {
													client.red({url:body.data.payment_url, loading:{text: 'Đang chờ thanh toán...'}});
												}else{
													info.status = 2;
													info.save();
													client.red({notice:{title:'LỖI', text:'Không thể thực hiện Giao Dịch', load:false}});
												}
											}catch(e){
												info.status = 2;
												info.save();
												client.red({notice:{title:'LỖI', text:'Không thể thực hiện Giao Dịch', load:false}});
											}
										});
									}
								});

								//accept_bank:1,
								//accept_cc:1,
								//url_detail:,
								//var hash = crypto.createHmac('SHA256', secret).update(string).digest('hex');
							}else{
								client.red({notice:{title:'LỖI', text:'Giao dịch tối thiểu 20.000.!', load:false}});
							}
							///**
						}
					}else{
						client.red({notice:{title:'LỖI', text:'Mã OTP Không đúng.!', load:false}});
					}
				});

			}else{
				client.red({notice:{title:'LỖI', text:'Bạn chưa kích hoạt số điện thoại.!', load:false}});
			}
		});
		//*/
	}
}
