const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;

  var data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merch_fields: {
        FNAME: fname,
        LNAME: lname
      }
    }]
  }
  app.post("/failure.html",function(req,res){
    res.redirect("/");
  })

  const jsonData = JSON.stringify(data);

  const url = "https://us5.api.mailchimp.com/3.0/lists/d62d4a690f";

  const option = {
    method: "POST",
    auth: "Mohamad1:f6a6fc048ffb5eb312e480d8452dc47e-us5"
  }

  const request = https.request(url, option, function(response) {
    response.on("data", function(data) {
      console.log(JSON.parse(data));
      const stts=response.statusCode;
      if(stts==200){
        res.sendFile(__dirname + "/success.html");
      }
      else{
        res.sendFile(__dirname + "/failure.html");
      }
    })
  })

  request.write(jsonData);
  request.end();
});

app.listen(process.env.PORT);
