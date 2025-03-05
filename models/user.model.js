import mongoose from "mongoose";
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "enter name"]
    },
    username: {
        type: String,
        lowercase : true,
        required: true
    },
    age: {
        type: Number,
        required: [true, "enter age"]
    },
    city: {
        type: String,
    }

},{
    timestamps: true
})
const User = mongoose.model("User", userSchema)
export default User;