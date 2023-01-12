
let mongoose = require('mongoose');

let Schema = new mongoose.Schema({
	id:    {type: String, required: true, unique: true}, // ID người dùng
	phone:  {type: String, required: true, unique: true}, // Số điện thoại
	name: {type: String, required: true},               // Mã quốc gia
});

module.exports = mongoose.model('accmomo', Schema);
