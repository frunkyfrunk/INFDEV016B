// The User model

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var userSchema = new Schema({
	username:  { 
		type    : String,
		required: true,
		unique  : true
	},

	password: { 
		type    : String,
		required: true,
		unique  : false
	},

	money: {
		type     : Number
	}
});


module.exports = mongoose.model('User', userSchema);
