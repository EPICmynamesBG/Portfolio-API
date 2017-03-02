app.directive('newImage', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      ngModel: '=',
      disabled: '='
    },
    templateUrl: './src/components/NewImage/newImage.html',
    link: function(scope, element, attrs) {
      
    }
  }
});