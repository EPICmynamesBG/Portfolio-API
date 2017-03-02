projModule.controller('ProjectDetailsEditController', ['$scope', '$stateParams', 'ProjectsAPI', function ($scope, $stateParams, ProjectsAPI) {

  $scope.project = {};
  $scope.original = {};

  var init = function () {
    
    ProjectsAPI.getById($stateParams.id)
      .then(function (response) {
        $scope.project = response.data.data;
        $scope.original = angular.copy($scope.project);
        console.log($scope.original);
      }).catch(function (error) {
        console.error(error);
      });
    
    
  }
  
  init();


}]);