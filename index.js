var express = require('express')
var bodyParser = require('body-parser');
var mysql = require('mysql')
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'tango01',
  password : 'C2q79NBuBw1fJUvF8rz6',
  database : 'tango01'
});

connection.connect()

var app = express()
app.use(bodyParser.json())
 
app.get('/api/event', function(req, res) {
  connection.query('SELECT idevent as id, description, CAST(startdate AS CHAR) startdate FROM event', function (err, rows, fields) {
    if (err) throw err
    res.json(rows);    
  })
})

app.get('/api/members', function(req, res) {
  connection.query('SELECT psnid FROM member', function (err, rows, fields) {
    if (err) throw err
    res.json(rows);    
  })
})

app.get('/api/server', function(req, res) {
  connection.query('SELECT idserver FROM server', function (err, rows, fields) {
    if (err) throw err
    res.json(rows);    
  })
})

app.post('/api/event', function(req, res) {
  connection.query("INSERT INTO event (description, startdate) VALUES (?, STR_TO_DATE(?, '%d/%m/%Y %H:%i'))", [req.body.description, req.body.startdate]
  , function(err, result){
        if(err) {
          console.log(err);
          res.json('Error');
        }
        else {
          res.json('Success');
        }
      });
})

 
app.listen(3000)