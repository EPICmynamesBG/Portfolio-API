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
var projModule = angular.module('admin.projects', ['ui.router']);

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
    .state('Projects.Details', {
      url: '/:id',
      templateUrl: './src/modules/Projects/Details/projects.details.html',
      controller: 'ProjectDetailsController',
      parent: 'Projects',
      excludeFromSidenav: true,
      data: {

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
    .state('Tags.Details', {
      url: '/:id',
      templateUrl: './src/modules/Projects/Tags/Details/tags.details.html',
      controller: 'TagDetailsController',
      parent: 'Tags',
      excludeFromSidenav: true,
      data: {

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
    .state('Images.Details', {
      url: '/:id',
      templateUrl: './src/modules/Projects/Images/Details/images.details.html',
      controller: 'ImageDetailsController',
      parent: 'Images',
      excludeFromSidenav: true,
      data: {

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
    });

}]);
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
app.directive('appSubNav', ['$state', function($state){
  
  return {
    restrict: 'E',
    scope: {
      header: '@',
      itemType: '@', //ie: project, contact
      routeItems: '=',
      routeVariable: '@',
      createNew: '@'
    },
    replace: true,
    templateUrl: './src/components/App.SubNav/app.sub.nav.html',
    link: function(scope, element, attrs) {
      
      
      scope.itemType += 's';
      
      
      scope.create = function() {
        
        $state.go(scope.createNew);
      }
      
      
      
    }
  }
  
}]);
app.directive('appNav', function ($state, $auth, $timeout) {
  return {
    restrict: 'E',
    scope: {},
    replace: true,
    templateUrl: './src/modules/App.Nav/app.nav.html',
    link: function (scope, element, attrs) {

      scope.$auth = $auth;

      $('.button-collapse').sideNav({
        menuWidth: 300, // Default is 300
        edge: 'left', // Choose the horizontal origin
        closeOnClick: false, // Closes side-nav on <a> clicks, useful for Angular/Meteor
        draggable: true // Choose whether you can drag to open on touch screens
      });

      var compareFunc = function (a, b) {
        if (!a.data || !b.data) {
          return 0;
        }

        if (a.data.order < b.data.order) {
          return -1;
        } else if (a.data.order > b.data.order) {
          return 1;
        } else {
          return 0;
        }
      };

      var objectWithName = function (list, name) {
        for (var i = 0; i < list.length; i++) {
          var thisObj = list[i];
          if (thisObj.name == name) {
            return thisObj;
          }
        }
        return null;
      }

      var getParsedStateList = function () {
        var list = angular.copy($state.get());

        var i = 0;
        while (i < list.length) {
          var item = list[i];

          if (item.abstract || item.excludeFromSidenav) {
            list.splice(i, 1);
            continue;
          }

          if (item.subviewOf) {

            var parent = objectWithName(list, item.subviewOf);
            if (!parent.subviews) {
              parent.subviews = [];
            }
            parent.subviews.push(item);
            list.splice(i, 1);
            continue;
          }

          i++;
        }

        list.sort(compareFunc);

        return list;
      };


      scope.list = getParsedStateList();


      scope.rootNavList = [];
      scope.subNavList = [];
      scope.list.forEach(function (item) {
        if (item.subviews) {
          item.subviews.sort(compareFunc);
          scope.subNavList.push(item);
        } else {
          scope.rootNavList.push(item);
        }
      });


      scope.rootNavList.sort(compareFunc);
      scope.subNavList.sort(compareFunc);


      $timeout(function () {
        $('.collapsible').collapsible({
          accordion: true
        });
      }, 20);

    },
    controller: function () {

    }
  }
});
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
            return;
          }
          resolve(false);
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
authModule.service('$auth', function (jwtHelper, $q, $rootScope) {

  var self = this;

  var key = 'portfolio.admin.token';

  /**
   * Validate that user is authenticated
   * @author Brandon Groff
   * @returns {boolean} true/false
   */
  this.isAuthenticated = function () {
    //TODO: ??
    return self.getRawToken() ? true : false;
  };

  /**
   * Called on login, used to save the token if valid
   * @author Brandon Groff
   * @param   {string} token the raw authorization token
   * @returns {boolean}  true on success, false on success but no Slack registration, or a Rejected promise that will trigger an unauthorized redirect
   */
  this.performLogin = function (token) {
    var decoded = jwtHelper.decodeToken(token);
    if (decoded) {
      self.setToken(token);
      return true;
    } else {
      return $q.reject('tokenHasExpired');
    }
  };

  /**
   * Get the raw token string from localStorage, or request one if none in localStorage
   * @author Brandon Groff
   * @returns {string} the raw token string or the request Promise that may resolve with one
   */
  this.getRawToken = function () {
    var localToken = localStorage.getItem(key);
    if (localToken) {
      return localToken;
    }
  };

  /**
   * Get the parsed token object
   * @author Brandon Groff
   * @returns {object} the parsed token
   */
  this.getParsedToken = function () {
    var localToken = self.getRawToken();
    if (localToken) {
      return jwtHelper.decodeToken(localToken);
    }
  };

  /**
   * Save the RAW token
   * @author Brandon Groff
   * @param {string} token the RAW token object
   */
  this.setToken = function (token) {
    var decoded = jwtHelper.decodeToken(token);
    if (decoded){
      localStorage.setItem(key, token);
    } else {
      console.log('Token Error: Invalid?');
      $rootScope.$broadcast('tokenHasExpired');
    }
  };

  /**
   * Clear the token from localStorage
   * @author Brandon Groff
   */
  this.clearLocalToken = function () {
    localStorage.removeItem(key);
  };

  /**
   * Perform full logout process
   * @author Brandon Groff
   */
  this.logout = function () {
    self.clearLocalToken();
    $rootScope.$broadcast('tokenHasExpired');
  };

});
infoModule.controller('InformationController', ['$scope', function($scope){
  
  
  
  
}]);
projModule.factory('ProjectsAPI', ['$http', 'config', function($http, config){
  
  var factory = {};
  
  var baseUrl = config.url + '/projects';
  
  factory.getAll = function() {
    return $http({
      method: 'GET',
      url: baseUrl
    });
  }
  
  return factory;
  
}]);
projModule.controller('ProjectsController', ['$scope', 'ProjectsAPI', function ($scope, ProjectsAPI) {


  $scope.projectList = [];

  var loadProjects = function () {
    ProjectsAPI.getAll()
      .then(function (response) {
        $scope.projectList = response.data.data;
      }).catch(function (error) {
        console.error(error);
      });
  }

  var init = function () {
    loadProjects();
  }

  init();


}]);
workModule.controller('WorkExperienceController', ['$scope', function($scope){
  
  
  
}]);
infoModule.controller('InterestsController', ['$scope', function($scope){
  
  
  
}]);
infoModule.controller('SkillsController', ['$scope', function($scope){
  
  console.log('skills');
  
}]);
projModule.controller('CreateProjectsController', ['$scope', function($scope){
  
  
  console.log('create');
}]);
projModule.controller('ProjectDetailsController', ['$scope', function($scope){
  
  
  
  
}]);
projModule.controller('ImagesController', ['$scope', function($scope){
  
  
  
  
}]);
projModule.controller('TagsController', ['$scope', function($scope){
  
  
  
  
}]);
workModule.controller('ContactsController', ['$scope', function($scope){
  
  
  
}]);
projModule.controller('CreateImagesController', ['$scope', function($scope){
  
  
  
}]);
projModule.controller('ImageDetailsController', ['$scope', function($scope){
  
  
  
}]);
projModule.controller('CreateTagsController', ['$scope', function($scope){
  
  
  
  
}]);
projModule.controller('TagDetailsController', ['$scope', function($scope){
  
  
  
  
}]);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1vZHVsZXMvQXV0aC9hdXRoLm1vZHVsZS5qcyIsIm1vZHVsZXMvSW5mb3JtYXRpb24vaW5mby5tb2R1bGUuanMiLCJtb2R1bGVzL1Byb2plY3RzL3Byb2plY3RzLm1vZHVsZS5qcyIsIm1vZHVsZXMvV29ya0V4cGVyaWVuY2Uvd29yay5tb2R1bGUuanMiLCJjb21wb25lbnRzL0FwcC5TdWJOYXYvYXBwLnN1Yi5uYXYuanMiLCJtb2R1bGVzL0FwcC5OYXYvYXBwLm5hdi5qcyIsIm1vZHVsZXMvQXV0aC9hdXRoLmFwaS5qcyIsIm1vZHVsZXMvQXV0aC9hdXRoLmxvZ2luLmNvbnRyb2xsZXIuanMiLCJtb2R1bGVzL0F1dGgvYXV0aC5sb2dvdXQuY29udHJvbGxlci5qcyIsIm1vZHVsZXMvQXV0aC9hdXRoLnNlcnZpY2UuanMiLCJtb2R1bGVzL0luZm9ybWF0aW9uL2luZm8uY29udHJvbGxlci5qcyIsIm1vZHVsZXMvUHJvamVjdHMvcHJvamVjdHMuYXBpLmpzIiwibW9kdWxlcy9Qcm9qZWN0cy9wcm9qZWN0cy5jb250cm9sbGVyLmpzIiwibW9kdWxlcy9Xb3JrRXhwZXJpZW5jZS93b3JrLmNvbnRyb2xsZXIuanMiLCJtb2R1bGVzL0luZm9ybWF0aW9uL0ludGVyZXN0cy9pbnRlcmVzdHMuY29udHJvbGxlci5qcyIsIm1vZHVsZXMvSW5mb3JtYXRpb24vU2tpbGxzL3NraWxscy5jb250cm9sbGVyLmpzIiwibW9kdWxlcy9Qcm9qZWN0cy9DcmVhdGUvcHJvamVjdHMuY3JlYXRlLmpzIiwibW9kdWxlcy9Qcm9qZWN0cy9EZXRhaWxzL3Byb2plY3RzLmRldGFpbHMuanMiLCJtb2R1bGVzL1Byb2plY3RzL0ltYWdlcy9pbWFnZXMuY29udHJvbGxlci5qcyIsIm1vZHVsZXMvUHJvamVjdHMvVGFncy90YWdzLmNvbnRyb2xsZXIuanMiLCJtb2R1bGVzL1dvcmtFeHBlcmllbmNlL0NvbnRhY3RzL2NvbnRhY3RzLmNvbnRyb2xsZXIuanMiLCJtb2R1bGVzL1Byb2plY3RzL0ltYWdlcy9DcmVhdGUvaW1hZ2VzLmNyZWF0ZS5qcyIsIm1vZHVsZXMvUHJvamVjdHMvSW1hZ2VzL0RldGFpbHMvaW1hZ2VzLmRldGFpbHMuanMiLCJtb2R1bGVzL1Byb2plY3RzL1RhZ3MvQ3JlYXRlL3RhZ3MuY3JlYXRlLmpzIiwibW9kdWxlcy9Qcm9qZWN0cy9UYWdzL0RldGFpbHMvdGFncy5kZXRhaWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhZG1pbicsIFsndWkucm91dGVyJywgJ2FuZ3VsYXItbG9hZGluZy1iYXInLCAnYWRtaW4udGVtcGxhdGVzJywgJ2FkbWluLmluZm8nLCAnYWRtaW4ud29yaycsICdhZG1pbi5wcm9qZWN0cycsICdhZG1pbi5hdXRoJ10pO1xuXG5hcHAuY29uc3RhbnQoJ2NvbmZpZycsIHtcbiAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2FwaS92MSdcbn0pO1xuXG5hcHAucnVuKFsnJHJvb3RTY29wZScsICckc3RhdGUnLCAnJHRpbWVvdXQnLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHN0YXRlLCAkdGltZW91dCkge1xuXG4gICRyb290U2NvcGUuJHN0YXRlID0gJHN0YXRlO1xuICAkcm9vdFNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgJHJvb3RTY29wZS5tb2RhbERhdGEgPSB7fTtcblxuICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbiAoZXZ0LCB0bywgcGFyYW1zKSB7XG4gICAgaWYgKHRvLnJlZGlyZWN0VG8pIHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgJHN0YXRlLmdvKHRvLnJlZGlyZWN0VG8sIHBhcmFtcywge1xuICAgICAgICBsb2NhdGlvbjogJ3JlcGxhY2UnXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufV0pO1xuXG5cbi8qIC0tLSBSb3V0aW5nIC0tLSAqL1xuXG5hcHAuY29uZmlnKFsnJHVybFJvdXRlclByb3ZpZGVyJywgJyRsb2NhdGlvblByb3ZpZGVyJywgJyRzdGF0ZVByb3ZpZGVyJywgJ2NmcExvYWRpbmdCYXJQcm92aWRlcicsIGZ1bmN0aW9uICgkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyLCAkc3RhdGVQcm92aWRlciwgY2ZwTG9hZGluZ0JhclByb3ZpZGVyKSB7XG5cbiAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHtcbiAgICBlbmFibGVkOiB0cnVlLFxuICAgIHJlcXVpcmVCYXNlOiB0cnVlXG4gIH0pO1xuXG4gICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoXCIvXCIpO1xuICBcbiAgY2ZwTG9hZGluZ0JhclByb3ZpZGVyLnNwaW5uZXJUZW1wbGF0ZSA9ICc8ZGl2IGNsYXNzPVwicHJlbG9hZGVyLXdyYXBwZXIgYmlnIGFjdGl2ZVwiPjxkaXYgY2xhc3M9XCJzcGlubmVyLWxheWVyIHNwaW5uZXItYmx1ZS1vbmx5XCI+PGRpdiBjbGFzcz1cImNpcmNsZS1jbGlwcGVyIGxlZnRcIj48ZGl2IGNsYXNzPVwiY2lyY2xlXCI+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cImdhcC1wYXRjaFwiPjxkaXYgY2xhc3M9XCJjaXJjbGVcIj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwiY2lyY2xlLWNsaXBwZXIgcmlnaHRcIj48ZGl2IGNsYXNzPVwiY2lyY2xlXCI+PC9kaXY+PC9kaXY+PC9kaXY+PC9kaXY+JztcblxuICAkc3RhdGVQcm92aWRlclxuICAgIC5zdGF0ZSgnLycsIHtcbiAgICAgIHJlZGlyZWN0VG86ICdJbmZvcm1hdGlvbicsXG4gICAgICBleGNsdWRlRnJvbVNpZGVuYXY6IHRydWUsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgIH1cbiAgICB9KTtcblxufV0pOyIsInZhciBhdXRoTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FkbWluLmF1dGgnLCBbJ3VpLnJvdXRlcicsICdhbmd1bGFyLWp3dCddKTtcblxuYXV0aE1vZHVsZS5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICdqd3RPcHRpb25zUHJvdmlkZXInLCAnJGh0dHBQcm92aWRlcicsIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgand0T3B0aW9uc1Byb3ZpZGVyLCAkaHR0cFByb3ZpZGVyKSB7XG5cbiAgJHN0YXRlUHJvdmlkZXJcbiAgICAuc3RhdGUoJ0xvZ2luJywge1xuICAgICAgdXJsOiAnL2xvZ2luJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnLi9zcmMvbW9kdWxlcy9BdXRoL2F1dGgubG9naW4uaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnTG9naW5Db250cm9sbGVyJyxcbiAgICAgIGV4Y2x1ZGVGcm9tU2lkZW5hdjogdHJ1ZSxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgcmVxdWlyZXNMb2dpbjogZmFsc2VcbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnTG9nb3V0Jywge1xuICAgICAgdXJsOiAnL2xvZ291dCcsXG4gICAgICB0ZW1wbGF0ZVVybDogJy4vc3JjL21vZHVsZXMvQXV0aC9hdXRoLmxvZ291dC5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdMb2dvdXRDb250cm9sbGVyJyxcbiAgICAgIGV4Y2x1ZGVGcm9tU2lkZW5hdjogdHJ1ZSxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgXG4gICAgICB9XG4gICAgfSk7XG4gIFxuICBqd3RPcHRpb25zUHJvdmlkZXIuY29uZmlnKHtcbiAgICB0b2tlbkdldHRlcjogWydvcHRpb25zJywgJyRhdXRoJywgZnVuY3Rpb24gKG9wdGlvbnMsICRhdXRoKSB7XG4gICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnVybC5zdWJzdHIob3B0aW9ucy51cmwubGVuZ3RoIC0gNSkgPT0gJy5odG1sJykge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiAkYXV0aC5nZXRSYXdUb2tlbigpO1xuICAgICAgfV0sXG4gICAgd2hpdGVMaXN0ZWREb21haW5zOiBbJ2xvY2FsaG9zdCcsICdicmFuZG9uZ3JvZmYuY29tJywgJ2Rldi5icmFuZG9uZ3JvZmYuY29tJywgJ2FwaS5icmFuZG9uZ3JvZmYuY29tJ10sXG4gICAgLy8gICAgdW5hdXRoZW50aWNhdGVkUmVkaXJlY3RQYXRoOiAnL2Vycm9yP2NvZGU9NDAzJyxcbiAgICB1bmF1dGhlbnRpY2F0ZWRSZWRpcmVjdG9yOiBbJyRzdGF0ZScsICckYXV0aCcsIGZ1bmN0aW9uICgkc3RhdGUsICRhdXRoKSB7XG4gICAgICAkYXV0aC5sb2dvdXQoKTtcbiAgICAgICRzdGF0ZS5nbyhcIkxvZ2luXCIpO1xuICAgICAgfV1cbiAgfSk7XG4gIFxuICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKCdqd3RJbnRlcmNlcHRvcicpO1xuXG59XSk7XG5cbmF1dGhNb2R1bGUucnVuKFsnYXV0aE1hbmFnZXInLCAnJHJvb3RTY29wZScsICckc3RhdGUnLCAnJGF1dGgnLCBmdW5jdGlvbiAoYXV0aE1hbmFnZXIsICRyb290U2NvcGUsICRzdGF0ZSwgJGF1dGgpIHtcbiAgXG4gIGF1dGhNYW5hZ2VyLmNoZWNrQXV0aE9uUmVmcmVzaCgpO1xuXG4gIGF1dGhNYW5hZ2VyLnJlZGlyZWN0V2hlblVuYXV0aGVudGljYXRlZCgpO1xuXG4gICRyb290U2NvcGUuJG9uKCd0b2tlbkhhc0V4cGlyZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgJGF1dGguY2xlYXJMb2NhbFRva2VuKCk7XG4gICAgJHN0YXRlLmdvKCdMb2dpbicpO1xuICB9KTtcblxufV0pO1xuIiwidmFyIGluZm9Nb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYWRtaW4uaW5mbycsIFsndWkucm91dGVyJ10pO1xuXG5pbmZvTW9kdWxlLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgJHN0YXRlUHJvdmlkZXJcbiAgICAuc3RhdGUoJ0luZm9ybWF0aW9uJywge1xuICAgICAgdXJsOiAnL2luZm9ybWF0aW9uJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnLi9zcmMvbW9kdWxlcy9JbmZvcm1hdGlvbi9pbmZvLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ0luZm9ybWF0aW9uQ29udHJvbGxlcicsXG4gICAgICByZWRpcmVjdFRvOiAnSW50ZXJlc3RzJyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgb3JkZXI6IDAsXG4gICAgICAgIHRhZ3M6IFtcbiAgICAgICAgXCJpbmZvXCIsXG4gICAgICAgIFwiaW5mb3JtYXRpb25cIlxuICAgICAgXSxcbiAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgfVxuICAgIH0pXG4gICAgLnN0YXRlKCdJbnRlcmVzdHMnLCB7XG4gICAgICB1cmw6ICcvaW50ZXJlc3RzJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnLi9zcmMvbW9kdWxlcy9JbmZvcm1hdGlvbi9JbnRlcmVzdHMvaW50ZXJlc3RzLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ0ludGVyZXN0c0NvbnRyb2xsZXInLFxuICAgICAgc3Vidmlld09mOiAnSW5mb3JtYXRpb24nLFxuICAgICAgZGF0YToge1xuICAgICAgICBvcmRlcjogMFxuICAgICAgfVxuICAgIH0pXG4gICAgLnN0YXRlKCdTa2lsbHMnLCB7XG4gICAgICB1cmw6ICcvc2tpbGxzJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnLi9zcmMvbW9kdWxlcy9JbmZvcm1hdGlvbi9Ta2lsbHMvc2tpbGxzLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ1NraWxsc0NvbnRyb2xsZXInLFxuICAgICAgc3Vidmlld09mOiAnSW5mb3JtYXRpb24nLFxuICAgICAgZGF0YToge1xuICAgICAgICBvcmRlcjogMVxuICAgICAgfVxuICAgIH0pO1xuXG59XSk7IiwidmFyIHByb2pNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYWRtaW4ucHJvamVjdHMnLCBbJ3VpLnJvdXRlciddKTtcblxucHJvak1vZHVsZS5jb25maWcoWyckc3RhdGVQcm92aWRlcicsIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICRzdGF0ZVByb3ZpZGVyXG4gICAgLnN0YXRlKCdQcm9qZWN0cycsIHtcbiAgICAgIHVybDogJy9wcm9qZWN0cycsXG4gICAgICB0ZW1wbGF0ZVVybDogJy4vc3JjL21vZHVsZXMvUHJvamVjdHMvcHJvamVjdHMuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnUHJvamVjdHNDb250cm9sbGVyJyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgb3JkZXI6IDIsXG4gICAgICAgIHRhZ3M6IFtcbiAgICAgICAgXCJwcm9qZWN0c1wiXG4gICAgICBdLFxuICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICB9XG4gICAgfSlcbiAgICAuc3RhdGUoJ1Byb2plY3RzLkRldGFpbHMnLCB7XG4gICAgICB1cmw6ICcvOmlkJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnLi9zcmMvbW9kdWxlcy9Qcm9qZWN0cy9EZXRhaWxzL3Byb2plY3RzLmRldGFpbHMuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnUHJvamVjdERldGFpbHNDb250cm9sbGVyJyxcbiAgICAgIHBhcmVudDogJ1Byb2plY3RzJyxcbiAgICAgIGV4Y2x1ZGVGcm9tU2lkZW5hdjogdHJ1ZSxcbiAgICAgIGRhdGE6IHtcblxuICAgICAgfVxuICAgIH0pXG4gICAgLnN0YXRlKCdQcm9qZWN0cy5DcmVhdGUnLCB7XG4gICAgICB1cmw6ICcvY3JlYXRlJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnLi9zcmMvbW9kdWxlcy9Qcm9qZWN0cy9DcmVhdGUvcHJvamVjdHMuY3JlYXRlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ0NyZWF0ZVByb2plY3RzQ29udHJvbGxlcicsXG4gICAgICBwYXJlbnQ6ICdQcm9qZWN0cycsXG4gICAgICBleGNsdWRlRnJvbVNpZGVuYXY6IHRydWUsXG4gICAgICBkYXRhOiB7XG5cbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnVGFncycsIHtcbiAgICAgIHVybDogJy90YWdzJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnLi9zcmMvbW9kdWxlcy9Qcm9qZWN0cy9UYWdzL3RhZ3MuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnVGFnc0NvbnRyb2xsZXInLFxuICAgICAgc3Vidmlld09mOiAnUHJvamVjdHMnLFxuICAgICAgZXhjbHVkZUZyb21TaWRlbmF2OiBmYWxzZSxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgb3JkZXI6IDAsXG4gICAgICAgIHRhZ3M6IFtcbiAgICAgICAgXCJwcm9qZWN0c1wiXG4gICAgICAgIF0sXG4gICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnVGFncy5EZXRhaWxzJywge1xuICAgICAgdXJsOiAnLzppZCcsXG4gICAgICB0ZW1wbGF0ZVVybDogJy4vc3JjL21vZHVsZXMvUHJvamVjdHMvVGFncy9EZXRhaWxzL3RhZ3MuZGV0YWlscy5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdUYWdEZXRhaWxzQ29udHJvbGxlcicsXG4gICAgICBwYXJlbnQ6ICdUYWdzJyxcbiAgICAgIGV4Y2x1ZGVGcm9tU2lkZW5hdjogdHJ1ZSxcbiAgICAgIGRhdGE6IHtcblxuICAgICAgfVxuICAgIH0pXG4gICAgLnN0YXRlKCdUYWdzLkNyZWF0ZScsIHtcbiAgICAgIHVybDogJy9jcmVhdGUnLFxuICAgICAgdGVtcGxhdGVVcmw6ICcuL3NyYy9tb2R1bGVzL1Byb2plY3RzL1RhZ3MvQ3JlYXRlL3RhZ3MuY3JlYXRlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ0NyZWF0ZVRhZ3NDb250cm9sbGVyJyxcbiAgICAgIHBhcmVudDogJ1RhZ3MnLFxuICAgICAgZXhjbHVkZUZyb21TaWRlbmF2OiB0cnVlLFxuICAgICAgZGF0YToge1xuXG4gICAgICB9XG4gICAgfSlcbiAgICAuc3RhdGUoJ0ltYWdlcycsIHtcbiAgICAgIHVybDogJy9pbWFnZXMnLFxuICAgICAgdGVtcGxhdGVVcmw6ICcuL3NyYy9tb2R1bGVzL1Byb2plY3RzL0ltYWdlcy9pbWFnZXMuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnSW1hZ2VzQ29udHJvbGxlcicsXG4gICAgICBzdWJ2aWV3T2Y6ICdQcm9qZWN0cycsXG4gICAgICBleGNsdWRlRnJvbVNpZGVuYXY6IGZhbHNlLFxuICAgICAgZGF0YToge1xuICAgICAgICBvcmRlcjogMSxcbiAgICAgICAgdGFnczogW1xuICAgICAgICBcInByb2plY3RzXCJcbiAgICAgIF0sXG4gICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnSW1hZ2VzLkRldGFpbHMnLCB7XG4gICAgICB1cmw6ICcvOmlkJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnLi9zcmMvbW9kdWxlcy9Qcm9qZWN0cy9JbWFnZXMvRGV0YWlscy9pbWFnZXMuZGV0YWlscy5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdJbWFnZURldGFpbHNDb250cm9sbGVyJyxcbiAgICAgIHBhcmVudDogJ0ltYWdlcycsXG4gICAgICBleGNsdWRlRnJvbVNpZGVuYXY6IHRydWUsXG4gICAgICBkYXRhOiB7XG5cbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnSW1nYWVzLkNyZWF0ZScsIHtcbiAgICAgIHVybDogJy9jcmVhdGUnLFxuICAgICAgdGVtcGxhdGVVcmw6ICcuL3NyYy9tb2R1bGVzL1Byb2plY3RzL0ltYWdlcy9DcmVhdGUvaW1hZ2VzLmNyZWF0ZS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdJbWFnZVRhZ3NDb250cm9sbGVyJyxcbiAgICAgIHBhcmVudDogJ0ltYWdlcycsXG4gICAgICBleGNsdWRlRnJvbVNpZGVuYXY6IHRydWUsXG4gICAgICBkYXRhOiB7XG5cbiAgICAgIH1cbiAgICB9KTtcblxufV0pOyIsInZhciB3b3JrTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FkbWluLndvcmsnLCBbJ3VpLnJvdXRlciddKTtcblxud29ya01vZHVsZS5jb25maWcoWyckc3RhdGVQcm92aWRlcicsIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICRzdGF0ZVByb3ZpZGVyXG4gICAgLnN0YXRlKCdXb3JrIEV4cGVyaWVuY2UnLCB7XG4gICAgICB1cmw6ICcvd29yay1leHBlcmllbmNlJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnLi9zcmMvbW9kdWxlcy9Xb3JrRXhwZXJpZW5jZS93b3JrLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ1dvcmtFeHBlcmllbmNlQ29udHJvbGxlcicsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIG9yZGVyOiAxLFxuICAgICAgICB0YWdzOiBbXG4gICAgICAgIFwid29ya1wiXG4gICAgICBdLFxuICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICB9XG4gICAgfSlcbiAgICAuc3RhdGUoJ0NvbnRhY3RzJywge1xuICAgICAgdXJsOiAnL2NvbnRhY3RzJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnLi9zcmMvbW9kdWxlcy9Xb3JrRXhwZXJpZW5jZS9Db250YWN0cy9jb250YWN0cy5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdXb3JrRXhwZXJpZW5jZUNvbnRyb2xsZXInLFxuICAgICAgc3Vidmlld09mOiAnV29yayBFeHBlcmllbmNlJyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgb3JkZXI6IDAsXG4gICAgICAgIHRhZ3M6IFtcbiAgICAgICAgXCJjb250YWN0c1wiXG4gICAgICBdLFxuICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG5cbn1dKTsiLCJhcHAuZGlyZWN0aXZlKCdhcHBTdWJOYXYnLCBbJyRzdGF0ZScsIGZ1bmN0aW9uKCRzdGF0ZSl7XG4gIFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgc2NvcGU6IHtcbiAgICAgIGhlYWRlcjogJ0AnLFxuICAgICAgaXRlbVR5cGU6ICdAJywgLy9pZTogcHJvamVjdCwgY29udGFjdFxuICAgICAgcm91dGVJdGVtczogJz0nLFxuICAgICAgcm91dGVWYXJpYWJsZTogJ0AnLFxuICAgICAgY3JlYXRlTmV3OiAnQCdcbiAgICB9LFxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgdGVtcGxhdGVVcmw6ICcuL3NyYy9jb21wb25lbnRzL0FwcC5TdWJOYXYvYXBwLnN1Yi5uYXYuaHRtbCcsXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICBcbiAgICAgIFxuICAgICAgc2NvcGUuaXRlbVR5cGUgKz0gJ3MnO1xuICAgICAgXG4gICAgICBcbiAgICAgIHNjb3BlLmNyZWF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBcbiAgICAgICAgJHN0YXRlLmdvKHNjb3BlLmNyZWF0ZU5ldyk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIFxuICAgICAgXG4gICAgfVxuICB9XG4gIFxufV0pOyIsImFwcC5kaXJlY3RpdmUoJ2FwcE5hdicsIGZ1bmN0aW9uICgkc3RhdGUsICRhdXRoLCAkdGltZW91dCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgc2NvcGU6IHt9LFxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgdGVtcGxhdGVVcmw6ICcuL3NyYy9tb2R1bGVzL0FwcC5OYXYvYXBwLm5hdi5odG1sJyxcbiAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG5cbiAgICAgIHNjb3BlLiRhdXRoID0gJGF1dGg7XG5cbiAgICAgICQoJy5idXR0b24tY29sbGFwc2UnKS5zaWRlTmF2KHtcbiAgICAgICAgbWVudVdpZHRoOiAzMDAsIC8vIERlZmF1bHQgaXMgMzAwXG4gICAgICAgIGVkZ2U6ICdsZWZ0JywgLy8gQ2hvb3NlIHRoZSBob3Jpem9udGFsIG9yaWdpblxuICAgICAgICBjbG9zZU9uQ2xpY2s6IGZhbHNlLCAvLyBDbG9zZXMgc2lkZS1uYXYgb24gPGE+IGNsaWNrcywgdXNlZnVsIGZvciBBbmd1bGFyL01ldGVvclxuICAgICAgICBkcmFnZ2FibGU6IHRydWUgLy8gQ2hvb3NlIHdoZXRoZXIgeW91IGNhbiBkcmFnIHRvIG9wZW4gb24gdG91Y2ggc2NyZWVuc1xuICAgICAgfSk7XG5cbiAgICAgIHZhciBjb21wYXJlRnVuYyA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgIGlmICghYS5kYXRhIHx8ICFiLmRhdGEpIHtcbiAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhLmRhdGEub3JkZXIgPCBiLmRhdGEub3JkZXIpIHtcbiAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH0gZWxzZSBpZiAoYS5kYXRhLm9yZGVyID4gYi5kYXRhLm9yZGVyKSB7XG4gICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHZhciBvYmplY3RXaXRoTmFtZSA9IGZ1bmN0aW9uIChsaXN0LCBuYW1lKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciB0aGlzT2JqID0gbGlzdFtpXTtcbiAgICAgICAgICBpZiAodGhpc09iai5uYW1lID09IG5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzT2JqO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdmFyIGdldFBhcnNlZFN0YXRlTGlzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGxpc3QgPSBhbmd1bGFyLmNvcHkoJHN0YXRlLmdldCgpKTtcblxuICAgICAgICB2YXIgaSA9IDA7XG4gICAgICAgIHdoaWxlIChpIDwgbGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG5cbiAgICAgICAgICBpZiAoaXRlbS5hYnN0cmFjdCB8fCBpdGVtLmV4Y2x1ZGVGcm9tU2lkZW5hdikge1xuICAgICAgICAgICAgbGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoaXRlbS5zdWJ2aWV3T2YpIHtcblxuICAgICAgICAgICAgdmFyIHBhcmVudCA9IG9iamVjdFdpdGhOYW1lKGxpc3QsIGl0ZW0uc3Vidmlld09mKTtcbiAgICAgICAgICAgIGlmICghcGFyZW50LnN1YnZpZXdzKSB7XG4gICAgICAgICAgICAgIHBhcmVudC5zdWJ2aWV3cyA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGFyZW50LnN1YnZpZXdzLnB1c2goaXRlbSk7XG4gICAgICAgICAgICBsaXN0LnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuXG4gICAgICAgIGxpc3Quc29ydChjb21wYXJlRnVuYyk7XG5cbiAgICAgICAgcmV0dXJuIGxpc3Q7XG4gICAgICB9O1xuXG5cbiAgICAgIHNjb3BlLmxpc3QgPSBnZXRQYXJzZWRTdGF0ZUxpc3QoKTtcblxuXG4gICAgICBzY29wZS5yb290TmF2TGlzdCA9IFtdO1xuICAgICAgc2NvcGUuc3ViTmF2TGlzdCA9IFtdO1xuICAgICAgc2NvcGUubGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIGlmIChpdGVtLnN1YnZpZXdzKSB7XG4gICAgICAgICAgaXRlbS5zdWJ2aWV3cy5zb3J0KGNvbXBhcmVGdW5jKTtcbiAgICAgICAgICBzY29wZS5zdWJOYXZMaXN0LnB1c2goaXRlbSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2NvcGUucm9vdE5hdkxpc3QucHVzaChpdGVtKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cblxuICAgICAgc2NvcGUucm9vdE5hdkxpc3Quc29ydChjb21wYXJlRnVuYyk7XG4gICAgICBzY29wZS5zdWJOYXZMaXN0LnNvcnQoY29tcGFyZUZ1bmMpO1xuXG5cbiAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCgnLmNvbGxhcHNpYmxlJykuY29sbGFwc2libGUoe1xuICAgICAgICAgIGFjY29yZGlvbjogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgIH0sIDIwKTtcblxuICAgIH0sXG4gICAgY29udHJvbGxlcjogZnVuY3Rpb24gKCkge1xuXG4gICAgfVxuICB9XG59KTsiLCJhdXRoTW9kdWxlLmZhY3RvcnkoJ0F1dGhBUEknLCBmdW5jdGlvbiAoJGh0dHAsIGNvbmZpZywgJGF1dGgsICRyb290U2NvcGUpIHtcblxuICB2YXIgZmFjdG9yeSA9IHt9O1xuXG4gIHZhciBiYXNlVXJsID0gY29uZmlnLnVybCArICcvYXV0aCc7XG5cblxuICBmYWN0b3J5LmxvZ2luID0gZnVuY3Rpb24gKGVtYWlsLCBwYXNzd29yZCkge1xuICAgIFxuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIHVybDogYmFzZVVybCArICcvbG9naW4nLFxuICAgICAgZGF0YToge1xuICAgICAgICBlbWFpbDogZW1haWwsXG4gICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZFxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZmFjdG9yeS52YWxpZGF0ZVRva2VuID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBwcm9tID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgJGh0dHAoe1xuICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgdXJsOiBiYXNlVXJsICsgJy90b2tlbi92YWxpZGF0ZSdcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgLy9UT0RPXG4gICAgICAgICAgaWYgKHJlc3BvbnNlLmRhdGEudmFsaWQpIHtcbiAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICBpZiAoZXJyb3Iuc3RhdHVzID09IDQwMyB8fCBlcnJvci5zdGF0dXMgPT0gNDAxKSB7XG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3Rva2VuSGFzRXhwaXJlZCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZWplY3QoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBwcm9tO1xuICB9O1xuXG4gIGZhY3RvcnkubG9nb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdERUxFVEUnLFxuICAgICAgdXJsOiBiYXNlVXJsICsgJy9sb2dvdXQnXG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIGZhY3Rvcnk7XG5cbn0pOyIsImF1dGhNb2R1bGUuY29udHJvbGxlcignTG9naW5Db250cm9sbGVyJywgWyckc2NvcGUnLCAnQXV0aEFQSScsICckYXV0aCcsICckc3RhdGUnLCBmdW5jdGlvbiAoJHNjb3BlLCBBdXRoQVBJLCAkYXV0aCwgJHN0YXRlKSB7XG5cbiAgJHNjb3BlLmVycm9yID0gdW5kZWZpbmVkO1xuICBcbiAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24gKCkge1xuXG4gICAgQXV0aEFQSS5sb2dpbigkc2NvcGUuZW1haWwsICRzY29wZS5wYXNzd29yZClcbiAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXG4gICAgICAgIGlmIChyZXNwb25zZS5kYXRhLnRva2VuKSB7XG4gICAgICAgICAgJGF1dGgucGVyZm9ybUxvZ2luKHJlc3BvbnNlLmRhdGEudG9rZW4pO1xuICAgICAgICAgICRzdGF0ZS5nbygnLycpO1xuICAgICAgICB9XG4gICAgICBcbiAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuXG4gICAgICAgICRzY29wZS5lcnJvciA9IGVycm9yLmRhdGEubXNnO1xuICAgICAgXG4gICAgICB9KTtcblxuICB9O1xuXG5cblxufV0pOyIsImF1dGhNb2R1bGUuY29udHJvbGxlcignTG9nb3V0Q29udHJvbGxlcicsIFsnJHNjb3BlJywgJ0F1dGhBUEknLCAnJGF1dGgnLCAnJHN0YXRlJywgZnVuY3Rpb24gKCRzY29wZSwgQXV0aEFQSSwgJGF1dGgsICRzdGF0ZSkge1xuXG4gIEF1dGhBUEkubG9nb3V0KClcbiAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgIGlmIChyZXNwb25zZS5kYXRhLmxvZ291dCA9PSBcInN1Y2Nlc3NcIil7XG4gICAgICAgICRhdXRoLmxvZ291dCgpO1xuICAgICAgICAkc3RhdGUuZ28oJ0xvZ2luJyk7IFxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zb2xlLmVycm9yKHJlc3BvbnNlKTtcbiAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgIH0pO1xuXG59XSk7IiwiYXV0aE1vZHVsZS5zZXJ2aWNlKCckYXV0aCcsIGZ1bmN0aW9uIChqd3RIZWxwZXIsICRxLCAkcm9vdFNjb3BlKSB7XG5cbiAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gIHZhciBrZXkgPSAncG9ydGZvbGlvLmFkbWluLnRva2VuJztcblxuICAvKipcbiAgICogVmFsaWRhdGUgdGhhdCB1c2VyIGlzIGF1dGhlbnRpY2F0ZWRcbiAgICogQGF1dGhvciBCcmFuZG9uIEdyb2ZmXG4gICAqIEByZXR1cm5zIHtib29sZWFufSB0cnVlL2ZhbHNlXG4gICAqL1xuICB0aGlzLmlzQXV0aGVudGljYXRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAvL1RPRE86ID8/XG4gICAgcmV0dXJuIHNlbGYuZ2V0UmF3VG9rZW4oKSA/IHRydWUgOiBmYWxzZTtcbiAgfTtcblxuICAvKipcbiAgICogQ2FsbGVkIG9uIGxvZ2luLCB1c2VkIHRvIHNhdmUgdGhlIHRva2VuIGlmIHZhbGlkXG4gICAqIEBhdXRob3IgQnJhbmRvbiBHcm9mZlxuICAgKiBAcGFyYW0gICB7c3RyaW5nfSB0b2tlbiB0aGUgcmF3IGF1dGhvcml6YXRpb24gdG9rZW5cbiAgICogQHJldHVybnMge2Jvb2xlYW59ICB0cnVlIG9uIHN1Y2Nlc3MsIGZhbHNlIG9uIHN1Y2Nlc3MgYnV0IG5vIFNsYWNrIHJlZ2lzdHJhdGlvbiwgb3IgYSBSZWplY3RlZCBwcm9taXNlIHRoYXQgd2lsbCB0cmlnZ2VyIGFuIHVuYXV0aG9yaXplZCByZWRpcmVjdFxuICAgKi9cbiAgdGhpcy5wZXJmb3JtTG9naW4gPSBmdW5jdGlvbiAodG9rZW4pIHtcbiAgICB2YXIgZGVjb2RlZCA9IGp3dEhlbHBlci5kZWNvZGVUb2tlbih0b2tlbik7XG4gICAgaWYgKGRlY29kZWQpIHtcbiAgICAgIHNlbGYuc2V0VG9rZW4odG9rZW4pO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAkcS5yZWplY3QoJ3Rva2VuSGFzRXhwaXJlZCcpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogR2V0IHRoZSByYXcgdG9rZW4gc3RyaW5nIGZyb20gbG9jYWxTdG9yYWdlLCBvciByZXF1ZXN0IG9uZSBpZiBub25lIGluIGxvY2FsU3RvcmFnZVxuICAgKiBAYXV0aG9yIEJyYW5kb24gR3JvZmZcbiAgICogQHJldHVybnMge3N0cmluZ30gdGhlIHJhdyB0b2tlbiBzdHJpbmcgb3IgdGhlIHJlcXVlc3QgUHJvbWlzZSB0aGF0IG1heSByZXNvbHZlIHdpdGggb25lXG4gICAqL1xuICB0aGlzLmdldFJhd1Rva2VuID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBsb2NhbFRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KTtcbiAgICBpZiAobG9jYWxUb2tlbikge1xuICAgICAgcmV0dXJuIGxvY2FsVG9rZW47XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHBhcnNlZCB0b2tlbiBvYmplY3RcbiAgICogQGF1dGhvciBCcmFuZG9uIEdyb2ZmXG4gICAqIEByZXR1cm5zIHtvYmplY3R9IHRoZSBwYXJzZWQgdG9rZW5cbiAgICovXG4gIHRoaXMuZ2V0UGFyc2VkVG9rZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGxvY2FsVG9rZW4gPSBzZWxmLmdldFJhd1Rva2VuKCk7XG4gICAgaWYgKGxvY2FsVG9rZW4pIHtcbiAgICAgIHJldHVybiBqd3RIZWxwZXIuZGVjb2RlVG9rZW4obG9jYWxUb2tlbik7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBTYXZlIHRoZSBSQVcgdG9rZW5cbiAgICogQGF1dGhvciBCcmFuZG9uIEdyb2ZmXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b2tlbiB0aGUgUkFXIHRva2VuIG9iamVjdFxuICAgKi9cbiAgdGhpcy5zZXRUb2tlbiA9IGZ1bmN0aW9uICh0b2tlbikge1xuICAgIHZhciBkZWNvZGVkID0gand0SGVscGVyLmRlY29kZVRva2VuKHRva2VuKTtcbiAgICBpZiAoZGVjb2RlZCl7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIHRva2VuKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ1Rva2VuIEVycm9yOiBJbnZhbGlkPycpO1xuICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCd0b2tlbkhhc0V4cGlyZWQnKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIENsZWFyIHRoZSB0b2tlbiBmcm9tIGxvY2FsU3RvcmFnZVxuICAgKiBAYXV0aG9yIEJyYW5kb24gR3JvZmZcbiAgICovXG4gIHRoaXMuY2xlYXJMb2NhbFRva2VuID0gZnVuY3Rpb24gKCkge1xuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIFBlcmZvcm0gZnVsbCBsb2dvdXQgcHJvY2Vzc1xuICAgKiBAYXV0aG9yIEJyYW5kb24gR3JvZmZcbiAgICovXG4gIHRoaXMubG9nb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgIHNlbGYuY2xlYXJMb2NhbFRva2VuKCk7XG4gICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCd0b2tlbkhhc0V4cGlyZWQnKTtcbiAgfTtcblxufSk7IiwiaW5mb01vZHVsZS5jb250cm9sbGVyKCdJbmZvcm1hdGlvbkNvbnRyb2xsZXInLCBbJyRzY29wZScsIGZ1bmN0aW9uKCRzY29wZSl7XG4gIFxuICBcbiAgXG4gIFxufV0pOyIsInByb2pNb2R1bGUuZmFjdG9yeSgnUHJvamVjdHNBUEknLCBbJyRodHRwJywgJ2NvbmZpZycsIGZ1bmN0aW9uKCRodHRwLCBjb25maWcpe1xuICBcbiAgdmFyIGZhY3RvcnkgPSB7fTtcbiAgXG4gIHZhciBiYXNlVXJsID0gY29uZmlnLnVybCArICcvcHJvamVjdHMnO1xuICBcbiAgZmFjdG9yeS5nZXRBbGwgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogYmFzZVVybFxuICAgIH0pO1xuICB9XG4gIFxuICByZXR1cm4gZmFjdG9yeTtcbiAgXG59XSk7IiwicHJvak1vZHVsZS5jb250cm9sbGVyKCdQcm9qZWN0c0NvbnRyb2xsZXInLCBbJyRzY29wZScsICdQcm9qZWN0c0FQSScsIGZ1bmN0aW9uICgkc2NvcGUsIFByb2plY3RzQVBJKSB7XG5cblxuICAkc2NvcGUucHJvamVjdExpc3QgPSBbXTtcblxuICB2YXIgbG9hZFByb2plY3RzID0gZnVuY3Rpb24gKCkge1xuICAgIFByb2plY3RzQVBJLmdldEFsbCgpXG4gICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgJHNjb3BlLnByb2plY3RMaXN0ID0gcmVzcG9uc2UuZGF0YS5kYXRhO1xuICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgfSk7XG4gIH1cblxuICB2YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICBsb2FkUHJvamVjdHMoKTtcbiAgfVxuXG4gIGluaXQoKTtcblxuXG59XSk7Iiwid29ya01vZHVsZS5jb250cm9sbGVyKCdXb3JrRXhwZXJpZW5jZUNvbnRyb2xsZXInLCBbJyRzY29wZScsIGZ1bmN0aW9uKCRzY29wZSl7XG4gIFxuICBcbiAgXG59XSk7IiwiaW5mb01vZHVsZS5jb250cm9sbGVyKCdJbnRlcmVzdHNDb250cm9sbGVyJywgWyckc2NvcGUnLCBmdW5jdGlvbigkc2NvcGUpe1xuICBcbiAgXG4gIFxufV0pOyIsImluZm9Nb2R1bGUuY29udHJvbGxlcignU2tpbGxzQ29udHJvbGxlcicsIFsnJHNjb3BlJywgZnVuY3Rpb24oJHNjb3BlKXtcbiAgXG4gIGNvbnNvbGUubG9nKCdza2lsbHMnKTtcbiAgXG59XSk7IiwicHJvak1vZHVsZS5jb250cm9sbGVyKCdDcmVhdGVQcm9qZWN0c0NvbnRyb2xsZXInLCBbJyRzY29wZScsIGZ1bmN0aW9uKCRzY29wZSl7XG4gIFxuICBcbiAgY29uc29sZS5sb2coJ2NyZWF0ZScpO1xufV0pOyIsInByb2pNb2R1bGUuY29udHJvbGxlcignUHJvamVjdERldGFpbHNDb250cm9sbGVyJywgWyckc2NvcGUnLCBmdW5jdGlvbigkc2NvcGUpe1xuICBcbiAgXG4gIFxuICBcbn1dKTsiLCJwcm9qTW9kdWxlLmNvbnRyb2xsZXIoJ0ltYWdlc0NvbnRyb2xsZXInLCBbJyRzY29wZScsIGZ1bmN0aW9uKCRzY29wZSl7XG4gIFxuICBcbiAgXG4gIFxufV0pOyIsInByb2pNb2R1bGUuY29udHJvbGxlcignVGFnc0NvbnRyb2xsZXInLCBbJyRzY29wZScsIGZ1bmN0aW9uKCRzY29wZSl7XG4gIFxuICBcbiAgXG4gIFxufV0pOyIsIndvcmtNb2R1bGUuY29udHJvbGxlcignQ29udGFjdHNDb250cm9sbGVyJywgWyckc2NvcGUnLCBmdW5jdGlvbigkc2NvcGUpe1xuICBcbiAgXG4gIFxufV0pOyIsInByb2pNb2R1bGUuY29udHJvbGxlcignQ3JlYXRlSW1hZ2VzQ29udHJvbGxlcicsIFsnJHNjb3BlJywgZnVuY3Rpb24oJHNjb3BlKXtcbiAgXG4gIFxuICBcbn1dKTsiLCJwcm9qTW9kdWxlLmNvbnRyb2xsZXIoJ0ltYWdlRGV0YWlsc0NvbnRyb2xsZXInLCBbJyRzY29wZScsIGZ1bmN0aW9uKCRzY29wZSl7XG4gIFxuICBcbiAgXG59XSk7IiwicHJvak1vZHVsZS5jb250cm9sbGVyKCdDcmVhdGVUYWdzQ29udHJvbGxlcicsIFsnJHNjb3BlJywgZnVuY3Rpb24oJHNjb3BlKXtcbiAgXG4gIFxuICBcbiAgXG59XSk7IiwicHJvak1vZHVsZS5jb250cm9sbGVyKCdUYWdEZXRhaWxzQ29udHJvbGxlcicsIFsnJHNjb3BlJywgZnVuY3Rpb24oJHNjb3BlKXtcbiAgXG4gIFxuICBcbiAgXG59XSk7Il19
