const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
    name: {
        type: String,
      
    },

    description: {
        type: String,
        required: false,
    },
    slug: {
        type: String,
        lowercase:true
    },
    comments: [
        {
            type: String,
        },
    ],
    rating: {
        type: Number,
        default: 0,
    },
    cumulativeRating: {
        type: Number,
        default: 0,
    },
    numberOfRatings: {
        type: Number,
        default: 0,
    }
   
});

const Course = mongoose.model("Course", CourseSchema);

module.exports = Course;