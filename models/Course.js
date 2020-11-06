const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CourseSchema = new Schema({

    courseName: {
        type: String,
        required: true,
    },

});
module.exports = mongoose.model("Course", CourseSchema);