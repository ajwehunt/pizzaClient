angular.module('pizzaApp')
.service('pizzaSrv', function($http, $q) {

  let pizzaApi = 'https://pizzaserver.herokuapp.com';
  let ordersApi = 'https://enigmatic-basin-86907.herokuapp.com';


  //Get pizza list
  this.getPizzas = () => {
    return $http({
      method: 'GET',
      url: pizzaApi + '/pizzas'
    })
    .then((res) => {
      //filters out pizzas w/ same names and no names
      res.data = res.data.filter((x, i, self) => (self.findIndex((t) => t.name === x.name) === i) && x.name)
      return res
    })
  }

  //Add a new pizza
  this.addPizza = (pizza, desc) => {
    return $http({
      method: 'POST',
      url: pizzaApi + '/pizzas',
      data: {
        name: pizza,
        description: desc
      }
    })
  }

  //Get toppings
  this.getToppings = () => {
    return $http({
      method: 'GET',
      url: pizzaApi + '/toppings'
    })
  }

  //Add a new topping
  this.addTopping = (newTopping) => {
    return $http({
      method: 'POST',
      url: pizzaApi + '/toppings',
      data: {
        name: newTopping
      }
    })
  }

  //Get target pizza toppings
  this.getTargetPizzaToppings = (pizzaId) => {
    return $http({
      method: 'GET',
      url: pizzaApi + '/pizzas/' + pizzaId + '/toppings'
    })
    .then((res) => {
      return res
    }, (err) => {
      //finds Pizzas who are no longer associated with toppings in the db
      return 'badPizza';
    })
  }

  //Add target Topping to target Pizza
  this.addToppingToPizza = (pizzaId, toppingId) => {
    return $http({
      method: 'POST',
      url: pizzaApi + '/pizzas/' + pizzaId + '/toppings',
      data: {
        topping_id: toppingId
      }
    })
  }

  //Get orders
  this.getOrders = () => {
    return $http({
      method: 'GET',
      url: ordersApi + '/orders'
    })
    .then((orders) => {
      orders.data = orders.data.filter((x, i, self) => (self.findIndex((t) => t.name === x.name) === i) && x.name)
      // return orders
      return orders
    })
  }

  //Make a new order
  this.addOrder = (orderName) => {
    return $http({
      method: 'POST',
      url: ordersApi + '/orders',
      data: {
        name: orderName
      }
    })
  }

  //Delete order
  this.deleteOrder = (orderId) => {
    return $http({
      method: 'DELETE',
      url: ordersApi + '/orders/' + orderId
    })
  }

  // Add pizza to order
  this.addPizzaToOrder = (pizzaName, orderId) => {
    return $http({
      method: 'POST',
      url: ordersApi + '/orders/' + orderId + '/pizzas',
      data: {
        name: pizzaName
      }
    })
  }

  //delete pizza from order
  this.deletePizzaFromOrder = (orderId, pizzaId) => {
    return $http({
      method: 'DELETE',
      url: ordersApi + '/orders/' + orderId + '/pizzas/' + pizzaId
    })
  }

  //get target order's pizzas
  this.getTargetOrderPizzas = (orderId) => {
    return $http({
      method: 'GET',
      url: ordersApi + '/orders/' + orderId + '/pizzas'
    })
    .then((res) => {
      return res
    })
  }


})
