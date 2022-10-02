const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const cors = require("cors");
app.use(cors());

const jwt = require("jsonwebtoken");
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

// app.post("/post", async(req, res)=>{
//     console.log(req.body);
//     const {name} = req.body;

//     try {
//         if(name == "Daniyal"){
//             res.send({status:"ok"})
//         }
//         else{
//             res.send({status:"user not found"})
//         }

//     } catch (error) {
//         res.send({status:"error"})

//     }

// })
