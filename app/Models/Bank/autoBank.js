
let mongoose = require('mongoose');

let Schema = new mongoose.Schema({
	bank:   {type: String},               // Tên ngân hàng
	number: {type: String, unique: true}, // Số tài khoản
	name:   {type: String},               // Chủ tài khoản
	branch: {type: String},               // Chi nhánh
	hinhthuc: {type:Number, default:0},  // 1 la bank auto
});

module.exports = mongoose.model('autoBank', Schema);
