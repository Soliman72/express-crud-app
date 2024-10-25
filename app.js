require("dotenv").config();

const express = require("express");
const userRouter = require("./routes/userRoute");
const authRouter = require("./routes/authRoute");
const productRoute = require("./routes/productRoute");

const app = express();
app.use(express.json());

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/products", productRoute);

module.exports = app;
