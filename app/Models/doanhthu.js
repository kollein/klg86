
let mongoose = require('mongoose');

let Schema = new mongoose.Schema({
	 tiennap: {type: Number,  required: true}, 
	 tienrut:  {type: Number,  required: true}, 
	// napthe: {type: Number,  required: true},
	// rutthe: {type: Number,  required: true},
	
});

Schema.index({uid:1, cnid:1}, {background:true});
module.exports = mongoose.model('doanhthu', Schema);