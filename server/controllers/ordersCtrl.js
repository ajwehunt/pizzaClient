var app = require('../../server');
var db = app.get('db');

module.exports = {

  getOrders: function(req, res){
    db.get_orders(function(err,orders){
      if (err) {
        res.status(500).json(err)
      } else {
        res.status(200).json(orders)
      }
    })
  },

  addOrder: function(req, res){
    db.add_order([req.body.name], function(err,orders){
      if (err) {
        res.status(500).json(err)
      } else {
        res.status(200).json(orders)
      }
    })
  },

  addPizza: function(req, res){
    db.add_pizza([req.body.name, req.body.orderid], function(err,orders){
      if (err) {
        res.status(500).json(err)
      } else {
        res.status(200).json(orders)
      }
    })
  },

  getPizzas: function(req, res){
    db.get_pizzas(function(err,orders){
      if (err) {
        res.status(500).json(err)
      } else {
        res.status(200).json(orders)
      }
    })
  },

  getOrderPizzas: function(req, res) {
    db.get_order_pizzas(req.params.orderid, (err, resp) => {
      if (err) {
        res.status(500).send(err)
      } else {
        res.status(200).send(resp)
      }
    })
  }

}
