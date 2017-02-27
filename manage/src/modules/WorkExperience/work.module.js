var workModule = angular.module('admin.work', ['ui.router']);

workModule.config(['$stateProvider', function ($stateProvider) {

  $stateProvider
    .state('Work Experience', {
      url: '/work-experience',
      templateUrl: './src/modules/WorkExperience/work.html',
      controller: 'WorkExperienceController',
      data: {
        order: 1,
        tags: [
        "work"
      ],
        requiresLogin: true
      }
    })
    .state('Contacts', {
      url: '/contacts',
      templateUrl: './src/modules/WorkExperience/Contacts/contacts.html',
      controller: 'WorkExperienceController',
      subviewOf: 'Work Experience',
      data: {
        order: 0,
        tags: [
        "contacts"
      ],
        requiresLogin: true
      }
    });

}]);