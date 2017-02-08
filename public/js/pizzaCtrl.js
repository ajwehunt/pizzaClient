angular.module('pizzaPlanetApp')
.controller('pizzaCtrl', function($scope, $timeout, $mdSidenav, $log, pizzaSrv) {



  //populate pizza list for ng-repeat
  pizzaSrv.getPizzas().then(function(res){
      $scope.pizzas = res.data
  })



  //List Toppings
  pizzaSrv.getToppings().then(function(res){
    $scope.toppings = res.data
  })



  //Select a pizza and show toppings
  $scope.targetPizza = undefined;

  $scope.selectPizza = function (index, pizzaId, toppings) {
    if ($scope.targetPizza !== index) {

      //enlarge pizza
      $scope.targetPizza = index;

      //show Add Topping Button
      function showToppingsButton () {
        toppings.showToppingsButton = true
      }
      $timeout(showToppingsButton, 300)

      //show toppings
      pizzaSrv.getTargetPizzaToppings(pizzaId).then(function successCallback(res) {
        $scope.targettoppings = res.data
      }, function errorCallback(res) {
        return {name: ''}
      });
      function showToppings () {
        toppings.showTargetToppings = true
      }
      $timeout(showToppings, 300)

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
      $scope.pizzas.push(res.data)
    }, function errorCallback(res) {
    });
  }


  //Add New topping
  $scope.addNewTopping = function () {
    var newTopping = $scope.newToppingName;

    pizzaSrv.addTopping(newTopping).then(function successCallback(res) {
      //empty input
      $scope.newToppingName = '';

      //repopulate toppinglist
      $scope.toppings.push(res.data)
    }, function errorCallback(res) {
    });
  }


  //Add a topping to a pizza
  var originatorEv;
  $scope.openMenu = function($mdMenu, ev) {
      originatorEv = ev;
      $mdMenu.open(ev);
    };

  $scope.addToppingToPizza = function (pizzaId, toppingId) {
    pizzaSrv.addToppingToPizza(pizzaId, toppingId).then(function successCallback(res) {

      //repopulate target pizza toppings list
      pizzaSrv.getTargetPizzaToppings(pizzaId).then(function successCallback(res) {
          $scope.targettoppings.push(res.data[res.data.length-1])
      }, function errorCallback(res) {
        return {name: ''}
      });
    }, function errorCallback(res) {
    });
  }


  //Open Add Pizza/Toppings Panel
  $scope.toggleRight = buildToggler('right');
  $scope.isOpenRight = function(){
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
      timer = $timeout(function() {
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
    return debounce(function() {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav(navID)
        .toggle()
        .then(function () {
        });
    }, 200);
  }
  function buildToggler(navID) {
    return function() {
      // Component lookup should always be available since we are not using `ng-if`
      $mdSidenav(navID)
        .toggle()
        .then(function () {
        });
    };
  }
  $scope.close = function () {
    $mdSidenav('right').close()
      .then(function () {
      });
  };



})









// .controller('PositionDemoCtrl', function DemoCtrl($mdDialog) {
//   var originatorEv;
//
//   this.menuHref = "http://www.google.com/design/spec/components/menus.html#menus-specs";
//
//   this.openMenu = function($mdMenu, ev) {
//     originatorEv = ev;
//     $mdMenu.open(ev);
//   };
//
//   this.announceClick = function(index) {
//     $mdDialog.show(
//       $mdDialog.alert()
//         .title('You clicked!')
//         .textContent('You clicked the menu item at index ' + index)
//         .ok('Nice')
//         .targetEvent(originatorEv)
//     );
//     originatorEv = null;
//   };
// });
