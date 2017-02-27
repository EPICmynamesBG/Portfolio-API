projModule.factory('ProjectsAPI', ['$http', 'config', function($http, config){
  
  var factory = {};
  
  var baseUrl = config.url + '/projects';
  
  factory.getAll = function() {
    return $http({
      method: 'GET',
      url: baseUrl
    });
  }
  
  return factory;
  
}]);