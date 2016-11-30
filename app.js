var express = require('express')
var app = express()
var pg = require('pg');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

app.get('/hello', function (req, res) {
    res.send("hello")
})

app.get('/titles', function (req, res) {
	get().then((results) => {
		res.send(results)
	})
})

app.post('/title/:name', jsonParser, function (req, res) {
  var title = req.params.name;
  console.log(title, 'htopppp')
  insert(title).then((id)=> {
    res.send(id)
  }, (err)=> {
    res.send(err)

  })
})

app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!')
})

var config = {
  user: 'lanzhao', //env var: PGUSER
  database: 'testheroku', //env var: PGDATABASE
  host: 'localhost', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

var connectURL = process.env.DATABASE_URL || "postgresql://lanzhao@localhost:5432/testheroku";
pg.defaults.ssl = process.env.SSL || false;

var client = new pg.Client(connectURL);

var insert = (title)=> {
  return new Promise((resolve, reject)=> { 

    // connect to our database
      client.connect(function (err) {
      if (err) throw err;
      console.log("connect success");
      // execute a query on our database
      client.query('INSERT into  titles (title) VALUES($1) RETURNING title', [title], (err, res)=> {
        if (err) throw err;
        resolve(res.rows);
        client.end();

      });
        //.on('row', (row)=>{
        //  console.log("insert success");
        //
        //  resolve(row);
        //})
        //.on('end', function() {
        //  console.log("end success");
        //
        //  client.end();
        //});
    });
  });
};

var get = () => {
	return new Promise((resolve, reject)=> {
    // connect to our database
    client.connect(function (err) {
      if (err) throw err;
      console.log("connect success");

      // execute a query on our database
      client.query('SELECT * FROM titles', (err, res)=> {
        debugger;
        if (err) throw err;

        resolve(res.rows);
        client.end();
      });
        //.on('row', (row)=>{
        //  console.log("get success");
        //  resolve(row);
        //})
        //.on('end', function(rows) {
        //  console.log("end success rows", rows);
        //  client.end();
        //});
    });
  });
};


// module.exports = app;