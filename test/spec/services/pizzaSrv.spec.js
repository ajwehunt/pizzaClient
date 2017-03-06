describe('Pizza Service', function() {
  var pizzaSrv, http;

  // Load our api.users module
  beforeEach(angular.mock.module('pizzaApp'));

  // Set our injected Pizza Service (_pizzaSrv_) to our local pizzaSrv variable
  beforeEach(inject(function(_pizzaSrv_, $http) {
    pizzaSrv = _pizzaSrv_;
    http = $http
  }));

  // // A simple test to verify the pizza service exists
  it('should exist', function() {
    expect(pizzaSrv).toBeDefined();
  });

  // // A set of tests for our Users.all() method
  // describe('.all()', function() {
  //   // A simple test to verify the method all exists
  //   it('should exist', function() {
  //     expect(pizza.all).toBeDefined();
  //   });
  // });
});
