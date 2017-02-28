'use strict';

angular.module('pizzaApp', ['ngMaterial', 'ngAnimate', 'ngAria', 'angular.filter', 'ui.materialize']);

angular.module('pizzaApp').service('pizzaSrv', function ($http, $q) {

  var pizzaApi = 'https://pizzaserver.herokuapp.com';
  var ordersApi = '/api';

  //Get pizza list
  this.getPizzas = function () {
    return $http({
      method: 'GET',
      url: pizzaApi + '/pizzas'
    }).then(function (res) {
      //filters out pizzas w/ same names and no names
      res.data = res.data.filter(function (x, i, self) {
        return self.findIndex(function (t) {
          return t.name === x.name;
        }) === i && x.name;
      });
      return res;
    });
  };

  //Add a new pizza
  this.addPizza = function (pizza, desc) {
    return $http({
      method: 'POST',
      url: pizzaApi + '/pizzas',
      data: {
        name: pizza,
        description: desc
      }
    });
  };

  //Get toppings
  this.getToppings = function () {
    return $http({
      method: 'GET',
      url: pizzaApi + '/toppings'
    });
  };

  //Add a new topping
  this.addTopping = function (newTopping) {
    return $http({
      method: 'POST',
      url: pizzaApi + '/toppings',
      data: {
        name: newTopping
      }
    });
  };

  //Get target pizza toppings
  this.getTargetPizzaToppings = function (pizzaId) {
    return $http({
      method: 'GET',
      url: pizzaApi + '/pizzas/' + pizzaId + '/toppings'
    }).then(function (res) {
      return res;
    }, function (err) {
      //finds Pizzas who are no longer associated with toppings in the db
      return 'badPizza';
    });
  };

  //Add target Topping to target Pizza
  this.addToppingToPizza = function (pizzaId, toppingId) {
    return $http({
      method: 'POST',
      url: pizzaApi + '/pizzas/' + pizzaId + '/toppings',
      data: {
        topping_id: toppingId
      }
    });
  };

  //Get orders
  this.getOrders = function () {
    return $http({
      method: 'GET',
      url: ordersApi + '/orders'
    }).then(function (orders) {
      orders.data = orders.data.filter(function (x, i, self) {
        return self.findIndex(function (t) {
          return t.name === x.name;
        }) === i && x.name;
      });
      // return orders
      return orders;
    });
  };

  //Make a new order
  this.addOrder = function (orderName) {
    return $http({
      method: 'POST',
      url: ordersApi + '/orders',
      data: {
        name: orderName
      }
    });
  };

  // Add pizza to order
  this.addPizzaToOrder = function (pizzaId, pizzaName, orderId) {
    return $http({
      method: 'POST',
      url: ordersApi + '/pizzas',
      data: {
        id: pizzaId,
        name: pizzaName,
        orderid: orderId
      }
    });
  };

  //get target order's pizzas
  this.getTargetOrderPizzas = function (orderId) {
    return $http({
      method: 'GET',
      url: ordersApi + '/orders/' + orderId + '/pizzas'
    }).then(function (res) {
      return res;
    });
  };
});

angular.module('pizzaApp').controller('pizzaCtrl', function ($scope, $timeout, $mdSidenav, $mdToast, $log, pizzaSrv) {

  ///////////  PIZZAS  ////////////

  //populate pizza list for ng-repeat
  pizzaSrv.getPizzas().then(function (res) {
    $scope.pizzas = res.data;
  });

  //List Toppings
  pizzaSrv.getToppings().then(function (res) {
    $scope.toppings = res.data;
  });

  //Select a pizza and show toppings
  $scope.targetPizza = undefined;
  $scope.selectPizza = function (index, pizzaId, toppings) {
    if ($scope.targetPizza !== index) {

      //enlarge pizza
      $scope.targetPizza = index;

      //show Add Topping Button
      var showToppingsButton = function showToppingsButton() {
        toppings.showToppingsButton = true;
      };
      $timeout(showToppingsButton, 300);

      //show toppings *if 500 status return error message
      pizzaSrv.getTargetPizzaToppings(pizzaId).then(function (res) {
        if (res === 'badPizza') {
          $scope.targettoppings = [{ name: 'This Pizza Is Broken!', pizza_id: pizzaId }];
        } else {
          $scope.targettoppings = res.data;
        }
      });
      var showToppings = function showToppings() {
        toppings.showTargetToppings = true;
      };
      $timeout(showToppings, 200);

      //Click another pizza or unclick the selected pizza
    } else {
      //hide Add Topping Button
      toppings.showToppingsButton = false;

      //hide toppings
      toppings.showTargetToppings = false;

      //hide pizza
      $timeout(function () {
        return $scope.targetPizza = undefined;
      }, 150);
    }
  };

  //Add a topping to a pizza
  var originatorEv;
  $scope.openMenu = function ($mdMenu, ev) {
    originatorEv = ev;
    $mdMenu.open(ev);
  };

  $scope.addToppingToPizza = function (pizzaId, toppingId) {
    pizzaSrv.addToppingToPizza(pizzaId, toppingId).then(function (res) {

      //repopulate target pizza toppings list
      pizzaSrv.getTargetPizzaToppings(pizzaId).then(function (res) {
        $scope.targettoppings.push(res.data[res.data.length - 1]);
      });
    });
  };

  //Pizza Form Init
  $scope.newPizzaName = '';
  $scope.newPizzaDesc = '';
  $scope.newToppingName = '';
  //Toast
  $scope.pizzaAlert = function (alert, location) {
    $mdToast.show({
      hideDelay: 1500,
      position: 'bottom right',
      controller: 'pizzaCtrl',
      template: '<md-toast><i class="fa fa-exclamation" aria-hidden="true"></i><span class="md-toast-text" flex>' + alert + '</span></md-toast>',
      parent: location
    });
  };

  //Add New Pizza
  $scope.addNewPizza = function () {
    var newPizza = $scope.newPizzaName,
        newDesc = $scope.newPizzaDesc;
    //If no entry for Pizza => alert user
    if ($scope.newPizzaName === '') {
      //Error Toast
      $scope.pizzaAlert('Please enter a pizza name', '.pizzaForm');

      //if Pizza doesnt exist=> add pizza & alert user
    } else if ($scope.pizzas.findIndex(function (x) {
      return x.name.toLowerCase() === newPizza.toLowerCase();
    }) === -1) {
      pizzaSrv.addPizza(newPizza, newDesc).then(function (res) {
        //Alert Toast
        $scope.pizzaAlert('Pizza Added', '.pizzaForm');
        //empty inputs
        $scope.newPizzaName = '';
        $scope.newPizzaDesc = '';
        //repopulate pizza list
        $scope.pizzas.push(res.data);
      });

      //If Pizza already exists => alert user
    } else {
      //Error Toast
      $scope.pizzaAlert('This pizza already exists', '.pizzaForm');
      //empty inputs
      $scope.newPizzaName = '';
    }
  };

  //Add New topping
  $scope.addNewTopping = function () {
    var newTopping = $scope.newToppingName;
    //if no entry for topping => alert user
    if ($scope.newToppingName === '') {
      //Error Toast
      $scope.pizzaAlert('Please enter a topping name', '.toppingForm');

      //if topping doesnt exist=> add topping & alert user
    } else if ($scope.toppings.findIndex(function (x) {
      return x.name === newTopping;
    }) === -1) {
      pizzaSrv.addTopping(newTopping).then(function (res) {
        //Alert Toast
        $scope.pizzaAlert('Topping Added', '.toppingForm');
        //empty input
        $scope.newToppingName = '';
        //repopulate toppinglist
        $scope.toppings.push(res.data);
      });

      // if topping already exists => alert user
    } else {
      //Error Toast
      $scope.pizzaAlert('This topping already exists', '.toppingForm');
      //empty input
      $scope.newToppingName = '';
    }
  };

  ///////////  ORDERS  ////////////

  // Get orders
  $scope.updateOrders = function () {
    pizzaSrv.getOrders().then(function (orders) {
      $scope.orders = orders.data.map(function (x) {
        //add list of pizzas to orders
        pizzaSrv.getTargetOrderPizzas(x.id).then(function (pizzas) {
          var pizzaList = [];
          pizzas.data.map(function (x) {
            pizzaList.push(x.name);
          });
          x.pizzas = pizzaList;
        });
        return x;
      });
    });
  };
  $scope.updateOrders();

  $scope.newOrderName = '';
  //Add new order
  $scope.addNewOrder = function () {
    var newOrder = $scope.newOrderName;
    //If no entry for Order => alert user
    if ($scope.newOrderName === '') {
      //Error Toast
      $scope.pizzaAlert('Please enter an order name', '.orderForm');

      //if Order doesnt exist=> add order & alert user
    } else if ($scope.orders.findIndex(function (x) {
      return x.name.toLowerCase() === newOrder.toLowerCase();
    }) === -1) {
      pizzaSrv.addOrder(newOrder).then(function (res) {
        //Alert Toast
        $scope.pizzaAlert('Order Added', '.orderForm');
        //empty inputs
        $scope.newOrderName = '';
        //repopulate order list
        $scope.orders.push(res.data);
        $scope.updateOrders();
      });

      //If Order already exists => alert user
    } else {
      //Error Toast
      $scope.pizzaAlert('This order already exists', '.orderForm');
      //empty inputs
      $scope.newOrderName = '';
    }
  };

  // Add pizza to order
  $scope.addPizzaToOrder = function (pizzaId, pizzaName, orderId) {
    pizzaSrv.addPizzaToOrder(pizzaId, pizzaName, orderId).then(function (res) {
      $scope.updateOrders();
    });
  };

  /////////  MENU UX  /////////////


  //Open Add Pizza/Toppings Panel
  $scope.toggleRight = buildToggler('right');
  $scope.isOpenRight = function () {
    return $mdSidenav('right').isOpen();
  };

  //Open Add // View Orders Panel
  $scope.toggleRight2 = buildToggler('right2');
  $scope.isOpenRight2 = function () {
    return $mdSidenav('right2').isOpen();
  };

  /**
   * Supplies a function that will continue to operate until the
   * time is up.
   */
  function debounce(func, wait, context) {
    var timer;
    return function debounced() {
      var context = $scope,
          args = Array.prototype.slice.call(arguments);
      $timeout.cancel(timer);
      timer = $timeout(function () {
        timer = undefined;
        func.apply(context, args);
      }, wait || 10);
    };
  }
  /**
   * Build handler to open/close a SideNav; when animation finishes
   * report completion in console
   */
  function buildDelayedToggler(navID) {
    return debounce(function () {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav(navID).toggle().then(function () {});
    }, 200);
  }
  function buildToggler(navID) {
    return function () {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav(navID).toggle().then(function () {});
    };
  }
  $scope.close = function () {
    $mdSidenav('right').close().then(function () {});
  };
});