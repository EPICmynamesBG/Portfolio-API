<?php

require_once './src/model/WorkExperience/Contacts.php';

$app->group('/contacts', function() use ($app){
  
  
  /**
    * @SWG\Get(
    *     path="/work.experience/{id}/contacts",
    *     summary="Get All in Work Experience",
    *     description="Get all contacts associated to the given WorkExperience id",
    *     tags={"Contacts"},
    *     @SWG\Parameter(ref="#/parameters/id"),
    *     @SWG\Response(
    *         response=200,
    *         description="Success",
    *         @SWG\Schema(
    *             type="object",
    *             required={"data"},
    *             @SWG\Property(property="data", type="array", 
    *               @SWG\Items(
    *                 ref="#/definitions/Contact"
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
    $contacts = Contact::getAllForWorkExperience($args['id']);
    $output = ['data' => $contacts];
    return $response->getBody()->write(json_encode($output));
  });
  
  
});