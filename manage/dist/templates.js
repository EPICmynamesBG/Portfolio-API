angular.module('admin.templates', []).run(['$templateCache', function($templateCache) {$templateCache.put('./src/components/App.SubNav/app.sub.nav.html','<aside id="app-sub-nav">\n  <nav class="blue-grey lighten-4 z-depth-2">\n    <header>\n      <h3>{{header}}</h3>\n    </header>\n    <main>\n      <ul>\n        <li class="bold" ng-repeat="item in routeItems" ui-sref-active="active-nav">\n          <a ui-sref="{{itemType}}.details({id: item.id})" class="waves-effect">{{item[routeVariable]}}</a>\n        </li>\n      </ul>\n    </main>\n    <footer>\n      <div>\n        <div>\n          <button class="btn green lighten-2 waves-effect waves-light" type="button" ng-click="create()">Create\n          </button>\n        </div>\n      </div>\n    </footer>\n  </nav>\n</aside>');
$templateCache.put('./src/modules/App.Nav/app.nav.html','<nav class="blue-grey lighten-3">\n  <header>\n    <h1>Portfolio Admin</h1>\n    <summary>Administrative management for brandongroff.com</summary>\n    <div class="row" ng-if="$auth.isAuthenticated()">\n      <div class="col s12">\n        <a class="logout" ui-sref="Logout">Logout</a>\n      </div>\n    </div>\n  </header>\n  <main>\n    <ul ng-if="$auth.isAuthenticated()">\n      <li class="bold" ng-repeat="item in rootNavList" ui-sref-active="active-nav" ng-if="!item.subviews">\n        <a ui-sref="{{item.name}}" class="waves-effect">{{item.name}}</a>\n      </li>\n      <li class="no-padding">\n        <ul class="collapsible">\n          <li class="bold" ng-repeat="item in subNavList" ui-sref-active="active-nav">\n            <a class="collapsible-header waves-effect waves" ui-sref="{{item.name}}" >{{item.name}}</a>\n            <div class="collapsible-body blue-grey lighten-3">\n              <ul>\n                <li class="subnav-item"  ng-repeat="subview in item.subviews" ui-sref-active="active-nav">\n                  <a ui-sref="{{subview.name}}" class="waves-effect waves">{{subview.name}}</a>\n                </li>\n              </ul>\n            </div>\n          </li>\n        </ul>\n      </li>\n    </ul>\n  </main>\n  <footer class="page-footer blue-grey">\n    <div class="footer-copyright">\n      <div class="container">\n        \xA9 2017 Copyright <a href="http://brandongroff.com" target="_blank">Brandon Groff</a>\n      </div>\n    </div>\n  </footer>\n</nav>');
$templateCache.put('./src/modules/Auth/auth.login.html','<div class="login blue-grey lighten-4 z-depth-2">\n  <section class="section login-header">\n    <div class="row">\n      <div class="col s11 offset-s1">\n        <h2>Login</h2>\n      </div>\n    </div>\n  </section>\n  <div class="divider"></div>\n  <section class="section">\n    <form name="auth">\n      <div class="row">\n        <div class="col s12 input-field">\n          <input type="email" name="email" ng-model="email" required />\n          <label for="email">Email</label>\n        </div>\n      </div>\n      <div class="row">\n        <div class="col s12 input-field">\n          <input type="password" name="password" ng-model="password" required />\n          <label for="password">Password</label>\n        </div>\n      </div>\n    </form>\n  </section>\n  <div class="divider"></div>\n  <section class="section">\n    <div class="row">\n      <div class="col s9">\n        <span class="error red-text">{{error}}</span>\n      </div>\n      <div class="col s3">\n        <button form="auth" type="submit" class="btn waves-effect waves btn-flat green lighten-2" ng-disabled="auth.$invalid" ng-click="login()">Login</button>\n      </div>\n    </div>\n  </section>\n</div>');
$templateCache.put('./src/modules/Auth/auth.logout.html','<section>\n  Logging out...\n</section>');
$templateCache.put('./src/modules/Information/info.html','<div>\n Info\n  <div ui-view></div>\n</div>');
$templateCache.put('./src/modules/Projects/projects.html','<app-sub-nav header="Projects" item-type="project" route-items="projectList" route-variable="id" create-new="Projects.Create"></app-sub-nav>\n<article>\n  <div class="sub-body" ui-view></div>\n</article>');
$templateCache.put('./src/modules/WorkExperience/work.html','work');
$templateCache.put('./src/modules/Information/Interests/interests.html','interests');
$templateCache.put('./src/modules/Information/Skills/skills.html','Skills');
$templateCache.put('./src/modules/Projects/Create/projects.create.html','<h5>Create</h5>');
$templateCache.put('./src/modules/Projects/Details/projects.details.html','');
$templateCache.put('./src/modules/Projects/Images/images.html','images');
$templateCache.put('./src/modules/Projects/Tags/tags.html','tags');
$templateCache.put('./src/modules/WorkExperience/Contacts/contacts.html','');
$templateCache.put('./src/modules/Projects/Images/Create/images.create.html','');
$templateCache.put('./src/modules/Projects/Images/Details/images.details.html','');
$templateCache.put('./src/modules/Projects/Tags/Create/tags.create.html','');
$templateCache.put('./src/modules/Projects/Tags/Details/tags.details.html','');}]);