<?php

require_once './src/model/Information.php';

$app->group('/information', function() use ($app){
  
  /**
    * @SWG\Get(
    *     path="/information",
    *     summary="Get All",
    *     description="Get all information",
    *     tags={"Information"},
    *     @SWG\Response(
    *         response=200,
    *         description="Success",
    *         @SWG\Schema(
    *             type="object",
    *             required={"data"},
    *             @SWG\Property(property="data", type="object", ref="#/definitions/Information")
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
    $info = Information::getAll();
    $output = ['data' => $info];
    return $response->getBody()->write(json_encode($output));
  });
  
  require_once __DIR__ . '/Information/Interests.php';
  require_once __DIR__ . '/Information/Skills.php';
  
});