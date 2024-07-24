import mongoose from "mongoose";
import validator from "validator";




const messageSchema = new mongoose.Schema({
    firstName : {
        type : String, 
        require : true,
        minLength : [5, 'Name should contain at least 6 character']
    
    },
    lastName: {
        type: String,
        required: true,
        minLength: [3, "Last Name cant be empty"]
      },
      email: {
        type: String,
        required: true,
        validate: [validator.isEmail, "Email is required"],
      },
      phone: {
        type: String,
        required: true,
        minLength: [11, "Its exactly 11 digits "],
        maxLength: [11, "Its exactly 11 digits"],
      },
      message: {
        type: String,
        required: true,
        minLength: [10, "Message contain some scripts"],
      },
});

export const Message = mongoose.model("Message", messageSchema);