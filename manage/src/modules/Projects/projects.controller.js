projModule.controller('ProjectsController', ['$scope', 'ProjectsAPI', '$state', function ($scope, ProjectsAPI, $state) {


  $scope.projectList = [];

  var loadProjects = function (cb) {
    ProjectsAPI.getAll()
      .then(function (response) {
        $scope.projectList = response.data.data;
        if (cb) {
          cb();
        }
      }).catch(function (error) {
        console.error(error);
      });
  }

  var init = function () {
    loadProjects(function () {
      if ($scope.projectList.length > 0) {
        $state.go('Projects.Details', {
          id: $scope.projectList[0].id
        });
      }
    });
  }

  init();

  $scope.$on('projects.reload', function () {
    loadProjects();
  });

}]);