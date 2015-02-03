client.controller('rainbowChart', function($scope, $http) {
  $scope.data = [];
  $http.get('/api/charts/dema/60?hoursAgo=3').success(function(data) {
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
      {y: 'dema-60-8', axis: 'y1', color: '#F7977A', drawDots: true, dotSize: 2},
      {y: 'dema-60-16', axis: 'y1', color: '#F9AD81', drawDots: true, dotSize: 2},
      {y: 'dema-60-24', axis: 'y1', color: '#FDC68A', drawDots: true, dotSize: 2},
      {y: 'dema-60-32', axis: 'y1', color: '#FFF79A', drawDots: true, dotSize: 2},
      {y: 'dema-60-40', axis: 'y1', color: '#C4DF9B', drawDots: true, dotSize: 2},
      {y: 'dema-60-48', axis: 'y1', color: '#A2D39C', drawDots: true, dotSize: 2},
      {y: 'dema-60-56', axis: 'y1', color: '#82CA9D', drawDots: true, dotSize: 2},
      {y: 'dema-60-64', axis: 'y1', color: '#7BCDC8', drawDots: true, dotSize: 2},
      {y: 'dema-60-72', axis: 'y1', color: '#6ECFF6', drawDots: true, dotSize: 2},
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