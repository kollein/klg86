var fs = require('fs');

module.exports = function(data) {
	fs.readFile('./config/sys.json', 'utf8', (err, dataF)=>{
		try {
			var sys = JSON.parse(dataF);
			sys.telegram = data;
			fs.writeFile('./config/sys.json', JSON.stringify(sys), function(err){
				if (!!err) {
					client.red({notice:{title:'THẤT BẠI', text:'Đổi Telegram thất bại...'}});
				}
			});
		} catch (error) {
		}
	});
}