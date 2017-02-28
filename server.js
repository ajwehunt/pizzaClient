var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var massive = require('massive');
var config = require('./config')
var connectionString = 'postgres://postgres:@localhost/pizzadb';
// var connectionString = config.connectionString;


///middleware///
var app = module.exports = express();

var massiveInstance = massive.connectSync({connectionString: connectionString});

app.set('db', massiveInstance);

app.use(cors());

app.use(bodyParser.json());
app.use(express.static('./public'));




///Controllers///
var ordersCtrl = require('./server/controllers/ordersctrl');

///Requests///
app.get('/api/orders', ordersCtrl.getOrders);

app.post('/api/orders', ordersCtrl.addOrder);

app.get('/api/pizzas', ordersCtrl.getPizzas);

app.post('/api/pizzas', ordersCtrl.addPizza);

app.get('/api/orders/:orderid/pizzas', ordersCtrl.getOrderPizzas)



//Listen
var port = config.port;
app.listen(port, function(){
  console.log('Port ' + port + ' is listening.');
});
