projModule.controller('ProjectDetailsController', ['$scope', '$stateParams', 'ProjectsAPI', function ($scope, $stateParams, ProjectsAPI) {

  $scope.project = {};
  $scope.updating = false;

  var init = function () {
    $scope.updating = true;
    ProjectsAPI.getById($stateParams.id)
      .then(function (response) {
        $scope.project = angular.copy(response.data.data);
        $scope.project = ProjectsAPI.parseProjectDates($scope.project);
        $scope.showProjectOnLive = !$scope.project.hidden;
      }).catch(function (error) {
        console.error(error);
      }).finally(function () {
        $scope.updating = false;
      });


  }

  init();

  var updateVisiblity = function (visible) {
    $scope.updating = true;
    ProjectsAPI.toggleVisibility($scope.project.id, visible)
      .then(function (response) {
        $scope.project = angular.copy(response.data.data);
        $scope.project = ProjectsAPI.parseProjectDates($scope.project);
        $scope.showProjectOnLive = !$scope.project.hidden;
      }).catch(function (error) {
        console.error(error);
      }).finally(function () {
        $scope.updating = false;
      });
  };

  $scope.$watch('showProjectOnLive', function (newVal, oldVal) {
    if (newVal !== oldVal && oldVal !== undefined) {
      updateVisiblity(newVal);
    }
  });

}]);