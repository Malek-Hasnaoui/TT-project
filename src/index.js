const express = require("express");
const path = require("path");
const collection = require("./config");
const bcrypt = require('bcrypt');
const upload=require("./multer")
const Uploads=require("./uploadConfig")
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});
app.get('/upload', (req, res) => {
    res.render("index");
  });
app.get('/files', (req, res) => {
    res.render("displayFile");
  });

app.post("/signup", async (req, res) => {

    const data = {
        name: req.body.username,
        password: req.body.password
    }

 
    const existingUser = await collection.findOne({ name: data.name });

    if (existingUser) {
        res.send('User already exists. Please choose a different username.');
    } else {
       
        const saltRounds = 10; 
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword; 

        const userdata = await collection.insertMany(data);
        res.redirect("/")
    }

});


app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            res.send("User name cannot found")
        }
        // Compare the hashed password from the database with the plaintext password
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isPasswordMatch) {
            res.send("wrong Password");
        }
        else {
            res.redirect("/upload");
        }
    }
    catch {
        res.send("wrong Details");
    }
});
app.post("/api/uplodeFiles",upload.single("file"),async (req,res)=>{
    try{
        const filePath = path.join('uploads', req.file.filename);
        console.log(filePath)
     const newFile=new Uploads({
        filePath:filePath
     })
     await newFile.save()

     res.status(200).json({message:"file saved successfuly"})
    }catch(err){
    console.log(err)
    res.status(400).json({message:"somthing is wrong"}) 
    }

  
})
app.get("/api/getFiles",async (req,res)=>{
    try{
        const files= await Uploads.find()
        res.status(200).json({files})
    }catch(err){
        res.status(500).json({error:err.message})
    }  
})


// Define Port for Application
const port = 5000;
app.listen(port, () => {
const connect = mongoose.connect("mongodb+srv://malekhasnaoui:malek1234@cluster0.ivcnkay.mongodb.net/");


connect.then(() => {
    console.log("Database Connected Successfully");
})
.catch(() => {
    console.log("Database cannot be Connected");
})
    console.log(`Server listening on port ${port}`)
});