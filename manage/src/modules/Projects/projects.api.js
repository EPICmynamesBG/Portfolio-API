projModule.factory('ProjectsAPI', ['$http', 'config', function ($http, config) {

  var factory = {};

  var baseUrl = config.url + '/projects';
  
  factory.parseProjectDates = function(project) {
    project.startDate = moment(project.startDate, config.dateFormat);
    if (project.endDate != null){
      project.endDate = moment(project.endDate, config.dateFormat)
    }
    
    project.lastUpdated = moment(project.lastUpdated, config.dateTimeFormat);
    return project;
  }
  

  factory.getAll = function () {
    return $http({
      method: 'GET',
      url: baseUrl
    });
  };

  factory.getById = function (id) {
    return $http({
      method: 'GET',
      url: baseUrl + '/' + id
    });
  };

  factory.create = function (data) {
    return $http({
      method: 'POST',
      url: baseUrl,
      data: data
    });
  };

  factory.toggleVisibility = function (id, visible = false) {
    return $http({
      method: 'PUT',
      url: baseUrl + '/' + id + '/visibility',
      data: {
        visible: visible
      }
    });
  };

  factory.update = function (id, data) {
    return $http({
      method: 'PUT',
      url: baseUrl + '/' + id,
      data: data
    });
  };

  factory.delete = function (id) {
    return $http({
      method: 'DELETE',
      url: baseUrl + '/' + id
    });
  }

  return factory;

}]);