var authModule = angular.module('admin.auth', ['ui.router', 'angular-jwt']);

authModule.config(['$stateProvider', 'jwtOptionsProvider', '$httpProvider', function ($stateProvider, jwtOptionsProvider, $httpProvider) {

  $stateProvider
    .state('Login', {
      url: '/login',
      templateUrl: './src/modules/Auth/auth.login.html',
      controller: 'LoginController',
      excludeFromSidenav: true,
      data: {
        requiresLogin: false
      }
    })
    .state('Logout', {
      url: '/logout',
      templateUrl: './src/modules/Auth/auth.logout.html',
      controller: 'LogoutController',
      excludeFromSidenav: true,
      data: {
        
      }
    });
  
  jwtOptionsProvider.config({
    tokenGetter: ['options', '$auth', function (options, $auth) {
      if (options && options.url.substr(options.url.length - 5) == '.html') {
        return null;
      }
      return $auth.getRawToken();
      }],
    whiteListedDomains: ['localhost', 'brandongroff.com', 'dev.brandongroff.com', 'api.brandongroff.com'],
    //    unauthenticatedRedirectPath: '/error?code=403',
    unauthenticatedRedirector: ['$state', '$auth', function ($state, $auth) {
      $auth.logout();
      $state.go("Login");
      }]
  });
  
  $httpProvider.interceptors.push('jwtInterceptor');

}]);

authModule.run(['authManager', '$rootScope', '$state', '$auth', function (authManager, $rootScope, $state, $auth) {
  
  authManager.checkAuthOnRefresh();

  authManager.redirectWhenUnauthenticated();

  $rootScope.$on('tokenHasExpired', function () {
    $auth.clearLocalToken();
    $state.go('Login');
  });

}]);
