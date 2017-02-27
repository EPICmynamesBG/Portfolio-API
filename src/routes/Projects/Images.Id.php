<?php

require_once './src/model/Projects/Images.php';

$app->group('/images', function() use ($app){
  
  
  /**
    * @SWG\Get(
    *     path="/projects/{id}/images",
    *     summary="Get All in Project",
    *     description="Get all images associated to the given Project id",
    *     tags={"Images"},
    *     @SWG\Parameter(ref="#/parameters/id"),
    *     @SWG\Response(
    *         response=200,
    *         description="Success",
    *         @SWG\Schema(
    *             type="object",
    *             required={"data"},
    *             @SWG\Property(property="data", type="array", 
    *               @SWG\Items(
    *                 ref="#/definitions/Image"
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
    $contacts = Image::getAllForProject($args['id']);
    $output = ['data' => $contacts];
    return $response->getBody()->write(json_encode($output));
  });
  
  
});