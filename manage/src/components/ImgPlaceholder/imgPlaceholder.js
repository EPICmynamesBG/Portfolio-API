app.directive('imgPlaceholder', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      addClasses: '='
    },
    templateUrl: './src/components/ImgPlaceholder/imgPlaceholder.html',
    link: function(scope, element, attrs) {
      
    }
  }
});