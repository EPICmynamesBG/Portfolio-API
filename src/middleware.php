<?php
// Application middleware

// e.g: $app->add(new \Slim\Csrf\Guard);

$app->add(function($request, $response, $next) {
    $response = $response->withHeader('Content-Type', 'application/json');
    return $next($request, $response);
});

/**
 * @SWG\Parameter(
 *      parameter="AuthHeader",
 * 	    name="Authorization",
 *      in="header",
 *      description="Permission Authorization",
 * 		  required=true,
 *		  type="string",
 *      default="Bearer {token}"
 * 	 )
 */

/**
 * @SWG\Definition(
 *    definition="Unauthorized",
 *    type="object",
 * 		required={"status", "error", "msg"},
 *		@SWG\Property(property="status", type="int", default="403"),
 *		@SWG\Property(property="error", type="bool", default="true"),
 *		@SWG\Property(property="msg", type="string", default="Access Denied")
 * 	 )
 */
$validateAdmin = function($request, $response, $next) {
  
  $admin = JWT::validateJWTForAdmin($request);
  if (!isset($admin)){
    throw new Exception("Access Denied", 403);
  }
  //save the user to the request for the route
  $request = $request->withAttribute('admin', $admin);
  
  $response = $next($request, $response);
  
  return $response;
  
};