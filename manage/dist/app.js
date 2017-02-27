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
      ]
      }
    })
    .state('Interests', {
      url: '/interests',
      templateUrl: './src/modules/Information/Interests/interests.html',
      controller: 'InterestsController',
      parent: 'Information',
      data: {
        order: 0
      }
    })
    .state('Skills', {
      url: '/skills',
      templateUrl: './src/modules/Information/Skills/skills.html',
      controller: 'SkillsController',
      parent: 'Information',
      data: {
        order: 1
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
      ]
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
      ]
      }
    });

}]);
app.directive('appNav', function ($state) {
  return {
    restrict: 'E',
    scope: {},
    replace: true,
    templateUrl: './src/modules/App.Nav/app.nav.html',
    link: function (scope, element, attrs) {

      $('.button-collapse').sideNav({
        menuWidth: 300, // Default is 300
        edge: 'left', // Choose the horizontal origin
        closeOnClick: false, // Closes side-nav on <a> clicks, useful for Angular/Meteor
        draggable: true // Choose whether you can drag to open on touch screens
      });
      
      $('.collapsible').collapsible({
        accordion: true,
        onClick: function() {
          console.log('hello');
        }
      });

      var objectWithName = function (list, name) {
        for (var i = 0; i < list.length; i++) {
          var thisObj = list[i];
          if (thisObj.name == name){
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
          
          if (item.abstract) {
            list.splice(i, 1);
            continue;
          }
          
          if (item.parent) {
            var parent = objectWithName(list, item.parent);
            if (!parent.subviews) {
              parent.subviews = [];
            }
            parent.subviews.push(item);
            list.splice(i, 1);
            continue;
          }
          
          i++;
        }
        
        
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
        }

        list.sort(compareFunc);

        return list;
      };


      scope.list = getParsedStateList();
      
      
      scope.rootNavList = [];
      scope.subNavList = [];
      scope.list.forEach(function(item){
        if (item.subviews) {
          scope.subNavList.push(item);
        } else {
          scope.rootNavList.push(item);
        }
      });
      
    },
    controller: function () {

    }
  }
});
infoModule.controller('InformationController', ['$scope', function($scope){
  
  
  
  
}]);
workModule.controller('WorkExperienceController', ['$scope', function($scope){
  
  
  
}]);
projModule.controller('ProjectsController', ['$scope', function($scope){
  
  
  
  
}]);
infoModule.controller('InterestsController', ['$scope', function($scope){
  
  
  
}]);
infoModule.controller('SkillsController', ['$scope', function($scope){
  
  console.log('skills');
  
}]);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIm1vZHVsZXMvSW5mb3JtYXRpb24vaW5mby5tb2R1bGUuanMiLCJtb2R1bGVzL1dvcmtFeHBlcmllbmNlL3dvcmsubW9kdWxlLmpzIiwibW9kdWxlcy9Qcm9qZWN0cy9wcm9qZWN0cy5tb2R1bGUuanMiLCJtb2R1bGVzL0FwcC5OYXYvYXBwLm5hdi5qcyIsIm1vZHVsZXMvSW5mb3JtYXRpb24vaW5mby5jb250cm9sbGVyLmpzIiwibW9kdWxlcy9Xb3JrRXhwZXJpZW5jZS93b3JrLmNvbnRyb2xsZXIuanMiLCJtb2R1bGVzL1Byb2plY3RzL3Byb2plY3RzLmNvbnRyb2xsZXIuanMiLCJtb2R1bGVzL0luZm9ybWF0aW9uL0ludGVyZXN0cy9pbnRlcmVzdHMuY29udHJvbGxlci5qcyIsIm1vZHVsZXMvSW5mb3JtYXRpb24vU2tpbGxzL3NraWxscy5jb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhZG1pbicsIFsndWkucm91dGVyJywgJ2FkbWluLnRlbXBsYXRlcycsICdhZG1pbi5pbmZvJywgJ2FkbWluLndvcmsnLCAnYWRtaW4ucHJvamVjdHMnXSk7XG5cbmFwcC5ydW4oWyckcm9vdFNjb3BlJywgJyRzdGF0ZScsICckdGltZW91dCcsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc3RhdGUsICR0aW1lb3V0KSB7XG5cbiAgJHJvb3RTY29wZS4kc3RhdGUgPSAkc3RhdGU7XG4gICRyb290U2NvcGUubG9hZGluZyA9IGZhbHNlO1xuICAkcm9vdFNjb3BlLm1vZGFsRGF0YSA9IHt9O1xuXG4gICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uIChldnQsIHRvLCBwYXJhbXMpIHtcbiAgICBpZiAodG8ucmVkaXJlY3RUbykge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAkc3RhdGUuZ28odG8ucmVkaXJlY3RUbywgcGFyYW1zLCB7XG4gICAgICAgIGxvY2F0aW9uOiAncmVwbGFjZSdcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG59XSk7XG5cblxuLyogLS0tIFJvdXRpbmcgLS0tICovXG5cbmFwcC5jb25maWcoWyckdXJsUm91dGVyUHJvdmlkZXInLCAnJGxvY2F0aW9uUHJvdmlkZXInLCBmdW5jdGlvbiAoJHVybFJvdXRlclByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcikge1xuXG4gICRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh7XG4gICAgZW5hYmxlZDogdHJ1ZSxcbiAgICByZXF1aXJlQmFzZTogdHJ1ZVxuICB9KTtcblxuICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKFwiL2luZm9ybWF0aW9uXCIpO1xuXG59XSk7IiwidmFyIGluZm9Nb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYWRtaW4uaW5mbycsIFsndWkucm91dGVyJ10pO1xuXG5pbmZvTW9kdWxlLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgJHN0YXRlUHJvdmlkZXJcbiAgICAuc3RhdGUoJ0luZm9ybWF0aW9uJywge1xuICAgICAgdXJsOiAnL2luZm9ybWF0aW9uJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnLi9zcmMvbW9kdWxlcy9JbmZvcm1hdGlvbi9pbmZvLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ0luZm9ybWF0aW9uQ29udHJvbGxlcicsXG4gICAgICByZWRpcmVjdFRvOiAnSW50ZXJlc3RzJyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgb3JkZXI6IDAsXG4gICAgICAgIHRhZ3M6IFtcbiAgICAgICAgXCJpbmZvXCIsXG4gICAgICAgIFwiaW5mb3JtYXRpb25cIlxuICAgICAgXVxuICAgICAgfVxuICAgIH0pXG4gICAgLnN0YXRlKCdJbnRlcmVzdHMnLCB7XG4gICAgICB1cmw6ICcvaW50ZXJlc3RzJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnLi9zcmMvbW9kdWxlcy9JbmZvcm1hdGlvbi9JbnRlcmVzdHMvaW50ZXJlc3RzLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ0ludGVyZXN0c0NvbnRyb2xsZXInLFxuICAgICAgcGFyZW50OiAnSW5mb3JtYXRpb24nLFxuICAgICAgZGF0YToge1xuICAgICAgICBvcmRlcjogMFxuICAgICAgfVxuICAgIH0pXG4gICAgLnN0YXRlKCdTa2lsbHMnLCB7XG4gICAgICB1cmw6ICcvc2tpbGxzJyxcbiAgICAgIHRlbXBsYXRlVXJsOiAnLi9zcmMvbW9kdWxlcy9JbmZvcm1hdGlvbi9Ta2lsbHMvc2tpbGxzLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ1NraWxsc0NvbnRyb2xsZXInLFxuICAgICAgcGFyZW50OiAnSW5mb3JtYXRpb24nLFxuICAgICAgZGF0YToge1xuICAgICAgICBvcmRlcjogMVxuICAgICAgfVxuICAgIH0pO1xuXG59XSk7IiwidmFyIHdvcmtNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnYWRtaW4ud29yaycsIFsndWkucm91dGVyJ10pO1xuXG53b3JrTW9kdWxlLmNvbmZpZyhbJyRzdGF0ZVByb3ZpZGVyJywgZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG5cbiAgJHN0YXRlUHJvdmlkZXJcbiAgICAuc3RhdGUoJ1dvcmsgRXhwZXJpZW5jZScsIHtcbiAgICAgIHVybDogJy93b3JrLWV4cGVyaWVuY2UnLFxuICAgICAgdGVtcGxhdGVVcmw6ICcuL3NyYy9tb2R1bGVzL1dvcmtFeHBlcmllbmNlL3dvcmsuaHRtbCcsXG4gICAgICBjb250cm9sbGVyOiAnV29ya0V4cGVyaWVuY2VDb250cm9sbGVyJyxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgb3JkZXI6IDEsXG4gICAgICAgIHRhZ3M6IFtcbiAgICAgICAgXCJ3b3JrXCJcbiAgICAgIF1cbiAgICAgIH1cbiAgICB9KTtcblxufV0pOyIsInZhciBwcm9qTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ2FkbWluLnByb2plY3RzJywgWyd1aS5yb3V0ZXInXSk7XG5cbnByb2pNb2R1bGUuY29uZmlnKFsnJHN0YXRlUHJvdmlkZXInLCBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcblxuICAkc3RhdGVQcm92aWRlclxuICAgIC5zdGF0ZSgnUHJvamVjdHMnLCB7XG4gICAgICB1cmw6ICcvcHJvamVjdHMnLFxuICAgICAgdGVtcGxhdGVVcmw6ICcuL3NyYy9tb2R1bGVzL1Byb2plY3RzL3Byb2plY3RzLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ1Byb2plY3RzQ29udHJvbGxlcicsXG4gICAgICBkYXRhOiB7XG4gICAgICAgIG9yZGVyOiAyLFxuICAgICAgICB0YWdzOiBbXG4gICAgICAgIFwicHJvamVjdHNcIlxuICAgICAgXVxuICAgICAgfVxuICAgIH0pO1xuXG59XSk7IiwiYXBwLmRpcmVjdGl2ZSgnYXBwTmF2JywgZnVuY3Rpb24gKCRzdGF0ZSkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRScsXG4gICAgc2NvcGU6IHt9LFxuICAgIHJlcGxhY2U6IHRydWUsXG4gICAgdGVtcGxhdGVVcmw6ICcuL3NyYy9tb2R1bGVzL0FwcC5OYXYvYXBwLm5hdi5odG1sJyxcbiAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW1lbnQsIGF0dHJzKSB7XG5cbiAgICAgICQoJy5idXR0b24tY29sbGFwc2UnKS5zaWRlTmF2KHtcbiAgICAgICAgbWVudVdpZHRoOiAzMDAsIC8vIERlZmF1bHQgaXMgMzAwXG4gICAgICAgIGVkZ2U6ICdsZWZ0JywgLy8gQ2hvb3NlIHRoZSBob3Jpem9udGFsIG9yaWdpblxuICAgICAgICBjbG9zZU9uQ2xpY2s6IGZhbHNlLCAvLyBDbG9zZXMgc2lkZS1uYXYgb24gPGE+IGNsaWNrcywgdXNlZnVsIGZvciBBbmd1bGFyL01ldGVvclxuICAgICAgICBkcmFnZ2FibGU6IHRydWUgLy8gQ2hvb3NlIHdoZXRoZXIgeW91IGNhbiBkcmFnIHRvIG9wZW4gb24gdG91Y2ggc2NyZWVuc1xuICAgICAgfSk7XG4gICAgICBcbiAgICAgICQoJy5jb2xsYXBzaWJsZScpLmNvbGxhcHNpYmxlKHtcbiAgICAgICAgYWNjb3JkaW9uOiB0cnVlLFxuICAgICAgICBvbkNsaWNrOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnaGVsbG8nKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHZhciBvYmplY3RXaXRoTmFtZSA9IGZ1bmN0aW9uIChsaXN0LCBuYW1lKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciB0aGlzT2JqID0gbGlzdFtpXTtcbiAgICAgICAgICBpZiAodGhpc09iai5uYW1lID09IG5hbWUpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXNPYmo7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICB2YXIgZ2V0UGFyc2VkU3RhdGVMaXN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbGlzdCA9IGFuZ3VsYXIuY29weSgkc3RhdGUuZ2V0KCkpO1xuICAgICAgICBcbiAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICB3aGlsZSAoaSA8IGxpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgICAgICAgIFxuICAgICAgICAgIGlmIChpdGVtLmFic3RyYWN0KSB7XG4gICAgICAgICAgICBsaXN0LnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBcbiAgICAgICAgICBpZiAoaXRlbS5wYXJlbnQpIHtcbiAgICAgICAgICAgIHZhciBwYXJlbnQgPSBvYmplY3RXaXRoTmFtZShsaXN0LCBpdGVtLnBhcmVudCk7XG4gICAgICAgICAgICBpZiAoIXBhcmVudC5zdWJ2aWV3cykge1xuICAgICAgICAgICAgICBwYXJlbnQuc3Vidmlld3MgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBhcmVudC5zdWJ2aWV3cy5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgbGlzdC5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgXG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgdmFyIGNvbXBhcmVGdW5jID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICBpZiAoIWEuZGF0YSB8fCAhYi5kYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoYS5kYXRhLm9yZGVyIDwgYi5kYXRhLm9yZGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgfSBlbHNlIGlmIChhLmRhdGEub3JkZXIgPiBiLmRhdGEub3JkZXIpIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsaXN0LnNvcnQoY29tcGFyZUZ1bmMpO1xuXG4gICAgICAgIHJldHVybiBsaXN0O1xuICAgICAgfTtcblxuXG4gICAgICBzY29wZS5saXN0ID0gZ2V0UGFyc2VkU3RhdGVMaXN0KCk7XG4gICAgICBcbiAgICAgIFxuICAgICAgc2NvcGUucm9vdE5hdkxpc3QgPSBbXTtcbiAgICAgIHNjb3BlLnN1Yk5hdkxpc3QgPSBbXTtcbiAgICAgIHNjb3BlLmxpc3QuZm9yRWFjaChmdW5jdGlvbihpdGVtKXtcbiAgICAgICAgaWYgKGl0ZW0uc3Vidmlld3MpIHtcbiAgICAgICAgICBzY29wZS5zdWJOYXZMaXN0LnB1c2goaXRlbSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2NvcGUucm9vdE5hdkxpc3QucHVzaChpdGVtKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBcbiAgICB9LFxuICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgpIHtcblxuICAgIH1cbiAgfVxufSk7IiwiaW5mb01vZHVsZS5jb250cm9sbGVyKCdJbmZvcm1hdGlvbkNvbnRyb2xsZXInLCBbJyRzY29wZScsIGZ1bmN0aW9uKCRzY29wZSl7XG4gIFxuICBcbiAgXG4gIFxufV0pOyIsIndvcmtNb2R1bGUuY29udHJvbGxlcignV29ya0V4cGVyaWVuY2VDb250cm9sbGVyJywgWyckc2NvcGUnLCBmdW5jdGlvbigkc2NvcGUpe1xuICBcbiAgXG4gIFxufV0pOyIsInByb2pNb2R1bGUuY29udHJvbGxlcignUHJvamVjdHNDb250cm9sbGVyJywgWyckc2NvcGUnLCBmdW5jdGlvbigkc2NvcGUpe1xuICBcbiAgXG4gIFxuICBcbn1dKTsiLCJpbmZvTW9kdWxlLmNvbnRyb2xsZXIoJ0ludGVyZXN0c0NvbnRyb2xsZXInLCBbJyRzY29wZScsIGZ1bmN0aW9uKCRzY29wZSl7XG4gIFxuICBcbiAgXG59XSk7IiwiaW5mb01vZHVsZS5jb250cm9sbGVyKCdTa2lsbHNDb250cm9sbGVyJywgWyckc2NvcGUnLCBmdW5jdGlvbigkc2NvcGUpe1xuICBcbiAgY29uc29sZS5sb2coJ3NraWxscycpO1xuICBcbn1dKTsiXX0=
