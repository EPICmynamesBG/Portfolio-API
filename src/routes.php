<?php
// Routes

//Simple redirects
$app->get('/docs', function($request, $response, $args) {
  return $response->withStatus(302)->withHeader("Location", "/docs/index.html");
});

$app->get('/manage', function($request, $response, $args) {
  return $response->withStatus(302)->withHeader("Location", "/manage/index.html");
});

$app->group('/api/v1', function() use ($app){
  
  
  $app->get('/swagger', function($request, $response, $args) {
    $swagger = \Swagger\scan(['./index.php', './src']);
    $response->getBody()->write(json_encode($swagger));
    return $response;
  });
  
  $app->get('/docs', function($request, $response, $args) {
    return $response->withStatus(302)->withHeader("Location", "/docs/index.html");
  });
  
  
  require "./src/routes/Auth.php";
  require "./src/routes/Information.php";
  
});

/** 
 * @SWG\Parameter(
 * 	    name="id",
 *      in="path",
 *      description="an object ID number",
 * 		  required=true,
 *		  type="integer",
 *      default="1"
 * 	 )
*/
