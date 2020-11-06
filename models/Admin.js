const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
    
    username: {
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
    isAdmin: {
        type: String,
        default: "YES",
    },
    date: {
        type: Date,
        default: Date.now,
    },
});
module.exports = mongoose.model("Admin", AdminSchema);