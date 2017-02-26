<?php

require_once './src/model/WorkExperience/Contacts.php';

$app->group('/contacts', function() use ($app){
  
  
  /**
    * @SWG\Get(
    *     path="/work.experience/contacts",
    *     summary="Get All",
    *     description="Get all contacts",
    *     tags={"Contacts"},
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
    $contacts = Contact::getAll();
    $output = ['data' => $contacts];
    return $response->getBody()->write(json_encode($output));
  });
  
  
  /**
    * @SWG\Get(
    *     path="/work.experience/contacts/{id}",
    *     summary="Get by Id",
    *     description="Get a contact by Id",
    *     tags={"Contacts"},
    *     @SWG\Parameter(ref="#/parameters/id"),
    *     @SWG\Response(
    *         response=200,
    *         description="Success",
    *         @SWG\Schema(
    *             type="object",
    *             required={"data"},
    *             @SWG\Property(property="data", type="object", ref="#/definitions/Contact")
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
    $contacts = Contact::getById($args['id']);
    $output = ['data' => $contacts];
    return $response->getBody()->write(json_encode($output));
  });
  
  
});