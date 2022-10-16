const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
var nodemailer = require("nodemailer");
const cors = require("cors");
app.use(cors());
const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");

const JWT_SECRET =
  "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";

const mongooseURL =
  "mongodb+srv://dannyalalam:sRob7w5bmBSf1Tfa@cluster0.iiordeo.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(mongooseURL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("connected to database");
  })
  .catch((e) => console.log(e));

app.listen(5000, () => {
  console.log("server started");
});
require("./customerDetails");
require("./ShopOwner");

const customer = mongoose.model("CustomerInfo");
app.post("/register", async (req, res) => {
  const { fname, lname, email, password } = req.body;
  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    const oldcustomer = await customer.findOne({ email });

    if (oldcustomer) {
      return res.json({ error: "User Exists" });
    }
    await customer.create({
      fname,
      lname,
      email,
      password: encryptedPassword,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});

app.post("/login", async (req, res) => {
  console.log("danyal");
  const { email, password } = req.body;

  const user = await customer.findOne({ email });
  if (!user) {
    return res.json({ error: "User Not found" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET);

    if (res.status(201)) {
      return res.json({ status: "ok", data: token });
    } else {
      return res.json({ error: "error" });
    }
  }
  res.json({ status: "error", error: "InvAlid Password" });
});

app.get("/logout", (req, res) => {
  console.log("logout");
  res.clearCookie("jwt", { path: "/" });
  res.status(200).send("user logout");
  res.end();
});

app.post("/userData", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET);

    const useremail = user.email;
    customer
      .findOne({ email: useremail })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) {}
});

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await customer.findOne({ email });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    const secret = JWT_SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "5m",
    });
    const link = `http://localhost:5000/reset-password/${oldUser._id}/${token}`;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "dannyalalam09@gmail.com",
        pass: "fvmultatpzjvmeqm",
      },
    });

    var mailOptions = {
      from: "youremail@gmail.com",
      to: email,
      subject: "Password Reset",
      text: link,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
        res.json({ status: `Email Sent to ${email} for verification` });
      }
    });
    console.log(link);
  } catch (error) {}
});

app.get("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  console.log(req.params);
  const oldUser = await customer.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    return res.render("index", { email: verify.email, status: "Not Verified" });
  } catch (error) {
    console.log(error);
    res.send("Not Verified");
  }
  res.send("done");
});

app.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const oldUser = await customer.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    await customer.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );

    res.render("index", { email: verify.email, status: "verified" });
  } catch (error) {
    console.log(error);
    res.json({ status: "Something Went Wrong" });
  }
});

// ????????????????????????????????????????????
//  ShopOwnerInfo

const shopOnwer = mongoose.model("ShopOwnerInfo");
app.post("/shopowner-register", async (req, res) => {
  const { fname, lname, email, password, shop_no, shopname, floor, catagorey , phone } =
    req.body;
  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    const oldShopOwner = await shopOnwer.findOne({ email });

    if (oldShopOwner) {
      
      return res.json({ error: "ShopOwner Exists" });
    }
    await shopOnwer.create({
      fname,
      lname,
      email,
      password: encryptedPassword,
      shop_no,
      shopname,
      floor,
      catagorey,
      phone
    });
    
    res.send({ status: "ok" });
  } catch (error) {
    
    res.send({ status: "error" });
  }
});
