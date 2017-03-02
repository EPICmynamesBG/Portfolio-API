projModule.factory('TagsAPI', ['$http', 'config', function ($http, config) {

  var factory = {};

  var baseUrl = config.url + '/projects/tags';
  
  factory.parseForSending = function(materializeTags) {
    var parsed = [];
    materializeTags.forEach(function(tag){
      var temp = {};
      if (tag.hasOwnProperty('id')){
        temp.id = tag.id;
      }
      temp.name = tag.tag;
      parsed.push(temp);
    });
    return parsed;
  };

  factory.getAll = function () {
    return $http({
      method: 'GET',
      url: baseUrl
    });
  };

//  factory.getById = function (id) {
//    return $http({
//      method: 'GET',
//      url: baseUrl + '/id'
//    });
//  };
//
//  factory.create = function (data) {
//    return $http({
//      method: 'POST',
//      url: baseUrl,
//      data: {
//        
//      }
//    });
//  }

  return factory;

}]);