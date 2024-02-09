const mongoose = require("mongoose");
const axios = require('axios');
// Function to fetch the default profile photo and convert it to buffer
async function getDefaultPhoto() {
    try {
        const response = await axios.get("https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg", {
            responseType: "arraybuffer"
        });
        return {
            data: Buffer.from(response.data, "binary"),
            contentType: response.headers["content-type"]
        };
    } catch (error) {
        console.error("Error fetching default photo:", error);
        throw error;
    }
}
const UserSchema = new mongoose.Schema({
    userid: {
        type: String, 
        required:true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    
    photo: {
        data: Buffer,
        contentType: String,
       
        
    },
    courses: [
        {
            type: mongoose.ObjectId,
            ref:"Course"
        },
    ],
    slug: {
        type:String,
    },
    projects: [
        {
            type: mongoose.ObjectId,
            ref:"Project"
        },
    ],

    skills: [
        {
            type:String,
        },
    ],

});
// Before saving, set the default photo
UserSchema.pre("save", async function(next) {
    if (!this.photo.data) {
        try {
            const defaultPhoto = await getDefaultPhoto();
            this.photo.data = defaultPhoto.data;
            this.photo.contentType = defaultPhoto.contentType;
        } catch (error) {
            console.error("Error setting default photo:", error);
        }
    }
    next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;