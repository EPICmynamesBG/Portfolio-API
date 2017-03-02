var projModule = angular.module('admin.projects', ['ui.router', 'ui.sortable']);

projModule.config(['$stateProvider', function ($stateProvider) {

  $stateProvider
    .state('Projects', {
      url: '/projects',
      templateUrl: './src/modules/Projects/projects.html',
      controller: 'ProjectsController',
      data: {
        order: 2,
        tags: [
        "projects"
      ],
        requiresLogin: true
      }
    })
    .state('Projects.Create', {
      url: '/create',
      templateUrl: './src/modules/Projects/Create/projects.create.html',
      controller: 'CreateProjectsController',
      parent: 'Projects',
      excludeFromSidenav: true,
      data: {

      }
    })
    .state('Projects.Details', {
      url: '/:id',
      templateUrl: './src/modules/Projects/Details/projects.details.html',
      controller: 'ProjectDetailsController',
      parent: 'Projects',
      excludeFromSidenav: true,
      data: {

      }
    })
    .state('Projects.Edit', {
      url: '/:id/edit',
      templateUrl: './src/modules/Projects/Details/Edit/projects.details.edit.html',
      controller: 'ProjectDetailsEditController',
      parent: 'Projects',
      excludeFromSidenav: true,
      data: {
        
      }
    })
    .state('Tags', {
      url: '/tags',
      templateUrl: './src/modules/Projects/Tags/tags.html',
      controller: 'TagsController',
      subviewOf: 'Projects',
      excludeFromSidenav: false,
      data: {
        order: 0,
        tags: [
        "projects"
        ],
        requiresLogin: true
      }
    })
    .state('Tags.Create', {
      url: '/create',
      templateUrl: './src/modules/Projects/Tags/Create/tags.create.html',
      controller: 'CreateTagsController',
      parent: 'Tags',
      excludeFromSidenav: true,
      data: {

      }
    })
    .state('Tags.Details', {
      url: '/:id',
      templateUrl: './src/modules/Projects/Tags/Details/tags.details.html',
      controller: 'TagDetailsController',
      parent: 'Tags',
      excludeFromSidenav: true,
      data: {

      }
    })
    .state('Images', {
      url: '/images',
      templateUrl: './src/modules/Projects/Images/images.html',
      controller: 'ImagesController',
      subviewOf: 'Projects',
      excludeFromSidenav: false,
      data: {
        order: 1,
        tags: [
        "projects"
      ],
        requiresLogin: true
      }
    })
    .state('Imgaes.Create', {
      url: '/create',
      templateUrl: './src/modules/Projects/Images/Create/images.create.html',
      controller: 'ImageTagsController',
      parent: 'Images',
      excludeFromSidenav: true,
      data: {

      }
    })
    .state('Images.Details', {
      url: '/:id',
      templateUrl: './src/modules/Projects/Images/Details/images.details.html',
      controller: 'ImageDetailsController',
      parent: 'Images',
      excludeFromSidenav: true,
      data: {

      }
    });

}]);