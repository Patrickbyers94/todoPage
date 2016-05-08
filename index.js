 var express = require('express');
 var app = express();
 var port = process.env.PORT||8080;
 var pg = require('pg').native;
 //var connectionString = "postgres://localhost:5432/tododb";
 var connectionString = "postgres://byerspatr:xYzzY@depot:5432/tododb";

 var client = new pg.Client(connectionString);
 client.connect();

 var bodyParser = require('body-parser')
 app.use(express.static(__dirname+'/webpage'))
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({
   extended: true
 }));


 app.get('/tasks', function (req, res){
   var query = client.query("SELECT * FROM todo;", function(error, data){
     res.json(data.rows);
   });
 });

 app.post('/tasks', function (req,res){
   var text = req.body.disc;
   var query = client.query("INSERT INTO todo (disc) VALUES ('"+text+"')");
   res.end();
 });

 app.delete('/tasks/:taskid', function (req,res){
   var id = req.params.taskid;
   var query = client.query("DELETE FROM todo WHERE id="+id+";");
   res.end();
 });

 app.put('/tasks/:taskid', function (req, res){
    var id = req.params.taskid;
    var query = client.query("UPDATE todo SET complete= NOT complete WHERE id="+id+";");
    res.end();
 })

 app.listen(port, function(){
   console.log('"Mr Anderson" -Agent Smith');
 });
