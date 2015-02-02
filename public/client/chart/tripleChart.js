client.controller('tripleChart', function($scope, $http) {
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
      {y: 'dema-900-8', axis: 'y1', color: 'blue', drawDots: true, dotSize: 2, thickness: '3px'},
      {y: 'dema-900-24', axis: 'y1', color: 'green', drawDots: true, dotSize: 2, thickness: '3px'},
      {y: 'dema-900-40', axis: 'y1', color: 'red', drawDots: true, dotSize: 2, thickness: '3px'},
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