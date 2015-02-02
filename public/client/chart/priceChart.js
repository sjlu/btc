client.controller('priceChart', function($scope, $http,element) {
  $scope.data = [];
  $http.get('/api/charts/price').success(function(data) {
    $scope.data = data;
  });
});