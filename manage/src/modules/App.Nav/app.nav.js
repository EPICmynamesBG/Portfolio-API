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