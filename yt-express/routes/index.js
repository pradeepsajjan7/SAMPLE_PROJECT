var express = require("express");
var router = express.Router();
var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/sample";
var objectId = require("mongodb").ObjectId;

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/get-data", function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    if (err) throw error;
    let dbo = db.db("sample");
    dbo.collection("details").find({}).toArray(function(err, data) {
        if (err) throw error;
        console.log(JSON.stringify(data));
        db.close();
        res.render("index", { title: "form submission" , items : data });
      });
  });
});

router.post("/delete",function(req,res,next){
 let id = req.body.id;
  MongoClient.connect(url , function(err,db){
  if(err) throw error;
  let dbo = db.db("sample");
  dbo.collection('details').deleteOne({"_id" : objectId(id)},function(err , data){
    if(err) throw error;
    console.log("item deleted");
    //console.log(JSON.stringify(data));
    db.close();
    res.redirect("/");
   })
  });
});

router.post("/update",function(req,res,next){
  let id = req.body.id;
  var item = {
    name : req.body.name,
    email : req.body.email
  };
  MongoClient.connect(url , function(err,db){
    if(err) throw error;
    let dbo = db.db("sample");
    dbo.collection('details').updateOne({"_id": objectId(id)},{$set : item}, function(err , data){
    if(err) throw error;
    console.log("updated one");
    res.redirect('/');
    })
  })
})

router.post("/insert", function(req, res, next) {
  let item = {
    name: req.body.name,
    email: req.body.email
  };
  MongoClient.connect(url, function(err, db) {
    if (err) throw error;
    let dbo = db.db("sample");
    dbo.collection("details").insertOne(item, function(err, data) {
      if (err) throw error;
      console.log("insertion done");
      db.close();
      res.redirect("/");
    });
  });
});

module.exports = router;
