//jshint esversion:6

//.....configurations.......
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const  _ = require('lodash');
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const helpers = require('./helpers/helpers.js');

const app = express();

var posts = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//......configuring the mongoDB
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/dailyJournalDB')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));



//end of configuring the mongoDB.........

//......creating mongoose schema and the model

const userSchema  = new mongoose.Schema({

  title :{
    type:String,
    required:true
  }  ,
  content :{
    type: String,
    required:true
  }
})

const Detail =  mongoose.model("Detail", userSchema);

// end of creating the mongoose schema and model.........

//........end fo configurations..............



//get methods
app.get("/", function(req,res){

  const findAllDocuments = async () => {

    try{
      const home_journals = await Detail.find({});
     
      console.log("database data had been readed");
      console.log(home_journals)
   

      res.render("home" , { homeJournal_content : home_journals  } );
    }catch(err){
      console.log(err);
    }

  } ;
  findAllDocuments();
 

  
})

app.get("/contact", function(req,res){

  res.render("contact" ,{contactSC : contactContent});
})

app.get("/about", function(req,res){

  res.render("about" , {aboutSC : aboutContent});
})


app.get("/compose", function(req,res){

  res.render("compose");
})


app.get("/update",function(req,res){

  const jornel_id = req.query.id;

  
  
  const getting_data_by_id = async () =>{

    try{
      const foundDetails = await Detail.findById(jornel_id);
        console.log("kodiiiiiiiiiiiiiiiiiiiiiiiiiii")
        console.log(foundDetails);
      res.render("update",{details : foundDetails});
    }catch(err){
      console.log(err);
    }
  }

  getting_data_by_id();

})
//end of get methods

//post methods
app.post("/publish", function(req,res){

 const title_submited = req.body.composeTitle;
 const content_submited = req.body.composePost;

 console.log(title_submited );
 
 console.log(content_submited );

 const addNewJournel  = async () =>{

  const newjournal = new Detail ({

    title : title_submited,
    content : content_submited

 });try{
    await newjournal.save();
    console.log("New journel added to the data base");
    res.redirect("/");
 }catch(err){
  console.log(err);
 }

 }

 addNewJournel();


})

//geeting the dynamic website url
app.get("/post/:postName" , function(req,res){

 const nameOfPost = _.lowerCase(req.params.postName);  //used lodash to change the string to lowercase

 const detailsForPosts = async () =>{

  try{
     const details =  await Detail.find({});
     details.forEach(function(post){

        const np =_.lowerCase(post.title);
        const postTitle = post.title;
        const postContent =post.content;
        const postId = post._id;
      

  if(nameOfPost === np){
    console.log("huu");
     
      res.render("post" ,{titleOfPost : postTitle , contentOfPost : postContent ,id :postId });

  }
 })
  }catch(err){
    console.log(err);
  }
 }
 detailsForPosts();
 
})

app.post("/delete", function(req,res){

  const id = req.body.deleteBtn;

  const deleting_jounel = async () =>{

    try {
      // Use await to ensure the document is deleted before redirecting
      const deletedDocument = await Detail.findByIdAndDelete(id);
      if (deletedDocument) {
        console.log('Deleted:', deletedDocument);
        res.redirect("/");
      } else {
        console.log('Document not found.');
        res.redirect("/"); // Redirect even if the document is not found
      }
    } catch (error) {
      console.error('Error:', error);
      res.redirect("/"); // Redirect in case of an error
    }

  }

  deleting_jounel();




 
})


app.post("/update_button_clicked",function(req,res){

  const id = req.body.updateBtn;

  res.redirect("/update?id=" + id);

})


app.post("/update_details", function(req,res){

  const updated_title = req.body.update_title;
  const updated_post = req.body.update_post;
  const updated_id = req.body.up_btn;

  const updatedFields = {
    title: updated_title,
    content: updated_post,
  };

  const real_update_details = async () =>{

    try{
      const uuu = await Detail.findByIdAndUpdate(updated_id ,updatedFields, { new: true } );

      if(uuu){
          console.log("updated");
          res.redirect("/");
      }else{
          console.log("not updated");
      }
    }catch(err){
      console.log(err);
    }
  }

  real_update_details();


})

//........end of post methods



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
