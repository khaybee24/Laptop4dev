const nodemailer = require('nodemailer');
const User = require("../model/userSchema");


const userDetails = async (req, res) => {
  try {
    const {firstName, lastName, email, phoneNumber, reasonForLaptop} = req.body;
    console.log(req.body);
    const existingUser = await User.findOne({ email:email});
    
    if (existingUser) {
      return res.status(400).json({error: "user already exists"});
    }
    const newUser = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      reasonForLaptop: reasonForLaptop
    })
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
        text: "Thank you for your submission, we will get back to you.",
      }; 
  
      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error occurred:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });
  
      return res.status(201).json({ message: "User created" });


} catch (error) {
  console.log("error creating user");
    return res.status(500)
      .json({ error: "Something went wrong creating a user" });
}

}

module.exports = {userDetails}