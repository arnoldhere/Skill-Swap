// load modules
const mongoose = require("mongoose");

// create city schema
var FeesSchema = new mongoose.Schema({
	requestId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "SkillCategory",
	},
	commission: { type: Number, default: 5.5 },
	timestamps: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Fee", FeesSchema);
