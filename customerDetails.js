const mongoose = require("mongoose");

const customerDetailsSchema = new mongoose.Schema(
  {
    fname: String,
    lname: String,
    email: {type: String , unique: true, required: true},
    password:  {type: String , required: true},
    verifed:{type:Boolean , default: false}
  },
  {
    collection: "CustomerInfo",
  }
);

mongoose.model("CustomerInfo", customerDetailsSchema);
