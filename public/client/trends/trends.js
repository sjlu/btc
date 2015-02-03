client.controller('trends', function($scope, $http) {
  $http.get('/api/trends/dema-60-8,24,40').success(function(data) {
    $scope.data = _.map(data, function(row) {
      row.time = moment(row.time).format('MM/DD/YYYY hh:mm');
      return row;
    });
  });
});