
var fs   = require('fs');

module.exports = function(res) {
	fs.readFile('./config/sys.json', 'utf8', (err, data)=>{
		try {
			var sys = JSON.parse(data);
			return res.redirect(sys.fanpage);
		} catch (error) {
			return res.redirect('/');
		}
	});
}
