<?php

require_once './src/model/Projects/Tags.php';

$app->group('/tags', function() use ($app){
  
  
  /**
    * @SWG\Get(
    *     path="/projects/tags",
    *     summary="Get All",
    *     description="Get all tags",
    *     tags={"Tags"},
    *     @SWG\Response(
    *         response=200,
    *         description="Success",
    *         @SWG\Schema(
    *             type="object",
    *             required={"data"},
    *             @SWG\Property(property="data", type="array", 
    *               @SWG\Items(
    *                 ref="#/definitions/Tag"
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
    $tags = Tag::getAll();
    $output = ['data' => $tags];
    return $response->getBody()->write(json_encode($output));
  });
  
  
  /**
    * @SWG\Get(
    *     path="/projects/tags/{id}",
    *     summary="Get by Id",
    *     description="Get a tag by Id",
    *     tags={"Tags"},
    *     @SWG\Parameter(ref="#/parameters/id"),
    *     @SWG\Response(
    *         response=200,
    *         description="Success",
    *         @SWG\Schema(
    *             type="object",
    *             required={"data"},
    *             @SWG\Property(property="data", type="object", ref="#/definitions/Tag")
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
    $tags = Tag::getById($args['id']);
    $output = ['data' => $tags];
    return $response->getBody()->write(json_encode($output));
  });
  
  
});