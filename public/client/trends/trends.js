client.controller('trends', function($scope, $http) {
  $scope.rate = 60;
  $scope.algo = 'dema';

  $scope.getData = function() {
    $http.get('/api/trends/'+$scope.algo+'-'+$scope.rate+'-8,24,40').success(function(data) {
      $scope.data = _.map(data, function(row) {
        row.time = moment(row.time).format('dd, MM Do YYYY, h:mm:ss a zz');
        return row;
      });
    });
  }
  $scope.getData();
});