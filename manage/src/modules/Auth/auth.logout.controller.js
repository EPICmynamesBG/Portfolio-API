authModule.controller('LogoutController', ['$scope', 'AuthAPI', '$auth', '$state', function ($scope, AuthAPI, $auth, $state) {

  AuthAPI.logout()
    .then(function (response) {
      if (response.data.logout == "success"){
        $auth.logout();
        $state.go('Login'); 
        return;
      }
      console.error(response);
    }).catch(function (error) {
      console.error(error);
    });

}]);