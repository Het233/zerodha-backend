require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

const bodyParser = require("body-parser");
const cors = require("cors");

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");

const { UserModel } = require("./model/UserModel");

app.use(cors());
app.use(bodyParser.json());

app.get("/allHoldings", async (req, res) => {
  let allHoldings = await HoldingsModel.find({});
  res.json(allHoldings);
});

app.get("/allPositions", async (req, res) => {
  let allPositions = await PositionsModel.find({});
  res.json(allPositions);
});

app.post("/newOrder", async (req, res) => {
  let newOrder = new OrdersModel({
    name: req.body.name,
    qty: req.body.qty,
    price: req.body.price,
    mode: req.body.mode,
  });

  newOrder.save();

  res.send("Order saved!");
});



app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await UserModel.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: "Username already exists" });
  }
  const newUser = new UserModel({ username, password });
  await newUser.save();
  res.status(201).json({ message: "User created successfully" });
});
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  console.log("Login attempt:", username, password); // add this temporarily

  const user = await UserModel.findOne({ username, password });

  console.log("User found:", user); // add this temporarily

  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  res.json({ message: "Login successful", userId: user._id });
});
app.get("/allUsers", async (req, res) => {
  const users = await UserModel.find({});
  res.json(users);
});

app.listen(PORT, () => {
  console.log("App started!");
  mongoose.connect(uri);
  console.log("DB connected!");
});
