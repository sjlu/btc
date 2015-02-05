client.controller('trends', function($scope, $http) {
  $scope.rate = 900;
  $scope.algo = 'dema';
  $scope.threshold = 0;

  $scope.getData = function() {
    $http.get('/api/trends/'+$scope.algo+'-'+$scope.rate+'-8,24,40/?threshold='+$scope.threshold).success(function(data) {
      $scope.data = _.map(data, function(row) {
        row.time = moment(row.time).format('ddd, M/D/YY, h:mm a');
        return row;
      });
    });
  }
  $scope.getData();
});