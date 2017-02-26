<?php

//Internal use only class

/**
 * @SWG\Definition(
 *  required={
 *      "id",
 *      "contactId",
 *      "workExperienceId"
 *   },
 *   description="A WorkContact object"
 *  )
 */
class WorkContact {
  
  /**
   * @SWG\Property()
   * @var integer
   */
  public $id;
  
  /**
   * @SWG\Property()
   * @var int
   */
  private $contactId;
  
  /**
   * @SWG\Property()
   * @var string
   */
  private $workExperienceId;
    
  public function __construct($data) {
    if (is_array($data)) {
      $this->id =  $data['id'];
      $this->contactId = $data['contactId'];
      $this->workExperienceId = $data['workExperienceId']; 
    }
  }
  
  
  public function getContactId() {
    return $this->contactId;
  }
  
  
  public function getWorkExperienceId(){
    return $this->workExperienceId;
  }
  
  
  private static function create($contactId, $workExpId) {
    if (!isset($contactId)){
      throw new Exception("ContactId required", 500);
    }
    
    if (!isset($workExpId)){
      throw new Exception("WorkExperienceId required", 500);
    }
    
    $db = DB::getInstance();
    
    $results = $db->insert('workContacts', ['contactId' => $contactId, 'workExperienceId' => $workExperienceId]);
    DB::handleError($db);
    
    if (sizeof($results) != 1){
      throw new Exception("An error occurred creating WorkContact ", 500);
    }
    
    $lastInsertedId = $db->lastInsertId();
    
    return self::getById($lastInsertedId);
  }
  
  
  public static function getAll(){
    $db = DB::getInstance();
    
    $results = $db->select('workContacts', '*');
    DB::handleError($db);
    
    $contacts = [];
    foreach ($results as $row) {
      $contacts[] = new WorkContact($row);
    }
    
    return $contacts;
  }
  
  
  public static function getById($id) {
    if (!isset($id)){
      throw new Exception("WorkContact id required", 500);
    }
    
    $db = DB::getInstance();
    
    $results = $db->select('workContacts', '*', ['id' => $id]);
    DB::handleError($db);
    
    if (sizeof($results) != 1){
      throw new Exception("WorkContact " . $id . " not found.", 404);
    }
    
    return new WorkContact($results[0]);
  }
  
  //no need for update. Just delete and create a new one
  
  public function delete() {
    $db = DB::getInstance();
    
    $deleted = $db->delete('workContacts', ['id' => $this->id]);
    DB::handleError($db);
    
    if (!isset($deleted) || $deleted != 1) {
      throw new Exception("An error occurred deleting WorkContact ". $this->id, 500);
    }
    
    return $this;
  }
  
  // --------- More Advanced Gets/Deletes ------------
  
  public static function findOrCreate($contactId, $workExpId) {
    if (!isset($contactId)){
      throw new Exception("ContactId required", 500);
    }
    
    if (!isset($workExpId)){
      throw new Exception("WorkExperienceId required", 500);
    }
    
    $db = DB::getInstance();
    
    $results = $db->select('workContacts', '*', ['contactId' => $contactId, 'workExperienceId' => $workExpId]);
    DB::handleError($db);
    
    if (sizeof($results) == 1){
      return new WorkContact($results[0]);
    }
    
    return self::create($contactId, $workExpId);
  }
  
  
  public static function getAllForWorkExperience($workExpId) {
    if (!isset($workExpId)){
      throw new Exception("WorkContact workExperienceId required", 500);
    }
    
    $db = DB::getInstance();
    
    $results = $db->select('workContacts', '*', ['workExperienceId' => $workExpId]);
    DB::handleError($db);
    
    $contacts = [];
    foreach ($results as $row) {
      $contacts[] = new WorkContact($row);
    }
    
    return $contacts;
  }
  
  
  public static function deleteAllForWorkExperience($workExpId) {
    if (!isset($workExpId)){
      throw new Exception("WorkContact workExperienceId required", 500);
    }
    
    $db = DB::getInstance();
    
    $results = $db->delete('workContacts', '*', ['workExperienceId' => $workExpId]);
    DB::handleError($db);
    
    if (!isset($deleted)) {
      throw new Exception("An error occurred deleting WorkContacts with workExperienceId ". $workExpId, 500);
    }
    
    return $results;
  }
  
}