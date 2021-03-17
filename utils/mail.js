const nodemailer = require("nodemailer");
const env = require("dotenv").config();
// console.log(env);
console.log("Email from mail.js : ",process.env.EMAIL);

// Initialisation !
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

// Mail Body
const sendMail = (email,name,cb) => {
    const mailOptions = {
        to: email, // This is to be allowed by GMAIL
        from: "IOT & Robotics Workshop 2021",
        subject: "IOT & Robotics Workshop 2021 - Registration Successful",
        text: `Heyy ${name} !
                Your registration for workshop has been done successfully !
                For any queries contact - 7083376479(Aditya)`
    };


// Send Mail
transporter.sendMail(mailOptions, (err, data) => {
    console.log("Sending....");
    if (err) {
        console.log("Error from nodemailer or gmail might be !", err)
        cb(err, null);
    } else {
        console.log("Success ! Mail has been sent successfully from nodemailer !");
        cb(null, data);
    }
});
}


// Mail Body
const responseMail = (email,name,contact,branch,clg,cb) => {
    const mailOpts = {
        to: "addyprofessional242@gmail.com", // This is to be allowed by GMAIL
        from: "IOT & Robotics Workshop 2021",
        subject: "Registration Added",
        text: `Name - ${name} !
               Email - ${email}
               Contact - ${contact}
               College - ${clg}
               Branch - ${branch}`
    };


// Send Mail
transporter.sendMail(mailOpts, (err, data) => {
    console.log("Sending....");
    if (err) {
        console.log("Error from nodemailer or gmail might be !", err)
        cb(err, null);
    } else {
        console.log("Success ! Mail has been sent successfully from nodemailer !");
        cb(null, data);
    }
});

}


module.exports = {sendMail,responseMail};