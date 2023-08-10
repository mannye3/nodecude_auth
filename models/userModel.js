const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please enter  name"]
    },

    email: {
        type: String,
        required: [true, "Please add the contact email"],
        unique: [true, "Email address already taken"]
    },


    password: {
        type: String,
        required: [true, "Please add user password"]
    },


},{
    timestamps: true,
})

module.exports = mongoose.model("User", userSchema)