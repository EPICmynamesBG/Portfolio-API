<?php

require_once "./src/model/Admin.php";
require_once "./src/model/Auth.php";

$app->group('/auth', function() use ($app){
  
  global $validateAdmin;
  
  
  /**
      * @SWG\Post(
      *     path="/auth/login",
      *     summary="Login",
      *     description="Login",
      *     tags={"Auth"},
      *     @SWG\Parameter(
      *       name="LoginBody",
      *       in="body",
      *       required=true,
      *       @SWG\Schema(
      *         type="object",
      *         required={"email","password"},
      *         @SWG\Property(property="email", type="string", example="admin@example.com"),
      *         @SWG\Property(property="password", type="string")
      *       )
      *     ),
      *     @SWG\Response(
      *         response=200,
      *         description="Success",
      *         @SWG\Schema(
      *             type="object",
      *             required={"token"},
      *             @SWG\Property(property="token", type="boolean", description="A JWT session token")
      *         )
      *     ),
      *     @SWG\Response(
      *         response=403,
      *         description="Unauthorized",
      *         @SWG\Schema(
      *             ref="#/definitions/Unauthorized"
      *         )
      *     ),
      *     @SWG\Response(
      *         response="default",
      *         description="Error",
      *         @SWG\Schema(
      *             ref="#/definitions/Error"
      *         )
      *     )
      * )
      */
  $app->post('/login', function($request, $response, $args){
    
    $body = $request->getParsedBody();
    $admin = Admin::login($body['email'], $body['password']);
    
    $output = ['token'=> $admin->token];
    
    return $response->getBody()->write(json_encode($output));
  });
  
  
  /**
      * @SWG\Delete(
      *     path="/auth/logout",
      *     summary="Logout",
      *     description="`User only.` Logout.",
      *     tags={"Auth"},
      *     @SWG\Parameter(ref="#/parameters/AuthHeader"),
      *     @SWG\Response(
      *         response=200,
      *         description="Success",
      *         @SWG\Schema(
      *             type="object",
      *             required={"logout"},
      *             @SWG\Property(property="logout", type="string", default="success")
      *         )
      *     ),
      *     @SWG\Response(
      *         response=403,
      *         description="Unauthorized",
      *         @SWG\Schema(
      *             ref="#/definitions/Unauthorized"
      *         )
      *     ),
      *     @SWG\Response(
      *         response="default",
      *         description="Error",
      *         @SWG\Schema(
      *             ref="#/definitions/Error"
      *         )
      *     )
      * )
      */
  $app->delete('/logout', function($request, $response, $args){
    
    $admin = $request->getAttribute('admin');
    
    $output = $admin->logout();
    return $response->getBody()->write(json_encode($output));
    
  })->add($validateAdmin);
  
  $app->group('/token', function() use ($app) {
    
    global $validateAdmin;
    
    
    /**
      * @SWG\Get(
      *     path="/auth/token/validate",
      *     summary="Validate Token",
      *     description="`User only.` Validate a User token is still good.",
      *     tags={"Auth"},
      *     @SWG\Parameter(ref="#/parameters/AuthHeader"),
      *     @SWG\Response(
      *         response=200,
      *         description="Success",
      *         @SWG\Schema(
      *             type="object",
      *             required={"valid"},
      *             @SWG\Property(property="valid", type="boolean", description="Valid will only be false if the token is past its expiration date. Otherwise an invalid token will get a 403 error.")
      *         )
      *     ),
      *     @SWG\Response(
      *         response=403,
      *         description="Unauthorized",
      *         @SWG\Schema(
      *             ref="#/definitions/Unauthorized"
      *         )
      *     ),
      *     @SWG\Response(
      *         response="default",
      *         description="Error",
      *         @SWG\Schema(
      *             ref="#/definitions/Error"
      *         )
      *     )
      * )
      */
    $app->get('/validate', function($request, $response, $args) {
      
      $output = ['valid' => true];
      return $response->getBody()->write(json_encode($output));
      
    })->add($validateAdmin);
    
  });
  
//  $app->post('/hash.password', function($request, $response, $args) {
//    
//    $body = $request->getParsedBody();
//    $hashed = Auth::generateHash($body['password']);
//    
//    $output = [
//      'password' => $body['password'],
//      'hashed' => $hashed
//    ];
//    return $response->getBody()->write(json_encode($output));
//  });
  
});