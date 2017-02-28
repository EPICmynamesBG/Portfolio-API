projModule.controller('CreateProjectsController', ['$scope', 'ProjectsAPI', 'ImagesAPI', function ($scope, ProjectsAPI, ImagesAPI) {

  $scope.imageList = [];


  var loadImageList = function () {
    ImagesAPI.getAll()
      .then(function (response) {
        $scope.imageList = response.data.data;
        $('select').material_select();
      }).catch(function (error) {
        console.error(error);
      });
  };





  var init = function () {
    $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15 // Creates a dropdown of 15 years to control year
    });

    $scope.project = {};
    $scope.project.endCurrent = true;
    
    loadImageList();
  }

  init();


}]);