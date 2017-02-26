<?php

require_once './src/model/WorkExperience/WorkContacts.php';

/**
 * @SWG\Definition(
 *  required={
 *      "name",
 *      "email"
 *   },
 *   description="A Contact object"
 *  )
 */
class Contact {
  
  /**
   * @SWG\Property(description="a Contact's unique id")
   * @var integer
   */
  public $id;
  
  /**
   * @SWG\Property(description="a Contact name")
   * @var string
   */
  public $name;
  
  /**
   * @SWG\Property(description="a Contact email")
   * @var string
   */
  public $email;
  
  public function __construct($data) {
    if (is_array($data)) {
      $this->id =  $data['id'];
      $this->name = $data['name'];
      $this->email = $data['email'];
    }
  }
  
  
  public static function create($data) {
    if (!isset($data['name'])){
      throw new Exception("Contact name required", 400);
    }
    
    if (!isset($data['email'])){
      throw new Exception("Contact email required", 400);
    }
    
    $db = DB::getInstance();
    
    $results = $db->insert('contacts', ['name' => $name, 'email' => $email]);
    DB::handleError($db);
    
    if (sizeof($results) != 1){
      throw new Exception("An error occurred creating contact ". $name, 500);
    }
    
    $lastInsertedId = $db->lastInsertId();
    
    return self::getById($lastInsertedId);
  }
  
  
  public static function getAll(){
    $db = DB::getInstance();
    
    $results = $db->select('contacts', '*');
    DB::handleError($db);
    
    $contacts = [];
    foreach ($results as $row) {
      $contacts[] = new Contact($row);
    }
    
    return $contacts;
  }
  
  
  public static function getById($id) {
    if (!isset($id)){
      throw new Exception("Contact id required", 400);
    }
    
    $db = DB::getInstance();
    
    $results = $db->select('contacts', '*', ['id' => $id]);
    DB::handleError($db);
    
    if (sizeof($results) != 1){
      throw new Exception("Contact " . $id . " not found.", 404);
    }
    
    return new Contact($results[0]);
  }
  
  
  public function update($data) {
    if (!isset($data['name']) || !isset($data['email'])){
      throw new Exception("Contact name or email required", 400);
    }
    
    $db = DB::getInstance();
    
    $updated = $db->update('contacts', $data, ['id' => $this->id]);
    DB::handleError($db);
    
    if (!isset($updated) || $updated != 1) {
      throw new Exception("An error occurred updating contact ". $this->id, 500);
    }
    
    if (isset($data['name'])){
      $this->name = $data['name'];
    }
    if (isset($data['email'])){
      $this->email = $data['email'];
    }
    return $this;
  }
  
  public function delete() {
    $db = DB::getInstance();
    
    $deleted = $db->delete('contacts', ['id' => $this->id]);
    DB::handleError($db);
    
    if (!isset($deleted) || $deleted != 1) {
      throw new Exception("An error occurred deleting contact ". $this->id, 500);
    }
    
    return $this;
  }
  
  // ------- Begin more advance create/delete --------
  
  public static function findOrCreate($data) {
    if (!isset($data['name'])){
      throw new Exception("Contact name required", 400);
    }
    
    if (!isset($data['email'])){
      throw new Exception("Contact email required", 400);
    }
    
    $db = DB::getInstance();
    
    $results = $db->select('contacts', '*', [
      'AND' => [
        'name' => $data['name'],
        'email' => $data['email']
      ]
    ]);
    DB::handleError($db);
    
    if (sizeof($results) == 1){
      return new Contact($results[0]);
    } else {
      return self::create($data);
    }
    
  }
  
  
  public static function createAllForWorkExperience($newContacts, $workExpId) {
    
    $createdContacts = [];
    foreach($newContacts as $toCreate) {
      $createdContacts[] = self::findOrCreate($toCreate);
    }
    
    $createdWorkContacts = [];
    foreach($createdContacts as $contact) {
      $createdWorkContacts[] = WorkContact::findOrCreate($contact->id, $workExpId);
    }
    
    if (sizeof($createdWorkContacts) != sizeof($createdContacts)){
      throw new Exception('Created Contacts count does not match created Work Contacts count', 500);
    }
    
    return $createdContacts;
  }
  
  public static function getAllForWorkExperience($workExpId) {
    $workContacts = WorkContact::getAllForWorkExperience($workExpId);
    
    $contactIdArr = [];
    foreach($workContacts as $workContact) {
      $contactIdArr[] = $workContact->getContactId();
    }
    
    if (sizeof($contactIdArr) == 0){
      return [];
    }
    
    $db = DB::getInstance();
    $results = $db->select('contacts', '*', ['id' => $contactIdArr]);
    DB::handleError($db);
    
    $contacts = [];
    foreach($results as $row) {
      $contacts[] = new Contact($row);
    }
    return $contacts;
  }
  
  //doesn't actually delete the contact table instance, but the workContact relationship
  public static function deleteAllForWorkExperience($workExpId) {
    return WorkContact::deleteAllForWorkExperience($workExpId);
  }
  
}