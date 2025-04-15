// load modules
const mongoose = require("mongoose");

// create city schema
var Skillcategory = new mongoose.Schema({
	name: String,
	description: String,
	commission: { type: Number, default: 5.5 },
	price: { type: Number, default: 100 },
});

module.exports = mongoose.model("SkillCategory", Skillcategory);
