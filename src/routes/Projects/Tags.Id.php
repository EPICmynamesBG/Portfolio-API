<?php

require_once './src/model/Projects/Tags.php';

$app->group('/tags', function() use ($app){
  
  
  /**
    * @SWG\Get(
    *     path="/projects/{id}/tags",
    *     summary="Get All in Project",
    *     description="Get all tags associated to the given Project id",
    *     tags={"Tags"},
    *     @SWG\Parameter(ref="#/parameters/id"),
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
    $contacts = Tag::getAllForProject($args['id']);
    $output = ['data' => $contacts];
    return $response->getBody()->write(json_encode($output));
  });
  
  
});