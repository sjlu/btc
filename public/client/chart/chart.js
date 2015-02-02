client.controller('chart', function($scope, $http) {
  $scope.data = [];
  $http.get('/api/charts/dema/900?points=10').success(function(data) {
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
      {y: 'dema-900-50', axis: 'y1', color: 'red', drawDots: true, dotSize: 2},
      {y: 'dema-900-25', axis: 'y1', color: 'green', drawDots: true, dotSize: 2},
      {y: 'dema-900-10', axis: 'y1', color: 'blue', drawDots: true, dotSize: 2},
      {y: 'close', axis: 'y1', color: 'black', drawDots: true, dotSize: 2},
    ],
    stacks: [],
    lineMode: "linear",
    tension: 0.7,
    drawLegend: true,
    drawDots: true,
    columnsHGap: 5
  };
});