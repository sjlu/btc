client.directive('ratePicker', function () {
  return {
    restrict: 'AE',
    require: 'ngModel',
    scope: {
      ngModel: '=',
      ngChange: '&'
    },
    templateUrl: 'ratePicker.html',
    link: function($scope, element, attrs) {
      $scope.invokeChange = function() {
        $scope.ngChange();
      }
    }
  }
});