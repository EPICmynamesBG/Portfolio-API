projModule.controller('ProjectDetailsEditController', ['$scope', '$stateParams', 'ProjectsAPI', function ($scope, $stateParams, ProjectsAPI) {

  console.log('Editing');
  
  $scope.project = {};
  $scope.original = {};

  var init = function () {
    
    ProjectsAPI.getById($stateParams.id)
      .then(function (response) {
        $scope.project = response.data.data;
        $scope.project = ProjectsAPI.parseProjectDates($scope.project);
        $scope.project.startDate = $scope.project.startDate.toDate();
        $scope.original = angular.copy($scope.project);
        console.log($scope.original);
      }).catch(function (error) {
        console.error(error);
      });
    
    
  }
  
  init();


}]);