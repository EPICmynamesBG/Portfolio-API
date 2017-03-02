angular.module('admin.templates', []).run(['$templateCache', function($templateCache) {$templateCache.put('./src/components/App.SubNav/app.sub.nav.html','<aside id="app-sub-nav">\n  <nav class="blue-grey lighten-4 z-depth-2">\n    <header>\n      <h3>{{header}}</h3>\n    </header>\n    <main>\n      <ul>\n        <li class="bold" ng-repeat="item in routeItems" ui-sref-active="active-nav">\n          <a ui-sref="{{itemType}}.Details({id: item[routeVariable]})" class="waves-effect">{{item[displayProp]}}</a>\n        </li>\n      </ul>\n    </main>\n    <footer>\n      <div>\n        <div>\n          <button class="btn green lighten-2 waves-effect waves-light" type="button" ng-click="create()">Create\n          </button>\n        </div>\n      </div>\n    </footer>\n  </nav>\n</aside>');
$templateCache.put('./src/components/Chips/chip-field.html','<div class="chips chip-field">\n  \n</div>');
$templateCache.put('./src/components/ImgPlaceholder/imgPlaceholder.html','<figure class="img-preview" ng-class="addClasses">\n  <span class="img-title">No Image(s)</span>\n  <img ng-src="http://placehold.it/150x150" alt="Placeholder Image" />\n  <figcaption>a placeholder image</figcaption>\n</figure>');
$templateCache.put('./src/components/ImgPreview/imgPreview.html','<figure class="img-preview {{addClasses}}">\n  <span class="img-title">{{img.name}}</span>\n  <img ng-src="{{img.url}}" alt="{{img.alt}}" />\n  <figcaption><span ng-if="index != undefined || img.orderNum != undefined">{{img.orderNum != undefined ? img.orderNum:index}}: </span>{{img.label}}</figcaption>\n</figure>');
$templateCache.put('./src/components/NewImage/newImage.html','<div class="row">\n  <div class="col s12 input-field">\n    <input placeholder="name" id="link-image-name" name="link-image-name" ng-model="ngModel.name" type="text" class="validate" ng-disabled="disabled" />\n    <label for="link-image-name">Image Name</label>\n  </div>\n  <div class="col s12 input-field">\n    <input placeholder="url" id="link-image-url" name="link-image-url" ng-model="ngModel.url" type="url" class="validate" ng-disabled="disabled" />\n    <label for="link-image-url">Image Url (absolute)</label>\n  </div>\n  <div class="col s12 input-field">\n    <input placeholder="label" id="link-image-label" name="link-image-label" ng-model="ngModel.label" type="text" class="validate" ng-disabled="disabled" />\n    <label for="link-image-label">Image Label/Caption</label>\n  </div>\n  <div class="col s12 input-field">\n    <input placeholder="alt" id="link-image-alt" name="link-image-alt" ng-model="ngModel.alt" type="text" class="validate" ng-disabled="disabled" />\n    <label for="link-image-alt">Image Alt Description</label>\n  </div>\n  <div class="col s12">\n    <h6>Live Preview</h6>\n    <img-preview img="ngModel"></img-preview>\n  </div>\n</div>');
$templateCache.put('./src/modules/App.Nav/app.nav.html','<nav class="blue-grey lighten-3">\n  <header>\n    <h1>Portfolio Admin</h1>\n    <summary>Administrative management for brandongroff.com</summary>\n    <div class="row" ng-if="$auth.isAuthenticated()">\n      <div class="col s12">\n        <a class="logout" ui-sref="Logout">Logout</a>\n      </div>\n    </div>\n  </header>\n  <main>\n    <ul ng-if="$auth.isAuthenticated()">\n      <li class="bold" ng-repeat="item in rootNavList" ui-sref-active="active-nav" ng-if="!item.subviews">\n        <a ui-sref="{{item.name}}" class="waves-effect">{{item.name}}</a>\n      </li>\n      <li class="no-padding">\n        <ul class="collapsible">\n          <li class="bold" ng-repeat="item in subNavList" ui-sref-active="active-nav">\n            <a class="collapsible-header waves-effect waves" ui-sref="{{item.name}}" >{{item.name}}</a>\n            <div class="collapsible-body blue-grey lighten-3">\n              <ul>\n                <li class="subnav-item"  ng-repeat="subview in item.subviews" ui-sref-active="active-nav">\n                  <a ui-sref="{{subview.name}}" class="waves-effect waves">{{subview.name}}</a>\n                </li>\n              </ul>\n            </div>\n          </li>\n        </ul>\n      </li>\n    </ul>\n  </main>\n  <footer class="page-footer blue-grey">\n    <div class="footer-copyright">\n      <div class="container">\n        \xA9 2017 Copyright <a href="http://brandongroff.com" target="_blank">Brandon Groff</a>\n      </div>\n    </div>\n  </footer>\n</nav>');
$templateCache.put('./src/modules/Auth/auth.login.html','<div class="login blue-grey lighten-4 z-depth-2">\n  <section class="section login-header">\n    <div class="row">\n      <div class="col s11 offset-s1">\n        <h2>Login</h2>\n      </div>\n    </div>\n  </section>\n  <div class="divider"></div>\n  <section class="section">\n    <form name="auth">\n      <div class="row">\n        <div class="col s12 input-field">\n          <input type="email" name="email" ng-model="email" required />\n          <label for="email">Email</label>\n        </div>\n      </div>\n      <div class="row">\n        <div class="col s12 input-field">\n          <input type="password" name="password" ng-model="password" required />\n          <label for="password">Password</label>\n        </div>\n      </div>\n    </form>\n  </section>\n  <div class="divider"></div>\n  <section class="section">\n    <div class="row">\n      <div class="col s9">\n        <span class="error red-text">{{error}}</span>\n      </div>\n      <div class="col s3">\n        <button form="auth" type="submit" class="btn waves-effect waves btn-flat green lighten-2" ng-disabled="auth.$invalid" ng-click="login()">Login</button>\n      </div>\n    </div>\n  </section>\n</div>');
$templateCache.put('./src/modules/Auth/auth.logout.html','<section>\n  Logging out...\n</section>');
$templateCache.put('./src/modules/Information/info.html','<div>\n Info\n  <div ui-view></div>\n</div>');
$templateCache.put('./src/modules/Projects/projects.html','<app-sub-nav header="Projects" item-type="Projects" route-items="projectList" route-variable="id" display-prop="title" create-new="Projects.Create"></app-sub-nav>\n<article>\n  <div class="sub-body" ui-view></div>\n</article>');
$templateCache.put('./src/modules/WorkExperience/work.html','work');
$templateCache.put('./src/modules/Information/Interests/interests.html','interests');
$templateCache.put('./src/modules/Information/Skills/skills.html','Skills');
$templateCache.put('./src/modules/Projects/Create/projects.create.html','<form name="projectCreateForm">\n  <div class="row">\n    <div class="col s12">\n      <h4>Create a Project</h4>\n      <div class="divider"></div>\n    </div>\n  </div>\n  <div class="row">\n    <div class="input-field col s12 m6">\n      <input placeholder="Title" id="title" name="title" ng-model="project.title" type="text" required class="validate" />\n      <label for="title">Title</label>\n    </div>\n    <div class="input-field col s12 m6">\n      <input placeholder="completed" id="status" name="status" ng-model="project.status" type="text" class="validate" />\n      <label for="status">Project Status</label>\n    </div>\n  </div>\n  <div class="row">\n    <div class="input-field col s12">\n      <h5>Date Range</h5>\n      <div class="divider"></div>\n    </div>\n    <div class="input-field col s12 m4">\n      <input placeholder="MM/DD/YYYY" id="start-date" name="start-date" ng-model="project.startDate" type="date" class="validate datepicker" required />\n      <label for="start-date" class="active">Start Date</label>\n    </div>\n    <div class="input-field col s12 m4">\n      <input ng-value="true" id="current-work" name="current-work" ng-model="project.endCurrent" type="checkbox" class="validate" checked />\n      <label for="current-work">Currently Working</label>\n    </div>\n    <div class="input-field col s12 m4">\n      <input placeholder="MM/DD/YYYY" id="end-date" name="end-date" ng-model="project.endDate" type="date" class="validate datepicker" ng-disabled="project.endCurrent" />\n      <label for="end-date" class="active">End Date</label>\n    </div>\n  </div>\n  <div class="row">\n    <div class="col s12">\n      <h5>Linking</h5>\n      <div class="divider"></div>\n    </div>\n    <div class="row">\n      <div class="input-field col s11 m6 offset-s1">\n        <input placeholder="Text" id="link-text" name="link-text" ng-model="project.linkText" type="text" class="validate" />\n        <label for="link-text">Link Text</label>\n      </div>\n    </div>\n    <div class="row">\n      <div class="input-field col s11 m6 offset-s1">\n        <input placeholder="url" id="link-text" name="link-location" ng-model="project.linkLocation" type="url" class="validate" />\n        <label for="link-location">Link Location (href)</label>\n      </div>\n    </div>\n    <div class="row">\n      <h6>Link Image</h6>\n      <div class="input-field col s12 m6">\n        <select ng-model="project.linkImageId" ng-disabled="allImagesList.length == 0 || project.linkImage.url" class="icons">\n          <option value=\'\' disabled selected>Choose your option</option>\n          <option value="{{option.id}}" ng-repeat="option in allImagesList" data-icon="{{option.url}}" class="circle">{{option.name}}: {{option.label}}</option>\n        </select>\n        <label>Use Existing Image</label>\n      </div>\n      <div class="input-field col s12 m6">\n        <div class="row">\n          <div class="col s12">\n            <p><b>New Image</b></p>\n          </div>\n        </div>\n        <new-image ng-model="project.linkImage" disabled="project.linkImageId"></new-image>\n      </div>\n    </div>\n  </div>\n  <div class="row">\n    <div class="input-field col s12">\n      <h5>Carousel Images</h5>\n    </div>\n    <div class="col s12 input-field">\n      <div class="divider"></div>\n      <div class="row img-grid">\n        <img-preview img="image" add-classes="flex-item" index="$index" ng-repeat="image in project.images"></img-preview>\n        <img-placeholder add-classes="flex-item" ng-if="!project.images || project.images.length == 0"></img-placeholder>\n      </div>\n      <div class="divider"></div>\n    </div>\n    <div class="input-field col s12 m6">\n      <div class="row">\n        <div class="col s12">\n          <p><b>Add Image</b></p>\n        </div>\n      </div>\n      <new-image ng-model="createImage" disabled="false"></new-image>\n      <div class="row">\n        <div class="col s6">\n          <button type="button" class="btn waves-effect waves green lighten-3" ng-click="addImage()">Add</button>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class="input-field col s12">\n    <h5>Tags</h5>\n    <div class="divider"></div>\n  </div>\n  <div class="row">\n    <div class="col s12 m8" chip-field ng-model="project.tags">\n    </div>\n  </div>\n  <div class="input-field col s12">\n    <h5>Description</h5>\n    <div class="divider"></div>\n  </div>\n  <div class="row">\n    <div class="col s12">\n      <div class="row">\n        <h6>Show Live Preview</h6>\n        <div class="switch" ng-init="showPreview = false">\n          <label>\n            Off\n            <input type="checkbox" ng-value="true" ng-model="showPreview">\n            <span class="lever"></span> On\n          </label>\n        </div>\n      </div>\n      <textarea froala ng-model="project.description" required></textarea>\n    </div>\n  </div>\n  <div class="row" ng-if="showPreview">\n    <div class="col s12">\n      <div froala-view="project.description"></div>\n    </div>\n  </div>\n  <br />\n  <div class="row">\n    <div class="col s6">\n      <button class="btn btn-large waves-effect waves-light red left" type="reset" name="action" ng-click="resetProject()">Reset\n        <i class="material-icons right">clear</i>\n      </button>\n    </div>\n    <div class="col s6">\n      <button class="btn btn-large waves-effect waves-light light-blue right" type="submit" name="action" ng-click="createProject()" ng-disabled="projectCreateForm.$invalid">Submit\n        <i class="material-icons right">send</i>\n      </button>\n    </div>\n  </div>\n</form>');
$templateCache.put('./src/modules/Projects/Details/projects.details.html','<form name="projectDetailsForm">\n  <a class="btn btn-floating circle waves-effect waves fixed top right" title="Edit" ui-sref="Projects.Edit({id: project.id})"><i class="material-icons left">edit</i></a>\n  <div class="row">\n    <div class="col s7">\n      <h4>{{project.title}}</h4>\n      <h6>Last Updated: <i>{{project.lastUpdated.toDate() | date:\'short\'}}</i></h6>\n    </div>\n    <div class="col s5">\n      Live Site Visibility\n      <div class="switch">\n        <label>\n          Hidden\n          <input type="checkbox" ng-value="true" ng-model="showProjectOnLive" ng-disabled="updating" />\n          <span class="lever"></span> Visible\n        </label>\n      </div>\n    </div>\n  </div>\n  <div class="row">\n    <div class="col s12 m6">\n      <p>Status: <i>{{project.status}}</i></p>\n    </div>\n    <div class="col s12 m6">\n      Date Range: {{project.startDate.toDate() | date:\'MMM yyyy\'}} - {{project.endDate != null ? (project.endDate.toDate() | date:\'MMM yyyy\') : \'Current\'}}\n    </div>\n  </div>\n  <div class="row">\n    <div class="col s12">\n      <h5>Link</h5>\n    </div>\n    <div class="col s11 m6 offset-s1 offset-m1">\n      <a href="{{project.linkLocation}}">{{project.linkText}} <img class="flex-item circle" ng-src="{{project.linkImage.url}}" alt="{{project.linkImage.alt}}" /></a>\n    </div>\n  </div>\n  <div class="row">\n    <div class="col s12">\n      <h5>Carousel Images</h5>\n    </div>\n    <div class="col s12">\n      <div class="divider"></div>\n      <div class="row img-grid">\n        <img-preview img="image" add-classes="flex-item" index="$index" ng-repeat="image in project.images"></img-preview>\n        <img-placeholder add-classes="flex-item" ng-if="!project.images || project.images.length == 0"></img-placeholder>\n      </div>\n      <div class="divider"></div>\n    </div>\n  </div>\n  <div class="input-field col s12">\n    <h5>Tags</h5>\n  </div>\n  <div class="row">\n    <div class="col s12">\n      <div class="chip" ng-repeat="tag in project.tags">\n        <i ng-if="tag.mdiIcon" class="mdi mdi-{{tag.mdiIcon}}"></i> {{tag.name}}\n      </div>\n    </div>\n  </div>\n  <div class="input-field col s12">\n    <h5>Description</h5>\n    <div class="divider"></div>\n  </div>\n  <div class="row">\n    <div class="col s12">\n      <div froala-view="project.description"></div>\n    </div>\n  </div>\n</form>');
$templateCache.put('./src/modules/Projects/Images/images.html','images');
$templateCache.put('./src/modules/Projects/Tags/tags.html','tags');
$templateCache.put('./src/modules/WorkExperience/Contacts/contacts.html','');
$templateCache.put('./src/modules/Projects/Details/Edit/projects.details.edit.html','<form name="projectDetailsForm">\n  <div class="row">\n    <div class="col s7">\n      <h4>Edit {{original.title}}</h4>\n      <h6>Last Updated: <i>{{project.lastUpdated.toDate() | date:\'short\'}}</i></h6>\n    </div>\n    <div class="col s5">\n      Live Site Visibility\n      <div class="switch">\n        <label>\n          Hidden\n          <input type="checkbox" ng-value="true" ng-model="project.hidden" ng-disabled="updating" />\n          <span class="lever"></span> Visible\n        </label>\n      </div>\n    </div>\n    <div class="divider"></div>\n  </div>\n  <div class="row">\n    <div class="input-field col s12 m6">\n      <input placeholder="Title" id="title" name="title" ng-model="project.title" type="text" required class="validate" />\n      <label for="title">Title</label>\n    </div>\n    <div class="input-field col s12 m6">\n      <input placeholder="completed" id="status" name="status" ng-model="project.status" type="text" class="validate" />\n      <label for="status">Project Status</label>\n    </div>\n  </div>\n  <div class="row">\n    <div class="input-field col s12">\n      <h5>Date Range</h5>\n      <div class="divider"></div>\n    </div>\n    <div class="input-field col s12 m4">\n      <input placeholder="MM/DD/YYYY" id="start-date" name="start-date" ng-model="project.startDate" type="date" class="validate datepicker" required />\n      <label for="start-date" class="active">Start Date</label>\n    </div>\n    <div class="input-field col s12 m4">\n      <input ng-value="true" id="current-work" name="current-work" ng-model="project.endCurrent" type="checkbox" class="validate" checked />\n      <label for="current-work">Currently Working</label>\n    </div>\n    <div class="input-field col s12 m4">\n      <input placeholder="MM/DD/YYYY" id="end-date" name="end-date" ng-model="project.endDate" type="date" class="validate datepicker" ng-disabled="project.endCurrent" />\n      <label for="end-date" class="active">End Date</label>\n    </div>\n  </div>\n  <div class="row">\n    <div class="col s12">\n      <h5>Linking</h5>\n      <div class="divider"></div>\n    </div>\n    <div class="row">\n      <div class="input-field col s11 m6 offset-s1">\n        <input placeholder="Text" id="link-text" name="link-text" ng-model="project.linkText" type="text" class="validate" />\n        <label for="link-text">Link Text</label>\n      </div>\n    </div>\n    <div class="row">\n      <div class="input-field col s11 m6 offset-s1">\n        <input placeholder="url" id="link-text" name="link-location" ng-model="project.linkLocation" type="url" class="validate" />\n        <label for="link-location">Link Location (href)</label>\n      </div>\n    </div>\n    <div class="row">\n      <h6>Link Image</h6>\n      <div class="input-field col s12 m6">\n        <select ng-model="project.linkImageId" ng-disabled="allImagesList.length == 0 || project.linkImage.url" class="icons">\n          <option value=\'\' disabled selected>Choose your option</option>\n          <option value="{{option.id}}" ng-repeat="option in allImagesList" data-icon="{{option.url}}" class="circle">{{option.name}}: {{option.label}}</option>\n        </select>\n        <label>Use Existing Image</label>\n      </div>\n      <div class="input-field col s12 m6">\n        <div class="row">\n          <div class="col s12">\n            <p><b>New Image</b></p>\n          </div>\n        </div>\n        <new-image ng-model="project.linkImage" disabled="project.linkImageId"></new-image>\n      </div>\n    </div>\n  </div>\n  <div class="row">\n    <div class="input-field col s12">\n      <h5>Carousel Images</h5>\n    </div>\n    <div class="col s12 input-field">\n      <div class="divider"></div>\n      <div class="row img-grid">\n        <img-preview img="image" add-classes="flex-item" index="$index" ng-repeat="image in project.images"></img-preview>\n        <img-placeholder add-classes="flex-item" ng-if="!project.images || project.images.length == 0"></img-placeholder>\n      </div>\n      <div class="divider"></div>\n    </div>\n    <div class="input-field col s12 m6">\n      <div class="row">\n        <div class="col s12">\n          <p><b>Add Image</b></p>\n        </div>\n      </div>\n      <new-image ng-model="createImage" disabled="false"></new-image>\n      <div class="row">\n        <div class="col s6">\n          <button type="button" class="btn waves-effect waves green lighten-3" ng-click="addImage()">Add</button>\n        </div>\n      </div>\n    </div>\n  </div>\n  <div class="input-field col s12">\n    <h5>Tags</h5>\n    <div class="divider"></div>\n  </div>\n  <div class="row">\n    <div class="col s12 m8" chip-field ng-model="project.tags">\n    </div>\n  </div>\n  <div class="input-field col s12">\n    <h5>Description</h5>\n    <div class="divider"></div>\n  </div>\n  <div class="row">\n    <div class="col s12">\n      <div class="row">\n        <h6>Show Live Preview</h6>\n        <div class="switch" ng-init="showPreview = false">\n          <label>\n            Off\n            <input type="checkbox" ng-value="true" ng-model="showPreview">\n            <span class="lever"></span> On\n          </label>\n        </div>\n      </div>\n      <textarea froala ng-model="project.description" required></textarea>\n    </div>\n  </div>\n  <div class="row" ng-if="showPreview">\n    <div class="col s12">\n      <div froala-view="project.description"></div>\n    </div>\n  </div>\n  <br />\n  <div class="row">\n    <div class="col s4">\n      <button class="btn btn-large waves-effect waves-light red left" type="button" name="delete" ng-click="delete()">Delete\n        <i class="material-icons right">clear</i>\n      </button>\n    </div>\n    <div class="col s4">\n      <button class="btn btn-large waves-effect waves-light amber" type="reset" name="reset" ng-click="resetChanges()">Reset Changes\n        <i class="material-icons right">clear</i>\n      </button>\n    </div>\n    <div class="col s4">\n      <button class="btn btn-large waves-effect waves-light orange right" type="submit" name="action" ng-click="updateProject()" ng-disabled="projectDetailsForm.$invalid">Update\n        <i class="material-icons right">send</i>\n      </button>\n    </div>\n  </div>\n</form>');
$templateCache.put('./src/modules/Projects/Images/Details/images.details.html','');
$templateCache.put('./src/modules/Projects/Images/Create/images.create.html','');
$templateCache.put('./src/modules/Projects/Tags/Create/tags.create.html','');
$templateCache.put('./src/modules/Projects/Tags/Details/tags.details.html','');}]);