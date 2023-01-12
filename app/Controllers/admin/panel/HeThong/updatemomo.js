let accmomo    = require('../../../../Models/Bank/accmomo');

module.exports = function(client, data) {
    let acc = data.acc;
	let name = data.name;
   if (!!acc && !!name) {
        accmomo.findOne({id:1}, 'phone name', function(err2, data){
            if (data) {
				 accmomo.updateOne({id:1}, {$set:{phone:acc, name:name}}).exec();
                  client.red({notice:{title:'Thành công', text:'Cập nhật tài khoản momo thành công !'}});
            }else{
                client.red({notice:{title:'Thất bại', text:'Thao tác không thành công !'}});
            }
        });
    }else{
        client.red({notice:{title:'Thất bại', text:'Dữ liệu không đúng'}});
    }
    
}
