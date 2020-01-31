var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = "mongodb://localhost:27017/mydb";

let authenticate = function(req,res,next){
var loggedIn = req.session.isLoggedIn;
console.log("loggedIn", loggedIn )
if(loggedIn)
{
  next();
}
else
{
  
  res.redirect('/signin');
}
}

let authenticated = function(req,res,next){
req.session.isLoggedIn = req.session.isLoggedIn ? true  : false ;
console.log('authenticated',req.session)
if(req.session.isLoggedIn){
  res.locals.user = req.session.user ;
  next();
}
else{
  next();
}
}

router.use(authenticated); // it will check if req.session.isloggedin then it will assign the value
router.use(authenticate);

router.get('/',function(req,res,next){
  res.render('index',{layout : 'layout_dashboard' , title :'My Profile Dashboard ' , user : req.session.user})
});

// list of projects 
router.get('/projects',function(req,res,next){
  MongoClient.connect(url,function(err,db){
    if(err) throw error
    let dbo = db.db('portfolio');
    dbo.collection('projects').find({}).toArray(function(err,project){
      if(err) throw error
      console.log(JSON.stringify(project));
      db.close();
      res.render('projects/listProjects',{layout : "layout_dashboard" , projects : project })
    })
  });
});

// create project 
router.get('/projects/new',function(req,res,next){
  res.render('projects/createProject',{ layout : 'layout_dashboard' ,'title' : 'create new project'})
});

//  submit project 
router.post('/projects/new',function(req,res,next){
  let title = req.body.title;
  let images = req.body.images;
  let description = req.body.description;
  let project = {title,images,description};
  MongoClient.connect(url,function(err,db){
    if(err) throw error;
    let dbo = db.db('portfolio');
    dbo.collection('projects').insertOne(project ,function(err,project){
      if(err) throw error;
      console.log(JSON.stringify(project));
      db.close();
      res.redirect('/projects');
    })
  });
});

//  project detail 
router.get('/projects/:id',function(req,res,next){
  //read the id from path param
  let id = req.params.id;
  MongoClient.connect(url,function(err,db){
    if(err) throw err;
    let dbo = db.db('portfolio');
    dbo.collection('projects').findOne({_id : new ObjectId(id)} , function(err,project){
      if(err) throw error
      console.log(JSON.stringify(project));
      db.close();
      res.render('projects/projectDetails',{layout : "layout_dashboard" , project : project })
    })
  });
});

// update project 
router.post('/projects/:id',function(req,res,next){
  let id = req.params.id;

  let title = req.body.title;
  let images = req.body.images;
  let description = req.body.description;
  let project = {title,images,description};
  let updatedProject = {$set:project};

  MongoClient.connect(url,function(err,db){
    if(err) throw err;
    let dbo = db.db('portfolio');
    dbo.collection('projects').updateOne({_id : new ObjectId(id)} , updatedProject , function(err,p){
      if(err) throw err;
      console.log(JSON.stringify(p));
      db.close();
      res.render('projects/projectDetails' , { project : project , layout : 'layout_dashboard', success : true});
    })
  });
});

// delete project 
router.get('/projects/:id/delete',function(req,res,next){
  let id = req.params.id;
  MongoClient.connect(url,function(err,db){
    if(err) throw err;
    let dbo = db.db('portfolio');
    dbo.collection('projects').deleteOne({_id : new ObjectId(id)} , function(err,project){
      if(err) throw err;
      console.log(JSON.stringify(project));
      db.close();
      res.redirect('/projects');
    })
  });
});

router.get('/logout',function(req ,res ,next){
  req.session.isLoggedIn=false;
  delete req.session.user;
  res.redirect('signin');
  });

module.exports = router;
