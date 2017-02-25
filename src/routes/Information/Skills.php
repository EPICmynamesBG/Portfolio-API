<?php

require_once './src/model/Information/Skills.php';

$app->group('/skills', function() use ($app){
  
  global $validateAdmin;
  
  /**
    * @SWG\Get(
    *     path="/information/skills",
    *     summary="Get All",
    *     description="Get all skills",
    *     tags={"Skills"},
    *     @SWG\Response(
    *         response=200,
    *         description="Success",
    *         @SWG\Schema(
    *             type="object",
    *             required={"data"},
    *             @SWG\Property(property="data", type="array", 
    *               @SWG\Items(ref="#/definitions/Skill")
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
    $skills = Skill::getAll();
    $output = ['data' => $skills];
    return $response->getBody()->write(json_encode($output));
  });
  
  
  /**
    * @SWG\Get(
    *     path="/information/skills/{id}",
    *     summary="Get by Id",
    *     description="Get an skill by Id",
    *     tags={"Skills"},
    *     @SWG\Parameter(ref="#/parameters/id"),
    *     @SWG\Response(
    *         response=200,
    *         description="Success",
    *         @SWG\Schema(
    *             type="object",
    *             required={"data"},
    *             @SWG\Property(property="data", type="object", ref="#/definitions/Skill")
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
  $app->get('/{id}', function($request, $response, $args){
    $skill = Skill::getById($args['id']);
    $output = ['data' => $skill];
    return $response->getBody()->write(json_encode($output));
  });
  
  
  /**
    * @SWG\Post(
    *     path="/information/skills",
    *     summary="Create",
    *     description="`Admin`. Create an Skill",
    *     tags={"Skills"},
    *     @SWG\Parameter(ref="#/parameters/AuthHeader"),
    *     @SWG\Parameter(
    *       name="SkillCreateBody",
    *       in="body",
    *       required=true,
    *       @SWG\Schema(
    *         type="object",
    *         required={"name"},
    *         @SWG\Property(property="name", type="string", example="KickBoxing")
    *       )
    *     ),
    *     @SWG\Response(
    *         response=200,
    *         description="Success",
    *         @SWG\Schema(
    *             type="object",
    *             required={"created", "data"},
    *             @SWG\Property(property="created", type="boolean", default="true"),
    *             @SWG\Property(property="data", ref="#/definitions/Skill")
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
    $output = Skill::create($body['name']);
    return $response->getBody()->write(json_encode($output));
  })->add($validateAdmin);
  
  
  /**
    * @SWG\Put(
    *     path="/information/skills/{id}",
    *     summary="Update by Id",
    *     description="`Admin`. Update an Skill",
    *     tags={"Skills"},
    *     @SWG\Parameter(ref="#/parameters/AuthHeader"),
    *     @SWG\Parameter(ref="#/parameters/id"),
    *     @SWG\Parameter(
    *       name="SkillUpdateBody",
    *       in="body",
    *       required=true,
    *       @SWG\Schema(
    *         type="object",
    *         required={"name"},
    *         @SWG\Property(property="name", type="string", example="KickBoxing")
    *       )
    *     ),
    *     @SWG\Response(
    *         response=200,
    *         description="Success",
    *         @SWG\Schema(
    *             type="object",
    *             required={"updated", "data"},
    *             @SWG\Property(property="updated", type="boolean", default="true"),
    *             @SWG\Property(property="data", ref="#/definitions/Skill")
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
  $app->put('/{id}', function($request, $response, $args){
    $skill = Skill::getById($args['id']);
    $body = $request->getParsedBody();
    $output = $skill->update($body['name']);
    return $response->getBody()->write(json_encode($output));
  })->add($validateAdmin);
  
  
  /**
    * @SWG\Delete(
    *     path="/information/skills/{id}",
    *     summary="Delete by Id",
    *     description="`Admin`. Delete an Skill",
    *     tags={"Skills"},
    *     @SWG\Parameter(ref="#/parameters/AuthHeader"),
    *     @SWG\Parameter(ref="#/parameters/id"),
    *     @SWG\Response(
    *         response=200,
    *         description="Success",
    *         @SWG\Schema(
    *             type="object",
    *             required={"delted", "data"},
    *             @SWG\Property(property="deleted", type="boolean", default="true"),
    *             @SWG\Property(property="data", ref="#/definitions/Skill")
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
  $app->delete('/{id}', function($request, $response, $args){
    $skill = Skill::getById($args['id']);
    $output = $skill->delete();
    return $response->getBody()->write(json_encode($output));
  })->add($validateAdmin);
  
});