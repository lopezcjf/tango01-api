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
  connection.query('SELECT idevent, description, CAST(startdate AS CHAR) startdate FROM event', function (err, rows, fields) {
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
          res.json({ result: 'Error'});
        }
        else {
          res.json({ result: 'Success'});
        }
      });
})

app.get('/api/eventmember', function(req, res) {
  connection.query('SELECT m.idmember, ? as idevent, psnid, ifnull(confirmed,0) confirmed  ' +
  'FROM member m left join event_member em on m.idmember = em.idmember and em.idevent = ? ' +
  'ORDER BY confirmed desc, psnid', [req.query.idevent, req.query.idevent], function (err, rows, fields) {
    if (err) throw err
    console.log(req.query);
    res.json(rows);    
  })
})

app.post('/api/eventmember', function(req, res) {

  connection.query('SELECT confirmed FROM event_member where idmember = ? AND idevent = ?', [req.body.idmember, req.body.idevent]
  , function(err, result){
        if(err) {
          console.log(err);
          res.json({ result: 'Error'});
        }
        else {
          
          var updateConfirm = 0;
          if (result.length > 0){
            updateConfirm = result[0].confirmed;            
          }

          if (updateConfirm == 0){
            updateConfirm = 1;
          } else{
            updateConfirm = 0;
          }

          connection.query('INSERT INTO event_member (idmember, idevent, confirmed) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE confirmed = ?', [req.body.idmember, req.body.idevent, updateConfirm, updateConfirm]
          , function(err2, result2){
                if(err2) {
                  console.log(err2);
                  res.json({ result: 'Error'});
                }
                else {
                  res.json({ result: 'Success'});
                }
              });
        }
      });
})

 
app.listen(3000)