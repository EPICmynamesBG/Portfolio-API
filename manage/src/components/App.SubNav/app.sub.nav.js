app.directive('appSubNav', ['$state', function($state){
  
  return {
    restrict: 'E',
    scope: {
      header: '@',
      itemType: '@', //ie: project, contact
      routeItems: '=',
      routeVariable: '@',
      createNew: '@'
    },
    replace: true,
    templateUrl: './src/components/App.SubNav/app.sub.nav.html',
    link: function(scope, element, attrs) {
      
      
      scope.itemType += 's';
      
      
      scope.create = function() {
        
        $state.go(scope.createNew);
      }
      
      
      
    }
  }
  
}]);