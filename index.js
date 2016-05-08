 var express = require('express');
 var app = express();
 var port = process.env.PORT||8080;
 var pg = require('pg').native;
 var connectionString = "postgres://byerspatr:xYzzY@depot:5432/byerspatr_nodejs";
 
 var client = new pg.Client(connectionString);
 client.connect();
 
 var bodyParser = require('body-parser')
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({
   extended: true
 }));
 
 app.get('/',function(req, res){
   res.send('Hello World! \n');
 });
 
 app.get('/test_database', function(request, response){
   var query = client.query("SELECT * FROM todo;");
   var results =[]
   query.on('row', function(row){
     results.push(row);
   });
   
   query.on('end', function(){
     response.json(results);
   });
 });
 
 app.get('/tasks', function (req, res){
   res.send('This is a task.');
 });
 
 app.post('/task', function (req,res){
   var text = req.body;
   var query = client.query("INSERT INTO todo (item) VALUES ('"+text+"')");
   res.end();
 });
 
 app.listen(port, function(){
   console.log('Example app listening on port 8080!');
 });
