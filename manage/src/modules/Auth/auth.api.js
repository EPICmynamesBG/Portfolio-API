authModule.factory('AuthAPI', function ($http, config, $auth, $rootScope) {

  var factory = {};

  var baseUrl = config.url + '/auth';


  factory.login = function (email, password) {

    return $http({
      method: 'POST',
      url: baseUrl + '/login',
      data: {
        email: email,
        password: password
      }
    });
  }

  factory.validateToken = function () {
    var prom = new Promise(function (resolve, reject) {
      $http({
          method: 'GET',
          url: baseUrl + '/token/validate'
        })
        .then(function (response) {
          //TODO
          if (response.data.valid) {
            resolve(true);
          } else {
            $rootScope.$broadcast('tokenHasExpired');
            resolve(false);
          }
          
        }, function (error) {
          console.error(error);
          if (error.status == 403 || error.status == 401) {
            $rootScope.$broadcast('tokenHasExpired');
          }
          reject(false);
        });
    });

    return prom;
  };

  factory.logout = function () {
    return $http({
      method: 'DELETE',
      url: baseUrl + '/logout'
    });
  };

  return factory;

});