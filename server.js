var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var massive = require('massive');
var config = require('./config')
var connectionString = 'postgres://postgres:@localhost/zenwaterart';
// var connectionString = config.connectionString;

var app = express();
module.exports = app;

var massiveInstance = massive.connectSync({connectionString: connectionString});

app.set('db', massiveInstance);

app.use(cors());

app.use(bodyParser.json());
app.use(express.static('./public'));


///Controllers///

///Requests///

var port = config.port;
app.listen(port, function(){
  console.log('Port ' + port + ' is listening.');
});
