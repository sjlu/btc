client.controller('tripleChart', function($scope, $http, $routeParams) {
  $scope.rate = $routeParams.rate || 900;
  $scope.algo = $routeParams.algo || 'dema'
  $scope.data = [];

  $scope.getData = function() {
    $http.get('/api/charts/'+$scope.algo+'/'+$scope.rate+'?points=96').success(function(data) {
      $scope.data = _.map(data, function(d) {
        d.fast = d[$scope.algo+'-'+$scope.rate+'-8'];
        d.mid = d[$scope.algo+'-'+$scope.rate+'-24'];
        d.slow = d[$scope.algo+'-'+$scope.rate+'-40'];
        return d;
      });
    });
  }
  $scope.getData();

  setInterval(function() {
    $scope.getData);
  }, $scope.rate*1000);

  $scope.chartOpts = {
    axes: {x: {type: "date", key: "time"}, y: {type: "linear"}},
    tooltip: {
      mode: "scrubber",
      formatter: function (x, y, series) {
        return moment(parseInt(x)).fromNow() + ' : ' + y;
      }
    },
    series: [
      {y: 'fast', axis: 'y1', color: 'blue', drawDots: true, dotSize: 2, thickness: '3px'},
      {y: 'mid', axis: 'y1', color: 'green', drawDots: true, dotSize: 2, thickness: '3px'},
      {y: 'slow', axis: 'y1', color: 'red', drawDots: true, dotSize: 2, thickness: '3px'},
      {y: 'close', axis: 'y1', color: 'black', drawDots: true, dotSize: 2}
    ],
    stacks: [],
    lineMode: "linear",
    tension: 0.7,
    drawLegend: true,
    drawDots: true,
    columnsHGap: 5
  };
});