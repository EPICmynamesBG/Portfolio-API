<?php

require_once './src/model/Projects/Images.php';

$app->group('/images', function() use ($app){
  
  
  /**
    * @SWG\Get(
    *     path="/projects/images",
    *     summary="Get All",
    *     description="Get all images",
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
    $images = Tag::getAll();
    $output = ['data' => $images];
    return $response->getBody()->write(json_encode($output));
  });
  
  
  /**
    * @SWG\Get(
    *     path="/projects/images/{id}",
    *     summary="Get by Id",
    *     description="Get an image by Id",
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
    $images = Tag::getById($args['id']);
    $output = ['data' => $images];
    return $response->getBody()->write(json_encode($output));
  });
  
  
});