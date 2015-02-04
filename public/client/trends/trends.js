client.controller('trends', function($scope, $http) {
  $scope.rate = 300;
  $scope.algo = 'dema';

  $scope.getData = function() {
    $http.get('/api/trends/'+$scope.algo+'-'+$scope.rate+'-8,24,40').success(function(data) {
      $scope.data = _.map(data, function(row) {
        row.time = moment(row.time).format('ddd, M/D/YY, h:mm a');
        return row;
      });
    });
  }
  $scope.getData();
});