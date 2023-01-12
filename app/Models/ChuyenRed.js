let AutoIncrement = require('mongoose-auto-increment-reworked').MongooseAutoIncrementID;
let mongoose      = require('mongoose');

let Schema = new mongoose.Schema({
	//uid:     {type: String, required: true}, // ID Người chơi
	from:    {type: String, required: true}, // Tên người gửi
	to:      {type: String, required: true}, // Tên người nhận
	red:     {type: Number, required: true}, // Số red gửi
	red_c:   {type: Number, required: true}, // Số red nhận được
	message: String,                         // Thông điệp
	time:    Date,                           // Thời gian gửi
	report: String,							//Lý do
	reportTime: Date,						//Thời gian báo cáo
	freeze: { type: String }, //Lý do đóng băng tiền
    freezeTime: { type: Date }, //Thời gian đóng băng
});
Schema.plugin(AutoIncrement.plugin, {modelName: 'ChuyenRed', field:'id'});
module.exports = mongoose.model('ChuyenRed', Schema);
