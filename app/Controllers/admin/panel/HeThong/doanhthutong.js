var doanhthu_history = require('../../../../Models/doanhthu');

module.exports = function(client, data){
	if (!!data) {
		doanhthu_history.findOne({}, function(err, dt) {
			var tongnapbank = dt.tiennap;
			var tongnapthe = dt.napthe;
			var tongtienrut = dt.tienrut;
			var tongrutthe = dt.rutthe;
			if (!!dt) {
				client.red({tonght:{lshethong:{tongnapbank:tongnapbank, tongnapthe:tongnapthe, tongtienrut:tongtienrut, tongrutthe:tongrutthe}}});
				
			}
		});
	}

}