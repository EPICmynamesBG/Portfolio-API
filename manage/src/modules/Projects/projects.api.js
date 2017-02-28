projModule.factory('ProjectsAPI', ['$http', 'config', function ($http, config) {

  var factory = {};

  var baseUrl = config.url + '/projects';

  factory.getAll = function () {
    return $http({
      method: 'GET',
      url: baseUrl
    });
  };

  factory.getById = function (id) {
    return $http({
      method: 'GET',
      url: baseUrl + '/id'
    });
  };

  factory.create = function (data) {
    return $http({
      method: 'POST',
      url: baseUrl,
      data: {
        
      }
    });
  }

  return factory;

}]);