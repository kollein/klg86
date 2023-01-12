let AutoIncrement = require('mongoose-auto-increment-reworked').MongooseAutoIncrementID;
let mongoose = require('mongoose');

let Schema = new mongoose.Schema({
	uid: {type: String,  default: ''},
	name: {type: String,  default: ''},   // Tên người được gọi
	phien:  {type: Number,  default: 0},                       // Phien
	nhan:  {type: mongoose.Schema.Types.Long, default: 0}, // Hu nhan $
	quyhu:  {type: mongoose.Schema.Types.Long, default: 0}, //quy hu khi no
	ketqua:  {type: Number,  default: 0}, //ketqua tai xiu
	tongtiendat: {type: Number,  default: 0}, //tong tien dat
	tonguser: {type: Number,  default: 0}, //ketqua so nguoi chon 
	lenh: {type: Number,  default: 0}, //
	time: {type: Date,   default: new Date()},
	phiennohu: {type: Number,  default: 0},
});
Schema.plugin(AutoIncrement.plugin, {modelName:'hutx', field:'id'});
module.exports = mongoose.model('hutx', Schema);
