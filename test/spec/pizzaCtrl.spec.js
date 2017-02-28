'use strict';

describe('Controller: pizzaCtrl', function() {
  var pizzaCtrl,
  pizzaSrv,
  scope;

  //load the controllers module
  beforeEach(module('pizzaApp'));


  //Initialize the controller and mock scope
  beforeEach(inject(function($controller, $rootScope){
    pizzaSrv = {
      fn: function(){}
    }
    spyOn(pizzaSrv, 'fn').and.returnValue("Foo");
    
    scope = $rootScope.$new();
    pizzaCtrl = $controller('pizzaCtrl', {
      $scope: scope,
      pizzaSrv: pizzaSrv
    })
  }))

  // it('blahblahblahblah', function () {
  //   expect(scope.thisTest.length).toBe(3)
  // })


  it('has correct initial values', function() {
    expect(scope.value).toBe(0);
    expect(scope.maxValue).toBe(3);
});

});
