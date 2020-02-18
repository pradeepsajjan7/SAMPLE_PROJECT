var express = require("express");
var router = express.Router();

let users = [
  { email: "pra@p.com", pwd: 1234, name: "PRADEEP" },
  { email: "ary@a.com", pwd: 5678, name: "RAMESH" }
];

router.get("/", function(req, res) {
  res.render("signin", { title: "signin" });
});

router.post("/", function(req, res) {
  let email = req.body.email;
  let pwd = req.body.pwd;
  console.log(email);
  console.log(pwd);
  if (email != undefined && email !== "" && pwd != undefined && pwd !== "") {
    users.forEach(u => {
      if (u.email == email && u.pwd == pwd) {
        req.session.isLoggedIn = true;
        req.session.user = u;
        res.redirect("/");
      }
    });
  } else {
    res.render("signin", { title: "signin" });
  }
});



module.exports = router;
