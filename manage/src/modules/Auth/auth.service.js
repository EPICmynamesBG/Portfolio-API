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