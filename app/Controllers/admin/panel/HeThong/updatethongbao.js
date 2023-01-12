let thongbaomain    = require('../../../../Models/Title');

module.exports = function(client, data) {
    let tb1 = data.thongbao1;
	let tb2 = data.thongbao2;
	let tb3 = data.thongbao3;
    if (!!tb1 && !!tb2 && !!tb3) {
        thongbaomain.findOne({active:1}, 'thongbao1 thongbao2 thongbao3', function(err2, data){
            if (data) {
				 thongbaomain.updateOne({active:1}, {$set:{thongbao1:tb1, thongbao2:tb2, thongbao3:tb3}}).exec();
                  client.red({notice:{title:'Thành công', text:'Cập nhật thông báo thành công !'}});
            }else{
                client.red({notice:{title:'Thất bại', text:'Thao tác không thành công !'}});
            }
        });
    }else{
        client.red({notice:{title:'Thất bại', text:'Dữ liệu không đúng'}});
    }
    
}
