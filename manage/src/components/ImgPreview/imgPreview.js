app.directive('imgPreview', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      img: '=',
      addClasses: '@',
      index: '='
    },
    templateUrl: './src/components/ImgPreview/imgPreview.html',
    link: function(scope, element, attrs) {
      
    }
  }
});