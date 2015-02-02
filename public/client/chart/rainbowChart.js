client.controller('rainbowChart', function($scope, $http) {
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
      {y: 'dema-900-8', axis: 'y1', color: '#F7977A', drawDots: true, dotSize: 2},
      {y: 'dema-900-16', axis: 'y1', color: '#F9AD81', drawDots: true, dotSize: 2},
      {y: 'dema-900-24', axis: 'y1', color: '#FDC68A', drawDots: true, dotSize: 2},
      {y: 'dema-900-32', axis: 'y1', color: '#FFF79A', drawDots: true, dotSize: 2},
      {y: 'dema-900-40', axis: 'y1', color: '#C4DF9B', drawDots: true, dotSize: 2},
      {y: 'dema-900-48', axis: 'y1', color: '#A2D39C', drawDots: true, dotSize: 2},
      {y: 'dema-900-56', axis: 'y1', color: '#82CA9D', drawDots: true, dotSize: 2},
      {y: 'dema-900-64', axis: 'y1', color: '#7BCDC8', drawDots: true, dotSize: 2},
      {y: 'dema-900-72', axis: 'y1', color: '#6ECFF6', drawDots: true, dotSize: 2},
      {y: 'dema-900-80', axis: 'y1', color: '#7EA7D8', drawDots: true, dotSize: 2},
      {y: 'dema-900-88', axis: 'y1', color: '#8493CA', drawDots: true, dotSize: 2},
      {y: 'dema-900-96', axis: 'y1', color: '#8882BE', drawDots: true, dotSize: 2},
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