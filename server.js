const express = require("express");
const ejs = require("ejs");
const mongo = require("mongoose");
const session = require("express-session");
const url = require("./setup/config").url;
const {sendMail,responseMail} = require("./utils/mail");
const { v4: uuidv4 } = require('uuid');
const {version : uuidVersion} = require('uuid');
const {validate : uuidValidate} = require('uuid');
const fetch = require("node-fetch");
var Insta = require('instamojo-nodejs');
Insta.setKeys(process.env.api_key, process.env.auth_key);

// const stripe = require('stripe')(SECRET_KEY);

// Import User table !
const User = require("./tables/User");


const port = process.env.PORT || 5500;
const host = '0.0.0.0';

let app = express();

app.set("view engine","ejs");

app.use(express.json());
app.use(express.urlencoded({extended:false}));



app.use(express.static(__dirname+"/public"));

const user = [];


// Middleware
function uuidValidateV4(uuid) {
  return uuidValidate(uuid) && uuidVersion(uuid) === 4;
}

// Database Connection

mongo.connect(url,{ useNewUrlParser: true,useUnifiedTopology: true  })
  .then(()=>console.log('Database Connected'))
  .catch(err=>console.log(`Something went wrong : ${err}`))

app.get("/",(req,res)=>{
    res.render("main");
});

app.get("/register",(req,res)=>{
    res.render("register",{error: ""});
})

app.post("/registerDetails",(req,res)=>{
    console.log(req.body);

    const {name,email,contact,clgname,branch} = req.body;

    if(name && email.includes("@") && contact.length === 10 && clgname && branch != "Branch"){

      // Check in database !
  
      User.findOne({contact : contact})
        .then((person)=>{
          if(person){

            res.render("register",{
              error : "Already Registered !"
            });

          }else{

      
            const userobj = {name,email,contact,clgname,branch,timeStamp : new Date().toLocaleString()};
  
            new User(userobj).save()
              .then((savedUser)=>{
                console.log('User registered !');
                // Send Email !
                const {name,email,contact,clgname,branch} = savedUser;
  
                // Send mail to user !
                sendMail(email,name,(err)=>{
                  if(err){
                    console.log("Error sending Mail !");
                  }else{
                    console.log("Sent successfully !");
                  }
                })
  
                                  // Response Mail !
                          responseMail(email,name,contact,branch,clgname,(err)=>{
                                    if(err){
                                      console.log("Error sending Mail !");
                                    }else{
                                      console.log("Response Mail sent successfully !");
                                      res.render("success");
                                    }
                                  })
              })
              .catch(err=>console.log(`Something went wrong : ${err}`));
          }
        })
        .catch(err=>console.log(`Something went wrong : ${err}`));
    }else{
      res.render("register",{
        error : "Failed"
      })
    } 

  

});

// app.post("/create-checkout-session",async(request,response)=>{
//   console.log(request.headers.origin);
//     const session = await stripe.checkout.sessions.create({
//         payment_method_types: ['card'],
//         line_items: [
//           {
//             price_data: {
//               currency: 'inr',
//               product_data: {
//                 name: 'IOT & Robotics Workshop 2021',
//               },
//               unit_amount: 100*100,
//             },
//             quantity: 1,
//           },
//         ],
//         mode: 'payment',
//         success_url: `${request.headers.origin}/success?contact=${request.query.contact}&id=${uuidv4()}`,
//         cancel_url: `${request.headers.origin}/failed`
//       });
//       response.json({ id: session.id });
// });


// app.get("/pay",(req,res)=>{
// var data = new Insta.PaymentData();
// data.purpose = "IOT&Robotics Workshop 2021";            // REQUIRED
// data.amount = 100;                  // REQUIRED
// data.setRedirectUrl(`https://workshop2021.herokuapp.com/success?contact=${req.query.contact}&id=${uuidv4()}`);
// data.currency = 'INR';
// data.phone = parseInt(req.query.contact);
// data.send_sms = 'True';

// Insta.createPayment(data, function(error, response) {
// if (error) {
//   // some error
//   console.log(error);
//   res.json({
//     message : "error"
//   })
// } else {
//   // Payment redirection link at response.payment_request.longurl
//   console.log(response);
//   res.json(response)
// }
// });
// })

// app.get("/success",(req,res)=>{
//   console.log("Contact Number of subscribed user : ",req.query.contact);

//   const {contact,id} = req.query;

//   console.log("ID : ",id);

//   console.log("Status : ",uuidValidateV4(id));

//   if(uuidValidateV4(id)){
//       // Get Index !
//   const getIndex = user.findIndex(user=>user.contact === contact);

//   if(getIndex < 0 || id === ""){
//     response.json({
//       message : "Error : Problem while searching in array !"
//     })
//   }else{
//     User.findOne({contact : user[getIndex].contact})
//       .then(function(person){
//         if(person){
//           res.json({
//             message : "Error : User already registered !"
//           })
//         }else{

//           const userObj = {
//             name : user[getIndex].name,
//             email : user[getIndex].email,
//             contact : user[getIndex].contact,
//             clgname : user[getIndex].clgname,
//             branch : user[getIndex].branch,
//             timeStamp : user[getIndex].timeStamp
//           }

//           new User(userObj).save()
//             .then((savedUser)=>{
//               console.log('User registered !');
//               // Send Email !
//               const {name,email,contact,clgname,branch} = savedUser;

//               // Send mail to user !
//               sendMail(email,name,(err)=>{
//                 if(err){
//                   console.log("Error sending Mail !");
//                 }else{
//                   console.log("Sent successfully !");
//                 }
//               })

//                                 // Response Mail !
//                         responseMail(email,name,contact,branch,clgname,(err)=>{
//                                   if(err){
//                                     console.log("Error sending Mail !");
//                                   }else{
//                                     console.log("Response Mail sent successfully !");
//                                     res.render("success");
//                                   }
//                                 })
//             })
//             .catch(err=>console.log(`Something went wrong : ${err}`));

//         }
//       })
//       .catch(err=>console.log(`Something went wrong : ${err}`))
//   }
//   }else{
//     res.render("register",{
//       error : "Failed"
//     })
//   }
  


// })

app.get("/failed",(req,res)=>{
    res.render("register",{
      error : "Failed"
    })
})

// Start Listening...
app.listen(port,host,()=>{
    console.log(`Server is running at port ${port}`);
})