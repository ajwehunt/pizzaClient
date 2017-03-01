angular.module('pizzaApp')
.controller('pizzaCtrl', function($scope, $timeout, $mdSidenav, $mdToast, $log, pizzaSrv) {


///////////  PIZZAS  ////////////

  //populate pizza list for ng-repeat
  pizzaSrv.getPizzas().then((res) => {
    $scope.pizzas = res.data
  })


  //List Toppings
  pizzaSrv.getToppings().then((res) => {
    $scope.toppings = res.data
  })


  //Select a pizza and show toppings
  $scope.targetPizza = undefined;
  $scope.selectPizza = (index, pizzaId, toppings) => {
    if ($scope.targetPizza !== index) {

      //enlarge pizza
      $scope.targetPizza = index;

      //show Add Topping Button
      let showToppingsButton = () => {
        toppings.showToppingsButton = true
      }
      $timeout(showToppingsButton, 300)

      //show toppings *if 500 status return error message
      pizzaSrv.getTargetPizzaToppings(pizzaId).then((res) => {
        if (res === 'badPizza') {
          $scope.targettoppings = [{name: 'This Pizza Is Broken!', pizza_id: pizzaId}]
        } else {
          $scope.targettoppings = res.data
        }
      });
      let showToppings = () => {
        toppings.showTargetToppings = true
      }
      $timeout(showToppings, 200)

    //Click another pizza or unclick the selected pizza
    } else {
      //hide Add Topping Button
      toppings.showToppingsButton = false;

      //hide toppings
      toppings.showTargetToppings = false;

      //hide pizza
      $timeout(() => $scope.targetPizza = undefined,150)
    }
  };


  //Add a topping to a pizza
  var originatorEv;
  $scope.openMenu = ($mdMenu, ev) => {
      originatorEv = ev;
      $mdMenu.open(ev);
    };

  $scope.addToppingToPizza = (pizzaId, toppingId) => {
    pizzaSrv.addToppingToPizza(pizzaId, toppingId).then((res) => {

      //repopulate target pizza toppings list
      pizzaSrv.getTargetPizzaToppings(pizzaId).then((res) => {
          $scope.targettoppings.push(res.data[res.data.length-1])
      });
    });
  }


  //Pizza Form Init
  $scope.newPizzaName = '';
  $scope.newPizzaDesc = '';
  $scope.newToppingName = '';
  //Toast
  $scope.pizzaAlert = (alert, location) => {
    $mdToast.show({
      hideDelay   : 1500,
      position    : 'bottom right',
      controller  : 'pizzaCtrl',
      template : '<md-toast><i class="fa fa-exclamation" aria-hidden="true"></i><span class="md-toast-text" flex>'+alert+'</span></md-toast>',
      parent : location
    });
  };


  //Add New Pizza
  $scope.addNewPizza = () => {
    let newPizza = $scope.newPizzaName,
        newDesc = $scope.newPizzaDesc;
    //If no entry for Pizza => alert user
    if ($scope.newPizzaName === '') {
      //Error Toast
      $scope.pizzaAlert('Please enter a pizza name', '.pizzaForm');

    //if Pizza doesnt exist=> add pizza & alert user
  } else if ($scope.pizzas.findIndex(x=>x.name.toLowerCase() === newPizza.toLowerCase()) === -1) {
      pizzaSrv.addPizza(newPizza, newDesc).then((res) => {
        //Alert Toast
        $scope.pizzaAlert('Pizza Added', '.pizzaForm');
        //empty inputs
        $scope.newPizzaName = '';
        $scope.newPizzaDesc = '';
        //repopulate pizza list
        $scope.pizzas.push(res.data)
      });

    //If Pizza already exists => alert user
    } else {
      //Error Toast
      $scope.pizzaAlert('This pizza already exists', '.pizzaForm');
      //empty inputs
      $scope.newPizzaName = '';
    }
  }


  //Add New topping
  $scope.addNewTopping = () => {
    var newTopping = $scope.newToppingName;
    //if no entry for topping => alert user
    if ($scope.newToppingName === '') {
      //Error Toast
      $scope.pizzaAlert('Please enter a topping name', '.toppingForm');

    //if topping doesnt exist=> add topping & alert user
    } else if ($scope.toppings.findIndex(x=>x.name === newTopping) === -1) {
      pizzaSrv.addTopping(newTopping).then((res) => {
        //Alert Toast
        $scope.pizzaAlert('Topping Added', '.toppingForm');
        //empty input
        $scope.newToppingName = '';
        //repopulate toppinglist
        $scope.toppings.push(res.data)
      });

    // if topping already exists => alert user
    } else {
      //Error Toast
      $scope.pizzaAlert('This topping already exists', '.toppingForm');
      //empty input
      $scope.newToppingName = '';
    }
  }



 ///////////  ORDERS  ////////////

  // Get orders
  $scope.updateOrders = function () {
    pizzaSrv.getOrders().then((orders) => {
      $scope.orders = orders.data.map((x)=>{
        //add list of pizzas to orders
        pizzaSrv.getTargetOrderPizzas(x.id).then((pizzas)=>{
          let pizzaList = []
          pizzas.data.map((x)=>{
            pizzaList.push(x.name)
          })
          x.pizzas = pizzaList
        })
        return x
      })
    })
  }
  $scope.updateOrders()


  $scope.newOrderName = '';
  //Add new order
  $scope.addNewOrder = () => {
    let newOrder = $scope.newOrderName
    //If no entry for Order => alert user
    if ($scope.newOrderName === '') {
      //Error Toast
      $scope.pizzaAlert('Please enter an order name', '.orderForm');

    //if Order doesnt exist=> add order & alert user
  } else if ($scope.orders.findIndex(x=>x.name.toLowerCase() === newOrder.toLowerCase()) === -1) {
      pizzaSrv.addOrder(newOrder).then((res) => {
        //Alert Toast
        $scope.pizzaAlert('Order Added', '.orderForm');
        //empty inputs
        $scope.newOrderName = '';
        //repopulate order list
        $scope.orders.push(res.data)
        $scope.updateOrders()
      });

    //If Order already exists => alert user
    } else {
      //Error Toast
      $scope.pizzaAlert('This order already exists', '.orderForm');
      //empty inputs
      $scope.newOrderName = '';
    }
  }

  // Add pizza to order
  $scope.addPizzaToOrder = (pizzaName, orderId) => {
    pizzaSrv.addPizzaToOrder(pizzaName, orderId).then((res) => {
      $scope.updateOrders()
    })
  }



 /////////  MENU UX  /////////////


 //Open Add Pizza/Toppings Panel
 $scope.toggleRight = buildToggler('right');
 $scope.isOpenRight = () => {
   return $mdSidenav('right').isOpen();
 };

 //Open Add // View Orders Panel
 $scope.toggleRight2 = buildToggler('right2');
 $scope.isOpenRight2 = () => {
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
