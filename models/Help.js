const mongoose = require("mongoose");

const HelpSchema = new mongoose.Schema({
    user: {
        type: mongoose.ObjectId,
            ref:"User"
    },
    comment:{
            type:String,
        },
    

});


const Help = mongoose.model("Help", HelpSchema);

module.exports = Help;