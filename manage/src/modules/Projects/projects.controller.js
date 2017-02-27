projModule.controller('ProjectsController', ['$scope', 'ProjectsAPI', function ($scope, ProjectsAPI) {


  $scope.projectList = [];

  var loadProjects = function () {
    ProjectsAPI.getAll()
      .then(function (response) {
        $scope.projectList = response.data.data;
      }).catch(function (error) {
        console.error(error);
      });
  }

  var init = function () {
    loadProjects();
  }

  init();


}]);