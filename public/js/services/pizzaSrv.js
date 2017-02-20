angular.module('pizzaApp')
.service('pizzaSrv', function($http) {

  const apiUrl = 'https://pizzaserver.herokuapp.com'


  //Get pizza list
  this.getPizzas = () => {
    return $http({
      method: 'GET',
      url: apiUrl + '/pizzas'
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
      url: apiUrl + '/pizzas',
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
      url: apiUrl + '/toppings'
    })
  }

  //Add a new topping
  this.addTopping = (newTopping) => {
    return $http({
      method: 'POST',
      url: apiUrl + '/toppings',
      data: {
        name: newTopping
      }
    })
  }

  //Get target pizza toppings
  this.getTargetPizzaToppings = (pizzaId) => {
    return $http({
      method: 'GET',
      url: apiUrl + '/pizzas/' + pizzaId + '/toppings'
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
      url: apiUrl + '/pizzas/' + pizzaId + '/toppings',
      data: {
        topping_id: toppingId
      }
    })
  }

})
