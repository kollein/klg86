
let mongoose = require('mongoose');

let Schema = new mongoose.Schema({
	id: {type: String,  default: '1'},
    hutx: {type: mongoose.Schema.Types.Long, default: 0}, 
	md5key: {type: String,  default: ''},
	ketquaphien: {type: String,  default: ''},
});
module.exports = mongoose.model('TaiXiu_Hu_md5key', Schema);