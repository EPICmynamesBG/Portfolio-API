var app = angular.module('admin', ['ui.router', 'angular-loading-bar', 'admin.templates', 'admin.info', 'admin.work', 'admin.projects', 'admin.auth']);

app.constant('config', {
  url: 'http://localhost:8888/api/v1'
});

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
  
  $rootScope.$on('stateChangeError', function(evt, to, params){
    console.error(evt, to, params);
  });
}]);


/* --- Routing --- */

app.config(['$urlRouterProvider', '$locationProvider', '$stateProvider', 'cfpLoadingBarProvider', function ($urlRouterProvider, $locationProvider, $stateProvider, cfpLoadingBarProvider) {

  $locationProvider.html5Mode({
    enabled: true,
    requireBase: true
  });

  $urlRouterProvider.otherwise("/");
  
  cfpLoadingBarProvider.spinnerTemplate = '<div class="preloader-wrapper big active"><div class="spinner-layer spinner-blue-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>';

  $stateProvider
    .state('/', {
      redirectTo: 'Information',
      excludeFromSidenav: true,
      data: {
        requiresLogin: true
      }
    });

}]);