const express = require('express');
const dotenv = require('dotenv').config();
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const userRouter = require("./routes/user.routes");
const AdminRouter = require("./routes/AdminRoutes");
const connectDB = require("./database/db");
connectDB();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/v1/user", userRouter);
app.use("/api/v1/Admin", AdminRouter);
app.get("/", (req, res) => {
    res.send("WELCOME TO Laptop4Dev");
  });


app.listen (port, ()=> {
    console.log("port is active")
});
