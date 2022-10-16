const mongoose = require("mongoose");

const shopOwnerDetailsSchema = new mongoose.Schema(
  {
    fname: String,
    lname: String,
    email: { type: String, unique: true, required: true },
    shop_no: { type: Number, required: true },
    shopname:String,
    floor: Number,
    phone: Number,
    catagorey: String,
    password: { type: String, required: true },
    verifed: { type: Boolean, default: false },
  },
  {
    collection: "ShopOwnerInfo",
  }
);

mongoose.model("ShopOwnerInfo", shopOwnerDetailsSchema);
