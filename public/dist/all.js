'use strict';

angular.module('pizzaApp', ['ngMaterial', 'ngAnimate', 'ngAria', 'angular.filter']);

angular.module('pizzaApp').service('pizzaSrv', function ($http) {

  var apiUrl = 'https://pizzaserver.herokuapp.com';

  //Get pizza list
  this.getPizzas = function () {
    return $http({
      method: 'GET',
      url: apiUrl + '/pizzas'
    });
  };

  //Add a new pizza
  this.addPizza = function (pizza, desc) {
    return $http({
      method: 'POST',
      url: apiUrl + '/pizzas',
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
      url: apiUrl + '/toppings'
    });
  };

  //Add a new topping
  this.addTopping = function (newTopping) {
    return $http({
      method: 'POST',
      url: apiUrl + '/toppings',
      data: {
        name: newTopping
      }
    });
  };

  //Get target pizza toppings
  this.getTargetPizzaToppings = function (pizzaId) {
    return $http({
      method: 'GET',
      url: apiUrl + '/pizzas/' + pizzaId + '/toppings'
    });
  };

  //Add target Topping to target Pizza
  this.addToppingToPizza = function (pizzaId, toppingId) {
    return $http({
      method: 'POST',
      url: apiUrl + '/pizzas/' + pizzaId + '/toppings',
      data: {
        topping_id: toppingId
      }
    });
  };
});

angular.module('pizzaApp').controller('pizzaCtrl', function ($scope, $timeout, $mdSidenav, $log, pizzaSrv) {

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

      //show Add Topping Button
      var showToppingsButton = function showToppingsButton() {
        toppings.showToppingsButton = true;
      };

      var showToppings = function showToppings() {
        toppings.showTargetToppings = true;
      };

      //enlarge pizza
      $scope.targetPizza = index;
      $timeout(showToppingsButton, 300);

      //show toppings
      pizzaSrv.getTargetPizzaToppings(pizzaId).then(function successCallback(res) {
        $scope.targettoppings = res.data;
      }, function errorCallback(res) {
        return { name: '' };
      });

      $timeout(showToppings, 300);
    } else {
      //hide pizza
      $scope.targetPizza = undefined;

      //hide Add Topping Button
      toppings.showToppingsButton = false;

      //hide toppings
      toppings.showTargetToppings = false;
    }
  };

  //Add New Pizza
  $scope.addNewPizza = function () {
    var newPizza = $scope.newPizzaName,
        newDesc = $scope.newPizzaDesc;

    pizzaSrv.addPizza(newPizza, newDesc).then(function successCallback(res) {
      //empty inputs
      $scope.newPizzaName = '';
      $scope.newPizzaDesc = '';

      //repopulate pizza list
      $scope.pizzas.push(res.data);
    }, function errorCallback(res) {});
  };

  //Add New topping
  $scope.addNewTopping = function () {
    var newTopping = $scope.newToppingName;

    pizzaSrv.addTopping(newTopping).then(function successCallback(res) {
      //empty input
      $scope.newToppingName = '';

      //repopulate toppinglist
      $scope.toppings.push(res.data);
    }, function errorCallback(res) {});
  };

  //Add a topping to a pizza
  var originatorEv;
  $scope.openMenu = function ($mdMenu, ev) {
    originatorEv = ev;
    $mdMenu.open(ev);
  };

  $scope.addToppingToPizza = function (pizzaId, toppingId) {
    pizzaSrv.addToppingToPizza(pizzaId, toppingId).then(function successCallback(res) {

      //repopulate target pizza toppings list
      pizzaSrv.getTargetPizzaToppings(pizzaId).then(function successCallback(res) {
        $scope.targettoppings.push(res.data[res.data.length - 1]);
      }, function errorCallback(res) {
        return { name: '' };
      });
    }, function errorCallback(res) {});
  };

  //Open Add Pizza/Toppings Panel
  $scope.toggleRight = buildToggler('right');
  $scope.isOpenRight = function () {
    return $mdSidenav('right').isOpen();
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