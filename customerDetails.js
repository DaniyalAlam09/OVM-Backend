const mongoose = require("mongoose");

const customerDetailsSchema = new mongoose.Schema(
  {
    fname: String,
    lname: String,
    email: {type: String , unique: true},
    password: String,
  },
  {
    collection: "CustomerInfo",
  }
);

mongoose.model("CustomerInfo", customerDetailsSchema);
