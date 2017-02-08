angular.module('pizzaPlanetApp')
.service('pizzaSrv', function($http) {

  var apiUrl = 'https://pizzaserver.herokuapp.com'

  //Get pizza list
  this.getPizzas = function () {
    return $http({
      method: 'GET',
      url: apiUrl + '/pizzas'
    })
  }

  //Add a new pizza
  this.addPizza = function(pizza, desc) {
    return $http({
      method: 'POST',
      url: apiUrl + '/pizzas',
      data: {
        name: pizza,
        description: desc
      }
    })
  }

  //Get toppings
  this.getToppings = function () {
    return $http({
      method: 'GET',
      url: apiUrl + '/toppings'
    })
  }

  //Add a new topping
  this.addTopping = function (newTopping) {
    return $http({
      method: 'POST',
      url: apiUrl + '/toppings',
      data: {
        name: newTopping
      }
    })
  }

  //Get target pizza toppings
  this.getTargetPizzaToppings = function (pizzaId) {
    return $http({
      method: 'GET',
      url: apiUrl + '/pizzas/' + pizzaId + '/toppings'
    })
  }

  //Add target Topping to target Pizza
  this.addToppingToPizza = function (pizzaId, toppingId) {
    return $http({
      method: 'POST',
      url: apiUrl + '/pizzas/' + pizzaId + '/toppings',
      data: {
        topping_id: toppingId
      }
    })
  }



})
