var app = angular.module('admin', ['ui.router', 'angular-loading-bar', 'admin.templates', 'admin.info', 'admin.work', 'admin.projects', 'admin.auth', 'froala']);

app.constant('config', {
  url: 'http://localhost:8888/api/v1',
  dateFormat: 'mm/dd/yyyy',
  dateTimeFormat: 'mm/dd/yyyy hh:mm:ss'
});

app.value('froalaConfig', {
  heightMin: 200
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
    .state('Projects.Details.Edit', {
      url: '/edit',
      templateUrl: './src/modules/Projects/Details/Edit/projects.details.edit.html',
      controller: 'ProjectDetailsEditController',
      parent: 'Projects.Details',
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
      createNew: '@',
      displayProp: '@'
    },
    replace: true,
    templateUrl: './src/components/App.SubNav/app.sub.nav.html',
    link: function(scope, element, attrs) {
            
      scope.create = function() {
        
        $state.go(scope.createNew);
      }
      
    }
  }
  
}]);
app.directive('chipField', function (TagsAPI) {
  return {
    restrict: 'A',
    replace: false,
    scope: {
      preset: '=',
      ngModel: '='
    },
    templateUrl: './src/components/Chips/chip-field.html',
    link: function (scope, element, attrs) {

      var thisField = $('.chip-field');

      var options = [];
      var presets = [];

      var getAllOptions = function () {
        TagsAPI.getAll()
          .then(function (resposne) {
            options = resposne.data.data;
          }).catch(function (error) {
            console.error(error);
          });
      };

      var parseOptionsToAutocomplete = function (toParse) {
        var autocomplete = {};
        toParse.forEach(function (item) {
          var key = item.name;
          autocomplete[key] = null;
        });
        return autocomplete;
      }


      var parsePresetsToChips = function (toParse) {
        if (!toParse || !Array.isArray(toParse) || toParse.length == 0) {
          return [];
        }

        var chipList = []
        toParse.forEach(function (tag) {
          var chip = {
            tag: tag.name,
            id: tag.id
          };
          chipList.push(chip);
        });
        return chipList;
      };


      var init = function () {
        thisField.material_chip({
          autocompleteData: parseOptionsToAutocomplete(options),
          limit: 10,
          data: parsePresetsToChips(scope.preset),
          placeholder: '+Tag',
          secondaryPlaceholder: 'Enter a Tag'
        });
      }

      init();


      scope.$watch(function () {
        return thisField.material_chip('data');
      }, function (newVal) {
        scope.ngModel = newVal;
      }, true);

      scope.$watch('ngModel', function (newValue, oldValue) {
        if (newValue != oldValue) {
          if (!newValue || newValue.length == 0) {
            thisField.empty();
            init();
          }
        }
      });

    }
  }
});
app.directive('imgPlaceholder', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      addClasses: '='
    },
    templateUrl: './src/components/ImgPlaceholder/imgPlaceholder.html',
    link: function(scope, element, attrs) {
      
    }
  }
});
app.directive('imgPreview', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      img: '=',
      addClasses: '@',
      index: '='
    },
    templateUrl: './src/components/ImgPreview/imgPreview.html',
    link: function(scope, element, attrs) {
      
    }
  }
});
app.directive('newImage', function() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      ngModel: '=',
      disabled: '='
    },
    templateUrl: './src/components/NewImage/newImage.html',
    link: function(scope, element, attrs) {
      
    }
  }
});
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
  
  factory.parseProjectDates = function(project) {
    project.startDate = moment(project.startDate, config.dateFormat);
    if (project.endDate != null){
      project.endDate = moment(project.endDate, config.dateFormat)
    }
    
    project.lastUpdated = moment(project.lastUpdated, config.dateTimeFormat);
    return project;
  }
  

  factory.getAll = function () {
    return $http({
      method: 'GET',
      url: baseUrl
    });
  };

  factory.getById = function (id) {
    return $http({
      method: 'GET',
      url: baseUrl + '/' + id
    });
  };

  factory.create = function (data) {
    return $http({
      method: 'POST',
      url: baseUrl,
      data: data
    });
  };

  factory.toggleVisibility = function (id, visible = false) {
    return $http({
      method: 'PUT',
      url: baseUrl + '/' + id + '/visibility',
      data: {
        visible: visible
      }
    });
  };

  factory.update = function (id, data) {
    return $http({
      method: 'PUT',
      url: baseUrl + '/' + id,
      data: data
    });
  };

  factory.delete = function (id) {
    return $http({
      method: 'DELETE',
      url: baseUrl + '/' + id
    });
  }

  return factory;

}]);
projModule.controller('ProjectsController', ['$scope', 'ProjectsAPI', '$state', function ($scope, ProjectsAPI, $state) {


  $scope.projectList = [];

  var loadProjects = function (cb) {
    ProjectsAPI.getAll()
      .then(function (response) {
        $scope.projectList = response.data.data;
        if (cb) {
          cb();
        }
      }).catch(function (error) {
        console.error(error);
      });
  }

  var init = function () {
    loadProjects(function () {
      if ($scope.projectList.length > 0) {
        $state.go('Projects.Details', {
          id: $scope.projectList[0].id
        });
      }
    });
  }

  init();

  $scope.$on('projects.reload', function () {
    loadProjects();
  });

}]);
workModule.controller('WorkExperienceController', ['$scope', function($scope){
  
  
  
}]);
infoModule.controller('SkillsController', ['$scope', function($scope){
  
  console.log('skills');
  
}]);
infoModule.controller('InterestsController', ['$scope', function($scope){
  
  
  
}]);
projModule.controller('CreateProjectsController', ['$scope', 'ProjectsAPI', 'ImagesAPI', 'TagsAPI', '$timeout', '$state', function ($scope, ProjectsAPI, ImagesAPI, TagsAPI, $timeout, $state) {

  var loadImageList = function () {
    ImagesAPI.getAll()
      .then(function (response) {
        $scope.allImagesList = response.data.data;
        $timeout(function(){
          $('select').material_select();
        }, 50);
      }).catch(function (error) {
        console.error(error);
      });
  };
  
  $scope.$watch('allImageList', function(newValue, oldValue){
    if (newValue != oldValue && newValue.length > 0){
      $timeout(function(){
          $('select').material_select('destroy');
          $('select').material_select();
        }, 50);
    }
  });

  var init = function () {
    $scope.project = {};
    $scope.allImagesList = [];
    $scope.createImage = {};
    

//    $('.datepicker').pickadate({
//      selectMonths: true, // Creates a dropdown to control month
//      selectYears: 15 // Creates a dropdown of 15 years to control year,
//    });

    $scope.project = {};
    $scope.project.endCurrent = true;

    loadImageList();
  }

  init();


  $scope.addImage = function () {
    if (!$scope.project.images) {
      $scope.project.images = [];
    }
    $scope.project.images.push(angular.copy($scope.createImage));
    $scope.createImage = {};
  };

  $scope.resetProject = function () {
    if (confirm("Are you sure?")) {
      $scope.project = {
        title: undefined,
        status: undefined,
        startDate: undefined,
        endDate: undefined,
        endCurrent: true,
        linkText: undefined,
        linkLocation: undefined,
        linkImage: {},
        linkImageId: undefined,
        image: [],
        tags: [],
        description: undefined
      };
    }
  }

  $scope.createProject = function () {

    var sendData = angular.copy($scope.project);
    
    sendData.tags = TagsAPI.parseForSending(sendData.tags);
    if (sendData.endCurrent) {
      sendData.endDate = null;
      delete sendData.endCurrent;
    }
    if (sendData.linkImageId) {
      sendData.linkImage.id = sendData.linkImageId;
      delete sendData.linkImageId;
    }

    ProjectsAPI.create(sendData)
      .then(function (response) {
        var created = response.data.data;
        $scope.$emit('projects.reload');
        $state.go('Projects.Details', {id: created.id});
      }).catch(function (error) {
        console.error(error);
      });

  };


}]);
projModule.controller('ProjectDetailsController', ['$scope', '$stateParams', 'ProjectsAPI', function ($scope, $stateParams, ProjectsAPI) {

  $scope.project = {};
  $scope.updating = false;

  var init = function () {
    $scope.updating = true;
    ProjectsAPI.getById($stateParams.id)
      .then(function (response) {
        $scope.project = angular.copy(response.data.data);
        $scope.project = ProjectsAPI.parseProjectDates($scope.project);
        $scope.showProjectOnLive = !$scope.project.hidden;
      }).catch(function (error) {
        console.error(error);
      }).finally(function () {
        $scope.updating = false;
      });


  }

  init();

  var updateVisiblity = function (visible) {
    $scope.updating = true;
    ProjectsAPI.toggleVisibility($scope.project.id, visible)
      .then(function (response) {
        $scope.project = angular.copy(response.data.data);
        $scope.project = ProjectsAPI.parseProjectDates($scope.project);
        $scope.showProjectOnLive = !$scope.project.hidden;
      }).catch(function (error) {
        console.error(error);
      }).finally(function () {
        $scope.updating = false;
      });
  };

  $scope.$watch('showProjectOnLive', function (newVal, oldVal) {
    if (newVal !== oldVal && oldVal !== undefined) {
      updateVisiblity(newVal);
    }
  });

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
projModule.factory('TagsAPI', ['$http', 'config', function ($http, config) {

  var factory = {};

  var baseUrl = config.url + '/projects/tags';
  
  factory.parseForSending = function(materializeTags) {
    var parsed = [];
    materializeTags.forEach(function(tag){
      var temp = {};
      if (tag.hasOwnProperty('id')){
        temp.id = tag.id;
      }
      temp.name = tag.tag;
      parsed.push(temp);
    });
    return parsed;
  };

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
projModule.controller('TagsController', ['$scope', function($scope){
  
  
  
  
}]);
workModule.controller('ContactsController', ['$scope', function($scope){
  
  
  
}]);
projModule.controller('ProjectDetailsEditController', ['$scope', '$stateParams', 'ProjectsAPI', function ($scope, $stateParams, ProjectsAPI) {

  $scope.project = {};
  $scope.original = {};

  var init = function () {
    
    ProjectsAPI.getById($stateParams.id)
      .then(function (response) {
        $scope.project = response.data.data;
        $scope.original = angular.copy($scope.project);
        console.log($scope.original);
      }).catch(function (error) {
        console.error(error);
      });
    
    
  }
  
  init();


}]);
projModule.controller('CreateImagesController', ['$scope', function($scope){
  
  
  
}]);
projModule.controller('ImageDetailsController', ['$scope', function($scope){
  
  
  
}]);
projModule.controller('CreateTagsController', ['$scope', function($scope){
  
  
  
  
}]);
projModule.controller('TagDetailsController', ['$scope', function($scope){
  
  
  
  
}]);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1vZHVsZXMvQXV0aC9hdXRoLm1vZHVsZS5qcyIsIm1vZHVsZXMvSW5mb3JtYXRpb24vaW5mby5tb2R1bGUuanMiLCJtb2R1bGVzL1Byb2plY3RzL3Byb2plY3RzLm1vZHVsZS5qcyIsIm1vZHVsZXMvV29ya0V4cGVyaWVuY2Uvd29yay5tb2R1bGUuanMiLCJjb21wb25lbnRzL0FwcC5TdWJOYXYvYXBwLnN1Yi5uYXYuanMiLCJjb21wb25lbnRzL0NoaXBzL2NoaXAtZmllbGQuanMiLCJjb21wb25lbnRzL0ltZ1BsYWNlaG9sZGVyL2ltZ1BsYWNlaG9sZGVyLmpzIiwiY29tcG9uZW50cy9JbWdQcmV2aWV3L2ltZ1ByZXZpZXcuanMiLCJjb21wb25lbnRzL05ld0ltYWdlL25ld0ltYWdlLmpzIiwibW9kdWxlcy9BcHAuTmF2L2FwcC5uYXYuanMiLCJtb2R1bGVzL0F1dGgvYXV0aC5hcGkuanMiLCJtb2R1bGVzL0F1dGgvYXV0aC5sb2dpbi5jb250cm9sbGVyLmpzIiwibW9kdWxlcy9BdXRoL2F1dGgubG9nb3V0LmNvbnRyb2xsZXIuanMiLCJtb2R1bGVzL0F1dGgvYXV0aC5zZXJ2aWNlLmpzIiwibW9kdWxlcy9JbmZvcm1hdGlvbi9pbmZvLmNvbnRyb2xsZXIuanMiLCJtb2R1bGVzL1Byb2plY3RzL3Byb2plY3RzLmFwaS5qcyIsIm1vZHVsZXMvUHJvamVjdHMvcHJvamVjdHMuY29udHJvbGxlci5qcyIsIm1vZHVsZXMvV29ya0V4cGVyaWVuY2Uvd29yay5jb250cm9sbGVyLmpzIiwibW9kdWxlcy9JbmZvcm1hdGlvbi9Ta2lsbHMvc2tpbGxzLmNvbnRyb2xsZXIuanMiLCJtb2R1bGVzL0luZm9ybWF0aW9uL0ludGVyZXN0cy9pbnRlcmVzdHMuY29udHJvbGxlci5qcyIsIm1vZHVsZXMvUHJvamVjdHMvQ3JlYXRlL3Byb2plY3RzLmNyZWF0ZS5qcyIsIm1vZHVsZXMvUHJvamVjdHMvRGV0YWlscy9wcm9qZWN0cy5kZXRhaWxzLmpzIiwibW9kdWxlcy9Qcm9qZWN0cy9JbWFnZXMvaW1hZ2VzLmFwaS5qcyIsIm1vZHVsZXMvUHJvamVjdHMvSW1hZ2VzL2ltYWdlcy5jb250cm9sbGVyLmpzIiwibW9kdWxlcy9Qcm9qZWN0cy9UYWdzL3RhZ3MuYXBpLmpzIiwibW9kdWxlcy9Qcm9qZWN0cy9UYWdzL3RhZ3MuY29udHJvbGxlci5qcyIsIm1vZHVsZXMvV29ya0V4cGVyaWVuY2UvQ29udGFjdHMvY29udGFjdHMuY29udHJvbGxlci5qcyIsIm1vZHVsZXMvUHJvamVjdHMvRGV0YWlscy9FZGl0L3Byb2plY3RzLmRldGFpbHMuZWRpdC5qcyIsIm1vZHVsZXMvUHJvamVjdHMvSW1hZ2VzL0NyZWF0ZS9pbWFnZXMuY3JlYXRlLmpzIiwibW9kdWxlcy9Qcm9qZWN0cy9JbWFnZXMvRGV0YWlscy9pbWFnZXMuZGV0YWlscy5qcyIsIm1vZHVsZXMvUHJvamVjdHMvVGFncy9DcmVhdGUvdGFncy5jcmVhdGUuanMiLCJtb2R1bGVzL1Byb2plY3RzL1RhZ3MvRGV0YWlscy90YWdzLmRldGFpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhZG1pbicsIFsndWkucm91dGVyJywgJ2FuZ3VsYXItbG9hZGluZy1iYXInLCAnYWRtaW4udGVtcGxhdGVzJywgJ2FkbWluLmluZm8nLCAnYWRtaW4ud29yaycsICdhZG1pbi5wcm9qZWN0cycsICdhZG1pbi5hdXRoJywgJ2Zyb2FsYSddKTtcblxuYXBwLmNvbnN0YW50KCdjb25maWcnLCB7XG4gIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODg4OC9hcGkvdjEnLFxuICBkYXRlRm9ybWF0OiAnbW0vZGQveXl5eScsXG4gIGRhdGVUaW1lRm9ybWF0OiAnbW0vZGQveXl5eSBoaDptbTpzcydcbn0pO1xuXG5hcHAudmFsdWUoJ2Zyb2FsYUNvbmZpZycsIHtcbiAgaGVpZ2h0TWluOiAyMDBcbn0pO1xuXG5hcHAucnVuKFsnJHJvb3RTY29wZScsICckc3RhdGUnLCAnJHRpbWVvdXQnLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHN0YXRlLCAkdGltZW91dCkge1xuXG4gICRyb290U2NvcGUuJHN0YXRlID0gJHN0YXRlO1xuICAkcm9vdFNjb3BlLmxvYWRpbmcgPSBmYWxzZTtcbiAgJHJvb3RTY29wZS5tb2RhbERhdGEgPSB7fTtcblxuICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbiAoZXZ0LCB0bywgcGFyYW1zKSB7XG4gICAgaWYgKHRvLnJlZGlyZWN0VG8pIHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgJHN0YXRlLmdvKHRvLnJlZGlyZWN0VG8sIHBhcmFtcywge1xuICAgICAgICBsb2NhdGlvbjogJ3JlcGxhY2UnXG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuICBcbn1dKTtcblxuXG4vKiAtLS0gUm91dGluZyAtLS0gKi9cblxuYXBwLmNvbmZpZyhbJyR1cmxSb3V0ZXJQcm92aWRlcicsICckbG9jYXRpb25Qcm92aWRlcicsICckc3RhdGVQcm92aWRlcicsICdjZnBMb2FkaW5nQmFyUHJvdmlkZXInLCBmdW5jdGlvbiAoJHVybFJvdXRlclByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlciwgJHN0YXRlUHJvdmlkZXIsIGNmcExvYWRpbmdCYXJQcm92aWRlcikge1xuXG4gICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh7XG4gICAgZW5hYmxlZDogdHJ1ZSxcbiAgICByZXF1aXJlQmFzZTogdHJ1ZVxuICB9KTtcblxuICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKFwiL1wiKTtcbiAgXG4gIGNmcExvYWRpbmdCYXJQcm92aWRlci5zcGlubmVyVGVtcGxhdGUgPSAnPGRpdiBjbGFzcz1cInByZWxvYWRlci13cmFwcGVyIGJpZyBhY3RpdmVcIj48ZGl2IGNsYXNzPVwic3Bpbm5lci1sYXllciBzcGlubmVyLWJsdWUtb25seVwiPjxkaXYgY2xhc3M9XCJjaXJjbGUtY2xpcHBlciBsZWZ0XCI+PGRpdiBjbGFzcz1cImNpcmNsZVwiPjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCJnYXAtcGF0Y2hcIj48ZGl2IGNsYXNzPVwiY2lyY2xlXCI+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cImNpcmNsZS1jbGlwcGVyIHJpZ2h0XCI+PGRpdiBjbGFzcz1cImNpcmNsZVwiPjwvZGl2PjwvZGl2PjwvZGl2PjwvZGl2Pic7XG5cbiAgJHN0YXRlUHJvdmlkZXJcbiAgICAuc3RhdGUoJy8nLCB7XG4gICAgICByZWRpcmVjdFRvOiAnSW5mb3JtYXRpb24nLFxuICAgICAgZXhjbHVkZUZyb21TaWRlbmF2OiB0cnVlLFxuICAgICAgZGF0YToge1xuICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG5cbn1dKTsiLCJ2YXIgYXV0aE1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhZG1pbi5hdXRoJywgWyd1aS5yb3V0ZXInLCAnYW5ndWxhci1qd3QnXSk7XG5cbmF1dGhNb2R1bGUuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCAnand0T3B0aW9uc1Byb3ZpZGVyJywgJyRodHRwUHJvdmlkZXInLCBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsIGp3dE9wdGlvbnNQcm92aWRlciwgJGh0dHBQcm92aWRlcikge1xuXG4gICRzdGF0ZVByb3ZpZGVyXG4gICAgLnN0YXRlKCdMb2dpbicsIHtcbiAgICAgIHVybDogJy9sb2dpbicsXG4gICAgICB0ZW1wbGF0ZVVybDogJy4vc3JjL21vZHVsZXMvQXV0aC9hdXRoLmxvZ2luLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ0xvZ2luQ29udHJvbGxlcicsXG4gICAgICBleGNsdWRlRnJvbVNpZGVuYXY6IHRydWUsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIHJlcXVpcmVzTG9naW46IGZhbHNlXG4gICAgICB9XG4gICAgfSlcbiAgICAuc3RhdGUoJ0xvZ291dCcsIHtcbiAgICAgIHVybDogJy9sb2dvdXQnLFxuICAgICAgdGVtcGxhdGVVcmw6ICcuL3NyYy9tb2R1bGVzL0F1dGgvYXV0aC5sb2dvdXQuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnTG9nb3V0Q29udHJvbGxlcicsXG4gICAgICBleGNsdWRlRnJvbVNpZGVuYXY6IHRydWUsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIFxuICAgICAgfVxuICAgIH0pO1xuICBcbiAgand0T3B0aW9uc1Byb3ZpZGVyLmNvbmZpZyh7XG4gICAgdG9rZW5HZXR0ZXI6IFsnb3B0aW9ucycsICckYXV0aCcsIGZ1bmN0aW9uIChvcHRpb25zLCAkYXV0aCkge1xuICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy51cmwuc3Vic3RyKG9wdGlvbnMudXJsLmxlbmd0aCAtIDUpID09ICcuaHRtbCcpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gJGF1dGguZ2V0UmF3VG9rZW4oKTtcbiAgICAgIH1dLFxuICAgIHdoaXRlTGlzdGVkRG9tYWluczogWydsb2NhbGhvc3QnLCAnYnJhbmRvbmdyb2ZmLmNvbScsICdkZXYuYnJhbmRvbmdyb2ZmLmNvbScsICdhcGkuYnJhbmRvbmdyb2ZmLmNvbSddLFxuICAgIC8vICAgIHVuYXV0aGVudGljYXRlZFJlZGlyZWN0UGF0aDogJy9lcnJvcj9jb2RlPTQwMycsXG4gICAgdW5hdXRoZW50aWNhdGVkUmVkaXJlY3RvcjogWyckc3RhdGUnLCAnJGF1dGgnLCBmdW5jdGlvbiAoJHN0YXRlLCAkYXV0aCkge1xuICAgICAgJGF1dGgubG9nb3V0KCk7XG4gICAgICAkc3RhdGUuZ28oXCJMb2dpblwiKTtcbiAgICAgIH1dXG4gIH0pO1xuICBcbiAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaCgnand0SW50ZXJjZXB0b3InKTtcblxufV0pO1xuXG5hdXRoTW9kdWxlLnJ1bihbJ2F1dGhNYW5hZ2VyJywgJyRyb290U2NvcGUnLCAnJHN0YXRlJywgJyRhdXRoJywgJ0F1dGhBUEknLCBmdW5jdGlvbiAoYXV0aE1hbmFnZXIsICRyb290U2NvcGUsICRzdGF0ZSwgJGF1dGgsIEF1dGhBUEkpIHtcbiAgXG4gIGF1dGhNYW5hZ2VyLmNoZWNrQXV0aE9uUmVmcmVzaCgpO1xuXG4gIGF1dGhNYW5hZ2VyLnJlZGlyZWN0V2hlblVuYXV0aGVudGljYXRlZCgpO1xuXG4gICRyb290U2NvcGUuJG9uKCd0b2tlbkhhc0V4cGlyZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgJGF1dGguY2xlYXJMb2NhbFRva2VuKCk7XG4gICAgJHN0YXRlLmdvKCdMb2dpbicpO1xuICB9KTtcblxuICBcbiAgLy92YWxpZGF0ZSB0aGUgY3VycmVudCB0b2tlbiBvbiBpbml0aWFsIHBhZ2UgbG9hZFxuICBBdXRoQVBJLnZhbGlkYXRlVG9rZW4oKTtcbiAgXG59XSk7XG4iLCJ2YXIgaW5mb01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhZG1pbi5pbmZvJywgWyd1aS5yb3V0ZXInXSk7XG5cbmluZm9Nb2R1bGUuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAkc3RhdGVQcm92aWRlclxuICAgIC5zdGF0ZSgnSW5mb3JtYXRpb24nLCB7XG4gICAgICB1cmw6ICcvaW5mb3JtYXRpb24nLFxuICAgICAgdGVtcGxhdGVVcmw6ICcuL3NyYy9tb2R1bGVzL0luZm9ybWF0aW9uL2luZm8uaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnSW5mb3JtYXRpb25Db250cm9sbGVyJyxcbiAgICAgIHJlZGlyZWN0VG86ICdJbnRlcmVzdHMnLFxuICAgICAgZGF0YToge1xuICAgICAgICBvcmRlcjogMCxcbiAgICAgICAgdGFnczogW1xuICAgICAgICBcImluZm9cIixcbiAgICAgICAgXCJpbmZvcm1hdGlvblwiXG4gICAgICBdLFxuICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICB9XG4gICAgfSlcbiAgICAuc3RhdGUoJ0ludGVyZXN0cycsIHtcbiAgICAgIHVybDogJy9pbnRlcmVzdHMnLFxuICAgICAgdGVtcGxhdGVVcmw6ICcuL3NyYy9tb2R1bGVzL0luZm9ybWF0aW9uL0ludGVyZXN0cy9pbnRlcmVzdHMuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnSW50ZXJlc3RzQ29udHJvbGxlcicsXG4gICAgICBzdWJ2aWV3T2Y6ICdJbmZvcm1hdGlvbicsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIG9yZGVyOiAwXG4gICAgICB9XG4gICAgfSlcbiAgICAuc3RhdGUoJ1NraWxscycsIHtcbiAgICAgIHVybDogJy9za2lsbHMnLFxuICAgICAgdGVtcGxhdGVVcmw6ICcuL3NyYy9tb2R1bGVzL0luZm9ybWF0aW9uL1NraWxscy9za2lsbHMuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnU2tpbGxzQ29udHJvbGxlcicsXG4gICAgICBzdWJ2aWV3T2Y6ICdJbmZvcm1hdGlvbicsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIG9yZGVyOiAxXG4gICAgICB9XG4gICAgfSk7XG5cbn1dKTsiLCJ2YXIgcHJvak1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdhZG1pbi5wcm9qZWN0cycsIFsndWkucm91dGVyJywgJ3VpLnNvcnRhYmxlJ10pO1xuXG5wcm9qTW9kdWxlLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgJHN0YXRlUHJvdmlkZXJcbiAgICAuc3RhdGUoJ1Byb2plY3RzJywge1xuICAgICAgdXJsOiAnL3Byb2plY3RzJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnLi9zcmMvbW9kdWxlcy9Qcm9qZWN0cy9wcm9qZWN0cy5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdQcm9qZWN0c0NvbnRyb2xsZXInLFxuICAgICAgZGF0YToge1xuICAgICAgICBvcmRlcjogMixcbiAgICAgICAgdGFnczogW1xuICAgICAgICBcInByb2plY3RzXCJcbiAgICAgIF0sXG4gICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnUHJvamVjdHMuQ3JlYXRlJywge1xuICAgICAgdXJsOiAnL2NyZWF0ZScsXG4gICAgICB0ZW1wbGF0ZVVybDogJy4vc3JjL21vZHVsZXMvUHJvamVjdHMvQ3JlYXRlL3Byb2plY3RzLmNyZWF0ZS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdDcmVhdGVQcm9qZWN0c0NvbnRyb2xsZXInLFxuICAgICAgcGFyZW50OiAnUHJvamVjdHMnLFxuICAgICAgZXhjbHVkZUZyb21TaWRlbmF2OiB0cnVlLFxuICAgICAgZGF0YToge1xuXG4gICAgICB9XG4gICAgfSlcbiAgICAuc3RhdGUoJ1Byb2plY3RzLkRldGFpbHMnLCB7XG4gICAgICB1cmw6ICcvOmlkJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnLi9zcmMvbW9kdWxlcy9Qcm9qZWN0cy9EZXRhaWxzL3Byb2plY3RzLmRldGFpbHMuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnUHJvamVjdERldGFpbHNDb250cm9sbGVyJyxcbiAgICAgIHBhcmVudDogJ1Byb2plY3RzJyxcbiAgICAgIGV4Y2x1ZGVGcm9tU2lkZW5hdjogdHJ1ZSxcbiAgICAgIGRhdGE6IHtcblxuICAgICAgfVxuICAgIH0pXG4gICAgLnN0YXRlKCdQcm9qZWN0cy5EZXRhaWxzLkVkaXQnLCB7XG4gICAgICB1cmw6ICcvZWRpdCcsXG4gICAgICB0ZW1wbGF0ZVVybDogJy4vc3JjL21vZHVsZXMvUHJvamVjdHMvRGV0YWlscy9FZGl0L3Byb2plY3RzLmRldGFpbHMuZWRpdC5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdQcm9qZWN0RGV0YWlsc0VkaXRDb250cm9sbGVyJyxcbiAgICAgIHBhcmVudDogJ1Byb2plY3RzLkRldGFpbHMnLFxuICAgICAgZXhjbHVkZUZyb21TaWRlbmF2OiB0cnVlLFxuICAgICAgZGF0YToge1xuICAgICAgICBcbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnVGFncycsIHtcbiAgICAgIHVybDogJy90YWdzJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnLi9zcmMvbW9kdWxlcy9Qcm9qZWN0cy9UYWdzL3RhZ3MuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnVGFnc0NvbnRyb2xsZXInLFxuICAgICAgc3Vidmlld09mOiAnUHJvamVjdHMnLFxuICAgICAgZXhjbHVkZUZyb21TaWRlbmF2OiBmYWxzZSxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgb3JkZXI6IDAsXG4gICAgICAgIHRhZ3M6IFtcbiAgICAgICAgXCJwcm9qZWN0c1wiXG4gICAgICAgIF0sXG4gICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnVGFncy5DcmVhdGUnLCB7XG4gICAgICB1cmw6ICcvY3JlYXRlJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnLi9zcmMvbW9kdWxlcy9Qcm9qZWN0cy9UYWdzL0NyZWF0ZS90YWdzLmNyZWF0ZS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdDcmVhdGVUYWdzQ29udHJvbGxlcicsXG4gICAgICBwYXJlbnQ6ICdUYWdzJyxcbiAgICAgIGV4Y2x1ZGVGcm9tU2lkZW5hdjogdHJ1ZSxcbiAgICAgIGRhdGE6IHtcblxuICAgICAgfVxuICAgIH0pXG4gICAgLnN0YXRlKCdUYWdzLkRldGFpbHMnLCB7XG4gICAgICB1cmw6ICcvOmlkJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnLi9zcmMvbW9kdWxlcy9Qcm9qZWN0cy9UYWdzL0RldGFpbHMvdGFncy5kZXRhaWxzLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ1RhZ0RldGFpbHNDb250cm9sbGVyJyxcbiAgICAgIHBhcmVudDogJ1RhZ3MnLFxuICAgICAgZXhjbHVkZUZyb21TaWRlbmF2OiB0cnVlLFxuICAgICAgZGF0YToge1xuXG4gICAgICB9XG4gICAgfSlcbiAgICAuc3RhdGUoJ0ltYWdlcycsIHtcbiAgICAgIHVybDogJy9pbWFnZXMnLFxuICAgICAgdGVtcGxhdGVVcmw6ICcuL3NyYy9tb2R1bGVzL1Byb2plY3RzL0ltYWdlcy9pbWFnZXMuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnSW1hZ2VzQ29udHJvbGxlcicsXG4gICAgICBzdWJ2aWV3T2Y6ICdQcm9qZWN0cycsXG4gICAgICBleGNsdWRlRnJvbVNpZGVuYXY6IGZhbHNlLFxuICAgICAgZGF0YToge1xuICAgICAgICBvcmRlcjogMSxcbiAgICAgICAgdGFnczogW1xuICAgICAgICBcInByb2plY3RzXCJcbiAgICAgIF0sXG4gICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnSW1nYWVzLkNyZWF0ZScsIHtcbiAgICAgIHVybDogJy9jcmVhdGUnLFxuICAgICAgdGVtcGxhdGVVcmw6ICcuL3NyYy9tb2R1bGVzL1Byb2plY3RzL0ltYWdlcy9DcmVhdGUvaW1hZ2VzLmNyZWF0ZS5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdJbWFnZVRhZ3NDb250cm9sbGVyJyxcbiAgICAgIHBhcmVudDogJ0ltYWdlcycsXG4gICAgICBleGNsdWRlRnJvbVNpZGVuYXY6IHRydWUsXG4gICAgICBkYXRhOiB7XG5cbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnSW1hZ2VzLkRldGFpbHMnLCB7XG4gICAgICB1cmw6ICcvOmlkJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnLi9zcmMvbW9kdWxlcy9Qcm9qZWN0cy9JbWFnZXMvRGV0YWlscy9pbWFnZXMuZGV0YWlscy5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdJbWFnZURldGFpbHNDb250cm9sbGVyJyxcbiAgICAgIHBhcmVudDogJ0ltYWdlcycsXG4gICAgICBleGNsdWRlRnJvbVNpZGVuYXY6IHRydWUsXG4gICAgICBkYXRhOiB7XG5cbiAgICAgIH1cbiAgICB9KTtcblxufV0pOyIsInZhciB3b3JrTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FkbWluLndvcmsnLCBbJ3VpLnJvdXRlciddKTtcblxud29ya01vZHVsZS5jb25maWcoWyckc3RhdGVQcm92aWRlcicsIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICRzdGF0ZVByb3ZpZGVyXG4gICAgLnN0YXRlKCdXb3JrIEV4cGVyaWVuY2UnLCB7XG4gICAgICB1cmw6ICcvd29yay1leHBlcmllbmNlJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnLi9zcmMvbW9kdWxlcy9Xb3JrRXhwZXJpZW5jZS93b3JrLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ1dvcmtFeHBlcmllbmNlQ29udHJvbGxlcicsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIG9yZGVyOiAxLFxuICAgICAgICB0YWdzOiBbXG4gICAgICAgIFwid29ya1wiXG4gICAgICBdLFxuICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICB9XG4gICAgfSlcbiAgICAuc3RhdGUoJ0NvbnRhY3RzJywge1xuICAgICAgdXJsOiAnL2NvbnRhY3RzJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnLi9zcmMvbW9kdWxlcy9Xb3JrRXhwZXJpZW5jZS9Db250YWN0cy9jb250YWN0cy5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdXb3JrRXhwZXJpZW5jZUNvbnRyb2xsZXInLFxuICAgICAgc3Vidmlld09mOiAnV29yayBFeHBlcmllbmNlJyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgb3JkZXI6IDAsXG4gICAgICAgIHRhZ3M6IFtcbiAgICAgICAgXCJjb250YWN0c1wiXG4gICAgICBdLFxuICAgICAgICByZXF1aXJlc0xvZ2luOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG5cbn1dKTsiLCJhcHAuZGlyZWN0aXZlKCdhcHBTdWJOYXYnLCBbJyRzdGF0ZScsIGZ1bmN0aW9uKCRzdGF0ZSl7XG4gIFxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgc2NvcGU6IHtcbiAgICAgIGhlYWRlcjogJ0AnLFxuICAgICAgaXRlbVR5cGU6ICdAJywgLy9pZTogcHJvamVjdCwgY29udGFjdFxuICAgICAgcm91dGVJdGVtczogJz0nLFxuICAgICAgcm91dGVWYXJpYWJsZTogJ0AnLFxuICAgICAgY3JlYXRlTmV3OiAnQCcsXG4gICAgICBkaXNwbGF5UHJvcDogJ0AnXG4gICAgfSxcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9zcmMvY29tcG9uZW50cy9BcHAuU3ViTmF2L2FwcC5zdWIubmF2Lmh0bWwnLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICAgICAgXG4gICAgICBzY29wZS5jcmVhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgXG4gICAgICAgICRzdGF0ZS5nbyhzY29wZS5jcmVhdGVOZXcpO1xuICAgICAgfVxuICAgICAgXG4gICAgfVxuICB9XG4gIFxufV0pOyIsImFwcC5kaXJlY3RpdmUoJ2NoaXBGaWVsZCcsIGZ1bmN0aW9uIChUYWdzQVBJKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcbiAgICByZXBsYWNlOiBmYWxzZSxcbiAgICBzY29wZToge1xuICAgICAgcHJlc2V0OiAnPScsXG4gICAgICBuZ01vZGVsOiAnPSdcbiAgICB9LFxuICAgIHRlbXBsYXRlVXJsOiAnLi9zcmMvY29tcG9uZW50cy9DaGlwcy9jaGlwLWZpZWxkLmh0bWwnLFxuICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcblxuICAgICAgdmFyIHRoaXNGaWVsZCA9ICQoJy5jaGlwLWZpZWxkJyk7XG5cbiAgICAgIHZhciBvcHRpb25zID0gW107XG4gICAgICB2YXIgcHJlc2V0cyA9IFtdO1xuXG4gICAgICB2YXIgZ2V0QWxsT3B0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgVGFnc0FQSS5nZXRBbGwoKVxuICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb3NuZSkge1xuICAgICAgICAgICAgb3B0aW9ucyA9IHJlc3Bvc25lLmRhdGEuZGF0YTtcbiAgICAgICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgdmFyIHBhcnNlT3B0aW9uc1RvQXV0b2NvbXBsZXRlID0gZnVuY3Rpb24gKHRvUGFyc2UpIHtcbiAgICAgICAgdmFyIGF1dG9jb21wbGV0ZSA9IHt9O1xuICAgICAgICB0b1BhcnNlLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICB2YXIga2V5ID0gaXRlbS5uYW1lO1xuICAgICAgICAgIGF1dG9jb21wbGV0ZVtrZXldID0gbnVsbDtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBhdXRvY29tcGxldGU7XG4gICAgICB9XG5cblxuICAgICAgdmFyIHBhcnNlUHJlc2V0c1RvQ2hpcHMgPSBmdW5jdGlvbiAodG9QYXJzZSkge1xuICAgICAgICBpZiAoIXRvUGFyc2UgfHwgIUFycmF5LmlzQXJyYXkodG9QYXJzZSkgfHwgdG9QYXJzZS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBjaGlwTGlzdCA9IFtdXG4gICAgICAgIHRvUGFyc2UuZm9yRWFjaChmdW5jdGlvbiAodGFnKSB7XG4gICAgICAgICAgdmFyIGNoaXAgPSB7XG4gICAgICAgICAgICB0YWc6IHRhZy5uYW1lLFxuICAgICAgICAgICAgaWQ6IHRhZy5pZFxuICAgICAgICAgIH07XG4gICAgICAgICAgY2hpcExpc3QucHVzaChjaGlwKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBjaGlwTGlzdDtcbiAgICAgIH07XG5cblxuICAgICAgdmFyIGluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXNGaWVsZC5tYXRlcmlhbF9jaGlwKHtcbiAgICAgICAgICBhdXRvY29tcGxldGVEYXRhOiBwYXJzZU9wdGlvbnNUb0F1dG9jb21wbGV0ZShvcHRpb25zKSxcbiAgICAgICAgICBsaW1pdDogMTAsXG4gICAgICAgICAgZGF0YTogcGFyc2VQcmVzZXRzVG9DaGlwcyhzY29wZS5wcmVzZXQpLFxuICAgICAgICAgIHBsYWNlaG9sZGVyOiAnK1RhZycsXG4gICAgICAgICAgc2Vjb25kYXJ5UGxhY2Vob2xkZXI6ICdFbnRlciBhIFRhZydcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGluaXQoKTtcblxuXG4gICAgICBzY29wZS4kd2F0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpc0ZpZWxkLm1hdGVyaWFsX2NoaXAoJ2RhdGEnKTtcbiAgICAgIH0sIGZ1bmN0aW9uIChuZXdWYWwpIHtcbiAgICAgICAgc2NvcGUubmdNb2RlbCA9IG5ld1ZhbDtcbiAgICAgIH0sIHRydWUpO1xuXG4gICAgICBzY29wZS4kd2F0Y2goJ25nTW9kZWwnLCBmdW5jdGlvbiAobmV3VmFsdWUsIG9sZFZhbHVlKSB7XG4gICAgICAgIGlmIChuZXdWYWx1ZSAhPSBvbGRWYWx1ZSkge1xuICAgICAgICAgIGlmICghbmV3VmFsdWUgfHwgbmV3VmFsdWUubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHRoaXNGaWVsZC5lbXB0eSgpO1xuICAgICAgICAgICAgaW5pdCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICB9XG4gIH1cbn0pOyIsImFwcC5kaXJlY3RpdmUoJ2ltZ1BsYWNlaG9sZGVyJywgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHNjb3BlOiB7XG4gICAgICBhZGRDbGFzc2VzOiAnPSdcbiAgICB9LFxuICAgIHRlbXBsYXRlVXJsOiAnLi9zcmMvY29tcG9uZW50cy9JbWdQbGFjZWhvbGRlci9pbWdQbGFjZWhvbGRlci5odG1sJyxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgIFxuICAgIH1cbiAgfVxufSk7IiwiYXBwLmRpcmVjdGl2ZSgnaW1nUHJldmlldycsIGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICBzY29wZToge1xuICAgICAgaW1nOiAnPScsXG4gICAgICBhZGRDbGFzc2VzOiAnQCcsXG4gICAgICBpbmRleDogJz0nXG4gICAgfSxcbiAgICB0ZW1wbGF0ZVVybDogJy4vc3JjL2NvbXBvbmVudHMvSW1nUHJldmlldy9pbWdQcmV2aWV3Lmh0bWwnLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgXG4gICAgfVxuICB9XG59KTsiLCJhcHAuZGlyZWN0aXZlKCduZXdJbWFnZScsIGZ1bmN0aW9uKCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgcmVwbGFjZTogdHJ1ZSxcbiAgICBzY29wZToge1xuICAgICAgbmdNb2RlbDogJz0nLFxuICAgICAgZGlzYWJsZWQ6ICc9J1xuICAgIH0sXG4gICAgdGVtcGxhdGVVcmw6ICcuL3NyYy9jb21wb25lbnRzL05ld0ltYWdlL25ld0ltYWdlLmh0bWwnLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgXG4gICAgfVxuICB9XG59KTsiLCJhcHAuZGlyZWN0aXZlKCdhcHBOYXYnLCBmdW5jdGlvbiAoJHN0YXRlLCAkYXV0aCwgJHRpbWVvdXQpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIHNjb3BlOiB7fSxcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHRlbXBsYXRlVXJsOiAnLi9zcmMvbW9kdWxlcy9BcHAuTmF2L2FwcC5uYXYuaHRtbCcsXG4gICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuXG4gICAgICBzY29wZS4kYXV0aCA9ICRhdXRoO1xuXG4gICAgICAkKCcuYnV0dG9uLWNvbGxhcHNlJykuc2lkZU5hdih7XG4gICAgICAgIG1lbnVXaWR0aDogMzAwLCAvLyBEZWZhdWx0IGlzIDMwMFxuICAgICAgICBlZGdlOiAnbGVmdCcsIC8vIENob29zZSB0aGUgaG9yaXpvbnRhbCBvcmlnaW5cbiAgICAgICAgY2xvc2VPbkNsaWNrOiBmYWxzZSwgLy8gQ2xvc2VzIHNpZGUtbmF2IG9uIDxhPiBjbGlja3MsIHVzZWZ1bCBmb3IgQW5ndWxhci9NZXRlb3JcbiAgICAgICAgZHJhZ2dhYmxlOiB0cnVlIC8vIENob29zZSB3aGV0aGVyIHlvdSBjYW4gZHJhZyB0byBvcGVuIG9uIHRvdWNoIHNjcmVlbnNcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgY29tcGFyZUZ1bmMgPSBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICBpZiAoIWEuZGF0YSB8fCAhYi5kYXRhKSB7XG4gICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYS5kYXRhLm9yZGVyIDwgYi5kYXRhLm9yZGVyKSB7XG4gICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9IGVsc2UgaWYgKGEuZGF0YS5vcmRlciA+IGIuZGF0YS5vcmRlcikge1xuICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICB2YXIgb2JqZWN0V2l0aE5hbWUgPSBmdW5jdGlvbiAobGlzdCwgbmFtZSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgdGhpc09iaiA9IGxpc3RbaV07XG4gICAgICAgICAgaWYgKHRoaXNPYmoubmFtZSA9PSBuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpc09iajtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIHZhciBnZXRQYXJzZWRTdGF0ZUxpc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBsaXN0ID0gYW5ndWxhci5jb3B5KCRzdGF0ZS5nZXQoKSk7XG5cbiAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICB3aGlsZSAoaSA8IGxpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuXG4gICAgICAgICAgaWYgKGl0ZW0uYWJzdHJhY3QgfHwgaXRlbS5leGNsdWRlRnJvbVNpZGVuYXYpIHtcbiAgICAgICAgICAgIGxpc3Quc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGl0ZW0uc3Vidmlld09mKSB7XG5cbiAgICAgICAgICAgIHZhciBwYXJlbnQgPSBvYmplY3RXaXRoTmFtZShsaXN0LCBpdGVtLnN1YnZpZXdPZik7XG4gICAgICAgICAgICBpZiAoIXBhcmVudC5zdWJ2aWV3cykge1xuICAgICAgICAgICAgICBwYXJlbnQuc3Vidmlld3MgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhcmVudC5zdWJ2aWV3cy5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgbGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cblxuICAgICAgICBsaXN0LnNvcnQoY29tcGFyZUZ1bmMpO1xuXG4gICAgICAgIHJldHVybiBsaXN0O1xuICAgICAgfTtcblxuXG4gICAgICBzY29wZS5saXN0ID0gZ2V0UGFyc2VkU3RhdGVMaXN0KCk7XG5cblxuICAgICAgc2NvcGUucm9vdE5hdkxpc3QgPSBbXTtcbiAgICAgIHNjb3BlLnN1Yk5hdkxpc3QgPSBbXTtcbiAgICAgIHNjb3BlLmxpc3QuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICBpZiAoaXRlbS5zdWJ2aWV3cykge1xuICAgICAgICAgIGl0ZW0uc3Vidmlld3Muc29ydChjb21wYXJlRnVuYyk7XG4gICAgICAgICAgc2NvcGUuc3ViTmF2TGlzdC5wdXNoKGl0ZW0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNjb3BlLnJvb3ROYXZMaXN0LnB1c2goaXRlbSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG5cbiAgICAgIHNjb3BlLnJvb3ROYXZMaXN0LnNvcnQoY29tcGFyZUZ1bmMpO1xuICAgICAgc2NvcGUuc3ViTmF2TGlzdC5zb3J0KGNvbXBhcmVGdW5jKTtcblxuXG4gICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoJy5jb2xsYXBzaWJsZScpLmNvbGxhcHNpYmxlKHtcbiAgICAgICAgICBhY2NvcmRpb246IHRydWVcbiAgICAgICAgfSk7XG4gICAgICB9LCAyMCk7XG5cbiAgICB9LFxuICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgpIHtcblxuICAgIH1cbiAgfVxufSk7IiwiYXV0aE1vZHVsZS5mYWN0b3J5KCdBdXRoQVBJJywgZnVuY3Rpb24gKCRodHRwLCBjb25maWcsICRhdXRoLCAkcm9vdFNjb3BlKSB7XG5cbiAgdmFyIGZhY3RvcnkgPSB7fTtcblxuICB2YXIgYmFzZVVybCA9IGNvbmZpZy51cmwgKyAnL2F1dGgnO1xuXG5cbiAgZmFjdG9yeS5sb2dpbiA9IGZ1bmN0aW9uIChlbWFpbCwgcGFzc3dvcmQpIHtcblxuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIHVybDogYmFzZVVybCArICcvbG9naW4nLFxuICAgICAgZGF0YToge1xuICAgICAgICBlbWFpbDogZW1haWwsXG4gICAgICAgIHBhc3N3b3JkOiBwYXNzd29yZFxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZmFjdG9yeS52YWxpZGF0ZVRva2VuID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBwcm9tID0gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgJGh0dHAoe1xuICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgdXJsOiBiYXNlVXJsICsgJy90b2tlbi92YWxpZGF0ZSdcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgLy9UT0RPXG4gICAgICAgICAgaWYgKHJlc3BvbnNlLmRhdGEudmFsaWQpIHtcbiAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgndG9rZW5IYXNFeHBpcmVkJyk7XG4gICAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgIGlmIChlcnJvci5zdGF0dXMgPT0gNDAzIHx8IGVycm9yLnN0YXR1cyA9PSA0MDEpIHtcbiAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgndG9rZW5IYXNFeHBpcmVkJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlamVjdChmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb207XG4gIH07XG5cbiAgZmFjdG9yeS5sb2dvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0RFTEVURScsXG4gICAgICB1cmw6IGJhc2VVcmwgKyAnL2xvZ291dCdcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gZmFjdG9yeTtcblxufSk7IiwiYXV0aE1vZHVsZS5jb250cm9sbGVyKCdMb2dpbkNvbnRyb2xsZXInLCBbJyRzY29wZScsICdBdXRoQVBJJywgJyRhdXRoJywgJyRzdGF0ZScsIGZ1bmN0aW9uICgkc2NvcGUsIEF1dGhBUEksICRhdXRoLCAkc3RhdGUpIHtcblxuICAkc2NvcGUuZXJyb3IgPSB1bmRlZmluZWQ7XG4gIFxuICAkc2NvcGUubG9naW4gPSBmdW5jdGlvbiAoKSB7XG5cbiAgICBBdXRoQVBJLmxvZ2luKCRzY29wZS5lbWFpbCwgJHNjb3BlLnBhc3N3b3JkKVxuICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cbiAgICAgICAgaWYgKHJlc3BvbnNlLmRhdGEudG9rZW4pIHtcbiAgICAgICAgICAkYXV0aC5wZXJmb3JtTG9naW4ocmVzcG9uc2UuZGF0YS50b2tlbik7XG4gICAgICAgICAgJHN0YXRlLmdvKCcvJyk7XG4gICAgICAgIH1cbiAgICAgIFxuICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG5cbiAgICAgICAgJHNjb3BlLmVycm9yID0gZXJyb3IuZGF0YS5tc2c7XG4gICAgICBcbiAgICAgIH0pO1xuXG4gIH07XG5cblxuXG59XSk7IiwiYXV0aE1vZHVsZS5jb250cm9sbGVyKCdMb2dvdXRDb250cm9sbGVyJywgWyckc2NvcGUnLCAnQXV0aEFQSScsICckYXV0aCcsICckc3RhdGUnLCBmdW5jdGlvbiAoJHNjb3BlLCBBdXRoQVBJLCAkYXV0aCwgJHN0YXRlKSB7XG5cbiAgQXV0aEFQSS5sb2dvdXQoKVxuICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgaWYgKHJlc3BvbnNlLmRhdGEubG9nb3V0ID09IFwic3VjY2Vzc1wiKXtcbiAgICAgICAgJGF1dGgubG9nb3V0KCk7XG4gICAgICAgICRzdGF0ZS5nbygnTG9naW4nKTsgXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnNvbGUuZXJyb3IocmVzcG9uc2UpO1xuICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgfSk7XG5cbn1dKTsiLCJhdXRoTW9kdWxlLnNlcnZpY2UoJyRhdXRoJywgZnVuY3Rpb24gKGp3dEhlbHBlciwgJHEsICRyb290U2NvcGUpIHtcblxuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgdmFyIGtleSA9ICdwb3J0Zm9saW8uYWRtaW4udG9rZW4nO1xuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZSB0aGF0IHVzZXIgaXMgYXV0aGVudGljYXRlZFxuICAgKiBAYXV0aG9yIEJyYW5kb24gR3JvZmZcbiAgICogQHJldHVybnMge2Jvb2xlYW59IHRydWUvZmFsc2VcbiAgICovXG4gIHRoaXMuaXNBdXRoZW50aWNhdGVkID0gZnVuY3Rpb24gKCkge1xuICAgIC8vVE9ETzogPz9cbiAgICByZXR1cm4gc2VsZi5nZXRSYXdUb2tlbigpID8gdHJ1ZSA6IGZhbHNlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDYWxsZWQgb24gbG9naW4sIHVzZWQgdG8gc2F2ZSB0aGUgdG9rZW4gaWYgdmFsaWRcbiAgICogQGF1dGhvciBCcmFuZG9uIEdyb2ZmXG4gICAqIEBwYXJhbSAgIHtzdHJpbmd9IHRva2VuIHRoZSByYXcgYXV0aG9yaXphdGlvbiB0b2tlblxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gIHRydWUgb24gc3VjY2VzcywgZmFsc2Ugb24gc3VjY2VzcyBidXQgbm8gU2xhY2sgcmVnaXN0cmF0aW9uLCBvciBhIFJlamVjdGVkIHByb21pc2UgdGhhdCB3aWxsIHRyaWdnZXIgYW4gdW5hdXRob3JpemVkIHJlZGlyZWN0XG4gICAqL1xuICB0aGlzLnBlcmZvcm1Mb2dpbiA9IGZ1bmN0aW9uICh0b2tlbikge1xuICAgIHZhciBkZWNvZGVkID0gand0SGVscGVyLmRlY29kZVRva2VuKHRva2VuKTtcbiAgICBpZiAoZGVjb2RlZCkge1xuICAgICAgc2VsZi5zZXRUb2tlbih0b2tlbik7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICRxLnJlamVjdCgndG9rZW5IYXNFeHBpcmVkJyk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHJhdyB0b2tlbiBzdHJpbmcgZnJvbSBsb2NhbFN0b3JhZ2UsIG9yIHJlcXVlc3Qgb25lIGlmIG5vbmUgaW4gbG9jYWxTdG9yYWdlXG4gICAqIEBhdXRob3IgQnJhbmRvbiBHcm9mZlxuICAgKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgcmF3IHRva2VuIHN0cmluZyBvciB0aGUgcmVxdWVzdCBQcm9taXNlIHRoYXQgbWF5IHJlc29sdmUgd2l0aCBvbmVcbiAgICovXG4gIHRoaXMuZ2V0UmF3VG9rZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGxvY2FsVG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xuICAgIGlmIChsb2NhbFRva2VuKSB7XG4gICAgICByZXR1cm4gbG9jYWxUb2tlbjtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgcGFyc2VkIHRva2VuIG9iamVjdFxuICAgKiBAYXV0aG9yIEJyYW5kb24gR3JvZmZcbiAgICogQHJldHVybnMge29iamVjdH0gdGhlIHBhcnNlZCB0b2tlblxuICAgKi9cbiAgdGhpcy5nZXRQYXJzZWRUb2tlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbG9jYWxUb2tlbiA9IHNlbGYuZ2V0UmF3VG9rZW4oKTtcbiAgICBpZiAobG9jYWxUb2tlbikge1xuICAgICAgcmV0dXJuIGp3dEhlbHBlci5kZWNvZGVUb2tlbihsb2NhbFRva2VuKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIFNhdmUgdGhlIFJBVyB0b2tlblxuICAgKiBAYXV0aG9yIEJyYW5kb24gR3JvZmZcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRva2VuIHRoZSBSQVcgdG9rZW4gb2JqZWN0XG4gICAqL1xuICB0aGlzLnNldFRva2VuID0gZnVuY3Rpb24gKHRva2VuKSB7XG4gICAgdmFyIGRlY29kZWQgPSBqd3RIZWxwZXIuZGVjb2RlVG9rZW4odG9rZW4pO1xuICAgIGlmIChkZWNvZGVkKXtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgdG9rZW4pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygnVG9rZW4gRXJyb3I6IEludmFsaWQ/Jyk7XG4gICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3Rva2VuSGFzRXhwaXJlZCcpO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogQ2xlYXIgdGhlIHRva2VuIGZyb20gbG9jYWxTdG9yYWdlXG4gICAqIEBhdXRob3IgQnJhbmRvbiBHcm9mZlxuICAgKi9cbiAgdGhpcy5jbGVhckxvY2FsVG9rZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcbiAgfTtcblxuICAvKipcbiAgICogUGVyZm9ybSBmdWxsIGxvZ291dCBwcm9jZXNzXG4gICAqIEBhdXRob3IgQnJhbmRvbiBHcm9mZlxuICAgKi9cbiAgdGhpcy5sb2dvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgc2VsZi5jbGVhckxvY2FsVG9rZW4oKTtcbiAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3Rva2VuSGFzRXhwaXJlZCcpO1xuICB9O1xuXG59KTsiLCJpbmZvTW9kdWxlLmNvbnRyb2xsZXIoJ0luZm9ybWF0aW9uQ29udHJvbGxlcicsIFsnJHNjb3BlJywgZnVuY3Rpb24oJHNjb3BlKXtcbiAgXG4gIFxuICBcbiAgXG59XSk7IiwicHJvak1vZHVsZS5mYWN0b3J5KCdQcm9qZWN0c0FQSScsIFsnJGh0dHAnLCAnY29uZmlnJywgZnVuY3Rpb24gKCRodHRwLCBjb25maWcpIHtcblxuICB2YXIgZmFjdG9yeSA9IHt9O1xuXG4gIHZhciBiYXNlVXJsID0gY29uZmlnLnVybCArICcvcHJvamVjdHMnO1xuICBcbiAgZmFjdG9yeS5wYXJzZVByb2plY3REYXRlcyA9IGZ1bmN0aW9uKHByb2plY3QpIHtcbiAgICBwcm9qZWN0LnN0YXJ0RGF0ZSA9IG1vbWVudChwcm9qZWN0LnN0YXJ0RGF0ZSwgY29uZmlnLmRhdGVGb3JtYXQpO1xuICAgIGlmIChwcm9qZWN0LmVuZERhdGUgIT0gbnVsbCl7XG4gICAgICBwcm9qZWN0LmVuZERhdGUgPSBtb21lbnQocHJvamVjdC5lbmREYXRlLCBjb25maWcuZGF0ZUZvcm1hdClcbiAgICB9XG4gICAgXG4gICAgcHJvamVjdC5sYXN0VXBkYXRlZCA9IG1vbWVudChwcm9qZWN0Lmxhc3RVcGRhdGVkLCBjb25maWcuZGF0ZVRpbWVGb3JtYXQpO1xuICAgIHJldHVybiBwcm9qZWN0O1xuICB9XG4gIFxuXG4gIGZhY3RvcnkuZ2V0QWxsID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiBiYXNlVXJsXG4gICAgfSk7XG4gIH07XG5cbiAgZmFjdG9yeS5nZXRCeUlkID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6IGJhc2VVcmwgKyAnLycgKyBpZFxuICAgIH0pO1xuICB9O1xuXG4gIGZhY3RvcnkuY3JlYXRlID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICB1cmw6IGJhc2VVcmwsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSk7XG4gIH07XG5cbiAgZmFjdG9yeS50b2dnbGVWaXNpYmlsaXR5ID0gZnVuY3Rpb24gKGlkLCB2aXNpYmxlID0gZmFsc2UpIHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgIHVybDogYmFzZVVybCArICcvJyArIGlkICsgJy92aXNpYmlsaXR5JyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgdmlzaWJsZTogdmlzaWJsZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGZhY3RvcnkudXBkYXRlID0gZnVuY3Rpb24gKGlkLCBkYXRhKSB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ1BVVCcsXG4gICAgICB1cmw6IGJhc2VVcmwgKyAnLycgKyBpZCxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KTtcbiAgfTtcblxuICBmYWN0b3J5LmRlbGV0ZSA9IGZ1bmN0aW9uIChpZCkge1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdERUxFVEUnLFxuICAgICAgdXJsOiBiYXNlVXJsICsgJy8nICsgaWRcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBmYWN0b3J5O1xuXG59XSk7IiwicHJvak1vZHVsZS5jb250cm9sbGVyKCdQcm9qZWN0c0NvbnRyb2xsZXInLCBbJyRzY29wZScsICdQcm9qZWN0c0FQSScsICckc3RhdGUnLCBmdW5jdGlvbiAoJHNjb3BlLCBQcm9qZWN0c0FQSSwgJHN0YXRlKSB7XG5cblxuICAkc2NvcGUucHJvamVjdExpc3QgPSBbXTtcblxuICB2YXIgbG9hZFByb2plY3RzID0gZnVuY3Rpb24gKGNiKSB7XG4gICAgUHJvamVjdHNBUEkuZ2V0QWxsKClcbiAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAkc2NvcGUucHJvamVjdExpc3QgPSByZXNwb25zZS5kYXRhLmRhdGE7XG4gICAgICAgIGlmIChjYikge1xuICAgICAgICAgIGNiKCk7XG4gICAgICAgIH1cbiAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgdmFyIGluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgbG9hZFByb2plY3RzKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICgkc2NvcGUucHJvamVjdExpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICAkc3RhdGUuZ28oJ1Byb2plY3RzLkRldGFpbHMnLCB7XG4gICAgICAgICAgaWQ6ICRzY29wZS5wcm9qZWN0TGlzdFswXS5pZFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGluaXQoKTtcblxuICAkc2NvcGUuJG9uKCdwcm9qZWN0cy5yZWxvYWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgbG9hZFByb2plY3RzKCk7XG4gIH0pO1xuXG59XSk7Iiwid29ya01vZHVsZS5jb250cm9sbGVyKCdXb3JrRXhwZXJpZW5jZUNvbnRyb2xsZXInLCBbJyRzY29wZScsIGZ1bmN0aW9uKCRzY29wZSl7XG4gIFxuICBcbiAgXG59XSk7IiwiaW5mb01vZHVsZS5jb250cm9sbGVyKCdTa2lsbHNDb250cm9sbGVyJywgWyckc2NvcGUnLCBmdW5jdGlvbigkc2NvcGUpe1xuICBcbiAgY29uc29sZS5sb2coJ3NraWxscycpO1xuICBcbn1dKTsiLCJpbmZvTW9kdWxlLmNvbnRyb2xsZXIoJ0ludGVyZXN0c0NvbnRyb2xsZXInLCBbJyRzY29wZScsIGZ1bmN0aW9uKCRzY29wZSl7XG4gIFxuICBcbiAgXG59XSk7IiwicHJvak1vZHVsZS5jb250cm9sbGVyKCdDcmVhdGVQcm9qZWN0c0NvbnRyb2xsZXInLCBbJyRzY29wZScsICdQcm9qZWN0c0FQSScsICdJbWFnZXNBUEknLCAnVGFnc0FQSScsICckdGltZW91dCcsICckc3RhdGUnLCBmdW5jdGlvbiAoJHNjb3BlLCBQcm9qZWN0c0FQSSwgSW1hZ2VzQVBJLCBUYWdzQVBJLCAkdGltZW91dCwgJHN0YXRlKSB7XG5cbiAgdmFyIGxvYWRJbWFnZUxpc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgSW1hZ2VzQVBJLmdldEFsbCgpXG4gICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgJHNjb3BlLmFsbEltYWdlc0xpc3QgPSByZXNwb25zZS5kYXRhLmRhdGE7XG4gICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgJCgnc2VsZWN0JykubWF0ZXJpYWxfc2VsZWN0KCk7XG4gICAgICAgIH0sIDUwKTtcbiAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgIH0pO1xuICB9O1xuICBcbiAgJHNjb3BlLiR3YXRjaCgnYWxsSW1hZ2VMaXN0JywgZnVuY3Rpb24obmV3VmFsdWUsIG9sZFZhbHVlKXtcbiAgICBpZiAobmV3VmFsdWUgIT0gb2xkVmFsdWUgJiYgbmV3VmFsdWUubGVuZ3RoID4gMCl7XG4gICAgICAkdGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICQoJ3NlbGVjdCcpLm1hdGVyaWFsX3NlbGVjdCgnZGVzdHJveScpO1xuICAgICAgICAgICQoJ3NlbGVjdCcpLm1hdGVyaWFsX3NlbGVjdCgpO1xuICAgICAgICB9LCA1MCk7XG4gICAgfVxuICB9KTtcblxuICB2YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkc2NvcGUucHJvamVjdCA9IHt9O1xuICAgICRzY29wZS5hbGxJbWFnZXNMaXN0ID0gW107XG4gICAgJHNjb3BlLmNyZWF0ZUltYWdlID0ge307XG4gICAgXG5cbi8vICAgICQoJy5kYXRlcGlja2VyJykucGlja2FkYXRlKHtcbi8vICAgICAgc2VsZWN0TW9udGhzOiB0cnVlLCAvLyBDcmVhdGVzIGEgZHJvcGRvd24gdG8gY29udHJvbCBtb250aFxuLy8gICAgICBzZWxlY3RZZWFyczogMTUgLy8gQ3JlYXRlcyBhIGRyb3Bkb3duIG9mIDE1IHllYXJzIHRvIGNvbnRyb2wgeWVhcixcbi8vICAgIH0pO1xuXG4gICAgJHNjb3BlLnByb2plY3QgPSB7fTtcbiAgICAkc2NvcGUucHJvamVjdC5lbmRDdXJyZW50ID0gdHJ1ZTtcblxuICAgIGxvYWRJbWFnZUxpc3QoKTtcbiAgfVxuXG4gIGluaXQoKTtcblxuXG4gICRzY29wZS5hZGRJbWFnZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoISRzY29wZS5wcm9qZWN0LmltYWdlcykge1xuICAgICAgJHNjb3BlLnByb2plY3QuaW1hZ2VzID0gW107XG4gICAgfVxuICAgICRzY29wZS5wcm9qZWN0LmltYWdlcy5wdXNoKGFuZ3VsYXIuY29weSgkc2NvcGUuY3JlYXRlSW1hZ2UpKTtcbiAgICAkc2NvcGUuY3JlYXRlSW1hZ2UgPSB7fTtcbiAgfTtcblxuICAkc2NvcGUucmVzZXRQcm9qZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChjb25maXJtKFwiQXJlIHlvdSBzdXJlP1wiKSkge1xuICAgICAgJHNjb3BlLnByb2plY3QgPSB7XG4gICAgICAgIHRpdGxlOiB1bmRlZmluZWQsXG4gICAgICAgIHN0YXR1czogdW5kZWZpbmVkLFxuICAgICAgICBzdGFydERhdGU6IHVuZGVmaW5lZCxcbiAgICAgICAgZW5kRGF0ZTogdW5kZWZpbmVkLFxuICAgICAgICBlbmRDdXJyZW50OiB0cnVlLFxuICAgICAgICBsaW5rVGV4dDogdW5kZWZpbmVkLFxuICAgICAgICBsaW5rTG9jYXRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgbGlua0ltYWdlOiB7fSxcbiAgICAgICAgbGlua0ltYWdlSWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgaW1hZ2U6IFtdLFxuICAgICAgICB0YWdzOiBbXSxcbiAgICAgICAgZGVzY3JpcHRpb246IHVuZGVmaW5lZFxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICAkc2NvcGUuY3JlYXRlUHJvamVjdCA9IGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciBzZW5kRGF0YSA9IGFuZ3VsYXIuY29weSgkc2NvcGUucHJvamVjdCk7XG4gICAgXG4gICAgc2VuZERhdGEudGFncyA9IFRhZ3NBUEkucGFyc2VGb3JTZW5kaW5nKHNlbmREYXRhLnRhZ3MpO1xuICAgIGlmIChzZW5kRGF0YS5lbmRDdXJyZW50KSB7XG4gICAgICBzZW5kRGF0YS5lbmREYXRlID0gbnVsbDtcbiAgICAgIGRlbGV0ZSBzZW5kRGF0YS5lbmRDdXJyZW50O1xuICAgIH1cbiAgICBpZiAoc2VuZERhdGEubGlua0ltYWdlSWQpIHtcbiAgICAgIHNlbmREYXRhLmxpbmtJbWFnZS5pZCA9IHNlbmREYXRhLmxpbmtJbWFnZUlkO1xuICAgICAgZGVsZXRlIHNlbmREYXRhLmxpbmtJbWFnZUlkO1xuICAgIH1cblxuICAgIFByb2plY3RzQVBJLmNyZWF0ZShzZW5kRGF0YSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICB2YXIgY3JlYXRlZCA9IHJlc3BvbnNlLmRhdGEuZGF0YTtcbiAgICAgICAgJHNjb3BlLiRlbWl0KCdwcm9qZWN0cy5yZWxvYWQnKTtcbiAgICAgICAgJHN0YXRlLmdvKCdQcm9qZWN0cy5EZXRhaWxzJywge2lkOiBjcmVhdGVkLmlkfSk7XG4gICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICB9KTtcblxuICB9O1xuXG5cbn1dKTsiLCJwcm9qTW9kdWxlLmNvbnRyb2xsZXIoJ1Byb2plY3REZXRhaWxzQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRzdGF0ZVBhcmFtcycsICdQcm9qZWN0c0FQSScsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZVBhcmFtcywgUHJvamVjdHNBUEkpIHtcblxuICAkc2NvcGUucHJvamVjdCA9IHt9O1xuICAkc2NvcGUudXBkYXRpbmcgPSBmYWxzZTtcblxuICB2YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAkc2NvcGUudXBkYXRpbmcgPSB0cnVlO1xuICAgIFByb2plY3RzQVBJLmdldEJ5SWQoJHN0YXRlUGFyYW1zLmlkKVxuICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICRzY29wZS5wcm9qZWN0ID0gYW5ndWxhci5jb3B5KHJlc3BvbnNlLmRhdGEuZGF0YSk7XG4gICAgICAgICRzY29wZS5wcm9qZWN0ID0gUHJvamVjdHNBUEkucGFyc2VQcm9qZWN0RGF0ZXMoJHNjb3BlLnByb2plY3QpO1xuICAgICAgICAkc2NvcGUuc2hvd1Byb2plY3RPbkxpdmUgPSAhJHNjb3BlLnByb2plY3QuaGlkZGVuO1xuICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgfSkuZmluYWxseShmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS51cGRhdGluZyA9IGZhbHNlO1xuICAgICAgfSk7XG5cblxuICB9XG5cbiAgaW5pdCgpO1xuXG4gIHZhciB1cGRhdGVWaXNpYmxpdHkgPSBmdW5jdGlvbiAodmlzaWJsZSkge1xuICAgICRzY29wZS51cGRhdGluZyA9IHRydWU7XG4gICAgUHJvamVjdHNBUEkudG9nZ2xlVmlzaWJpbGl0eSgkc2NvcGUucHJvamVjdC5pZCwgdmlzaWJsZSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAkc2NvcGUucHJvamVjdCA9IGFuZ3VsYXIuY29weShyZXNwb25zZS5kYXRhLmRhdGEpO1xuICAgICAgICAkc2NvcGUucHJvamVjdCA9IFByb2plY3RzQVBJLnBhcnNlUHJvamVjdERhdGVzKCRzY29wZS5wcm9qZWN0KTtcbiAgICAgICAgJHNjb3BlLnNob3dQcm9qZWN0T25MaXZlID0gISRzY29wZS5wcm9qZWN0LmhpZGRlbjtcbiAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgIH0pLmZpbmFsbHkoZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2NvcGUudXBkYXRpbmcgPSBmYWxzZTtcbiAgICAgIH0pO1xuICB9O1xuXG4gICRzY29wZS4kd2F0Y2goJ3Nob3dQcm9qZWN0T25MaXZlJywgZnVuY3Rpb24gKG5ld1ZhbCwgb2xkVmFsKSB7XG4gICAgaWYgKG5ld1ZhbCAhPT0gb2xkVmFsICYmIG9sZFZhbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB1cGRhdGVWaXNpYmxpdHkobmV3VmFsKTtcbiAgICB9XG4gIH0pO1xuXG59XSk7IiwicHJvak1vZHVsZS5mYWN0b3J5KCdJbWFnZXNBUEknLCBbJyRodHRwJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkaHR0cCwgY29uZmlnKSB7XG5cbiAgdmFyIGZhY3RvcnkgPSB7fTtcblxuICB2YXIgYmFzZVVybCA9IGNvbmZpZy51cmwgKyAnL3Byb2plY3RzL2ltYWdlcyc7XG5cbiAgZmFjdG9yeS5nZXRBbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6IGJhc2VVcmxcbiAgICB9KTtcbiAgfTtcblxuLy8gIGZhY3RvcnkuZ2V0QnlJZCA9IGZ1bmN0aW9uIChpZCkge1xuLy8gICAgcmV0dXJuICRodHRwKHtcbi8vICAgICAgbWV0aG9kOiAnR0VUJyxcbi8vICAgICAgdXJsOiBiYXNlVXJsICsgJy9pZCdcbi8vICAgIH0pO1xuLy8gIH07XG4vL1xuLy8gIGZhY3RvcnkuY3JlYXRlID0gZnVuY3Rpb24gKGRhdGEpIHtcbi8vICAgIHJldHVybiAkaHR0cCh7XG4vLyAgICAgIG1ldGhvZDogJ1BPU1QnLFxuLy8gICAgICB1cmw6IGJhc2VVcmwsXG4vLyAgICAgIGRhdGE6IHtcbi8vICAgICAgICBcbi8vICAgICAgfVxuLy8gICAgfSk7XG4vLyAgfVxuXG4gIHJldHVybiBmYWN0b3J5O1xuXG59XSk7IiwicHJvak1vZHVsZS5jb250cm9sbGVyKCdJbWFnZXNDb250cm9sbGVyJywgWyckc2NvcGUnLCBmdW5jdGlvbigkc2NvcGUpe1xuICBcbiAgXG4gIFxuICBcbn1dKTsiLCJwcm9qTW9kdWxlLmZhY3RvcnkoJ1RhZ3NBUEknLCBbJyRodHRwJywgJ2NvbmZpZycsIGZ1bmN0aW9uICgkaHR0cCwgY29uZmlnKSB7XG5cbiAgdmFyIGZhY3RvcnkgPSB7fTtcblxuICB2YXIgYmFzZVVybCA9IGNvbmZpZy51cmwgKyAnL3Byb2plY3RzL3RhZ3MnO1xuICBcbiAgZmFjdG9yeS5wYXJzZUZvclNlbmRpbmcgPSBmdW5jdGlvbihtYXRlcmlhbGl6ZVRhZ3MpIHtcbiAgICB2YXIgcGFyc2VkID0gW107XG4gICAgbWF0ZXJpYWxpemVUYWdzLmZvckVhY2goZnVuY3Rpb24odGFnKXtcbiAgICAgIHZhciB0ZW1wID0ge307XG4gICAgICBpZiAodGFnLmhhc093blByb3BlcnR5KCdpZCcpKXtcbiAgICAgICAgdGVtcC5pZCA9IHRhZy5pZDtcbiAgICAgIH1cbiAgICAgIHRlbXAubmFtZSA9IHRhZy50YWc7XG4gICAgICBwYXJzZWQucHVzaCh0ZW1wKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcGFyc2VkO1xuICB9O1xuXG4gIGZhY3RvcnkuZ2V0QWxsID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiBiYXNlVXJsXG4gICAgfSk7XG4gIH07XG5cbi8vICBmYWN0b3J5LmdldEJ5SWQgPSBmdW5jdGlvbiAoaWQpIHtcbi8vICAgIHJldHVybiAkaHR0cCh7XG4vLyAgICAgIG1ldGhvZDogJ0dFVCcsXG4vLyAgICAgIHVybDogYmFzZVVybCArICcvaWQnXG4vLyAgICB9KTtcbi8vICB9O1xuLy9cbi8vICBmYWN0b3J5LmNyZWF0ZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4vLyAgICByZXR1cm4gJGh0dHAoe1xuLy8gICAgICBtZXRob2Q6ICdQT1NUJyxcbi8vICAgICAgdXJsOiBiYXNlVXJsLFxuLy8gICAgICBkYXRhOiB7XG4vLyAgICAgICAgXG4vLyAgICAgIH1cbi8vICAgIH0pO1xuLy8gIH1cblxuICByZXR1cm4gZmFjdG9yeTtcblxufV0pOyIsInByb2pNb2R1bGUuY29udHJvbGxlcignVGFnc0NvbnRyb2xsZXInLCBbJyRzY29wZScsIGZ1bmN0aW9uKCRzY29wZSl7XG4gIFxuICBcbiAgXG4gIFxufV0pOyIsIndvcmtNb2R1bGUuY29udHJvbGxlcignQ29udGFjdHNDb250cm9sbGVyJywgWyckc2NvcGUnLCBmdW5jdGlvbigkc2NvcGUpe1xuICBcbiAgXG4gIFxufV0pOyIsInByb2pNb2R1bGUuY29udHJvbGxlcignUHJvamVjdERldGFpbHNFZGl0Q29udHJvbGxlcicsIFsnJHNjb3BlJywgJyRzdGF0ZVBhcmFtcycsICdQcm9qZWN0c0FQSScsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZVBhcmFtcywgUHJvamVjdHNBUEkpIHtcblxuICAkc2NvcGUucHJvamVjdCA9IHt9O1xuICAkc2NvcGUub3JpZ2luYWwgPSB7fTtcblxuICB2YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICBcbiAgICBQcm9qZWN0c0FQSS5nZXRCeUlkKCRzdGF0ZVBhcmFtcy5pZClcbiAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAkc2NvcGUucHJvamVjdCA9IHJlc3BvbnNlLmRhdGEuZGF0YTtcbiAgICAgICAgJHNjb3BlLm9yaWdpbmFsID0gYW5ndWxhci5jb3B5KCRzY29wZS5wcm9qZWN0KTtcbiAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLm9yaWdpbmFsKTtcbiAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgIH0pO1xuICAgIFxuICAgIFxuICB9XG4gIFxuICBpbml0KCk7XG5cblxufV0pOyIsInByb2pNb2R1bGUuY29udHJvbGxlcignQ3JlYXRlSW1hZ2VzQ29udHJvbGxlcicsIFsnJHNjb3BlJywgZnVuY3Rpb24oJHNjb3BlKXtcbiAgXG4gIFxuICBcbn1dKTsiLCJwcm9qTW9kdWxlLmNvbnRyb2xsZXIoJ0ltYWdlRGV0YWlsc0NvbnRyb2xsZXInLCBbJyRzY29wZScsIGZ1bmN0aW9uKCRzY29wZSl7XG4gIFxuICBcbiAgXG59XSk7IiwicHJvak1vZHVsZS5jb250cm9sbGVyKCdDcmVhdGVUYWdzQ29udHJvbGxlcicsIFsnJHNjb3BlJywgZnVuY3Rpb24oJHNjb3BlKXtcbiAgXG4gIFxuICBcbiAgXG59XSk7IiwicHJvak1vZHVsZS5jb250cm9sbGVyKCdUYWdEZXRhaWxzQ29udHJvbGxlcicsIFsnJHNjb3BlJywgZnVuY3Rpb24oJHNjb3BlKXtcbiAgXG4gIFxuICBcbiAgXG59XSk7Il19
