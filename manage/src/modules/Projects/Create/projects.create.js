projModule.controller('CreateProjectsController', ['$scope', 'ProjectsAPI', 'ImagesAPI', 'TagsAPI', '$timeout', '$state', function ($scope, ProjectsAPI, ImagesAPI, TagsAPI, $timeout, $state) {

  var loadImageList = function () {
    ImagesAPI.getAll()
      .then(function (response) {
        $scope.allImagesList = response.data.data;
        $timeout(function(){
          $('select').material_select();
        }, 50);
      }).catch(function (error) {
        console.error(error);
      });
  };
  
  $scope.$watch('allImageList', function(newValue, oldValue){
    if (newValue != oldValue && newValue.length > 0){
      $timeout(function(){
          $('select').material_select('destroy');
          $('select').material_select();
        }, 50);
    }
  });

  var init = function () {
    $scope.project = {};
    $scope.allImagesList = [];
    $scope.createImage = {};
    

//    $('.datepicker').pickadate({
//      selectMonths: true, // Creates a dropdown to control month
//      selectYears: 15 // Creates a dropdown of 15 years to control year,
//    });

    $scope.project = {};
    $scope.project.endCurrent = true;

    loadImageList();
  }

  init();


  $scope.addImage = function () {
    if (!$scope.project.images) {
      $scope.project.images = [];
    }
    $scope.project.images.push(angular.copy($scope.createImage));
    $scope.createImage = {};
  };

  $scope.resetProject = function () {
    if (confirm("Are you sure?")) {
      $scope.project = {
        title: undefined,
        status: undefined,
        startDate: undefined,
        endDate: undefined,
        endCurrent: true,
        linkText: undefined,
        linkLocation: undefined,
        linkImage: {},
        linkImageId: undefined,
        image: [],
        tags: [],
        description: undefined
      };
    }
  }

  $scope.createProject = function () {

    var sendData = angular.copy($scope.project);
    
    sendData.tags = TagsAPI.parseForSending(sendData.tags);
    if (sendData.endCurrent) {
      sendData.endDate = null;
      delete sendData.endCurrent;
    }
    if (sendData.linkImageId) {
      sendData.linkImage.id = sendData.linkImageId;
      delete sendData.linkImageId;
    }

    ProjectsAPI.create(sendData)
      .then(function (response) {
        var created = response.data.data;
        $scope.$emit('projects.reload');
        $state.go('Projects.Details', {id: created.id});
      }).catch(function (error) {
        console.error(error);
      });

  };


}]);