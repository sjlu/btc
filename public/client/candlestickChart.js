client.directive('candlestickChart', function () {
  return {
    restrict: 'AE',
    require: 'ngModel',
    scope: {
      ngModel: '='
    },
    templateUrl: 'candlestickChart.html',
    link: function($scope, element, attrs){
      var margin = {top: 20, right: 20, bottom: 30, left: 50};
      var width = element[0].offsetWidth - margin.left - margin.right;
      var height = 640 - margin.top - margin.bottom;

      var parseDate = d3.time.format("%d-%b-%y").parse;

      var x = techan.scale.financetime()
              .range([0, width]);

      var y = d3.scale.linear()
              .range([height, 0]);

      var candlestick = techan.plot.candlestick()
              .xScale(x)
              .yScale(y);

      var xAxis = d3.svg.axis()
              .scale(x)
              .orient("bottom");

      var yAxis = d3.svg.axis()
              .scale(y)
              .orient("left");

      var svg = d3.select(element[0]).append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var accessor = candlestick.accessor(),
          timestart = Date.now();

      $scope.$watch('ngModel', function() {
        var data = $scope.ngModel.map(function(d) {
          return {
            date: new Date(d.time),
            open: +d.open,
            high: +d.high,
            low: +d.low,
            close: +d.close,
            volume: +d.volume
          };
        }).sort(function(a, b) {
          return d3.ascending(accessor.d(a), accessor.d(b));
        });

        x.domain(data.map(accessor.d));
        y.domain(techan.scale.plot.ohlc(data, accessor).domain());

        svg.append("g")
                .datum(data)
                .attr("class", "candlestick")
                .call(candlestick);

        svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

        svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Price ($)");
      });
    }
  };
});
