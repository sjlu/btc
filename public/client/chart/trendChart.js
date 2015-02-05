client.controller('trendChart', function($scope, $http) {
  $scope.rate = 900;
  $scope.algo = 'dema';

  $scope.getData = function() {
    $http.get('/api/trends/'+$scope.algo+'-'+$scope.rate+'-8,24,40').success(function(data) {
      $scope.data = data;
    });
  }
  $scope.getData();

  $scope.chartOpts = {
    axes: {x: {type: "date", key: "time"}, y: {type: "linear"}},
    tooltip: {
      mode: "scrubber",
      formatter: function (x, y, series) {
        return moment(parseInt(x)).fromNow() + ' : ' + y;
      }
    },
    series: [
      {y: 'difference', axis: 'y1', color: '#F7977A', drawDots: true, dotSize: 2},
      {y: 'close', axis: 'y1', color: 'black', drawDots: true, dotSize: 2, visible: false}
    ],
    stacks: [],
    lineMode: "linear",
    tension: 0.7,
    drawLegend: true,
    drawDots: true,
    columnsHGap: 5
  };
});