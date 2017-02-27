authModule.controller('LoginController', ['$scope', 'AuthAPI', '$auth', '$state', function ($scope, AuthAPI, $auth, $state) {

  $scope.error = undefined;
  
  $scope.login = function () {

    AuthAPI.login($scope.email, $scope.password)
      .then(function (response) {

        if (response.data.token) {
          $auth.performLogin(response.data.token);
          $state.go('/');
        }
      
      }).catch(function (error) {

        $scope.error = error.data.msg;
      
      });

  };



}]);