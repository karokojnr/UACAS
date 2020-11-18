const mongoose = require("mongoose");

const InstitutionSchema = new mongoose.Schema({

    institutionName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isInstitution: {
        type: String,
        default: "NO",
    },
    date: {
        type: Date,
        default: Date.now,
    },
});
module.exports = mongoose.model("institutions", InstitutionSchema);