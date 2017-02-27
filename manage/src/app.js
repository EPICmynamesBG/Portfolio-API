var app = angular.module('admin', ['ui.router', 'admin.templates', 'admin.info', 'admin.work', 'admin.projects']);

app.run(['$rootScope', '$state', '$timeout', function ($rootScope, $state, $timeout) {

  $rootScope.$state = $state;
  $rootScope.loading = false;
  $rootScope.modalData = {};

  $rootScope.$on('$stateChangeStart', function (evt, to, params) {
    if (to.redirectTo) {
      evt.preventDefault();
      $state.go(to.redirectTo, params, {
        location: 'replace'
      });
    }
  });
}]);


/* --- Routing --- */

app.config(['$urlRouterProvider', '$locationProvider', function ($urlRouterProvider, $locationProvider) {

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: true
  });

  $urlRouterProvider.otherwise("/information");

}]);