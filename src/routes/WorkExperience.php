<?php

require_once './src/model/WorkExperience/WorkExperience.php';

$app->group('/work.experience', function() use ($app){
  
  global $validateAdmin;
  
  /**
    * @SWG\Get(
    *     path="/work.experience",
    *     summary="Get All",
    *     description="Get all work experience that is not hidden. If `Admin` auth token provided, gets all.",
    *     tags={"Work Experience"},
    *     @SWG\Response(
    *         response=200,
    *         description="Success",
    *         @SWG\Schema(
    *             type="object",
    *             required={"data"},
    *             @SWG\Property(property="data", type="array", 
    *               @SWG\Items(
    *                 ref="#/definitions/WorkExperience"
    *               )
    *             )
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
  $app->get('', function($request, $response, $args){
    try {
      $admin = JWT::validateJWTForAdmin($request);
    } catch (Exception $e) {
      //this is fine
    }
    
    if (isset($admin)) {
      $experience = WorkExperience::getAll();
    } else {
      $experience = WorkExperience::getAllVisible();
    }
    
    $output = ['data' => $experience];
    return $response->getBody()->write(json_encode($output));
  });
  
  
  /**
    * @SWG\Post(
    *     path="/work.experience",
    *     summary="Create",
    *     description="`Admin`. Create a Work Experience.",
    *     tags={"Work Experience"},
    *     @SWG\Parameter(ref="#/parameters/AuthHeader"),
    *     @SWG\Parameter(
    *       name="WorkExperienceCreateBody",
    *       in="body",
    *       required=true,
    *       @SWG\Schema(
    *         ref="#/definitions/WorkExperience"
    *       )
    *     ),
    *     @SWG\Response(
    *         response=200,
    *         description="Success",
    *         @SWG\Schema(
    *             type="object",
    *             required={"created", "data"},
    *             @SWG\Property(property="created", type="boolean", default=true),
    *             @SWG\Property(property="data", ref="#/definitions/WorkExperience")
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
  $app->post('', function($request, $response, $args){
    $body = $request->getParsedBody();
    $workExp = WorkExperience::create($body);
    $output = ['created' => true, 'data' => $workExp];
    return $response->getBody()->write(json_encode($output));
  })->add($validateAdmin);
  
  
  require_once __DIR__ . '/WorkExperience/Contacts.php';
  
  
  $app->group('/{id}', function() use ($app){
    
    global $validateAdmin;
    
    /**
      * @SWG\Get(
      *     path="/work.experience/{id}",
      *     summary="Get by Id",
      *     description="Get a work experience by Id",
      *     tags={"Work Experience"},
      *     @SWG\Parameter(ref="#/parameters/id"),
      *     @SWG\Response(
      *         response=200,
      *         description="Success",
      *         @SWG\Schema(
      *             type="object",
      *             required={"data"},
      *             @SWG\Property(property="data", type="object", ref="#/definitions/WorkExperience")
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
    $app->get('', function($request, $response, $args){
      $experience = WorkExperience::getById($args['id']);
      $output = ['data' => $experience];
      return $response->getBody()->write(json_encode($output));
    });
    
    
    /**
      * @SWG\Put(
      *     path="/work.experience/{id}",
      *     summary="Update by Id",
      *     description="Update a work experience by Id",
      *     tags={"Work Experience"},
      *     @SWG\Parameter(ref="#/parameters/AuthHeader"),
      *     @SWG\Parameter(ref="#/parameters/id"),
      *     @SWG\Parameter(
      *       name="WorkExperienceUpdateBody",
      *       in="body",
      *       required=true,
      *       @SWG\Schema(
      *         ref="#/definitions/WorkExperience"
      *       )
      *     ),
      *     @SWG\Response(
      *         response=200,
      *         description="Success",
      *         @SWG\Schema(
      *             type="object",
      *             required={"updated", "data"},
      *             @SWG\Property(property="updated", type="boolean", default=true),
      *             @SWG\Property(property="data", type="object", ref="#/definitions/WorkExperience")
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
    $app->put('', function($request, $response, $args){
      $experience = WorkExperience::getById($args['id']);
      $body = $request->getParsedBody();
      $experience = $experience->update($body);
      $output = ['updated' => true,'data' => $experience];
      return $response->getBody()->write(json_encode($output));
    })->add($validateAdmin);
    
    
    /**
      * @SWG\Delete(
      *     path="/work.experience/{id}",
      *     summary="Delete by Id",
      *     description="Delete a work experience by Id",
      *     tags={"Work Experience"},
      *     @SWG\Parameter(ref="#/parameters/AuthHeader"),
      *     @SWG\Parameter(ref="#/parameters/id"),
      *     @SWG\Response(
      *         response=200,
      *         description="Success",
      *         @SWG\Schema(
      *             type="object",
      *             required={"deleted", "data"},
      *             @SWG\Property(property="deleted", type="boolean", default=true),
      *             @SWG\Property(property="data", type="object", ref="#/definitions/WorkExperience")
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
    $app->delete('', function($request, $response, $args){
      $experience = WorkExperience::getById($args['id']);
      $experience = $experience->delete();
      $output = ['deleted' => true,'data' => $experience];
      return $response->getBody()->write(json_encode($output));
    })->add($validateAdmin);
    
    require_once __DIR__ . '/WorkExperience/Contacts.Id.php';
    
  });
  
  
  
  
});