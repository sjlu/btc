client.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  $locationProvider.html5Mode(false);

  var routes = {
    '/chart/price': 'priceChart',
    '/chart/rainbow': 'rainbowChart',
    '/chart/triple': 'tripleChart',
    '/trends': 'trends'
  };

  for (var route in routes) {
    var controller = routes[route];
    $routeProvider.when(route, {
      templateUrl: controller + '.html',
      controller: controller
    });
  }

  $routeProvider.otherwise({
    redirectTo: '/chart/price'
  });

}]);