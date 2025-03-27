// load modules
const mongoose = require("mongoose");

// create city schema
var citySchema = new mongoose.Schema({
	city: String,
	state: String
});

module.exports = mongoose.model("City", citySchema);
