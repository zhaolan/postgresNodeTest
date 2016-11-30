var express = require('express')
var app = express()
var pg = require('pg');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

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

app.listen(3000, function () {
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

var pool = new pg.Pool(config);


var insert = (title)=> {
  return new Promise((resolve, reject)=> { 

    // connect to our database
    pool.connect(function (err, client, done) {
      if (err) throw err;
      console.log("connect success");

      // execute a query on our database
      client.query('INSERT into titles (title) VALUES($1) RETURNING title',
        [title], function (err, result) {
          if (err) throw err;
          // just print the result to the console
          done();

          console.log("insert success", result);
          return resolve(result.rows[0]);
          // outputs: { name: 'brianc' }

          // disconnect the client
          client.end(function (err) {
            if (err) throw err;
          });
        });
    });
  });
};

var get = () => {
	return new Promise((resolve, reject)=> {
    // connect to our database
    pool.connect(function (err, client, done) {
      if (err) throw err;
      console.log("connect success");

      // execute a query on our database
      client.query('SELECT * FROM titles',function (err, result) {
          if (err) throw err;
          // just print the result to the console
          done();

          console.log("select  success", result);
          return resolve(result.rows);
          // outputs: { name: 'brianc' }

          // disconnect the client
          client.end(function (err) {
            if (err) throw err;
          });
        });
    });
  });
}


// module.exports = app;