var infoModule = angular.module('admin.info', ['ui.router']);

infoModule.config(['$stateProvider', function ($stateProvider) {

  $stateProvider
    .state('Information', {
      url: '/information',
      templateUrl: './src/modules/Information/info.html',
      controller: 'InformationController',
      redirectTo: 'Interests',
      data: {
        order: 0,
        tags: [
        "info",
        "information"
      ],
        requiresLogin: true
      }
    })
    .state('Interests', {
      url: '/interests',
      templateUrl: './src/modules/Information/Interests/interests.html',
      controller: 'InterestsController',
      subviewOf: 'Information',
      data: {
        order: 0
      }
    })
    .state('Skills', {
      url: '/skills',
      templateUrl: './src/modules/Information/Skills/skills.html',
      controller: 'SkillsController',
      subviewOf: 'Information',
      data: {
        order: 1
      }
    });

}]);