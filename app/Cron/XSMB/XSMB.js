
const Helpers   = require('../../Helpers/Helpers');
const xsmb      = require('../../Models/XoSo/mb/xsmb');
const request   = require('request');
const jsdom     = require('jsdom');
const { JSDOM } = jsdom;

let check = function(text){
	text = text.trim();
	return !!text ? text : '';
}

module.exports = function() {
	request.post({
		url: 'https://xoso.me/ajax/see-more-result',
		form: {
			page: 1,
                province_id: 'mbm'
		}
	},
	function(err, httpResponse, body){
		try {
			let data = JSON.parse(body);
			let content = data.data.content;
			if (content.length > 100) {
				let dom = new JSDOM(`<!DOCTYPE html>`+content);

				let date = dom.window.document.querySelector('h2').textContent;
				date = date.match(/[0-9]{1,2}-[0-9]{1,2}-[0-9]{4}/);
				if (date.length > 0) {
					date = date[0];
					let arrD = date.split('-');
					date = Helpers.numberPad(arrD[0], 2) + '/' + Helpers.numberPad(arrD[1], 2) + '/' + arrD[2];
				}else{
					return;
				}

				let number = dom.window.document.getElementsByClassName('number');

				let db   = check(number[0].textContent);
				let g1   = check(number[1].textContent);

				let g2_1 = check(number[2].textContent);
				let g2_2 = check(number[3].textContent);
				let g2   = [g2_1, g2_2];

				let g3_1 = check(number[4].textContent);
				let g3_2 = check(number[5].textContent);
				let g3_3 = check(number[6].textContent);
				let g3_4 = check(number[7].textContent);
				let g3_5 = check(number[8].textContent);
				let g3_6 = check(number[9].textContent);
				let g3   = [g3_1, g3_2, g3_3, g3_4, g3_5, g3_6];

				let g4_1 = check(number[10].textContent);
				let g4_2 = check(number[11].textContent);
				let g4_3 = check(number[12].textContent);
				let g4_4 = check(number[13].textContent);
				let g4   = [g4_1, g4_2, g4_3, g4_4];

				let g5_1 = check(number[14].textContent);
				let g5_2 = check(number[15].textContent);
				let g5_3 = check(number[16].textContent);
				let g5_4 = check(number[17].textContent);
				let g5_5 = check(number[18].textContent);
				let g5_6 = check(number[19].textContent);
				let g5   = [g5_1, g5_2, g5_3, g5_4, g5_5, g5_6];

				let g6_1 = check(number[20].textContent);
				let g6_2 = check(number[21].textContent);
				let g6_3 = check(number[22].textContent);
				let g6   = [g6_1, g6_2, g6_3];

				let g7_1 = check(number[23].textContent);
				let g7_2 = check(number[24].textContent);
				let g7_3 = check(number[25].textContent);
				let g7_4 = check(number[26].textContent);
				let g7   = [g7_1, g7_2, g7_3, g7_4];

				dom = null;
				number = null;
				xsmb.findOne({date:date}, {}, function(err, result) {
					if (!!result) {
						result.gdb = db;
						result.g1  = g1;
						result.g2  = g2;
						result.g3  = g3;
						result.g4  = g4;
						result.g5  = g5;
						result.g6  = g6;
						result.g7  = g7;
						result.save();
						date = null;
						db = null;
						g1 = null;
						g2 = null;
						g3 = null;
						g4 = null;
						g5 = null;
						g6 = null;
						g7 = null;
						result = null;
					}else{
						xsmb.create({date:date, gdb:db, g1:g1, g2:g2, g3:g3, g4:g4, g5:g5, g6:g6, g7:g7});
						date = null;
						db = null;
						g1 = null;
						g2 = null;
						g3 = null;
						g4 = null;
						g5 = null;
						g6 = null;
						g7 = null;
					}
				});
			}
		} catch(e){}
	});
}
