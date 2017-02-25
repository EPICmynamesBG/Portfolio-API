<?php

require_once './src/model/Information/Interests.php';

$app->group('/interests', function() use ($app){
  
  global $validateAdmin;
  
  /**
    * @SWG\Get(
    *     path="/information/interests",
    *     summary="Get All",
    *     description="Get all interests",
    *     tags={"Interests"},
    *     @SWG\Response(
    *         response=200,
    *         description="Success",
    *         @SWG\Schema(
    *             type="object",
    *             required={"data"},
    *             @SWG\Property(property="data", type="array", 
    *               @SWG\Items(ref="#/definitions/Interest")
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
    $interests = Interest::getAll();
    $output = ['data' => $interests];
    return $response->getBody()->write(json_encode($output));
  });
  
  
  /**
    * @SWG\Get(
    *     path="/information/interests/{id}",
    *     summary="Get by Id",
    *     description="Get an interest by Id",
    *     tags={"Interests"},
    *     @SWG\Parameter(ref="#/parameters/id"),
    *     @SWG\Response(
    *         response=200,
    *         description="Success",
    *         @SWG\Schema(
    *             type="object",
    *             required={"data"},
    *             @SWG\Property(property="data", type="object", ref="#/definitions/Interest")
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
    $interest = Interest::getById($args['id']);
    $output = ['data' => $interest];
    return $response->getBody()->write(json_encode($output));
  });
  
  
  /**
    * @SWG\Post(
    *     path="/information/interests",
    *     summary="Create",
    *     description="`Admin`. Create an Interest",
    *     tags={"Interests"},
    *     @SWG\Parameter(ref="#/parameters/AuthHeader"),
    *     @SWG\Parameter(
    *       name="InterestCreateBody",
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
    *             @SWG\Property(property="data", ref="#/definitions/Interest")
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
    $output = Interest::create($body['name']);
    return $response->getBody()->write(json_encode($output));
  })->add($validateAdmin);
  
  
  /**
    * @SWG\Put(
    *     path="/information/interests/{id}",
    *     summary="Update by Id",
    *     description="`Admin`. Update an Interest",
    *     tags={"Interests"},
    *     @SWG\Parameter(ref="#/parameters/AuthHeader"),
    *     @SWG\Parameter(ref="#/parameters/id"),
    *     @SWG\Parameter(
    *       name="InterestUpdateBody",
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
    *             @SWG\Property(property="data", ref="#/definitions/Interest")
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
    $interest = Interest::getById($args['id']);
    $body = $request->getParsedBody();
    $output = $interest->update($body['name']);
    return $response->getBody()->write(json_encode($output));
  })->add($validateAdmin);
  
  
  /**
    * @SWG\Delete(
    *     path="/information/interests/{id}",
    *     summary="Delete by Id",
    *     description="`Admin`. Delete an Interest",
    *     tags={"Interests"},
    *     @SWG\Parameter(ref="#/parameters/AuthHeader"),
    *     @SWG\Parameter(ref="#/parameters/id"),
    *     @SWG\Response(
    *         response=200,
    *         description="Success",
    *         @SWG\Schema(
    *             type="object",
    *             required={"delted", "data"},
    *             @SWG\Property(property="deleted", type="boolean", default="true"),
    *             @SWG\Property(property="data", ref="#/definitions/Interest")
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
    $interest = Interest::getById($args['id']);
    $output = $interest->delete();
    return $response->getBody()->write(json_encode($output));
  })->add($validateAdmin);
  
});