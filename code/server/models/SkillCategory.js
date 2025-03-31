// load modules
const mongoose = require("mongoose");

// create city schema
var Skillcategory = new mongoose.Schema({
    name: String,
    description: String
});

module.exports = mongoose.model("SkillCategory", Skillcategory);
