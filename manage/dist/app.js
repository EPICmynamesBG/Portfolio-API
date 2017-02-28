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

authModule.run(['authManager', '$rootScope', '$state', '$auth', 'AuthAPI', function (authManager, $rootScope, $state, $auth, AuthAPI) {
  
  authManager.checkAuthOnRefresh();

  authManager.redirectWhenUnauthenticated();

  $rootScope.$on('tokenHasExpired', function () {
    $auth.clearLocalToken();
    $state.go('Login');
  });

  
  //validate the current token on initial page load
  AuthAPI.validateToken();
  
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
var projModule = angular.module('admin.projects', ['ui.router', 'textAngular']);

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
projModule.factory('ProjectsAPI', ['$http', 'config', function ($http, config) {

  var factory = {};

  var baseUrl = config.url + '/projects';

  factory.getAll = function () {
    return $http({
      method: 'GET',
      url: baseUrl
    });
  };

  factory.getById = function (id) {
    return $http({
      method: 'GET',
      url: baseUrl + '/id'
    });
  };

  factory.create = function (data) {
    return $http({
      method: 'POST',
      url: baseUrl,
      data: {
        
      }
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
projModule.controller('CreateProjectsController', ['$scope', 'ProjectsAPI', 'ImagesAPI', function ($scope, ProjectsAPI, ImagesAPI) {

  $scope.imageList = [];


  var loadImageList = function () {
    ImagesAPI.getAll()
      .then(function (response) {
        $scope.imageList = response.data.data;
        $('select').material_select();
      }).catch(function (error) {
        console.error(error);
      });
  };





  var init = function () {
    $('.datepicker').pickadate({
      selectMonths: true, // Creates a dropdown to control month
      selectYears: 15 // Creates a dropdown of 15 years to control year
    });

    $scope.project = {};
    $scope.project.endCurrent = true;
    
    loadImageList();
  }

  init();


}]);
projModule.factory('ImagesAPI', ['$http', 'config', function ($http, config) {

  var factory = {};

  var baseUrl = config.url + '/projects/images';

  factory.getAll = function () {
    return $http({
      method: 'GET',
      url: baseUrl
    });
  };

//  factory.getById = function (id) {
//    return $http({
//      method: 'GET',
//      url: baseUrl + '/id'
//    });
//  };
//
//  factory.create = function (data) {
//    return $http({
//      method: 'POST',
//      url: baseUrl,
//      data: {
//        
//      }
//    });
//  }

  return factory;

}]);
projModule.controller('ImagesController', ['$scope', function($scope){
  
  
  
  
}]);
projModule.controller('ProjectDetailsController', ['$scope', function($scope){
  
  
  
  
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1vZHVsZXMvQXV0aC9hdXRoLm1vZHVsZS5qcyIsIm1vZHVsZXMvSW5mb3JtYXRpb24vaW5mby5tb2R1bGUuanMiLCJtb2R1bGVzL1Byb2plY3RzL3Byb2plY3RzLm1vZHVsZS5qcyIsIm1vZHVsZXMvV29ya0V4cGVyaWVuY2Uvd29yay5tb2R1bGUuanMiLCJjb21wb25lbnRzL0FwcC5TdWJOYXYvYXBwLnN1Yi5uYXYuanMiLCJtb2R1bGVzL0FwcC5OYXYvYXBwLm5hdi5qcyIsIm1vZHVsZXMvQXV0aC9hdXRoLmFwaS5qcyIsIm1vZHVsZXMvQXV0aC9hdXRoLmxvZ2luLmNvbnRyb2xsZXIuanMiLCJtb2R1bGVzL0F1dGgvYXV0aC5sb2dvdXQuY29udHJvbGxlci5qcyIsIm1vZHVsZXMvQXV0aC9hdXRoLnNlcnZpY2UuanMiLCJtb2R1bGVzL0luZm9ybWF0aW9uL2luZm8uY29udHJvbGxlci5qcyIsIm1vZHVsZXMvUHJvamVjdHMvcHJvamVjdHMuYXBpLmpzIiwibW9kdWxlcy9Qcm9qZWN0cy9wcm9qZWN0cy5jb250cm9sbGVyLmpzIiwibW9kdWxlcy9Xb3JrRXhwZXJpZW5jZS93b3JrLmNvbnRyb2xsZXIuanMiLCJtb2R1bGVzL0luZm9ybWF0aW9uL0ludGVyZXN0cy9pbnRlcmVzdHMuY29udHJvbGxlci5qcyIsIm1vZHVsZXMvSW5mb3JtYXRpb24vU2tpbGxzL3NraWxscy5jb250cm9sbGVyLmpzIiwibW9kdWxlcy9Qcm9qZWN0cy9DcmVhdGUvcHJvamVjdHMuY3JlYXRlLmpzIiwibW9kdWxlcy9Qcm9qZWN0cy9JbWFnZXMvaW1hZ2VzLmFwaS5qcyIsIm1vZHVsZXMvUHJvamVjdHMvSW1hZ2VzL2ltYWdlcy5jb250cm9sbGVyLmpzIiwibW9kdWxlcy9Qcm9qZWN0cy9EZXRhaWxzL3Byb2plY3RzLmRldGFpbHMuanMiLCJtb2R1bGVzL1Byb2plY3RzL1RhZ3MvdGFncy5jb250cm9sbGVyLmpzIiwibW9kdWxlcy9Xb3JrRXhwZXJpZW5jZS9Db250YWN0cy9jb250YWN0cy5jb250cm9sbGVyLmpzIiwibW9kdWxlcy9Qcm9qZWN0cy9JbWFnZXMvQ3JlYXRlL2ltYWdlcy5jcmVhdGUuanMiLCJtb2R1bGVzL1Byb2plY3RzL0ltYWdlcy9EZXRhaWxzL2ltYWdlcy5kZXRhaWxzLmpzIiwibW9kdWxlcy9Qcm9qZWN0cy9UYWdzL0NyZWF0ZS90YWdzLmNyZWF0ZS5qcyIsIm1vZHVsZXMvUHJvamVjdHMvVGFncy9EZXRhaWxzL3RhZ3MuZGV0YWlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYWRtaW4nLCBbJ3VpLnJvdXRlcicsICdhbmd1bGFyLWxvYWRpbmctYmFyJywgJ2FkbWluLnRlbXBsYXRlcycsICdhZG1pbi5pbmZvJywgJ2FkbWluLndvcmsnLCAnYWRtaW4ucHJvamVjdHMnLCAnYWRtaW4uYXV0aCddKTtcblxuYXBwLmNvbnN0YW50KCdjb25maWcnLCB7XG4gIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9hcGkvdjEnXG59KTtcblxuYXBwLnJ1bihbJyRyb290U2NvcGUnLCAnJHN0YXRlJywgJyR0aW1lb3V0JywgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzdGF0ZSwgJHRpbWVvdXQpIHtcblxuICAkcm9vdFNjb3BlLiRzdGF0ZSA9ICRzdGF0ZTtcbiAgJHJvb3RTY29wZS5sb2FkaW5nID0gZmFsc2U7XG4gICRyb290U2NvcGUubW9kYWxEYXRhID0ge307XG5cbiAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKGV2dCwgdG8sIHBhcmFtcykge1xuICAgIGlmICh0by5yZWRpcmVjdFRvKSB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICRzdGF0ZS5nbyh0by5yZWRpcmVjdFRvLCBwYXJhbXMsIHtcbiAgICAgICAgbG9jYXRpb246ICdyZXBsYWNlJ1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbiAgXG4gICRyb290U2NvcGUuJG9uKCdzdGF0ZUNoYW5nZUVycm9yJywgZnVuY3Rpb24oZXZ0LCB0bywgcGFyYW1zKXtcbiAgICBjb25zb2xlLmVycm9yKGV2dCwgdG8sIHBhcmFtcyk7XG4gIH0pO1xufV0pO1xuXG5cbi8qIC0tLSBSb3V0aW5nIC0tLSAqL1xuXG5hcHAuY29uZmlnKFsnJHVybFJvdXRlclByb3ZpZGVyJywgJyRsb2NhdGlvblByb3ZpZGVyJywgJyRzdGF0ZVByb3ZpZGVyJywgJ2NmcExvYWRpbmdCYXJQcm92aWRlcicsIGZ1bmN0aW9uICgkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyLCAkc3RhdGVQcm92aWRlciwgY2ZwTG9hZGluZ0JhclByb3ZpZGVyKSB7XG5cbiAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHtcbiAgICBlbmFibGVkOiB0cnVlLFxuICAgIHJlcXVpcmVCYXNlOiB0cnVlXG4gIH0pO1xuXG4gICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoXCIvXCIpO1xuICBcbiAgY2ZwTG9hZGluZ0JhclByb3ZpZGVyLnNwaW5uZXJUZW1wbGF0ZSA9ICc8ZGl2IGNsYXNzPVwicHJlbG9hZGVyLXdyYXBwZXIgYmlnIGFjdGl2ZVwiPjxkaXYgY2xhc3M9XCJzcGlubmVyLWxheWVyIHNwaW5uZXItYmx1ZS1vbmx5XCI+PGRpdiBjbGFzcz1cImNpcmNsZS1jbGlwcGVyIGxlZnRcIj48ZGl2IGNsYXNzPVwiY2lyY2xlXCI+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cImdhcC1wYXRjaFwiPjxkaXYgY2xhc3M9XCJjaXJjbGVcIj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwiY2lyY2xlLWNsaXBwZXIgcmlnaHRcIj48ZGl2IGNsYXNzPVwiY2lyY2xlXCI+PC9kaXY+PC9kaXY+PC9kaXY+PC9kaXY+JztcblxuICAkc3RhdGVQcm92aWRlclxuICAgIC5zdGF0ZSgnLycsIHtcbiAgICAgIHJlZGlyZWN0VG86ICdJbmZvcm1hdGlvbicsXG4gICAgICBleGNsdWRlRnJvbVNpZGVuYXY6IHRydWUsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgIH1cbiAgICB9KTtcblxufV0pOyIsInZhciBhdXRoTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FkbWluLmF1dGgnLCBbJ3VpLnJvdXRlcicsICdhbmd1bGFyLWp3dCddKTtcblxuYXV0aE1vZHVsZS5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICdqd3RPcHRpb25zUHJvdmlkZXInLCAnJGh0dHBQcm92aWRlcicsIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgand0T3B0aW9uc1Byb3ZpZGVyLCAkaHR0cFByb3ZpZGVyKSB7XG5cbiAgJHN0YXRlUHJvdmlkZXJcbiAgICAuc3RhdGUoJ0xvZ2luJywge1xuICAgICAgdXJsOiAnL2xvZ2luJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnLi9zcmMvbW9kdWxlcy9BdXRoL2F1dGgubG9naW4uaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnTG9naW5Db250cm9sbGVyJyxcbiAgICAgIGV4Y2x1ZGVGcm9tU2lkZW5hdjogdHJ1ZSxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgcmVxdWlyZXNMb2dpbjogZmFsc2VcbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnTG9nb3V0Jywge1xuICAgICAgdXJsOiAnL2xvZ291dCcsXG4gICAgICB0ZW1wbGF0ZVVybDogJy4vc3JjL21vZHVsZXMvQXV0aC9hdXRoLmxvZ291dC5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdMb2dvdXRDb250cm9sbGVyJyxcbiAgICAgIGV4Y2x1ZGVGcm9tU2lkZW5hdjogdHJ1ZSxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgXG4gICAgICB9XG4gICAgfSk7XG4gIFxuICBqd3RPcHRpb25zUHJvdmlkZXIuY29uZmlnKHtcbiAgICB0b2tlbkdldHRlcjogWydvcHRpb25zJywgJyRhdXRoJywgZnVuY3Rpb24gKG9wdGlvbnMsICRhdXRoKSB7XG4gICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnVybC5zdWJzdHIob3B0aW9ucy51cmwubGVuZ3RoIC0gNSkgPT0gJy5odG1sJykge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiAkYXV0aC5nZXRSYXdUb2tlbigpO1xuICAgICAgfV0sXG4gICAgd2hpdGVMaXN0ZWREb21haW5zOiBbJ2xvY2FsaG9zdCcsICdicmFuZG9uZ3JvZmYuY29tJywgJ2Rldi5icmFuZG9uZ3JvZmYuY29tJywgJ2FwaS5icmFuZG9uZ3JvZmYuY29tJ10sXG4gICAgLy8gICAgdW5hdXRoZW50aWNhdGVkUmVkaXJlY3RQYXRoOiAnL2Vycm9yP2NvZGU9NDAzJyxcbiAgICB1bmF1dGhlbnRpY2F0ZWRSZWRpcmVjdG9yOiBbJyRzdGF0ZScsICckYXV0aCcsIGZ1bmN0aW9uICgkc3RhdGUsICRhdXRoKSB7XG4gICAgICAkYXV0aC5sb2dvdXQoKTtcbiAgICAgICRzdGF0ZS5nbyhcIkxvZ2luXCIpO1xuICAgICAgfV1cbiAgfSk7XG4gIFxuICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKCdqd3RJbnRlcmNlcHRvcicpO1xuXG59XSk7XG5cbmF1dGhNb2R1bGUucnVuKFsnYXV0aE1hbmFnZXInLCAnJHJvb3RTY29wZScsICckc3RhdGUnLCAnJGF1dGgnLCAnQXV0aEFQSScsIGZ1bmN0aW9uIChhdXRoTWFuYWdlciwgJHJvb3RTY29wZSwgJHN0YXRlLCAkYXV0aCwgQXV0aEFQSSkge1xuICBcbiAgYXV0aE1hbmFnZXIuY2hlY2tBdXRoT25SZWZyZXNoKCk7XG5cbiAgYXV0aE1hbmFnZXIucmVkaXJlY3RXaGVuVW5hdXRoZW50aWNhdGVkKCk7XG5cbiAgJHJvb3RTY29wZS4kb24oJ3Rva2VuSGFzRXhwaXJlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAkYXV0aC5jbGVhckxvY2FsVG9rZW4oKTtcbiAgICAkc3RhdGUuZ28oJ0xvZ2luJyk7XG4gIH0pO1xuXG4gIFxuICAvL3ZhbGlkYXRlIHRoZSBjdXJyZW50IHRva2VuIG9uIGluaXRpYWwgcGFnZSBsb2FkXG4gIEF1dGhBUEkudmFsaWRhdGVUb2tlbigpO1xuICBcbn1dKTtcbiIsInZhciBpbmZvTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FkbWluLmluZm8nLCBbJ3VpLnJvdXRlciddKTtcblxuaW5mb01vZHVsZS5jb25maWcoWyckc3RhdGVQcm92aWRlcicsIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICRzdGF0ZVByb3ZpZGVyXG4gICAgLnN0YXRlKCdJbmZvcm1hdGlvbicsIHtcbiAgICAgIHVybDogJy9pbmZvcm1hdGlvbicsXG4gICAgICB0ZW1wbGF0ZVVybDogJy4vc3JjL21vZHVsZXMvSW5mb3JtYXRpb24vaW5mby5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdJbmZvcm1hdGlvbkNvbnRyb2xsZXInLFxuICAgICAgcmVkaXJlY3RUbzogJ0ludGVyZXN0cycsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIG9yZGVyOiAwLFxuICAgICAgICB0YWdzOiBbXG4gICAgICAgIFwiaW5mb1wiLFxuICAgICAgICBcImluZm9ybWF0aW9uXCJcbiAgICAgIF0sXG4gICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnSW50ZXJlc3RzJywge1xuICAgICAgdXJsOiAnL2ludGVyZXN0cycsXG4gICAgICB0ZW1wbGF0ZVVybDogJy4vc3JjL21vZHVsZXMvSW5mb3JtYXRpb24vSW50ZXJlc3RzL2ludGVyZXN0cy5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdJbnRlcmVzdHNDb250cm9sbGVyJyxcbiAgICAgIHN1YnZpZXdPZjogJ0luZm9ybWF0aW9uJyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgb3JkZXI6IDBcbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnU2tpbGxzJywge1xuICAgICAgdXJsOiAnL3NraWxscycsXG4gICAgICB0ZW1wbGF0ZVVybDogJy4vc3JjL21vZHVsZXMvSW5mb3JtYXRpb24vU2tpbGxzL3NraWxscy5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdTa2lsbHNDb250cm9sbGVyJyxcbiAgICAgIHN1YnZpZXdPZjogJ0luZm9ybWF0aW9uJyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgb3JkZXI6IDFcbiAgICAgIH1cbiAgICB9KTtcblxufV0pOyIsInZhciBwcm9qTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FkbWluLnByb2plY3RzJywgWyd1aS5yb3V0ZXInLCAndGV4dEFuZ3VsYXInXSk7XG5cbnByb2pNb2R1bGUuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAkc3RhdGVQcm92aWRlclxuICAgIC5zdGF0ZSgnUHJvamVjdHMnLCB7XG4gICAgICB1cmw6ICcvcHJvamVjdHMnLFxuICAgICAgdGVtcGxhdGVVcmw6ICcuL3NyYy9tb2R1bGVzL1Byb2plY3RzL3Byb2plY3RzLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ1Byb2plY3RzQ29udHJvbGxlcicsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIG9yZGVyOiAyLFxuICAgICAgICB0YWdzOiBbXG4gICAgICAgIFwicHJvamVjdHNcIlxuICAgICAgXSxcbiAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgfVxuICAgIH0pXG4gICAgLnN0YXRlKCdQcm9qZWN0cy5DcmVhdGUnLCB7XG4gICAgICB1cmw6ICcvY3JlYXRlJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnLi9zcmMvbW9kdWxlcy9Qcm9qZWN0cy9DcmVhdGUvcHJvamVjdHMuY3JlYXRlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ0NyZWF0ZVByb2plY3RzQ29udHJvbGxlcicsXG4gICAgICBwYXJlbnQ6ICdQcm9qZWN0cycsXG4gICAgICBleGNsdWRlRnJvbVNpZGVuYXY6IHRydWUsXG4gICAgICBkYXRhOiB7XG5cbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnUHJvamVjdHMuRGV0YWlscycsIHtcbiAgICAgIHVybDogJy86aWQnLFxuICAgICAgdGVtcGxhdGVVcmw6ICcuL3NyYy9tb2R1bGVzL1Byb2plY3RzL0RldGFpbHMvcHJvamVjdHMuZGV0YWlscy5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdQcm9qZWN0RGV0YWlsc0NvbnRyb2xsZXInLFxuICAgICAgcGFyZW50OiAnUHJvamVjdHMnLFxuICAgICAgZXhjbHVkZUZyb21TaWRlbmF2OiB0cnVlLFxuICAgICAgZGF0YToge1xuXG4gICAgICB9XG4gICAgfSlcbiAgICAuc3RhdGUoJ1RhZ3MnLCB7XG4gICAgICB1cmw6ICcvdGFncycsXG4gICAgICB0ZW1wbGF0ZVVybDogJy4vc3JjL21vZHVsZXMvUHJvamVjdHMvVGFncy90YWdzLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ1RhZ3NDb250cm9sbGVyJyxcbiAgICAgIHN1YnZpZXdPZjogJ1Byb2plY3RzJyxcbiAgICAgIGV4Y2x1ZGVGcm9tU2lkZW5hdjogZmFsc2UsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIG9yZGVyOiAwLFxuICAgICAgICB0YWdzOiBbXG4gICAgICAgIFwicHJvamVjdHNcIlxuICAgICAgICBdLFxuICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICB9XG4gICAgfSlcbiAgICAuc3RhdGUoJ1RhZ3MuQ3JlYXRlJywge1xuICAgICAgdXJsOiAnL2NyZWF0ZScsXG4gICAgICB0ZW1wbGF0ZVVybDogJy4vc3JjL21vZHVsZXMvUHJvamVjdHMvVGFncy9DcmVhdGUvdGFncy5jcmVhdGUuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnQ3JlYXRlVGFnc0NvbnRyb2xsZXInLFxuICAgICAgcGFyZW50OiAnVGFncycsXG4gICAgICBleGNsdWRlRnJvbVNpZGVuYXY6IHRydWUsXG4gICAgICBkYXRhOiB7XG5cbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnVGFncy5EZXRhaWxzJywge1xuICAgICAgdXJsOiAnLzppZCcsXG4gICAgICB0ZW1wbGF0ZVVybDogJy4vc3JjL21vZHVsZXMvUHJvamVjdHMvVGFncy9EZXRhaWxzL3RhZ3MuZGV0YWlscy5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdUYWdEZXRhaWxzQ29udHJvbGxlcicsXG4gICAgICBwYXJlbnQ6ICdUYWdzJyxcbiAgICAgIGV4Y2x1ZGVGcm9tU2lkZW5hdjogdHJ1ZSxcbiAgICAgIGRhdGE6IHtcblxuICAgICAgfVxuICAgIH0pXG4gICAgLnN0YXRlKCdJbWFnZXMnLCB7XG4gICAgICB1cmw6ICcvaW1hZ2VzJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnLi9zcmMvbW9kdWxlcy9Qcm9qZWN0cy9JbWFnZXMvaW1hZ2VzLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ0ltYWdlc0NvbnRyb2xsZXInLFxuICAgICAgc3Vidmlld09mOiAnUHJvamVjdHMnLFxuICAgICAgZXhjbHVkZUZyb21TaWRlbmF2OiBmYWxzZSxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgb3JkZXI6IDEsXG4gICAgICAgIHRhZ3M6IFtcbiAgICAgICAgXCJwcm9qZWN0c1wiXG4gICAgICBdLFxuICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICB9XG4gICAgfSlcbiAgICAuc3RhdGUoJ0ltZ2Flcy5DcmVhdGUnLCB7XG4gICAgICB1cmw6ICcvY3JlYXRlJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnLi9zcmMvbW9kdWxlcy9Qcm9qZWN0cy9JbWFnZXMvQ3JlYXRlL2ltYWdlcy5jcmVhdGUuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnSW1hZ2VUYWdzQ29udHJvbGxlcicsXG4gICAgICBwYXJlbnQ6ICdJbWFnZXMnLFxuICAgICAgZXhjbHVkZUZyb21TaWRlbmF2OiB0cnVlLFxuICAgICAgZGF0YToge1xuXG4gICAgICB9XG4gICAgfSlcbiAgICAuc3RhdGUoJ0ltYWdlcy5EZXRhaWxzJywge1xuICAgICAgdXJsOiAnLzppZCcsXG4gICAgICB0ZW1wbGF0ZVVybDogJy4vc3JjL21vZHVsZXMvUHJvamVjdHMvSW1hZ2VzL0RldGFpbHMvaW1hZ2VzLmRldGFpbHMuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnSW1hZ2VEZXRhaWxzQ29udHJvbGxlcicsXG4gICAgICBwYXJlbnQ6ICdJbWFnZXMnLFxuICAgICAgZXhjbHVkZUZyb21TaWRlbmF2OiB0cnVlLFxuICAgICAgZGF0YToge1xuXG4gICAgICB9XG4gICAgfSk7XG5cbn1dKTsiLCJ2YXIgd29ya01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhZG1pbi53b3JrJywgWyd1aS5yb3V0ZXInXSk7XG5cbndvcmtNb2R1bGUuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAkc3RhdGVQcm92aWRlclxuICAgIC5zdGF0ZSgnV29yayBFeHBlcmllbmNlJywge1xuICAgICAgdXJsOiAnL3dvcmstZXhwZXJpZW5jZScsXG4gICAgICB0ZW1wbGF0ZVVybDogJy4vc3JjL21vZHVsZXMvV29ya0V4cGVyaWVuY2Uvd29yay5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdXb3JrRXhwZXJpZW5jZUNvbnRyb2xsZXInLFxuICAgICAgZGF0YToge1xuICAgICAgICBvcmRlcjogMSxcbiAgICAgICAgdGFnczogW1xuICAgICAgICBcIndvcmtcIlxuICAgICAgXSxcbiAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgfVxuICAgIH0pXG4gICAgLnN0YXRlKCdDb250YWN0cycsIHtcbiAgICAgIHVybDogJy9jb250YWN0cycsXG4gICAgICB0ZW1wbGF0ZVVybDogJy4vc3JjL21vZHVsZXMvV29ya0V4cGVyaWVuY2UvQ29udGFjdHMvY29udGFjdHMuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnV29ya0V4cGVyaWVuY2VDb250cm9sbGVyJyxcbiAgICAgIHN1YnZpZXdPZjogJ1dvcmsgRXhwZXJpZW5jZScsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIG9yZGVyOiAwLFxuICAgICAgICB0YWdzOiBbXG4gICAgICAgIFwiY29udGFjdHNcIlxuICAgICAgXSxcbiAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuXG59XSk7IiwiYXBwLmRpcmVjdGl2ZSgnYXBwU3ViTmF2JywgWyckc3RhdGUnLCBmdW5jdGlvbigkc3RhdGUpe1xuICBcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIHNjb3BlOiB7XG4gICAgICBoZWFkZXI6ICdAJyxcbiAgICAgIGl0ZW1UeXBlOiAnQCcsIC8vaWU6IHByb2plY3QsIGNvbnRhY3RcbiAgICAgIHJvdXRlSXRlbXM6ICc9JyxcbiAgICAgIHJvdXRlVmFyaWFibGU6ICdAJyxcbiAgICAgIGNyZWF0ZU5ldzogJ0AnXG4gICAgfSxcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9zcmMvY29tcG9uZW50cy9BcHAuU3ViTmF2L2FwcC5zdWIubmF2Lmh0bWwnLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgXG4gICAgICBcbiAgICAgIHNjb3BlLml0ZW1UeXBlICs9ICdzJztcbiAgICAgIFxuICAgICAgXG4gICAgICBzY29wZS5jcmVhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgXG4gICAgICAgICRzdGF0ZS5nbyhzY29wZS5jcmVhdGVOZXcpO1xuICAgICAgfVxuICAgICAgXG4gICAgICBcbiAgICAgIFxuICAgIH1cbiAgfVxuICBcbn1dKTsiLCJhcHAuZGlyZWN0aXZlKCdhcHBOYXYnLCBmdW5jdGlvbiAoJHN0YXRlLCAkYXV0aCwgJHRpbWVvdXQpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIHNjb3BlOiB7fSxcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9zcmMvbW9kdWxlcy9BcHAuTmF2L2FwcC5uYXYuaHRtbCcsXG4gICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuXG4gICAgICBzY29wZS4kYXV0aCA9ICRhdXRoO1xuXG4gICAgICAkKCcuYnV0dG9uLWNvbGxhcHNlJykuc2lkZU5hdih7XG4gICAgICAgIG1lbnVXaWR0aDogMzAwLCAvLyBEZWZhdWx0IGlzIDMwMFxuICAgICAgICBlZGdlOiAnbGVmdCcsIC8vIENob29zZSB0aGUgaG9yaXpvbnRhbCBvcmlnaW5cbiAgICAgICAgY2xvc2VPbkNsaWNrOiBmYWxzZSwgLy8gQ2xvc2VzIHNpZGUtbmF2IG9uIDxhPiBjbGlja3MsIHVzZWZ1bCBmb3IgQW5ndWxhci9NZXRlb3JcbiAgICAgICAgZHJhZ2dhYmxlOiB0cnVlIC8vIENob29zZSB3aGV0aGVyIHlvdSBjYW4gZHJhZyB0byBvcGVuIG9uIHRvdWNoIHNjcmVlbnNcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgY29tcGFyZUZ1bmMgPSBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICBpZiAoIWEuZGF0YSB8fCAhYi5kYXRhKSB7XG4gICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYS5kYXRhLm9yZGVyIDwgYi5kYXRhLm9yZGVyKSB7XG4gICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9IGVsc2UgaWYgKGEuZGF0YS5vcmRlciA+IGIuZGF0YS5vcmRlcikge1xuICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICB2YXIgb2JqZWN0V2l0aE5hbWUgPSBmdW5jdGlvbiAobGlzdCwgbmFtZSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgdGhpc09iaiA9IGxpc3RbaV07XG4gICAgICAgICAgaWYgKHRoaXNPYmoubmFtZSA9PSBuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpc09iajtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIHZhciBnZXRQYXJzZWRTdGF0ZUxpc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBsaXN0ID0gYW5ndWxhci5jb3B5KCRzdGF0ZS5nZXQoKSk7XG5cbiAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICB3aGlsZSAoaSA8IGxpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuXG4gICAgICAgICAgaWYgKGl0ZW0uYWJzdHJhY3QgfHwgaXRlbS5leGNsdWRlRnJvbVNpZGVuYXYpIHtcbiAgICAgICAgICAgIGxpc3Quc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGl0ZW0uc3Vidmlld09mKSB7XG5cbiAgICAgICAgICAgIHZhciBwYXJlbnQgPSBvYmplY3RXaXRoTmFtZShsaXN0LCBpdGVtLnN1YnZpZXdPZik7XG4gICAgICAgICAgICBpZiAoIXBhcmVudC5zdWJ2aWV3cykge1xuICAgICAgICAgICAgICBwYXJlbnQuc3Vidmlld3MgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhcmVudC5zdWJ2aWV3cy5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgbGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cblxuICAgICAgICBsaXN0LnNvcnQoY29tcGFyZUZ1bmMpO1xuXG4gICAgICAgIHJldHVybiBsaXN0O1xuICAgICAgfTtcblxuXG4gICAgICBzY29wZS5saXN0ID0gZ2V0UGFyc2VkU3RhdGVMaXN0KCk7XG5cblxuICAgICAgc2NvcGUucm9vdE5hdkxpc3QgPSBbXTtcbiAgICAgIHNjb3BlLnN1Yk5hdkxpc3QgPSBbXTtcbiAgICAgIHNjb3BlLmxpc3QuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICBpZiAoaXRlbS5zdWJ2aWV3cykge1xuICAgICAgICAgIGl0ZW0uc3Vidmlld3Muc29ydChjb21wYXJlRnVuYyk7XG4gICAgICAgICAgc2NvcGUuc3ViTmF2TGlzdC5wdXNoKGl0ZW0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNjb3BlLnJvb3ROYXZMaXN0LnB1c2goaXRlbSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG5cbiAgICAgIHNjb3BlLnJvb3ROYXZMaXN0LnNvcnQoY29tcGFyZUZ1bmMpO1xuICAgICAgc2NvcGUuc3ViTmF2TGlzdC5zb3J0KGNvbXBhcmVGdW5jKTtcblxuXG4gICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoJy5jb2xsYXBzaWJsZScpLmNvbGxhcHNpYmxlKHtcbiAgICAgICAgICBhY2NvcmRpb246IHRydWVcbiAgICAgICAgfSk7XG4gICAgICB9LCAyMCk7XG5cbiAgICB9LFxuICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgpIHtcblxuICAgIH1cbiAgfVxufSk7IiwiYXV0aE1vZHVsZS5mYWN0b3J5KCdBdXRoQVBJJywgZnVuY3Rpb24gKCRodHRwLCBjb25maWcsICRhdXRoLCAkcm9vdFNjb3BlKSB7XG5cbiAgdmFyIGZhY3RvcnkgPSB7fTtcblxuICB2YXIgYmFzZVVybCA9IGNvbmZpZy51cmwgKyAnL2F1dGgnO1xuXG5cbiAgZmFjdG9yeS5sb2dpbiA9IGZ1bmN0aW9uIChlbWFpbCwgcGFzc3dvcmQpIHtcblxuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIHVybDogYmFzZVVybCArICcvbG9naW4nLFxuICAgICAgZGF0YToge1xuICAgICAgICBlbWFpbDogZW1haWwsXG4gICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZFxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZmFjdG9yeS52YWxpZGF0ZVRva2VuID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBwcm9tID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgJGh0dHAoe1xuICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgdXJsOiBiYXNlVXJsICsgJy90b2tlbi92YWxpZGF0ZSdcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgLy9UT0RPXG4gICAgICAgICAgaWYgKHJlc3BvbnNlLmRhdGEudmFsaWQpIHtcbiAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgndG9rZW5IYXNFeHBpcmVkJyk7XG4gICAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgIGlmIChlcnJvci5zdGF0dXMgPT0gNDAzIHx8IGVycm9yLnN0YXR1cyA9PSA0MDEpIHtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgndG9rZW5IYXNFeHBpcmVkJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlamVjdChmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb207XG4gIH07XG5cbiAgZmFjdG9yeS5sb2dvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0RFTEVURScsXG4gICAgICB1cmw6IGJhc2VVcmwgKyAnL2xvZ291dCdcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gZmFjdG9yeTtcblxufSk7IiwiYXV0aE1vZHVsZS5jb250cm9sbGVyKCdMb2dpbkNvbnRyb2xsZXInLCBbJyRzY29wZScsICdBdXRoQVBJJywgJyRhdXRoJywgJyRzdGF0ZScsIGZ1bmN0aW9uICgkc2NvcGUsIEF1dGhBUEksICRhdXRoLCAkc3RhdGUpIHtcblxuICAkc2NvcGUuZXJyb3IgPSB1bmRlZmluZWQ7XG4gIFxuICAkc2NvcGUubG9naW4gPSBmdW5jdGlvbiAoKSB7XG5cbiAgICBBdXRoQVBJLmxvZ2luKCRzY29wZS5lbWFpbCwgJHNjb3BlLnBhc3N3b3JkKVxuICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cbiAgICAgICAgaWYgKHJlc3BvbnNlLmRhdGEudG9rZW4pIHtcbiAgICAgICAgICAkYXV0aC5wZXJmb3JtTG9naW4ocmVzcG9uc2UuZGF0YS50b2tlbik7XG4gICAgICAgICAgJHN0YXRlLmdvKCcvJyk7XG4gICAgICAgIH1cbiAgICAgIFxuICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG5cbiAgICAgICAgJHNjb3BlLmVycm9yID0gZXJyb3IuZGF0YS5tc2c7XG4gICAgICBcbiAgICAgIH0pO1xuXG4gIH07XG5cblxuXG59XSk7IiwiYXV0aE1vZHVsZS5jb250cm9sbGVyKCdMb2dvdXRDb250cm9sbGVyJywgWyckc2NvcGUnLCAnQXV0aEFQSScsICckYXV0aCcsICckc3RhdGUnLCBmdW5jdGlvbiAoJHNjb3BlLCBBdXRoQVBJLCAkYXV0aCwgJHN0YXRlKSB7XG5cbiAgQXV0aEFQSS5sb2dvdXQoKVxuICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgaWYgKHJlc3BvbnNlLmRhdGEubG9nb3V0ID09IFwic3VjY2Vzc1wiKXtcbiAgICAgICAgJGF1dGgubG9nb3V0KCk7XG4gICAgICAgICRzdGF0ZS5nbygnTG9naW4nKTsgXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnNvbGUuZXJyb3IocmVzcG9uc2UpO1xuICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgfSk7XG5cbn1dKTsiLCJhdXRoTW9kdWxlLnNlcnZpY2UoJyRhdXRoJywgZnVuY3Rpb24gKGp3dEhlbHBlciwgJHEsICRyb290U2NvcGUpIHtcblxuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgdmFyIGtleSA9ICdwb3J0Zm9saW8uYWRtaW4udG9rZW4nO1xuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZSB0aGF0IHVzZXIgaXMgYXV0aGVudGljYXRlZFxuICAgKiBAYXV0aG9yIEJyYW5kb24gR3JvZmZcbiAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUvZmFsc2VcbiAgICovXG4gIHRoaXMuaXNBdXRoZW50aWNhdGVkID0gZnVuY3Rpb24gKCkge1xuICAgIC8vVE9ETzogPz9cbiAgICByZXR1cm4gc2VsZi5nZXRSYXdUb2tlbigpID8gdHJ1ZSA6IGZhbHNlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgb24gbG9naW4sIHVzZWQgdG8gc2F2ZSB0aGUgdG9rZW4gaWYgdmFsaWRcbiAgICogQGF1dGhvciBCcmFuZG9uIEdyb2ZmXG4gICAqIEBwYXJhbSAgIHtzdHJpbmd9IHRva2VuIHRoZSByYXcgYXV0aG9yaXphdGlvbiB0b2tlblxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gIHRydWUgb24gc3VjY2VzcywgZmFsc2Ugb24gc3VjY2VzcyBidXQgbm8gU2xhY2sgcmVnaXN0cmF0aW9uLCBvciBhIFJlamVjdGVkIHByb21pc2UgdGhhdCB3aWxsIHRyaWdnZXIgYW4gdW5hdXRob3JpemVkIHJlZGlyZWN0XG4gICAqL1xuICB0aGlzLnBlcmZvcm1Mb2dpbiA9IGZ1bmN0aW9uICh0b2tlbikge1xuICAgIHZhciBkZWNvZGVkID0gand0SGVscGVyLmRlY29kZVRva2VuKHRva2VuKTtcbiAgICBpZiAoZGVjb2RlZCkge1xuICAgICAgc2VsZi5zZXRUb2tlbih0b2tlbik7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICRxLnJlamVjdCgndG9rZW5IYXNFeHBpcmVkJyk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHJhdyB0b2tlbiBzdHJpbmcgZnJvbSBsb2NhbFN0b3JhZ2UsIG9yIHJlcXVlc3Qgb25lIGlmIG5vbmUgaW4gbG9jYWxTdG9yYWdlXG4gICAqIEBhdXRob3IgQnJhbmRvbiBHcm9mZlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgcmF3IHRva2VuIHN0cmluZyBvciB0aGUgcmVxdWVzdCBQcm9taXNlIHRoYXQgbWF5IHJlc29sdmUgd2l0aCBvbmVcbiAgICovXG4gIHRoaXMuZ2V0UmF3VG9rZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGxvY2FsVG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xuICAgIGlmIChsb2NhbFRva2VuKSB7XG4gICAgICByZXR1cm4gbG9jYWxUb2tlbjtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgcGFyc2VkIHRva2VuIG9iamVjdFxuICAgKiBAYXV0aG9yIEJyYW5kb24gR3JvZmZcbiAgICogQHJldHVybnMge29iamVjdH0gdGhlIHBhcnNlZCB0b2tlblxuICAgKi9cbiAgdGhpcy5nZXRQYXJzZWRUb2tlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbG9jYWxUb2tlbiA9IHNlbGYuZ2V0UmF3VG9rZW4oKTtcbiAgICBpZiAobG9jYWxUb2tlbikge1xuICAgICAgcmV0dXJuIGp3dEhlbHBlci5kZWNvZGVUb2tlbihsb2NhbFRva2VuKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFNhdmUgdGhlIFJBVyB0b2tlblxuICAgKiBAYXV0aG9yIEJyYW5kb24gR3JvZmZcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRva2VuIHRoZSBSQVcgdG9rZW4gb2JqZWN0XG4gICAqL1xuICB0aGlzLnNldFRva2VuID0gZnVuY3Rpb24gKHRva2VuKSB7XG4gICAgdmFyIGRlY29kZWQgPSBqd3RIZWxwZXIuZGVjb2RlVG9rZW4odG9rZW4pO1xuICAgIGlmIChkZWNvZGVkKXtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgdG9rZW4pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygnVG9rZW4gRXJyb3I6IEludmFsaWQ/Jyk7XG4gICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3Rva2VuSGFzRXhwaXJlZCcpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQ2xlYXIgdGhlIHRva2VuIGZyb20gbG9jYWxTdG9yYWdlXG4gICAqIEBhdXRob3IgQnJhbmRvbiBHcm9mZlxuICAgKi9cbiAgdGhpcy5jbGVhckxvY2FsVG9rZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcbiAgfTtcblxuICAvKipcbiAgICogUGVyZm9ybSBmdWxsIGxvZ291dCBwcm9jZXNzXG4gICAqIEBhdXRob3IgQnJhbmRvbiBHcm9mZlxuICAgKi9cbiAgdGhpcy5sb2dvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgc2VsZi5jbGVhckxvY2FsVG9rZW4oKTtcbiAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3Rva2VuSGFzRXhwaXJlZCcpO1xuICB9O1xuXG59KTsiLCJpbmZvTW9kdWxlLmNvbnRyb2xsZXIoJ0luZm9ybWF0aW9uQ29udHJvbGxlcicsIFsnJHNjb3BlJywgZnVuY3Rpb24oJHNjb3BlKXtcbiAgXG4gIFxuICBcbiAgXG59XSk7IiwicHJvak1vZHVsZS5mYWN0b3J5KCdQcm9qZWN0c0FQSScsIFsnJGh0dHAnLCAnY29uZmlnJywgZnVuY3Rpb24gKCRodHRwLCBjb25maWcpIHtcblxuICB2YXIgZmFjdG9yeSA9IHt9O1xuXG4gIHZhciBiYXNlVXJsID0gY29uZmlnLnVybCArICcvcHJvamVjdHMnO1xuXG4gIGZhY3RvcnkuZ2V0QWxsID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiBiYXNlVXJsXG4gICAgfSk7XG4gIH07XG5cbiAgZmFjdG9yeS5nZXRCeUlkID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6IGJhc2VVcmwgKyAnL2lkJ1xuICAgIH0pO1xuICB9O1xuXG4gIGZhY3RvcnkuY3JlYXRlID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICB1cmw6IGJhc2VVcmwsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIFxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGZhY3Rvcnk7XG5cbn1dKTsiLCJwcm9qTW9kdWxlLmNvbnRyb2xsZXIoJ1Byb2plY3RzQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ1Byb2plY3RzQVBJJywgZnVuY3Rpb24gKCRzY29wZSwgUHJvamVjdHNBUEkpIHtcblxuXG4gICRzY29wZS5wcm9qZWN0TGlzdCA9IFtdO1xuXG4gIHZhciBsb2FkUHJvamVjdHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgUHJvamVjdHNBUEkuZ2V0QWxsKClcbiAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAkc2NvcGUucHJvamVjdExpc3QgPSByZXNwb25zZS5kYXRhLmRhdGE7XG4gICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICB9KTtcbiAgfVxuXG4gIHZhciBpbml0ID0gZnVuY3Rpb24gKCkge1xuICAgIGxvYWRQcm9qZWN0cygpO1xuICB9XG5cbiAgaW5pdCgpO1xuXG5cbn1dKTsiLCJ3b3JrTW9kdWxlLmNvbnRyb2xsZXIoJ1dvcmtFeHBlcmllbmNlQ29udHJvbGxlcicsIFsnJHNjb3BlJywgZnVuY3Rpb24oJHNjb3BlKXtcbiAgXG4gIFxuICBcbn1dKTsiLCJpbmZvTW9kdWxlLmNvbnRyb2xsZXIoJ0ludGVyZXN0c0NvbnRyb2xsZXInLCBbJyRzY29wZScsIGZ1bmN0aW9uKCRzY29wZSl7XG4gIFxuICBcbiAgXG59XSk7IiwiaW5mb01vZHVsZS5jb250cm9sbGVyKCdTa2lsbHNDb250cm9sbGVyJywgWyckc2NvcGUnLCBmdW5jdGlvbigkc2NvcGUpe1xuICBcbiAgY29uc29sZS5sb2coJ3NraWxscycpO1xuICBcbn1dKTsiLCJwcm9qTW9kdWxlLmNvbnRyb2xsZXIoJ0NyZWF0ZVByb2plY3RzQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ1Byb2plY3RzQVBJJywgJ0ltYWdlc0FQSScsIGZ1bmN0aW9uICgkc2NvcGUsIFByb2plY3RzQVBJLCBJbWFnZXNBUEkpIHtcblxuICAkc2NvcGUuaW1hZ2VMaXN0ID0gW107XG5cblxuICB2YXIgbG9hZEltYWdlTGlzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICBJbWFnZXNBUEkuZ2V0QWxsKClcbiAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAkc2NvcGUuaW1hZ2VMaXN0ID0gcmVzcG9uc2UuZGF0YS5kYXRhO1xuICAgICAgICAkKCdzZWxlY3QnKS5tYXRlcmlhbF9zZWxlY3QoKTtcbiAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgIH0pO1xuICB9O1xuXG5cblxuXG5cbiAgdmFyIGluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgJCgnLmRhdGVwaWNrZXInKS5waWNrYWRhdGUoe1xuICAgICAgc2VsZWN0TW9udGhzOiB0cnVlLCAvLyBDcmVhdGVzIGEgZHJvcGRvd24gdG8gY29udHJvbCBtb250aFxuICAgICAgc2VsZWN0WWVhcnM6IDE1IC8vIENyZWF0ZXMgYSBkcm9wZG93biBvZiAxNSB5ZWFycyB0byBjb250cm9sIHllYXJcbiAgICB9KTtcblxuICAgICRzY29wZS5wcm9qZWN0ID0ge307XG4gICAgJHNjb3BlLnByb2plY3QuZW5kQ3VycmVudCA9IHRydWU7XG4gICAgXG4gICAgbG9hZEltYWdlTGlzdCgpO1xuICB9XG5cbiAgaW5pdCgpO1xuXG5cbn1dKTsiLCJwcm9qTW9kdWxlLmZhY3RvcnkoJ0ltYWdlc0FQSScsIFsnJGh0dHAnLCAnY29uZmlnJywgZnVuY3Rpb24gKCRodHRwLCBjb25maWcpIHtcblxuICB2YXIgZmFjdG9yeSA9IHt9O1xuXG4gIHZhciBiYXNlVXJsID0gY29uZmlnLnVybCArICcvcHJvamVjdHMvaW1hZ2VzJztcblxuICBmYWN0b3J5LmdldEFsbCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogYmFzZVVybFxuICAgIH0pO1xuICB9O1xuXG4vLyAgZmFjdG9yeS5nZXRCeUlkID0gZnVuY3Rpb24gKGlkKSB7XG4vLyAgICByZXR1cm4gJGh0dHAoe1xuLy8gICAgICBtZXRob2Q6ICdHRVQnLFxuLy8gICAgICB1cmw6IGJhc2VVcmwgKyAnL2lkJ1xuLy8gICAgfSk7XG4vLyAgfTtcbi8vXG4vLyAgZmFjdG9yeS5jcmVhdGUgPSBmdW5jdGlvbiAoZGF0YSkge1xuLy8gICAgcmV0dXJuICRodHRwKHtcbi8vICAgICAgbWV0aG9kOiAnUE9TVCcsXG4vLyAgICAgIHVybDogYmFzZVVybCxcbi8vICAgICAgZGF0YToge1xuLy8gICAgICAgIFxuLy8gICAgICB9XG4vLyAgICB9KTtcbi8vICB9XG5cbiAgcmV0dXJuIGZhY3Rvcnk7XG5cbn1dKTsiLCJwcm9qTW9kdWxlLmNvbnRyb2xsZXIoJ0ltYWdlc0NvbnRyb2xsZXInLCBbJyRzY29wZScsIGZ1bmN0aW9uKCRzY29wZSl7XG4gIFxuICBcbiAgXG4gIFxufV0pOyIsInByb2pNb2R1bGUuY29udHJvbGxlcignUHJvamVjdERldGFpbHNDb250cm9sbGVyJywgWyckc2NvcGUnLCBmdW5jdGlvbigkc2NvcGUpe1xuICBcbiAgXG4gIFxuICBcbn1dKTsiLCJwcm9qTW9kdWxlLmNvbnRyb2xsZXIoJ1RhZ3NDb250cm9sbGVyJywgWyckc2NvcGUnLCBmdW5jdGlvbigkc2NvcGUpe1xuICBcbiAgXG4gIFxuICBcbn1dKTsiLCJ3b3JrTW9kdWxlLmNvbnRyb2xsZXIoJ0NvbnRhY3RzQ29udHJvbGxlcicsIFsnJHNjb3BlJywgZnVuY3Rpb24oJHNjb3BlKXtcbiAgXG4gIFxuICBcbn1dKTsiLCJwcm9qTW9kdWxlLmNvbnRyb2xsZXIoJ0NyZWF0ZUltYWdlc0NvbnRyb2xsZXInLCBbJyRzY29wZScsIGZ1bmN0aW9uKCRzY29wZSl7XG4gIFxuICBcbiAgXG59XSk7IiwicHJvak1vZHVsZS5jb250cm9sbGVyKCdJbWFnZURldGFpbHNDb250cm9sbGVyJywgWyckc2NvcGUnLCBmdW5jdGlvbigkc2NvcGUpe1xuICBcbiAgXG4gIFxufV0pOyIsInByb2pNb2R1bGUuY29udHJvbGxlcignQ3JlYXRlVGFnc0NvbnRyb2xsZXInLCBbJyRzY29wZScsIGZ1bmN0aW9uKCRzY29wZSl7XG4gIFxuICBcbiAgXG4gIFxufV0pOyIsInByb2pNb2R1bGUuY29udHJvbGxlcignVGFnRGV0YWlsc0NvbnRyb2xsZXInLCBbJyRzY29wZScsIGZ1bmN0aW9uKCRzY29wZSl7XG4gIFxuICBcbiAgXG4gIFxufV0pOyJdfQ==
