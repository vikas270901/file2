var fs = require("file-system");
var express = require('express');
var multer = require('multer');
var bodyParser = require('body-parser');
var app = express();
var mongo = require('mongoose');
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
mongo.connect("mongodb://localhost:27017/newDb3", {useNewUrlParser:true});
var storage = multer.diskStorage({
	destination: function(req, file, callback){
		callback(null, './uploads');},
	filename: function(req, file, callback){
		var filename = Date.now()+'-'+file.originalname;	//switch (file.mimetype) {case 'image/png': filename = filename + ".pdf"; break; case 'image/docx': filename = filename + ".docx"; break; default: break;}
		callback(null, filename);
}});var upload = multer({storage:storage})

var schema = new mongo.Schema({
author:String,
name:String,
file:String,
sem:Number,
description:String,
likes:{type:Number, default:0}});
var model = new mongo.model("model", schema);

app.get("/", function(req, res) {
	res.render("page1");
}); 

app.get("/download/:id", function(req, res) {
	res.download("./uploads/"+req.params.id);
	console.log("File Successfully Downloaded...");
});

app.get("/delete/:id", function(req, res) {//console.log(req.params.id);
	model.findOneAndDelete({'file':req.params.id}, function(err, resl){
		if(err){console.log(err);}
		else{//console.log(resl);console.log("...");
			fs.unlink("./uploads/"+req.params.id);
			res.redirect("/files");
	}});
});

app.get("/read/:id", function(req, res) {//fs.readFile("./uploads/"+req.params.id, function(err, resl){res.contentType("application/pdf");console.log("./uploads/"+req.params.id);});
		console.log("File Location: "+__dirname + "/uploads/"+req.params.id);
		res.sendFile(__dirname + "/uploads/"+req.params.id);
});

app.post('/upload', upload.single('avatar'), function (req, res, next) {
	model.create({'author':req.body.author, 'name':req.body.name, 'file':req.file.filename, 'sem':req.body.sem, 'description':req.body.desc}, function(err, resl){ 
		if(err){console.log(err);}
		else{res.redirect("/thefile/"+req.file.filename);} 
	});
});

app.get("/thefile/:id", function(req, res){
	res.render("photos1", {filename:req.params.id});
});

app.post("/search", function(req, res){//console.log(req.body.name+req.body.sem);
	model.find({'name':req.body.name, 'sem':req.body.sem}, function(err, resl){
		//console.log(resl);
		res.render("searchresult", {data:resl});
	});
});

app.post("/searchtext", function(req, res){	//console.log(req.body.avatar);
	model.find({'file':req.body.avatar}, function(err, resl){//console.log(resl);
		if(err){console.log(err);}
		else{res.render("searchresult", {data:resl});
	}});
});

app.get("/files", function(req, res){
	model.find({}, function(err, resl){
	if(err){console.log(err);}
		else{//console.log(res.file);
			res.render("searchresult", {data:resl});}	
	});
});

app.listen(2003, function(req, res) {
	console.log("Listening to port 2003...");
});


 	// app.post("/api/Upload", function(req, res) {
	//     upload(req, res, function(err) {
	//         if (err) {
	//             return res.end("Something went wrong!");
	//         }
	//         return res.end("File uploaded sucessfully!.");
	//     });
	// });
