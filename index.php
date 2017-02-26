<?php

if (PHP_SAPI == 'cli-server') {
    // To help the built-in PHP dev server, check if the request was actually for
    // something which should probably be served as a static file
    $url  = parse_url($_SERVER['REQUEST_URI']);
    $file = __DIR__ . $url['path'];
    if (is_file($file)) {
        return false;
    }
}

/**
 * @SWG\Swagger(
 *   schemes={"http"},
 *   host="localhost:8888",
 *   basePath="/api/v1",
 *   consumes={"application/json"},
 *   produces={"application/json"},
 *   @SWG\Info(
 *     title="Portfolio.API",
 *     description="A CMS for my personal portfolio",
 *     version="1.0.0",
 *     @SWG\Contact(name="Brandon Groff", email="mynamesbg@gmail.com"),
 * 	   @SWG\License(name="MIT", url="https://opensource.org/licenses/MIT")
 *   )
 * )
 *
 */

require __DIR__ . '/vendor/autoload.php';
require __DIR__ . '/src/config/config.php';
require __DIR__ . '/src/config/db.php';

if ($CONFIG['debug']){
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
  header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
  
  ini_set('display_errors', 1);
  ini_set('display_startup_errors', 1);
  error_reporting(E_ALL);
}

date_default_timezone_set("America/New_York");

session_start();

// Instantiate the app
$settings = require __DIR__ . '/src/settings.php';

$app = new \Slim\App($settings);

require __DIR__ . '/src/util/util.php';
require __DIR__ . '/src/util/jwt.php';

// Set up dependencies
require __DIR__ . '/src/dependencies.php';

// Register middleware
require __DIR__ . '/src/middleware.php';

// Register routes
require __DIR__ . '/src/routes.php';

// Run app
$app->run();
