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
infoModule.controller('InterestsController', ['$scope', function($scope){
  
  
  
}]);
infoModule.controller('SkillsController', ['$scope', function($scope){
  
  console.log('skills');
  
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
projModule.controller('CreateImagesController', ['$scope', function($scope){
  
  
  
}]);
projModule.controller('ImageDetailsController', ['$scope', function($scope){
  
  
  
}]);
projModule.controller('ProjectDetailsEditController', ['$scope', '$stateParams', 'ProjectsAPI', function ($scope, $stateParams, ProjectsAPI) {

  console.log('Editing');
  
  $scope.project = {};
  $scope.original = {};

  var init = function () {
    
    ProjectsAPI.getById($stateParams.id)
      .then(function (response) {
        $scope.project = response.data.data;
        $scope.project = ProjectsAPI.parseProjectDates($scope.project);
        $scope.project.startDate = $scope.project.startDate.toDate();
        $scope.original = angular.copy($scope.project);
        console.log($scope.original);
      }).catch(function (error) {
        console.error(error);
      });
    
    
  }
  
  init();


}]);
projModule.controller('CreateTagsController', ['$scope', function($scope){
  
  
  
  
}]);
projModule.controller('TagDetailsController', ['$scope', function($scope){
  
  
  
  
}]);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1vZHVsZXMvQXV0aC9hdXRoLm1vZHVsZS5qcyIsIm1vZHVsZXMvSW5mb3JtYXRpb24vaW5mby5tb2R1bGUuanMiLCJtb2R1bGVzL1Byb2plY3RzL3Byb2plY3RzLm1vZHVsZS5qcyIsIm1vZHVsZXMvV29ya0V4cGVyaWVuY2Uvd29yay5tb2R1bGUuanMiLCJjb21wb25lbnRzL0FwcC5TdWJOYXYvYXBwLnN1Yi5uYXYuanMiLCJjb21wb25lbnRzL0NoaXBzL2NoaXAtZmllbGQuanMiLCJjb21wb25lbnRzL0ltZ1BsYWNlaG9sZGVyL2ltZ1BsYWNlaG9sZGVyLmpzIiwiY29tcG9uZW50cy9JbWdQcmV2aWV3L2ltZ1ByZXZpZXcuanMiLCJjb21wb25lbnRzL05ld0ltYWdlL25ld0ltYWdlLmpzIiwibW9kdWxlcy9BcHAuTmF2L2FwcC5uYXYuanMiLCJtb2R1bGVzL0F1dGgvYXV0aC5hcGkuanMiLCJtb2R1bGVzL0F1dGgvYXV0aC5sb2dpbi5jb250cm9sbGVyLmpzIiwibW9kdWxlcy9BdXRoL2F1dGgubG9nb3V0LmNvbnRyb2xsZXIuanMiLCJtb2R1bGVzL0F1dGgvYXV0aC5zZXJ2aWNlLmpzIiwibW9kdWxlcy9JbmZvcm1hdGlvbi9pbmZvLmNvbnRyb2xsZXIuanMiLCJtb2R1bGVzL1Byb2plY3RzL3Byb2plY3RzLmFwaS5qcyIsIm1vZHVsZXMvUHJvamVjdHMvcHJvamVjdHMuY29udHJvbGxlci5qcyIsIm1vZHVsZXMvV29ya0V4cGVyaWVuY2Uvd29yay5jb250cm9sbGVyLmpzIiwibW9kdWxlcy9JbmZvcm1hdGlvbi9JbnRlcmVzdHMvaW50ZXJlc3RzLmNvbnRyb2xsZXIuanMiLCJtb2R1bGVzL0luZm9ybWF0aW9uL1NraWxscy9za2lsbHMuY29udHJvbGxlci5qcyIsIm1vZHVsZXMvUHJvamVjdHMvQ3JlYXRlL3Byb2plY3RzLmNyZWF0ZS5qcyIsIm1vZHVsZXMvUHJvamVjdHMvSW1hZ2VzL2ltYWdlcy5hcGkuanMiLCJtb2R1bGVzL1Byb2plY3RzL0ltYWdlcy9pbWFnZXMuY29udHJvbGxlci5qcyIsIm1vZHVsZXMvUHJvamVjdHMvRGV0YWlscy9wcm9qZWN0cy5kZXRhaWxzLmpzIiwibW9kdWxlcy9Qcm9qZWN0cy9UYWdzL3RhZ3MuYXBpLmpzIiwibW9kdWxlcy9Qcm9qZWN0cy9UYWdzL3RhZ3MuY29udHJvbGxlci5qcyIsIm1vZHVsZXMvV29ya0V4cGVyaWVuY2UvQ29udGFjdHMvY29udGFjdHMuY29udHJvbGxlci5qcyIsIm1vZHVsZXMvUHJvamVjdHMvSW1hZ2VzL0NyZWF0ZS9pbWFnZXMuY3JlYXRlLmpzIiwibW9kdWxlcy9Qcm9qZWN0cy9JbWFnZXMvRGV0YWlscy9pbWFnZXMuZGV0YWlscy5qcyIsIm1vZHVsZXMvUHJvamVjdHMvRGV0YWlscy9FZGl0L3Byb2plY3RzLmRldGFpbHMuZWRpdC5qcyIsIm1vZHVsZXMvUHJvamVjdHMvVGFncy9DcmVhdGUvdGFncy5jcmVhdGUuanMiLCJtb2R1bGVzL1Byb2plY3RzL1RhZ3MvRGV0YWlscy90YWdzLmRldGFpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FkbWluJywgWyd1aS5yb3V0ZXInLCAnYW5ndWxhci1sb2FkaW5nLWJhcicsICdhZG1pbi50ZW1wbGF0ZXMnLCAnYWRtaW4uaW5mbycsICdhZG1pbi53b3JrJywgJ2FkbWluLnByb2plY3RzJywgJ2FkbWluLmF1dGgnLCAnZnJvYWxhJ10pO1xuXG5hcHAuY29uc3RhbnQoJ2NvbmZpZycsIHtcbiAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4ODg4L2FwaS92MScsXG4gIGRhdGVGb3JtYXQ6ICdtbS9kZC95eXl5JyxcbiAgZGF0ZVRpbWVGb3JtYXQ6ICdtbS9kZC95eXl5IGhoOm1tOnNzJ1xufSk7XG5cbmFwcC52YWx1ZSgnZnJvYWxhQ29uZmlnJywge1xuICBoZWlnaHRNaW46IDIwMFxufSk7XG5cbmFwcC5ydW4oWyckcm9vdFNjb3BlJywgJyRzdGF0ZScsICckdGltZW91dCcsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc3RhdGUsICR0aW1lb3V0KSB7XG5cbiAgJHJvb3RTY29wZS4kc3RhdGUgPSAkc3RhdGU7XG4gICRyb290U2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAkcm9vdFNjb3BlLm1vZGFsRGF0YSA9IHt9O1xuXG4gICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uIChldnQsIHRvLCBwYXJhbXMpIHtcbiAgICBpZiAodG8ucmVkaXJlY3RUbykge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAkc3RhdGUuZ28odG8ucmVkaXJlY3RUbywgcGFyYW1zLCB7XG4gICAgICAgIGxvY2F0aW9uOiAncmVwbGFjZSdcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4gIFxufV0pO1xuXG5cbi8qIC0tLSBSb3V0aW5nIC0tLSAqL1xuXG5hcHAuY29uZmlnKFsnJHVybFJvdXRlclByb3ZpZGVyJywgJyRsb2NhdGlvblByb3ZpZGVyJywgJyRzdGF0ZVByb3ZpZGVyJywgJ2NmcExvYWRpbmdCYXJQcm92aWRlcicsIGZ1bmN0aW9uICgkdXJsUm91dGVyUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyLCAkc3RhdGVQcm92aWRlciwgY2ZwTG9hZGluZ0JhclByb3ZpZGVyKSB7XG5cbiAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHtcbiAgICBlbmFibGVkOiB0cnVlLFxuICAgIHJlcXVpcmVCYXNlOiB0cnVlXG4gIH0pO1xuXG4gICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoXCIvXCIpO1xuICBcbiAgY2ZwTG9hZGluZ0JhclByb3ZpZGVyLnNwaW5uZXJUZW1wbGF0ZSA9ICc8ZGl2IGNsYXNzPVwicHJlbG9hZGVyLXdyYXBwZXIgYmlnIGFjdGl2ZVwiPjxkaXYgY2xhc3M9XCJzcGlubmVyLWxheWVyIHNwaW5uZXItYmx1ZS1vbmx5XCI+PGRpdiBjbGFzcz1cImNpcmNsZS1jbGlwcGVyIGxlZnRcIj48ZGl2IGNsYXNzPVwiY2lyY2xlXCI+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cImdhcC1wYXRjaFwiPjxkaXYgY2xhc3M9XCJjaXJjbGVcIj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwiY2lyY2xlLWNsaXBwZXIgcmlnaHRcIj48ZGl2IGNsYXNzPVwiY2lyY2xlXCI+PC9kaXY+PC9kaXY+PC9kaXY+PC9kaXY+JztcblxuICAkc3RhdGVQcm92aWRlclxuICAgIC5zdGF0ZSgnLycsIHtcbiAgICAgIHJlZGlyZWN0VG86ICdJbmZvcm1hdGlvbicsXG4gICAgICBleGNsdWRlRnJvbVNpZGVuYXY6IHRydWUsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgIH1cbiAgICB9KTtcblxufV0pOyIsInZhciBhdXRoTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FkbWluLmF1dGgnLCBbJ3VpLnJvdXRlcicsICdhbmd1bGFyLWp3dCddKTtcblxuYXV0aE1vZHVsZS5jb25maWcoWyckc3RhdGVQcm92aWRlcicsICdqd3RPcHRpb25zUHJvdmlkZXInLCAnJGh0dHBQcm92aWRlcicsIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgand0T3B0aW9uc1Byb3ZpZGVyLCAkaHR0cFByb3ZpZGVyKSB7XG5cbiAgJHN0YXRlUHJvdmlkZXJcbiAgICAuc3RhdGUoJ0xvZ2luJywge1xuICAgICAgdXJsOiAnL2xvZ2luJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnLi9zcmMvbW9kdWxlcy9BdXRoL2F1dGgubG9naW4uaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnTG9naW5Db250cm9sbGVyJyxcbiAgICAgIGV4Y2x1ZGVGcm9tU2lkZW5hdjogdHJ1ZSxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgcmVxdWlyZXNMb2dpbjogZmFsc2VcbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnTG9nb3V0Jywge1xuICAgICAgdXJsOiAnL2xvZ291dCcsXG4gICAgICB0ZW1wbGF0ZVVybDogJy4vc3JjL21vZHVsZXMvQXV0aC9hdXRoLmxvZ291dC5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdMb2dvdXRDb250cm9sbGVyJyxcbiAgICAgIGV4Y2x1ZGVGcm9tU2lkZW5hdjogdHJ1ZSxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgXG4gICAgICB9XG4gICAgfSk7XG4gIFxuICBqd3RPcHRpb25zUHJvdmlkZXIuY29uZmlnKHtcbiAgICB0b2tlbkdldHRlcjogWydvcHRpb25zJywgJyRhdXRoJywgZnVuY3Rpb24gKG9wdGlvbnMsICRhdXRoKSB7XG4gICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnVybC5zdWJzdHIob3B0aW9ucy51cmwubGVuZ3RoIC0gNSkgPT0gJy5odG1sJykge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiAkYXV0aC5nZXRSYXdUb2tlbigpO1xuICAgICAgfV0sXG4gICAgd2hpdGVMaXN0ZWREb21haW5zOiBbJ2xvY2FsaG9zdCcsICdicmFuZG9uZ3JvZmYuY29tJywgJ2Rldi5icmFuZG9uZ3JvZmYuY29tJywgJ2FwaS5icmFuZG9uZ3JvZmYuY29tJ10sXG4gICAgLy8gICAgdW5hdXRoZW50aWNhdGVkUmVkaXJlY3RQYXRoOiAnL2Vycm9yP2NvZGU9NDAzJyxcbiAgICB1bmF1dGhlbnRpY2F0ZWRSZWRpcmVjdG9yOiBbJyRzdGF0ZScsICckYXV0aCcsIGZ1bmN0aW9uICgkc3RhdGUsICRhdXRoKSB7XG4gICAgICAkYXV0aC5sb2dvdXQoKTtcbiAgICAgICRzdGF0ZS5nbyhcIkxvZ2luXCIpO1xuICAgICAgfV1cbiAgfSk7XG4gIFxuICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKCdqd3RJbnRlcmNlcHRvcicpO1xuXG59XSk7XG5cbmF1dGhNb2R1bGUucnVuKFsnYXV0aE1hbmFnZXInLCAnJHJvb3RTY29wZScsICckc3RhdGUnLCAnJGF1dGgnLCAnQXV0aEFQSScsIGZ1bmN0aW9uIChhdXRoTWFuYWdlciwgJHJvb3RTY29wZSwgJHN0YXRlLCAkYXV0aCwgQXV0aEFQSSkge1xuICBcbiAgYXV0aE1hbmFnZXIuY2hlY2tBdXRoT25SZWZyZXNoKCk7XG5cbiAgYXV0aE1hbmFnZXIucmVkaXJlY3RXaGVuVW5hdXRoZW50aWNhdGVkKCk7XG5cbiAgJHJvb3RTY29wZS4kb24oJ3Rva2VuSGFzRXhwaXJlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAkYXV0aC5jbGVhckxvY2FsVG9rZW4oKTtcbiAgICAkc3RhdGUuZ28oJ0xvZ2luJyk7XG4gIH0pO1xuXG4gIFxuICAvL3ZhbGlkYXRlIHRoZSBjdXJyZW50IHRva2VuIG9uIGluaXRpYWwgcGFnZSBsb2FkXG4gIEF1dGhBUEkudmFsaWRhdGVUb2tlbigpO1xuICBcbn1dKTtcbiIsInZhciBpbmZvTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FkbWluLmluZm8nLCBbJ3VpLnJvdXRlciddKTtcblxuaW5mb01vZHVsZS5jb25maWcoWyckc3RhdGVQcm92aWRlcicsIGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuXG4gICRzdGF0ZVByb3ZpZGVyXG4gICAgLnN0YXRlKCdJbmZvcm1hdGlvbicsIHtcbiAgICAgIHVybDogJy9pbmZvcm1hdGlvbicsXG4gICAgICB0ZW1wbGF0ZVVybDogJy4vc3JjL21vZHVsZXMvSW5mb3JtYXRpb24vaW5mby5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdJbmZvcm1hdGlvbkNvbnRyb2xsZXInLFxuICAgICAgcmVkaXJlY3RUbzogJ0ludGVyZXN0cycsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIG9yZGVyOiAwLFxuICAgICAgICB0YWdzOiBbXG4gICAgICAgIFwiaW5mb1wiLFxuICAgICAgICBcImluZm9ybWF0aW9uXCJcbiAgICAgIF0sXG4gICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnSW50ZXJlc3RzJywge1xuICAgICAgdXJsOiAnL2ludGVyZXN0cycsXG4gICAgICB0ZW1wbGF0ZVVybDogJy4vc3JjL21vZHVsZXMvSW5mb3JtYXRpb24vSW50ZXJlc3RzL2ludGVyZXN0cy5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdJbnRlcmVzdHNDb250cm9sbGVyJyxcbiAgICAgIHN1YnZpZXdPZjogJ0luZm9ybWF0aW9uJyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgb3JkZXI6IDBcbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnU2tpbGxzJywge1xuICAgICAgdXJsOiAnL3NraWxscycsXG4gICAgICB0ZW1wbGF0ZVVybDogJy4vc3JjL21vZHVsZXMvSW5mb3JtYXRpb24vU2tpbGxzL3NraWxscy5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdTa2lsbHNDb250cm9sbGVyJyxcbiAgICAgIHN1YnZpZXdPZjogJ0luZm9ybWF0aW9uJyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgb3JkZXI6IDFcbiAgICAgIH1cbiAgICB9KTtcblxufV0pOyIsInZhciBwcm9qTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FkbWluLnByb2plY3RzJywgWyd1aS5yb3V0ZXInLCAndWkuc29ydGFibGUnXSk7XG5cbnByb2pNb2R1bGUuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAkc3RhdGVQcm92aWRlclxuICAgIC5zdGF0ZSgnUHJvamVjdHMnLCB7XG4gICAgICB1cmw6ICcvcHJvamVjdHMnLFxuICAgICAgdGVtcGxhdGVVcmw6ICcuL3NyYy9tb2R1bGVzL1Byb2plY3RzL3Byb2plY3RzLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ1Byb2plY3RzQ29udHJvbGxlcicsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIG9yZGVyOiAyLFxuICAgICAgICB0YWdzOiBbXG4gICAgICAgIFwicHJvamVjdHNcIlxuICAgICAgXSxcbiAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgfVxuICAgIH0pXG4gICAgLnN0YXRlKCdQcm9qZWN0cy5DcmVhdGUnLCB7XG4gICAgICB1cmw6ICcvY3JlYXRlJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnLi9zcmMvbW9kdWxlcy9Qcm9qZWN0cy9DcmVhdGUvcHJvamVjdHMuY3JlYXRlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ0NyZWF0ZVByb2plY3RzQ29udHJvbGxlcicsXG4gICAgICBwYXJlbnQ6ICdQcm9qZWN0cycsXG4gICAgICBleGNsdWRlRnJvbVNpZGVuYXY6IHRydWUsXG4gICAgICBkYXRhOiB7XG5cbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnUHJvamVjdHMuRGV0YWlscycsIHtcbiAgICAgIHVybDogJy86aWQnLFxuICAgICAgdGVtcGxhdGVVcmw6ICcuL3NyYy9tb2R1bGVzL1Byb2plY3RzL0RldGFpbHMvcHJvamVjdHMuZGV0YWlscy5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdQcm9qZWN0RGV0YWlsc0NvbnRyb2xsZXInLFxuICAgICAgcGFyZW50OiAnUHJvamVjdHMnLFxuICAgICAgZXhjbHVkZUZyb21TaWRlbmF2OiB0cnVlLFxuICAgICAgZGF0YToge1xuXG4gICAgICB9XG4gICAgfSlcbiAgICAuc3RhdGUoJ1Byb2plY3RzLkVkaXQnLCB7XG4gICAgICB1cmw6ICcvOmlkL2VkaXQnLFxuICAgICAgdGVtcGxhdGVVcmw6ICcuL3NyYy9tb2R1bGVzL1Byb2plY3RzL0RldGFpbHMvRWRpdC9wcm9qZWN0cy5kZXRhaWxzLmVkaXQuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnUHJvamVjdERldGFpbHNFZGl0Q29udHJvbGxlcicsXG4gICAgICBwYXJlbnQ6ICdQcm9qZWN0cycsXG4gICAgICBleGNsdWRlRnJvbVNpZGVuYXY6IHRydWUsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIFxuICAgICAgfVxuICAgIH0pXG4gICAgLnN0YXRlKCdUYWdzJywge1xuICAgICAgdXJsOiAnL3RhZ3MnLFxuICAgICAgdGVtcGxhdGVVcmw6ICcuL3NyYy9tb2R1bGVzL1Byb2plY3RzL1RhZ3MvdGFncy5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdUYWdzQ29udHJvbGxlcicsXG4gICAgICBzdWJ2aWV3T2Y6ICdQcm9qZWN0cycsXG4gICAgICBleGNsdWRlRnJvbVNpZGVuYXY6IGZhbHNlLFxuICAgICAgZGF0YToge1xuICAgICAgICBvcmRlcjogMCxcbiAgICAgICAgdGFnczogW1xuICAgICAgICBcInByb2plY3RzXCJcbiAgICAgICAgXSxcbiAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgfVxuICAgIH0pXG4gICAgLnN0YXRlKCdUYWdzLkNyZWF0ZScsIHtcbiAgICAgIHVybDogJy9jcmVhdGUnLFxuICAgICAgdGVtcGxhdGVVcmw6ICcuL3NyYy9tb2R1bGVzL1Byb2plY3RzL1RhZ3MvQ3JlYXRlL3RhZ3MuY3JlYXRlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ0NyZWF0ZVRhZ3NDb250cm9sbGVyJyxcbiAgICAgIHBhcmVudDogJ1RhZ3MnLFxuICAgICAgZXhjbHVkZUZyb21TaWRlbmF2OiB0cnVlLFxuICAgICAgZGF0YToge1xuXG4gICAgICB9XG4gICAgfSlcbiAgICAuc3RhdGUoJ1RhZ3MuRGV0YWlscycsIHtcbiAgICAgIHVybDogJy86aWQnLFxuICAgICAgdGVtcGxhdGVVcmw6ICcuL3NyYy9tb2R1bGVzL1Byb2plY3RzL1RhZ3MvRGV0YWlscy90YWdzLmRldGFpbHMuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnVGFnRGV0YWlsc0NvbnRyb2xsZXInLFxuICAgICAgcGFyZW50OiAnVGFncycsXG4gICAgICBleGNsdWRlRnJvbVNpZGVuYXY6IHRydWUsXG4gICAgICBkYXRhOiB7XG5cbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnSW1hZ2VzJywge1xuICAgICAgdXJsOiAnL2ltYWdlcycsXG4gICAgICB0ZW1wbGF0ZVVybDogJy4vc3JjL21vZHVsZXMvUHJvamVjdHMvSW1hZ2VzL2ltYWdlcy5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdJbWFnZXNDb250cm9sbGVyJyxcbiAgICAgIHN1YnZpZXdPZjogJ1Byb2plY3RzJyxcbiAgICAgIGV4Y2x1ZGVGcm9tU2lkZW5hdjogZmFsc2UsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIG9yZGVyOiAxLFxuICAgICAgICB0YWdzOiBbXG4gICAgICAgIFwicHJvamVjdHNcIlxuICAgICAgXSxcbiAgICAgICAgcmVxdWlyZXNMb2dpbjogdHJ1ZVxuICAgICAgfVxuICAgIH0pXG4gICAgLnN0YXRlKCdJbWdhZXMuQ3JlYXRlJywge1xuICAgICAgdXJsOiAnL2NyZWF0ZScsXG4gICAgICB0ZW1wbGF0ZVVybDogJy4vc3JjL21vZHVsZXMvUHJvamVjdHMvSW1hZ2VzL0NyZWF0ZS9pbWFnZXMuY3JlYXRlLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ0ltYWdlVGFnc0NvbnRyb2xsZXInLFxuICAgICAgcGFyZW50OiAnSW1hZ2VzJyxcbiAgICAgIGV4Y2x1ZGVGcm9tU2lkZW5hdjogdHJ1ZSxcbiAgICAgIGRhdGE6IHtcblxuICAgICAgfVxuICAgIH0pXG4gICAgLnN0YXRlKCdJbWFnZXMuRGV0YWlscycsIHtcbiAgICAgIHVybDogJy86aWQnLFxuICAgICAgdGVtcGxhdGVVcmw6ICcuL3NyYy9tb2R1bGVzL1Byb2plY3RzL0ltYWdlcy9EZXRhaWxzL2ltYWdlcy5kZXRhaWxzLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ0ltYWdlRGV0YWlsc0NvbnRyb2xsZXInLFxuICAgICAgcGFyZW50OiAnSW1hZ2VzJyxcbiAgICAgIGV4Y2x1ZGVGcm9tU2lkZW5hdjogdHJ1ZSxcbiAgICAgIGRhdGE6IHtcblxuICAgICAgfVxuICAgIH0pO1xuXG59XSk7IiwidmFyIHdvcmtNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYWRtaW4ud29yaycsIFsndWkucm91dGVyJ10pO1xuXG53b3JrTW9kdWxlLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgJHN0YXRlUHJvdmlkZXJcbiAgICAuc3RhdGUoJ1dvcmsgRXhwZXJpZW5jZScsIHtcbiAgICAgIHVybDogJy93b3JrLWV4cGVyaWVuY2UnLFxuICAgICAgdGVtcGxhdGVVcmw6ICcuL3NyYy9tb2R1bGVzL1dvcmtFeHBlcmllbmNlL3dvcmsuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnV29ya0V4cGVyaWVuY2VDb250cm9sbGVyJyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgb3JkZXI6IDEsXG4gICAgICAgIHRhZ3M6IFtcbiAgICAgICAgXCJ3b3JrXCJcbiAgICAgIF0sXG4gICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgIH1cbiAgICB9KVxuICAgIC5zdGF0ZSgnQ29udGFjdHMnLCB7XG4gICAgICB1cmw6ICcvY29udGFjdHMnLFxuICAgICAgdGVtcGxhdGVVcmw6ICcuL3NyYy9tb2R1bGVzL1dvcmtFeHBlcmllbmNlL0NvbnRhY3RzL2NvbnRhY3RzLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ1dvcmtFeHBlcmllbmNlQ29udHJvbGxlcicsXG4gICAgICBzdWJ2aWV3T2Y6ICdXb3JrIEV4cGVyaWVuY2UnLFxuICAgICAgZGF0YToge1xuICAgICAgICBvcmRlcjogMCxcbiAgICAgICAgdGFnczogW1xuICAgICAgICBcImNvbnRhY3RzXCJcbiAgICAgIF0sXG4gICAgICAgIHJlcXVpcmVzTG9naW46IHRydWVcbiAgICAgIH1cbiAgICB9KTtcblxufV0pOyIsImFwcC5kaXJlY3RpdmUoJ2FwcFN1Yk5hdicsIFsnJHN0YXRlJywgZnVuY3Rpb24oJHN0YXRlKXtcbiAgXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICBzY29wZToge1xuICAgICAgaGVhZGVyOiAnQCcsXG4gICAgICBpdGVtVHlwZTogJ0AnLCAvL2llOiBwcm9qZWN0LCBjb250YWN0XG4gICAgICByb3V0ZUl0ZW1zOiAnPScsXG4gICAgICByb3V0ZVZhcmlhYmxlOiAnQCcsXG4gICAgICBjcmVhdGVOZXc6ICdAJyxcbiAgICAgIGRpc3BsYXlQcm9wOiAnQCdcbiAgICB9LFxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgdGVtcGxhdGVVcmw6ICcuL3NyYy9jb21wb25lbnRzL0FwcC5TdWJOYXYvYXBwLnN1Yi5uYXYuaHRtbCcsXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgICAgICBcbiAgICAgIHNjb3BlLmNyZWF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBcbiAgICAgICAgJHN0YXRlLmdvKHNjb3BlLmNyZWF0ZU5ldyk7XG4gICAgICB9XG4gICAgICBcbiAgICB9XG4gIH1cbiAgXG59XSk7IiwiYXBwLmRpcmVjdGl2ZSgnY2hpcEZpZWxkJywgZnVuY3Rpb24gKFRhZ3NBUEkpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuICAgIHJlcGxhY2U6IGZhbHNlLFxuICAgIHNjb3BlOiB7XG4gICAgICBwcmVzZXQ6ICc9JyxcbiAgICAgIG5nTW9kZWw6ICc9J1xuICAgIH0sXG4gICAgdGVtcGxhdGVVcmw6ICcuL3NyYy9jb21wb25lbnRzL0NoaXBzL2NoaXAtZmllbGQuaHRtbCcsXG4gICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuXG4gICAgICB2YXIgdGhpc0ZpZWxkID0gJCgnLmNoaXAtZmllbGQnKTtcblxuICAgICAgdmFyIG9wdGlvbnMgPSBbXTtcbiAgICAgIHZhciBwcmVzZXRzID0gW107XG5cbiAgICAgIHZhciBnZXRBbGxPcHRpb25zID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBUYWdzQVBJLmdldEFsbCgpXG4gICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3Bvc25lKSB7XG4gICAgICAgICAgICBvcHRpb25zID0gcmVzcG9zbmUuZGF0YS5kYXRhO1xuICAgICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICB2YXIgcGFyc2VPcHRpb25zVG9BdXRvY29tcGxldGUgPSBmdW5jdGlvbiAodG9QYXJzZSkge1xuICAgICAgICB2YXIgYXV0b2NvbXBsZXRlID0ge307XG4gICAgICAgIHRvUGFyc2UuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgIHZhciBrZXkgPSBpdGVtLm5hbWU7XG4gICAgICAgICAgYXV0b2NvbXBsZXRlW2tleV0gPSBudWxsO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGF1dG9jb21wbGV0ZTtcbiAgICAgIH1cblxuXG4gICAgICB2YXIgcGFyc2VQcmVzZXRzVG9DaGlwcyA9IGZ1bmN0aW9uICh0b1BhcnNlKSB7XG4gICAgICAgIGlmICghdG9QYXJzZSB8fCAhQXJyYXkuaXNBcnJheSh0b1BhcnNlKSB8fCB0b1BhcnNlLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNoaXBMaXN0ID0gW11cbiAgICAgICAgdG9QYXJzZS5mb3JFYWNoKGZ1bmN0aW9uICh0YWcpIHtcbiAgICAgICAgICB2YXIgY2hpcCA9IHtcbiAgICAgICAgICAgIHRhZzogdGFnLm5hbWUsXG4gICAgICAgICAgICBpZDogdGFnLmlkXG4gICAgICAgICAgfTtcbiAgICAgICAgICBjaGlwTGlzdC5wdXNoKGNoaXApO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGNoaXBMaXN0O1xuICAgICAgfTtcblxuXG4gICAgICB2YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpc0ZpZWxkLm1hdGVyaWFsX2NoaXAoe1xuICAgICAgICAgIGF1dG9jb21wbGV0ZURhdGE6IHBhcnNlT3B0aW9uc1RvQXV0b2NvbXBsZXRlKG9wdGlvbnMpLFxuICAgICAgICAgIGxpbWl0OiAxMCxcbiAgICAgICAgICBkYXRhOiBwYXJzZVByZXNldHNUb0NoaXBzKHNjb3BlLnByZXNldCksXG4gICAgICAgICAgcGxhY2Vob2xkZXI6ICcrVGFnJyxcbiAgICAgICAgICBzZWNvbmRhcnlQbGFjZWhvbGRlcjogJ0VudGVyIGEgVGFnJ1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaW5pdCgpO1xuXG5cbiAgICAgIHNjb3BlLiR3YXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzRmllbGQubWF0ZXJpYWxfY2hpcCgnZGF0YScpO1xuICAgICAgfSwgZnVuY3Rpb24gKG5ld1ZhbCkge1xuICAgICAgICBzY29wZS5uZ01vZGVsID0gbmV3VmFsO1xuICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgIHNjb3BlLiR3YXRjaCgnbmdNb2RlbCcsIGZ1bmN0aW9uIChuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcbiAgICAgICAgaWYgKG5ld1ZhbHVlICE9IG9sZFZhbHVlKSB7XG4gICAgICAgICAgaWYgKCFuZXdWYWx1ZSB8fCBuZXdWYWx1ZS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgdGhpc0ZpZWxkLmVtcHR5KCk7XG4gICAgICAgICAgICBpbml0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIH1cbiAgfVxufSk7IiwiYXBwLmRpcmVjdGl2ZSgnaW1nUGxhY2Vob2xkZXInLCBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0UnLFxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgc2NvcGU6IHtcbiAgICAgIGFkZENsYXNzZXM6ICc9J1xuICAgIH0sXG4gICAgdGVtcGxhdGVVcmw6ICcuL3NyYy9jb21wb25lbnRzL0ltZ1BsYWNlaG9sZGVyL2ltZ1BsYWNlaG9sZGVyLmh0bWwnLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgXG4gICAgfVxuICB9XG59KTsiLCJhcHAuZGlyZWN0aXZlKCdpbWdQcmV2aWV3JywgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHNjb3BlOiB7XG4gICAgICBpbWc6ICc9JyxcbiAgICAgIGFkZENsYXNzZXM6ICdAJyxcbiAgICAgIGluZGV4OiAnPSdcbiAgICB9LFxuICAgIHRlbXBsYXRlVXJsOiAnLi9zcmMvY29tcG9uZW50cy9JbWdQcmV2aWV3L2ltZ1ByZXZpZXcuaHRtbCcsXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICBcbiAgICB9XG4gIH1cbn0pOyIsImFwcC5kaXJlY3RpdmUoJ25ld0ltYWdlJywgZnVuY3Rpb24oKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFJyxcbiAgICByZXBsYWNlOiB0cnVlLFxuICAgIHNjb3BlOiB7XG4gICAgICBuZ01vZGVsOiAnPScsXG4gICAgICBkaXNhYmxlZDogJz0nXG4gICAgfSxcbiAgICB0ZW1wbGF0ZVVybDogJy4vc3JjL2NvbXBvbmVudHMvTmV3SW1hZ2UvbmV3SW1hZ2UuaHRtbCcsXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICBcbiAgICB9XG4gIH1cbn0pOyIsImFwcC5kaXJlY3RpdmUoJ2FwcE5hdicsIGZ1bmN0aW9uICgkc3RhdGUsICRhdXRoLCAkdGltZW91dCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgc2NvcGU6IHt9LFxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgdGVtcGxhdGVVcmw6ICcuL3NyYy9tb2R1bGVzL0FwcC5OYXYvYXBwLm5hdi5odG1sJyxcbiAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG5cbiAgICAgIHNjb3BlLiRhdXRoID0gJGF1dGg7XG5cbiAgICAgICQoJy5idXR0b24tY29sbGFwc2UnKS5zaWRlTmF2KHtcbiAgICAgICAgbWVudVdpZHRoOiAzMDAsIC8vIERlZmF1bHQgaXMgMzAwXG4gICAgICAgIGVkZ2U6ICdsZWZ0JywgLy8gQ2hvb3NlIHRoZSBob3Jpem9udGFsIG9yaWdpblxuICAgICAgICBjbG9zZU9uQ2xpY2s6IGZhbHNlLCAvLyBDbG9zZXMgc2lkZS1uYXYgb24gPGE+IGNsaWNrcywgdXNlZnVsIGZvciBBbmd1bGFyL01ldGVvclxuICAgICAgICBkcmFnZ2FibGU6IHRydWUgLy8gQ2hvb3NlIHdoZXRoZXIgeW91IGNhbiBkcmFnIHRvIG9wZW4gb24gdG91Y2ggc2NyZWVuc1xuICAgICAgfSk7XG5cbiAgICAgIHZhciBjb21wYXJlRnVuYyA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgIGlmICghYS5kYXRhIHx8ICFiLmRhdGEpIHtcbiAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhLmRhdGEub3JkZXIgPCBiLmRhdGEub3JkZXIpIHtcbiAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH0gZWxzZSBpZiAoYS5kYXRhLm9yZGVyID4gYi5kYXRhLm9yZGVyKSB7XG4gICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHZhciBvYmplY3RXaXRoTmFtZSA9IGZ1bmN0aW9uIChsaXN0LCBuYW1lKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciB0aGlzT2JqID0gbGlzdFtpXTtcbiAgICAgICAgICBpZiAodGhpc09iai5uYW1lID09IG5hbWUpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzT2JqO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdmFyIGdldFBhcnNlZFN0YXRlTGlzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGxpc3QgPSBhbmd1bGFyLmNvcHkoJHN0YXRlLmdldCgpKTtcblxuICAgICAgICB2YXIgaSA9IDA7XG4gICAgICAgIHdoaWxlIChpIDwgbGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG5cbiAgICAgICAgICBpZiAoaXRlbS5hYnN0cmFjdCB8fCBpdGVtLmV4Y2x1ZGVGcm9tU2lkZW5hdikge1xuICAgICAgICAgICAgbGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoaXRlbS5zdWJ2aWV3T2YpIHtcblxuICAgICAgICAgICAgdmFyIHBhcmVudCA9IG9iamVjdFdpdGhOYW1lKGxpc3QsIGl0ZW0uc3Vidmlld09mKTtcbiAgICAgICAgICAgIGlmICghcGFyZW50LnN1YnZpZXdzKSB7XG4gICAgICAgICAgICAgIHBhcmVudC5zdWJ2aWV3cyA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGFyZW50LnN1YnZpZXdzLnB1c2goaXRlbSk7XG4gICAgICAgICAgICBsaXN0LnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuXG4gICAgICAgIGxpc3Quc29ydChjb21wYXJlRnVuYyk7XG5cbiAgICAgICAgcmV0dXJuIGxpc3Q7XG4gICAgICB9O1xuXG5cbiAgICAgIHNjb3BlLmxpc3QgPSBnZXRQYXJzZWRTdGF0ZUxpc3QoKTtcblxuXG4gICAgICBzY29wZS5yb290TmF2TGlzdCA9IFtdO1xuICAgICAgc2NvcGUuc3ViTmF2TGlzdCA9IFtdO1xuICAgICAgc2NvcGUubGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIGlmIChpdGVtLnN1YnZpZXdzKSB7XG4gICAgICAgICAgaXRlbS5zdWJ2aWV3cy5zb3J0KGNvbXBhcmVGdW5jKTtcbiAgICAgICAgICBzY29wZS5zdWJOYXZMaXN0LnB1c2goaXRlbSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2NvcGUucm9vdE5hdkxpc3QucHVzaChpdGVtKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cblxuICAgICAgc2NvcGUucm9vdE5hdkxpc3Quc29ydChjb21wYXJlRnVuYyk7XG4gICAgICBzY29wZS5zdWJOYXZMaXN0LnNvcnQoY29tcGFyZUZ1bmMpO1xuXG5cbiAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCgnLmNvbGxhcHNpYmxlJykuY29sbGFwc2libGUoe1xuICAgICAgICAgIGFjY29yZGlvbjogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgIH0sIDIwKTtcblxuICAgIH0sXG4gICAgY29udHJvbGxlcjogZnVuY3Rpb24gKCkge1xuXG4gICAgfVxuICB9XG59KTsiLCJhdXRoTW9kdWxlLmZhY3RvcnkoJ0F1dGhBUEknLCBmdW5jdGlvbiAoJGh0dHAsIGNvbmZpZywgJGF1dGgsICRyb290U2NvcGUpIHtcblxuICB2YXIgZmFjdG9yeSA9IHt9O1xuXG4gIHZhciBiYXNlVXJsID0gY29uZmlnLnVybCArICcvYXV0aCc7XG5cblxuICBmYWN0b3J5LmxvZ2luID0gZnVuY3Rpb24gKGVtYWlsLCBwYXNzd29yZCkge1xuXG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgdXJsOiBiYXNlVXJsICsgJy9sb2dpbicsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIGVtYWlsOiBlbWFpbCxcbiAgICAgICAgcGFzc3dvcmQ6IHBhc3N3b3JkXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmYWN0b3J5LnZhbGlkYXRlVG9rZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHByb20gPSBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAkaHR0cCh7XG4gICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICB1cmw6IGJhc2VVcmwgKyAnL3Rva2VuL3ZhbGlkYXRlJ1xuICAgICAgICB9KVxuICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAvL1RPRE9cbiAgICAgICAgICBpZiAocmVzcG9uc2UuZGF0YS52YWxpZCkge1xuICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCd0b2tlbkhhc0V4cGlyZWQnKTtcbiAgICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgICAgaWYgKGVycm9yLnN0YXR1cyA9PSA0MDMgfHwgZXJyb3Iuc3RhdHVzID09IDQwMSkge1xuICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCd0b2tlbkhhc0V4cGlyZWQnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVqZWN0KGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbTtcbiAgfTtcblxuICBmYWN0b3J5LmxvZ291dCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICAgIHVybDogYmFzZVVybCArICcvbG9nb3V0J1xuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBmYWN0b3J5O1xuXG59KTsiLCJhdXRoTW9kdWxlLmNvbnRyb2xsZXIoJ0xvZ2luQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ0F1dGhBUEknLCAnJGF1dGgnLCAnJHN0YXRlJywgZnVuY3Rpb24gKCRzY29wZSwgQXV0aEFQSSwgJGF1dGgsICRzdGF0ZSkge1xuXG4gICRzY29wZS5lcnJvciA9IHVuZGVmaW5lZDtcbiAgXG4gICRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uICgpIHtcblxuICAgIEF1dGhBUEkubG9naW4oJHNjb3BlLmVtYWlsLCAkc2NvcGUucGFzc3dvcmQpXG4gICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcblxuICAgICAgICBpZiAocmVzcG9uc2UuZGF0YS50b2tlbikge1xuICAgICAgICAgICRhdXRoLnBlcmZvcm1Mb2dpbihyZXNwb25zZS5kYXRhLnRva2VuKTtcbiAgICAgICAgICAkc3RhdGUuZ28oJy8nKTtcbiAgICAgICAgfVxuICAgICAgXG4gICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcblxuICAgICAgICAkc2NvcGUuZXJyb3IgPSBlcnJvci5kYXRhLm1zZztcbiAgICAgIFxuICAgICAgfSk7XG5cbiAgfTtcblxuXG5cbn1dKTsiLCJhdXRoTW9kdWxlLmNvbnRyb2xsZXIoJ0xvZ291dENvbnRyb2xsZXInLCBbJyRzY29wZScsICdBdXRoQVBJJywgJyRhdXRoJywgJyRzdGF0ZScsIGZ1bmN0aW9uICgkc2NvcGUsIEF1dGhBUEksICRhdXRoLCAkc3RhdGUpIHtcblxuICBBdXRoQVBJLmxvZ291dCgpXG4gICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICBpZiAocmVzcG9uc2UuZGF0YS5sb2dvdXQgPT0gXCJzdWNjZXNzXCIpe1xuICAgICAgICAkYXV0aC5sb2dvdXQoKTtcbiAgICAgICAgJHN0YXRlLmdvKCdMb2dpbicpOyBcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc29sZS5lcnJvcihyZXNwb25zZSk7XG4gICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICB9KTtcblxufV0pOyIsImF1dGhNb2R1bGUuc2VydmljZSgnJGF1dGgnLCBmdW5jdGlvbiAoand0SGVscGVyLCAkcSwgJHJvb3RTY29wZSkge1xuXG4gIHZhciBzZWxmID0gdGhpcztcblxuICB2YXIga2V5ID0gJ3BvcnRmb2xpby5hZG1pbi50b2tlbic7XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlIHRoYXQgdXNlciBpcyBhdXRoZW50aWNhdGVkXG4gICAqIEBhdXRob3IgQnJhbmRvbiBHcm9mZlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gdHJ1ZS9mYWxzZVxuICAgKi9cbiAgdGhpcy5pc0F1dGhlbnRpY2F0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy9UT0RPOiA/P1xuICAgIHJldHVybiBzZWxmLmdldFJhd1Rva2VuKCkgPyB0cnVlIDogZmFsc2U7XG4gIH07XG5cbiAgLyoqXG4gICAqIENhbGxlZCBvbiBsb2dpbiwgdXNlZCB0byBzYXZlIHRoZSB0b2tlbiBpZiB2YWxpZFxuICAgKiBAYXV0aG9yIEJyYW5kb24gR3JvZmZcbiAgICogQHBhcmFtICAge3N0cmluZ30gdG9rZW4gdGhlIHJhdyBhdXRob3JpemF0aW9uIHRva2VuXG4gICAqIEByZXR1cm5zIHtib29sZWFufSAgdHJ1ZSBvbiBzdWNjZXNzLCBmYWxzZSBvbiBzdWNjZXNzIGJ1dCBubyBTbGFjayByZWdpc3RyYXRpb24sIG9yIGEgUmVqZWN0ZWQgcHJvbWlzZSB0aGF0IHdpbGwgdHJpZ2dlciBhbiB1bmF1dGhvcml6ZWQgcmVkaXJlY3RcbiAgICovXG4gIHRoaXMucGVyZm9ybUxvZ2luID0gZnVuY3Rpb24gKHRva2VuKSB7XG4gICAgdmFyIGRlY29kZWQgPSBqd3RIZWxwZXIuZGVjb2RlVG9rZW4odG9rZW4pO1xuICAgIGlmIChkZWNvZGVkKSB7XG4gICAgICBzZWxmLnNldFRva2VuKHRva2VuKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJHEucmVqZWN0KCd0b2tlbkhhc0V4cGlyZWQnKTtcbiAgICB9XG4gIH07XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgcmF3IHRva2VuIHN0cmluZyBmcm9tIGxvY2FsU3RvcmFnZSwgb3IgcmVxdWVzdCBvbmUgaWYgbm9uZSBpbiBsb2NhbFN0b3JhZ2VcbiAgICogQGF1dGhvciBCcmFuZG9uIEdyb2ZmXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZSByYXcgdG9rZW4gc3RyaW5nIG9yIHRoZSByZXF1ZXN0IFByb21pc2UgdGhhdCBtYXkgcmVzb2x2ZSB3aXRoIG9uZVxuICAgKi9cbiAgdGhpcy5nZXRSYXdUb2tlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbG9jYWxUb2tlbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XG4gICAgaWYgKGxvY2FsVG9rZW4pIHtcbiAgICAgIHJldHVybiBsb2NhbFRva2VuO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogR2V0IHRoZSBwYXJzZWQgdG9rZW4gb2JqZWN0XG4gICAqIEBhdXRob3IgQnJhbmRvbiBHcm9mZlxuICAgKiBAcmV0dXJucyB7b2JqZWN0fSB0aGUgcGFyc2VkIHRva2VuXG4gICAqL1xuICB0aGlzLmdldFBhcnNlZFRva2VuID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBsb2NhbFRva2VuID0gc2VsZi5nZXRSYXdUb2tlbigpO1xuICAgIGlmIChsb2NhbFRva2VuKSB7XG4gICAgICByZXR1cm4gand0SGVscGVyLmRlY29kZVRva2VuKGxvY2FsVG9rZW4pO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogU2F2ZSB0aGUgUkFXIHRva2VuXG4gICAqIEBhdXRob3IgQnJhbmRvbiBHcm9mZlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG9rZW4gdGhlIFJBVyB0b2tlbiBvYmplY3RcbiAgICovXG4gIHRoaXMuc2V0VG9rZW4gPSBmdW5jdGlvbiAodG9rZW4pIHtcbiAgICB2YXIgZGVjb2RlZCA9IGp3dEhlbHBlci5kZWNvZGVUb2tlbih0b2tlbik7XG4gICAgaWYgKGRlY29kZWQpe1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCB0b2tlbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCdUb2tlbiBFcnJvcjogSW52YWxpZD8nKTtcbiAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgndG9rZW5IYXNFeHBpcmVkJyk7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBDbGVhciB0aGUgdG9rZW4gZnJvbSBsb2NhbFN0b3JhZ2VcbiAgICogQGF1dGhvciBCcmFuZG9uIEdyb2ZmXG4gICAqL1xuICB0aGlzLmNsZWFyTG9jYWxUb2tlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBQZXJmb3JtIGZ1bGwgbG9nb3V0IHByb2Nlc3NcbiAgICogQGF1dGhvciBCcmFuZG9uIEdyb2ZmXG4gICAqL1xuICB0aGlzLmxvZ291dCA9IGZ1bmN0aW9uICgpIHtcbiAgICBzZWxmLmNsZWFyTG9jYWxUb2tlbigpO1xuICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgndG9rZW5IYXNFeHBpcmVkJyk7XG4gIH07XG5cbn0pOyIsImluZm9Nb2R1bGUuY29udHJvbGxlcignSW5mb3JtYXRpb25Db250cm9sbGVyJywgWyckc2NvcGUnLCBmdW5jdGlvbigkc2NvcGUpe1xuICBcbiAgXG4gIFxuICBcbn1dKTsiLCJwcm9qTW9kdWxlLmZhY3RvcnkoJ1Byb2plY3RzQVBJJywgWyckaHR0cCcsICdjb25maWcnLCBmdW5jdGlvbiAoJGh0dHAsIGNvbmZpZykge1xuXG4gIHZhciBmYWN0b3J5ID0ge307XG5cbiAgdmFyIGJhc2VVcmwgPSBjb25maWcudXJsICsgJy9wcm9qZWN0cyc7XG4gIFxuICBmYWN0b3J5LnBhcnNlUHJvamVjdERhdGVzID0gZnVuY3Rpb24ocHJvamVjdCkge1xuICAgIHByb2plY3Quc3RhcnREYXRlID0gbW9tZW50KHByb2plY3Quc3RhcnREYXRlLCBjb25maWcuZGF0ZUZvcm1hdCk7XG4gICAgaWYgKHByb2plY3QuZW5kRGF0ZSAhPSBudWxsKXtcbiAgICAgIHByb2plY3QuZW5kRGF0ZSA9IG1vbWVudChwcm9qZWN0LmVuZERhdGUsIGNvbmZpZy5kYXRlRm9ybWF0KVxuICAgIH1cbiAgICBcbiAgICBwcm9qZWN0Lmxhc3RVcGRhdGVkID0gbW9tZW50KHByb2plY3QubGFzdFVwZGF0ZWQsIGNvbmZpZy5kYXRlVGltZUZvcm1hdCk7XG4gICAgcmV0dXJuIHByb2plY3Q7XG4gIH1cbiAgXG5cbiAgZmFjdG9yeS5nZXRBbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6IGJhc2VVcmxcbiAgICB9KTtcbiAgfTtcblxuICBmYWN0b3J5LmdldEJ5SWQgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogYmFzZVVybCArICcvJyArIGlkXG4gICAgfSk7XG4gIH07XG5cbiAgZmFjdG9yeS5jcmVhdGUgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgIHVybDogYmFzZVVybCxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KTtcbiAgfTtcblxuICBmYWN0b3J5LnRvZ2dsZVZpc2liaWxpdHkgPSBmdW5jdGlvbiAoaWQsIHZpc2libGUgPSBmYWxzZSkge1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdQVVQnLFxuICAgICAgdXJsOiBiYXNlVXJsICsgJy8nICsgaWQgKyAnL3Zpc2liaWxpdHknLFxuICAgICAgZGF0YToge1xuICAgICAgICB2aXNpYmxlOiB2aXNpYmxlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgZmFjdG9yeS51cGRhdGUgPSBmdW5jdGlvbiAoaWQsIGRhdGEpIHtcbiAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgbWV0aG9kOiAnUFVUJyxcbiAgICAgIHVybDogYmFzZVVybCArICcvJyArIGlkLFxuICAgICAgZGF0YTogZGF0YVxuICAgIH0pO1xuICB9O1xuXG4gIGZhY3RvcnkuZGVsZXRlID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0RFTEVURScsXG4gICAgICB1cmw6IGJhc2VVcmwgKyAnLycgKyBpZFxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGZhY3Rvcnk7XG5cbn1dKTsiLCJwcm9qTW9kdWxlLmNvbnRyb2xsZXIoJ1Byb2plY3RzQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ1Byb2plY3RzQVBJJywgJyRzdGF0ZScsIGZ1bmN0aW9uICgkc2NvcGUsIFByb2plY3RzQVBJLCAkc3RhdGUpIHtcblxuXG4gICRzY29wZS5wcm9qZWN0TGlzdCA9IFtdO1xuXG4gIHZhciBsb2FkUHJvamVjdHMgPSBmdW5jdGlvbiAoY2IpIHtcbiAgICBQcm9qZWN0c0FQSS5nZXRBbGwoKVxuICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICRzY29wZS5wcm9qZWN0TGlzdCA9IHJlc3BvbnNlLmRhdGEuZGF0YTtcbiAgICAgICAgaWYgKGNiKSB7XG4gICAgICAgICAgY2IoKTtcbiAgICAgICAgfVxuICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgfSk7XG4gIH1cblxuICB2YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICBsb2FkUHJvamVjdHMoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCRzY29wZS5wcm9qZWN0TGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICRzdGF0ZS5nbygnUHJvamVjdHMuRGV0YWlscycsIHtcbiAgICAgICAgICBpZDogJHNjb3BlLnByb2plY3RMaXN0WzBdLmlkXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgaW5pdCgpO1xuXG4gICRzY29wZS4kb24oJ3Byb2plY3RzLnJlbG9hZCcsIGZ1bmN0aW9uICgpIHtcbiAgICBsb2FkUHJvamVjdHMoKTtcbiAgfSk7XG5cbn1dKTsiLCJ3b3JrTW9kdWxlLmNvbnRyb2xsZXIoJ1dvcmtFeHBlcmllbmNlQ29udHJvbGxlcicsIFsnJHNjb3BlJywgZnVuY3Rpb24oJHNjb3BlKXtcbiAgXG4gIFxuICBcbn1dKTsiLCJpbmZvTW9kdWxlLmNvbnRyb2xsZXIoJ0ludGVyZXN0c0NvbnRyb2xsZXInLCBbJyRzY29wZScsIGZ1bmN0aW9uKCRzY29wZSl7XG4gIFxuICBcbiAgXG59XSk7IiwiaW5mb01vZHVsZS5jb250cm9sbGVyKCdTa2lsbHNDb250cm9sbGVyJywgWyckc2NvcGUnLCBmdW5jdGlvbigkc2NvcGUpe1xuICBcbiAgY29uc29sZS5sb2coJ3NraWxscycpO1xuICBcbn1dKTsiLCJwcm9qTW9kdWxlLmNvbnRyb2xsZXIoJ0NyZWF0ZVByb2plY3RzQ29udHJvbGxlcicsIFsnJHNjb3BlJywgJ1Byb2plY3RzQVBJJywgJ0ltYWdlc0FQSScsICdUYWdzQVBJJywgJyR0aW1lb3V0JywgJyRzdGF0ZScsIGZ1bmN0aW9uICgkc2NvcGUsIFByb2plY3RzQVBJLCBJbWFnZXNBUEksIFRhZ3NBUEksICR0aW1lb3V0LCAkc3RhdGUpIHtcblxuICB2YXIgbG9hZEltYWdlTGlzdCA9IGZ1bmN0aW9uICgpIHtcbiAgICBJbWFnZXNBUEkuZ2V0QWxsKClcbiAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAkc2NvcGUuYWxsSW1hZ2VzTGlzdCA9IHJlc3BvbnNlLmRhdGEuZGF0YTtcbiAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAkKCdzZWxlY3QnKS5tYXRlcmlhbF9zZWxlY3QoKTtcbiAgICAgICAgfSwgNTApO1xuICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgfSk7XG4gIH07XG4gIFxuICAkc2NvcGUuJHdhdGNoKCdhbGxJbWFnZUxpc3QnLCBmdW5jdGlvbihuZXdWYWx1ZSwgb2xkVmFsdWUpe1xuICAgIGlmIChuZXdWYWx1ZSAhPSBvbGRWYWx1ZSAmJiBuZXdWYWx1ZS5sZW5ndGggPiAwKXtcbiAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgJCgnc2VsZWN0JykubWF0ZXJpYWxfc2VsZWN0KCdkZXN0cm95Jyk7XG4gICAgICAgICAgJCgnc2VsZWN0JykubWF0ZXJpYWxfc2VsZWN0KCk7XG4gICAgICAgIH0sIDUwKTtcbiAgICB9XG4gIH0pO1xuXG4gIHZhciBpbml0ID0gZnVuY3Rpb24gKCkge1xuICAgICRzY29wZS5wcm9qZWN0ID0ge307XG4gICAgJHNjb3BlLmFsbEltYWdlc0xpc3QgPSBbXTtcbiAgICAkc2NvcGUuY3JlYXRlSW1hZ2UgPSB7fTtcbiAgICBcblxuLy8gICAgJCgnLmRhdGVwaWNrZXInKS5waWNrYWRhdGUoe1xuLy8gICAgICBzZWxlY3RNb250aHM6IHRydWUsIC8vIENyZWF0ZXMgYSBkcm9wZG93biB0byBjb250cm9sIG1vbnRoXG4vLyAgICAgIHNlbGVjdFllYXJzOiAxNSAvLyBDcmVhdGVzIGEgZHJvcGRvd24gb2YgMTUgeWVhcnMgdG8gY29udHJvbCB5ZWFyLFxuLy8gICAgfSk7XG5cbiAgICAkc2NvcGUucHJvamVjdCA9IHt9O1xuICAgICRzY29wZS5wcm9qZWN0LmVuZEN1cnJlbnQgPSB0cnVlO1xuXG4gICAgbG9hZEltYWdlTGlzdCgpO1xuICB9XG5cbiAgaW5pdCgpO1xuXG5cbiAgJHNjb3BlLmFkZEltYWdlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghJHNjb3BlLnByb2plY3QuaW1hZ2VzKSB7XG4gICAgICAkc2NvcGUucHJvamVjdC5pbWFnZXMgPSBbXTtcbiAgICB9XG4gICAgJHNjb3BlLnByb2plY3QuaW1hZ2VzLnB1c2goYW5ndWxhci5jb3B5KCRzY29wZS5jcmVhdGVJbWFnZSkpO1xuICAgICRzY29wZS5jcmVhdGVJbWFnZSA9IHt9O1xuICB9O1xuXG4gICRzY29wZS5yZXNldFByb2plY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGNvbmZpcm0oXCJBcmUgeW91IHN1cmU/XCIpKSB7XG4gICAgICAkc2NvcGUucHJvamVjdCA9IHtcbiAgICAgICAgdGl0bGU6IHVuZGVmaW5lZCxcbiAgICAgICAgc3RhdHVzOiB1bmRlZmluZWQsXG4gICAgICAgIHN0YXJ0RGF0ZTogdW5kZWZpbmVkLFxuICAgICAgICBlbmREYXRlOiB1bmRlZmluZWQsXG4gICAgICAgIGVuZEN1cnJlbnQ6IHRydWUsXG4gICAgICAgIGxpbmtUZXh0OiB1bmRlZmluZWQsXG4gICAgICAgIGxpbmtMb2NhdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICBsaW5rSW1hZ2U6IHt9LFxuICAgICAgICBsaW5rSW1hZ2VJZDogdW5kZWZpbmVkLFxuICAgICAgICBpbWFnZTogW10sXG4gICAgICAgIHRhZ3M6IFtdLFxuICAgICAgICBkZXNjcmlwdGlvbjogdW5kZWZpbmVkXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gICRzY29wZS5jcmVhdGVQcm9qZWN0ID0gZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIHNlbmREYXRhID0gYW5ndWxhci5jb3B5KCRzY29wZS5wcm9qZWN0KTtcbiAgICBcbiAgICBzZW5kRGF0YS50YWdzID0gVGFnc0FQSS5wYXJzZUZvclNlbmRpbmcoc2VuZERhdGEudGFncyk7XG4gICAgaWYgKHNlbmREYXRhLmVuZEN1cnJlbnQpIHtcbiAgICAgIHNlbmREYXRhLmVuZERhdGUgPSBudWxsO1xuICAgICAgZGVsZXRlIHNlbmREYXRhLmVuZEN1cnJlbnQ7XG4gICAgfVxuICAgIGlmIChzZW5kRGF0YS5saW5rSW1hZ2VJZCkge1xuICAgICAgc2VuZERhdGEubGlua0ltYWdlLmlkID0gc2VuZERhdGEubGlua0ltYWdlSWQ7XG4gICAgICBkZWxldGUgc2VuZERhdGEubGlua0ltYWdlSWQ7XG4gICAgfVxuXG4gICAgUHJvamVjdHNBUEkuY3JlYXRlKHNlbmREYXRhKVxuICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIHZhciBjcmVhdGVkID0gcmVzcG9uc2UuZGF0YS5kYXRhO1xuICAgICAgICAkc2NvcGUuJGVtaXQoJ3Byb2plY3RzLnJlbG9hZCcpO1xuICAgICAgICAkc3RhdGUuZ28oJ1Byb2plY3RzLkRldGFpbHMnLCB7aWQ6IGNyZWF0ZWQuaWR9KTtcbiAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgIH0pO1xuXG4gIH07XG5cblxufV0pOyIsInByb2pNb2R1bGUuZmFjdG9yeSgnSW1hZ2VzQVBJJywgWyckaHR0cCcsICdjb25maWcnLCBmdW5jdGlvbiAoJGh0dHAsIGNvbmZpZykge1xuXG4gIHZhciBmYWN0b3J5ID0ge307XG5cbiAgdmFyIGJhc2VVcmwgPSBjb25maWcudXJsICsgJy9wcm9qZWN0cy9pbWFnZXMnO1xuXG4gIGZhY3RvcnkuZ2V0QWxsID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAkaHR0cCh7XG4gICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgdXJsOiBiYXNlVXJsXG4gICAgfSk7XG4gIH07XG5cbi8vICBmYWN0b3J5LmdldEJ5SWQgPSBmdW5jdGlvbiAoaWQpIHtcbi8vICAgIHJldHVybiAkaHR0cCh7XG4vLyAgICAgIG1ldGhvZDogJ0dFVCcsXG4vLyAgICAgIHVybDogYmFzZVVybCArICcvaWQnXG4vLyAgICB9KTtcbi8vICB9O1xuLy9cbi8vICBmYWN0b3J5LmNyZWF0ZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4vLyAgICByZXR1cm4gJGh0dHAoe1xuLy8gICAgICBtZXRob2Q6ICdQT1NUJyxcbi8vICAgICAgdXJsOiBiYXNlVXJsLFxuLy8gICAgICBkYXRhOiB7XG4vLyAgICAgICAgXG4vLyAgICAgIH1cbi8vICAgIH0pO1xuLy8gIH1cblxuICByZXR1cm4gZmFjdG9yeTtcblxufV0pOyIsInByb2pNb2R1bGUuY29udHJvbGxlcignSW1hZ2VzQ29udHJvbGxlcicsIFsnJHNjb3BlJywgZnVuY3Rpb24oJHNjb3BlKXtcbiAgXG4gIFxuICBcbiAgXG59XSk7IiwicHJvak1vZHVsZS5jb250cm9sbGVyKCdQcm9qZWN0RGV0YWlsc0NvbnRyb2xsZXInLCBbJyRzY29wZScsICckc3RhdGVQYXJhbXMnLCAnUHJvamVjdHNBUEknLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGVQYXJhbXMsIFByb2plY3RzQVBJKSB7XG5cbiAgJHNjb3BlLnByb2plY3QgPSB7fTtcbiAgJHNjb3BlLnVwZGF0aW5nID0gZmFsc2U7XG5cbiAgdmFyIGluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgJHNjb3BlLnVwZGF0aW5nID0gdHJ1ZTtcbiAgICBQcm9qZWN0c0FQSS5nZXRCeUlkKCRzdGF0ZVBhcmFtcy5pZClcbiAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAkc2NvcGUucHJvamVjdCA9IGFuZ3VsYXIuY29weShyZXNwb25zZS5kYXRhLmRhdGEpO1xuICAgICAgICAkc2NvcGUucHJvamVjdCA9IFByb2plY3RzQVBJLnBhcnNlUHJvamVjdERhdGVzKCRzY29wZS5wcm9qZWN0KTtcbiAgICAgICAgJHNjb3BlLnNob3dQcm9qZWN0T25MaXZlID0gISRzY29wZS5wcm9qZWN0LmhpZGRlbjtcbiAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgIH0pLmZpbmFsbHkoZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2NvcGUudXBkYXRpbmcgPSBmYWxzZTtcbiAgICAgIH0pO1xuXG5cbiAgfVxuXG4gIGluaXQoKTtcblxuICB2YXIgdXBkYXRlVmlzaWJsaXR5ID0gZnVuY3Rpb24gKHZpc2libGUpIHtcbiAgICAkc2NvcGUudXBkYXRpbmcgPSB0cnVlO1xuICAgIFByb2plY3RzQVBJLnRvZ2dsZVZpc2liaWxpdHkoJHNjb3BlLnByb2plY3QuaWQsIHZpc2libGUpXG4gICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgJHNjb3BlLnByb2plY3QgPSBhbmd1bGFyLmNvcHkocmVzcG9uc2UuZGF0YS5kYXRhKTtcbiAgICAgICAgJHNjb3BlLnByb2plY3QgPSBQcm9qZWN0c0FQSS5wYXJzZVByb2plY3REYXRlcygkc2NvcGUucHJvamVjdCk7XG4gICAgICAgICRzY29wZS5zaG93UHJvamVjdE9uTGl2ZSA9ICEkc2NvcGUucHJvamVjdC5oaWRkZW47XG4gICAgICB9KS5jYXRjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICB9KS5maW5hbGx5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJHNjb3BlLnVwZGF0aW5nID0gZmFsc2U7XG4gICAgICB9KTtcbiAgfTtcblxuICAkc2NvcGUuJHdhdGNoKCdzaG93UHJvamVjdE9uTGl2ZScsIGZ1bmN0aW9uIChuZXdWYWwsIG9sZFZhbCkge1xuICAgIGlmIChuZXdWYWwgIT09IG9sZFZhbCAmJiBvbGRWYWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdXBkYXRlVmlzaWJsaXR5KG5ld1ZhbCk7XG4gICAgfVxuICB9KTtcblxufV0pOyIsInByb2pNb2R1bGUuZmFjdG9yeSgnVGFnc0FQSScsIFsnJGh0dHAnLCAnY29uZmlnJywgZnVuY3Rpb24gKCRodHRwLCBjb25maWcpIHtcblxuICB2YXIgZmFjdG9yeSA9IHt9O1xuXG4gIHZhciBiYXNlVXJsID0gY29uZmlnLnVybCArICcvcHJvamVjdHMvdGFncyc7XG4gIFxuICBmYWN0b3J5LnBhcnNlRm9yU2VuZGluZyA9IGZ1bmN0aW9uKG1hdGVyaWFsaXplVGFncykge1xuICAgIHZhciBwYXJzZWQgPSBbXTtcbiAgICBtYXRlcmlhbGl6ZVRhZ3MuZm9yRWFjaChmdW5jdGlvbih0YWcpe1xuICAgICAgdmFyIHRlbXAgPSB7fTtcbiAgICAgIGlmICh0YWcuaGFzT3duUHJvcGVydHkoJ2lkJykpe1xuICAgICAgICB0ZW1wLmlkID0gdGFnLmlkO1xuICAgICAgfVxuICAgICAgdGVtcC5uYW1lID0gdGFnLnRhZztcbiAgICAgIHBhcnNlZC5wdXNoKHRlbXApO1xuICAgIH0pO1xuICAgIHJldHVybiBwYXJzZWQ7XG4gIH07XG5cbiAgZmFjdG9yeS5nZXRBbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICRodHRwKHtcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICB1cmw6IGJhc2VVcmxcbiAgICB9KTtcbiAgfTtcblxuLy8gIGZhY3RvcnkuZ2V0QnlJZCA9IGZ1bmN0aW9uIChpZCkge1xuLy8gICAgcmV0dXJuICRodHRwKHtcbi8vICAgICAgbWV0aG9kOiAnR0VUJyxcbi8vICAgICAgdXJsOiBiYXNlVXJsICsgJy9pZCdcbi8vICAgIH0pO1xuLy8gIH07XG4vL1xuLy8gIGZhY3RvcnkuY3JlYXRlID0gZnVuY3Rpb24gKGRhdGEpIHtcbi8vICAgIHJldHVybiAkaHR0cCh7XG4vLyAgICAgIG1ldGhvZDogJ1BPU1QnLFxuLy8gICAgICB1cmw6IGJhc2VVcmwsXG4vLyAgICAgIGRhdGE6IHtcbi8vICAgICAgICBcbi8vICAgICAgfVxuLy8gICAgfSk7XG4vLyAgfVxuXG4gIHJldHVybiBmYWN0b3J5O1xuXG59XSk7IiwicHJvak1vZHVsZS5jb250cm9sbGVyKCdUYWdzQ29udHJvbGxlcicsIFsnJHNjb3BlJywgZnVuY3Rpb24oJHNjb3BlKXtcbiAgXG4gIFxuICBcbiAgXG59XSk7Iiwid29ya01vZHVsZS5jb250cm9sbGVyKCdDb250YWN0c0NvbnRyb2xsZXInLCBbJyRzY29wZScsIGZ1bmN0aW9uKCRzY29wZSl7XG4gIFxuICBcbiAgXG59XSk7IiwicHJvak1vZHVsZS5jb250cm9sbGVyKCdDcmVhdGVJbWFnZXNDb250cm9sbGVyJywgWyckc2NvcGUnLCBmdW5jdGlvbigkc2NvcGUpe1xuICBcbiAgXG4gIFxufV0pOyIsInByb2pNb2R1bGUuY29udHJvbGxlcignSW1hZ2VEZXRhaWxzQ29udHJvbGxlcicsIFsnJHNjb3BlJywgZnVuY3Rpb24oJHNjb3BlKXtcbiAgXG4gIFxuICBcbn1dKTsiLCJwcm9qTW9kdWxlLmNvbnRyb2xsZXIoJ1Byb2plY3REZXRhaWxzRWRpdENvbnRyb2xsZXInLCBbJyRzY29wZScsICckc3RhdGVQYXJhbXMnLCAnUHJvamVjdHNBUEknLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGVQYXJhbXMsIFByb2plY3RzQVBJKSB7XG5cbiAgY29uc29sZS5sb2coJ0VkaXRpbmcnKTtcbiAgXG4gICRzY29wZS5wcm9qZWN0ID0ge307XG4gICRzY29wZS5vcmlnaW5hbCA9IHt9O1xuXG4gIHZhciBpbml0ID0gZnVuY3Rpb24gKCkge1xuICAgIFxuICAgIFByb2plY3RzQVBJLmdldEJ5SWQoJHN0YXRlUGFyYW1zLmlkKVxuICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICRzY29wZS5wcm9qZWN0ID0gcmVzcG9uc2UuZGF0YS5kYXRhO1xuICAgICAgICAkc2NvcGUucHJvamVjdCA9IFByb2plY3RzQVBJLnBhcnNlUHJvamVjdERhdGVzKCRzY29wZS5wcm9qZWN0KTtcbiAgICAgICAgJHNjb3BlLnByb2plY3Quc3RhcnREYXRlID0gJHNjb3BlLnByb2plY3Quc3RhcnREYXRlLnRvRGF0ZSgpO1xuICAgICAgICAkc2NvcGUub3JpZ2luYWwgPSBhbmd1bGFyLmNvcHkoJHNjb3BlLnByb2plY3QpO1xuICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUub3JpZ2luYWwpO1xuICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgfSk7XG4gICAgXG4gICAgXG4gIH1cbiAgXG4gIGluaXQoKTtcblxuXG59XSk7IiwicHJvak1vZHVsZS5jb250cm9sbGVyKCdDcmVhdGVUYWdzQ29udHJvbGxlcicsIFsnJHNjb3BlJywgZnVuY3Rpb24oJHNjb3BlKXtcbiAgXG4gIFxuICBcbiAgXG59XSk7IiwicHJvak1vZHVsZS5jb250cm9sbGVyKCdUYWdEZXRhaWxzQ29udHJvbGxlcicsIFsnJHNjb3BlJywgZnVuY3Rpb24oJHNjb3BlKXtcbiAgXG4gIFxuICBcbiAgXG59XSk7Il19
