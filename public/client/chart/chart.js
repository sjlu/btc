client.controller('chart', function($scope, $http) {
  $scope.data = [];
  $http.get('/api/averages').success(function(data) {
    $scope.data = data;
  });

  $scope.chartOpts = {
    axes: {x: {type: "date", key: "time"}, y: {type: "linear"}},
    tooltip: {
      mode: "scrubber",
      formatter: function (x, y, series) {
        return moment(parseInt(x)).fromNow() + ' : ' + y;
      }
    },
    series: [
      {y: 'ema-900-800', axis: 'y1', color: 'green', drawDots: true, dotSize: 2},
      {y: 'ema-900-200', axis: 'y1', color: 'blue', drawDots: true, dotSize: 2},
      {y: 'ema-900-50', axis: 'y1', color: 'red', drawDots: true, dotSize: 2},
    ],
    stacks: [],
    lineMode: "linear",
    tension: 0.7,
    drawLegend: true,
    drawDots: true,
    columnsHGap: 5
  };
});