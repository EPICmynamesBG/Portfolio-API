<?php

require_once './src/model/Projects.php';

$app->group('/projects', function() use ($app){
  
  global $validateAdmin;
  
  /**
    * @SWG\Get(
    *     path="/projects",
    *     summary="Get All",
    *     description="Get all projects that are not hidden. If `Admin` auth token provided, gets all.",
    *     tags={"Projects"},
    *     @SWG\Response(
    *         response=200,
    *         description="Success",
    *         @SWG\Schema(
    *             type="object",
    *             required={"data"},
    *             @SWG\Property(property="data", type="array", 
    *               @SWG\Items(
    *                 ref="#/definitions/Project"
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
      $projects = Project::getAll();
    } else {
      $projects = Project::getAllVisible();
    }
    
    $output = ['data' => $projects];
    return $response->getBody()->write(json_encode($output));
  });
  
  
  /**
    * @SWG\Post(
    *     path="/projects",
    *     summary="Create",
    *     description="`Admin`. Create a Project.",
    *     tags={"Projects"},
    *     @SWG\Parameter(ref="#/parameters/AuthHeader"),
    *     @SWG\Parameter(
    *       name="ProjectCreateBody",
    *       in="body",
    *       required=true,
    *       @SWG\Schema(
    *         ref="#/definitions/Project"
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
    $project = Project::create($body);
    $output = ['created' => true, 'data' => $project];
    return $response->getBody()->write(json_encode($output));
  })->add($validateAdmin);
  
  require_once __DIR__ . '/Projects/Tags.php';
  require_once __DIR__ . '/Projects/Images.php';
  
  
  $app->group('/{id}', function() use ($app) {
    
    global $validateAdmin;
    
    /**
      * @SWG\Get(
      *     path="/projects/{id}",
      *     summary="Get by Id",
      *     description="Get a projectby Id",
      *     tags={"Projects"},
      *     @SWG\Parameter(ref="#/parameters/id"),
      *     @SWG\Response(
      *         response=200,
      *         description="Success",
      *         @SWG\Schema(
      *             type="object",
      *             required={"data"},
      *             @SWG\Property(property="data", type="object", ref="#/definitions/Project")
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
      $project = Project::getById($args['id']);
      $output = ['data' => $project];
      return $response->getBody()->write(json_encode($output));
    });
    
    
    /**
      * @SWG\Put(
      *     path="/projects/{id}",
      *     summary="Update by Id",
      *     description="Update a project by Id",
      *     tags={"Projects"},
      *     @SWG\Parameter(ref="#/parameters/AuthHeader"),
      *     @SWG\Parameter(ref="#/parameters/id"),
      *     @SWG\Parameter(
      *       name="ProjectUpdateBody",
      *       in="body",
      *       required=true,
      *       @SWG\Schema(
      *         ref="#/definitions/Project"
      *       )
      *     ),
      *     @SWG\Response(
      *         response=200,
      *         description="Success",
      *         @SWG\Schema(
      *             type="object",
      *             required={"updated", "data"},
      *             @SWG\Property(property="updated", type="boolean", default=true),
      *             @SWG\Property(property="data", type="object", ref="#/definitions/Project")
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
      $project = Project::getById($args['id']);
      $body = $request->getParsedBody();
      $updated = $project->update($body);
      $output = ['updated' => true,'data' => $updated];
      return $response->getBody()->write(json_encode($output));
    })->add($validateAdmin);


    /**
     * @SWG\Put(
     *     path="/projects/{id}/visibility",
     *     summary="Toggle Visibility",
     *     description="Update a project's visibility by Id",
     *     tags={"Projects"},
     *     @SWG\Parameter(ref="#/parameters/AuthHeader"),
     *     @SWG\Parameter(ref="#/parameters/id"),
     *     @SWG\Parameter(
     *       name="ProjectUpdateBody",
     *       in="body",
     *       required=true,
     *       @SWG\Schema(
     *         type="object",
     *         required={"visible"},
     *         @SWG\Property(property="visible", type="boolean", default=false),
     *       )
     *     ),
     *     @SWG\Response(
     *         response=200,
     *         description="Success",
     *         @SWG\Schema(
     *             type="object",
     *             required={"updated", "data"},
     *             @SWG\Property(property="updated", type="boolean", default=true),
     *             @SWG\Property(property="data", type="object", ref="#/definitions/Project")
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
    $app->put('/visibility', function($request, $response, $args){
      $project = Project::getById($args['id']);
      $body = $request->getParsedBody();
      if (!isset($body['visible'])){
        throw new Exception('Missing parameter: visible', 400);
      }
      $project = $project->toggleVisibility($body['visible']);
      $output = ['updated' => true,'data' => $project];
      return $response->getBody()->write(json_encode($output));
    })->add($validateAdmin);
    
    
    /**
      * @SWG\Delete(
      *     path="/projects/{id}",
      *     summary="Delete by Id",
      *     description="Delete a project by Id",
      *     tags={"Projects"},
      *     @SWG\Parameter(ref="#/parameters/AuthHeader"),
      *     @SWG\Parameter(ref="#/parameters/id"),
      *     @SWG\Response(
      *         response=200,
      *         description="Success",
      *         @SWG\Schema(
      *             type="object",
      *             required={"deleted", "data"},
      *             @SWG\Property(property="deleted", type="boolean", default=true),
      *             @SWG\Property(property="data", type="object", ref="#/definitions/Project")
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
      $project = Project::getById($args['id']);
      $project = $project->delete();
      $output = ['deleted' => true,'data' => $project];
      return $response->getBody()->write(json_encode($output));
    })->add($validateAdmin);
    
    require_once __DIR__ . '/Projects/Tags.Id.php';
    require_once __DIR__ . '/Projects/Images.Id.php';
    
  });
  
});