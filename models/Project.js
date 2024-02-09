const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required:true,
    },
    description: {
        type: String,
        required: false,
    },
    slug: {
        type: String,
        lowercase:true
    },
    links: [
        {
            type: String,
        },
    ],
    techstacks: [
        {
            type: String,
        },
    ],
    photo: {
        data: Buffer,
        contentType:String
    },
    videos: [{
      type:String,  
    }],
    comments: [
        {
            type: String,
        },
    ],
    contributors: [
        {
            type: mongoose.ObjectId,
            ref:"User"
        }
    ],
    askforhelp: [
        {
            type: mongoose.ObjectId,
            ref:"Help"
        }
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

const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;