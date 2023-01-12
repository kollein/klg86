
let mongoose = require('mongoose');
let bcrypt  = require('bcrypt');
let Schema = new mongoose.Schema({
	name: {type:String, required:true, unique:true},
	vip:  {type:mongoose.Schema.Types.Long, default:0, index:true},
});
module.exports = mongoose.model('TopVip', Schema);
