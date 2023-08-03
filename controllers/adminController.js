const nodemailer = require('nodemailer');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");
const saltRounds = 10

const AdminSignup = async (req, res) => {
    try {
        const {firstName, lastName, email, password} = req.body;
        const existingUser = await User.findOne ({email: email});

        if (existingUser) {
            return res.status(400).json({message: "User already exists"});
        }
        const hashedPassword =await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            role: "admin",
          });
          await newUser.save();

          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.USER_EMAIL,
              pass: process.env.USER_PASSWORD,
            },
          });
      
          // Define the email options
          const mailOptions = {
            from: process.env.USER_EMAIL,
            to: `${newUser.email}`,
            subject: "Hello from Laptop4Dev",
            text: "welcome, you are an administrator",
          }; 
      
          // Send the email
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log("Error occurred:", error);
            } else {
              console.log("Email sent:", info.response);
            }
          });

    } catch (error) {
        return res
      .status(500)
      .json({ error: "Something went wrong creating a user" });
    }
}

const adminLogin = async (req, res) => {
    try {
      const { firstName, password } = req.body;
      const user = await User.findOne({ firstName:firstName });
      if (!user) {
       return res.status(404).json({ message: "user not found" });
      }
      if(user.role !== "admin") {
        return  res.status(404).json({ message: "You are not Authorized" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
       return res.status(401).json({ message: "Incorrect Password" });
      }
      const expirationTime = process.env.expires_In;
      const payload = {
        userId: user._id,
      };
      
      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: expirationTime }
        );
        // console.log(token)
        
      const dataInfo = {
        status: "success",
        message: "Admin Logged in successfully.",
        access_token: token,
      };
      // Create a transporter using your Gmail account
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.USER_EMAIL,
          pass: process.env.USER_PASSWORD,
        },
      });
  
      // Define the email options
      const mailOptions = {
        from: process.env.USER_EMAIL,
        to: `${user.email}`,
        subject: "Hello administrator",
        text: "You Just logged In to your Site.",
      };
  
      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error occurred:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });
      return res.status(200).json({ dataInfo });
    } catch (error) {
        console.error("Error occurred during adminLogin:", error);
      return res
        .status(500)
        .json({ error: "Something went wrong logging in user" });
    }
  };
  
  const findAllUser = async (req, res) => {
    try {
      const { userId } = req.user;
      const user = await User.findOne({ _id: userId });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (user.role !== "admin") {
        return res.status(403).json({ message: "You are not authorized to access this route" });
      }
  
      // Only fetch users with the role "user"
      const allUser = await User.find({ role: "user" });
  
      return res.status(200).json({ count: allUser.length, data: allUser });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong finding all users" });
    }
  };


// Route to get the total number of users
const noUsers = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.status(200).json({ totalUsers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Something went wrong while fetching total users' });
  }
};





module.exports = { AdminSignup, adminLogin, findAllUser, noUsers};