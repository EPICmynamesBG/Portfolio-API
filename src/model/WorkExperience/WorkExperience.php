<?php

require_once './src/model/WorkExperience/Contacts.php';

/**
 * @SWG\Definition(
 *  required={
 *      "id",
 *      "title",
 *      "company",
 *      "location",
 *      "startDate",
 *      "description"
 *   },
 *   description="A Contact object"
 *  )
 */
class WorkExperience {
  
  /**
   * @SWG\Property(description="a Contact's unique id")
   * @var integer
   */
  public $id;
  
  /**
   * @SWG\Property(default=null, description="an icon string from the mdiIcon npm module")
   * @var "string"
   */
  public $mdiIcon = null;
  
  /**
   * @SWG\Property()
   * @var string
   */
  public $title;
  
  /**
   * @SWG\Property()
   * @var string
   */
  public $company;
  
  /**
   * @SWG\Property()
   * @var string
   */
  public $location;
  
  /**
   * @SWG\Property(format="date")
   * @var string
   */
  public $startDate;
  
  /**
   * @SWG\Property(format="date", default=null)
   * @var "string"
   */
  public $endDate;
  
  /**
   * @SWG\Property(description="WYSIWYG html text")
   * @var string
   */
  public $description;
  
  /**
   * @SWG\Property(format="timestamp")
   * @var string
   */
  public $lastUpdated;
  
  /**
   * @SWG\Property()
   * @var Contact[]
   */
  public $contacts = [];
  
  public function __construct($data) {
    if (is_array($data)) {
      $this->id =  $data['id'];
      $this->mdiIcon = $data['mdiIcon'];
      $this->title = $data['title'];
      $this->company = $data['company'];
      $this->location = $data['location'];
      $this->startDate = $data['startDate'];
      $this->endDate = $data['endDate'];
      $this->description = $data['description'];
      $this->lastUpdated = $data['lastUpdated'];
      $this->contacts = Contact::getAllForWorkExperience($this->id);
    }
  }
  
  private static function hasAllRequiredInputs($data) {
    if (!isset($data)){
      throw new Exception('no data provided', 400);
    }
    $checkForKeys = ['title', 'company', 'location', 'startDate', 'description'];
    foreach($checkForKeys as $key){
      if (!isset($data[$key])){
        return false;
      }
    }
    return true;
  }
  
  
  public static function create($data) {
    if (!self::hasAllRequiredInputs($data)){
      throw new Exception("Missing required input(s): title, company, location, startDate, description", 400);
    }
    
    $db = DB::getInstance();
    
    $insertArr = [
      'title' => $data['title'],
      'company' => $data['company'],
      'location' => $data['location'],
      'startDate' => $data['description']
    ];
    $insertArr = Util::prepareOptionals($insertArr, $data, ['mdiIcon', 'endDate']);
    
    $results = $db->insert('workExperience', $insertArr);
    DB::handleError($db);
    
    if (sizeof($results) != 1){
      throw new Exception("An error occurred creating workExperience ". $data['title'], 500);
    }
    
    $lastInsertedId = $db->lastInsertId();
    
    if (isset($data['contacts'])){
      Contact::createAllForWorkExperience($data['contacts'], $lastInsertedId);
    }
    
    return self::getById($lastInsertedId);
  }
  
  
  public static function getAll(){
    $db = DB::getInstance();
    
    $results = $db->select('workExperience', '*');
    DB::handleError($db);
    
    $contacts = [];
    foreach ($results as $row) {
      $contacts[] = new WorkExperience($row);
    }
    
    return $contacts;
  }
  
  
  public static function getById($id) {
    if (!isset($id)){
      throw new Exception("WorkExperience id required", 400);
    }
    
    $db = DB::getInstance();
    
    $results = $db->select('workExperience', '*', ['id' => $id]);
    DB::handleError($db);
    
    if (sizeof($results) != 1){
      throw new Exception("WorkExperience " . $id . " not found.", 404);
    }
    
    return new WorkExperience($results[0]);
  }
  
  
  public function update($data) {
    if (!isset($data) || !Util::arrayIsAssoc($data)){
      throw new Exception("Missing data", 400);
    }
    
    $updateArr = Util::prepareOptionals([], $data, ['mdiIcon', 'title', 'company', 'location', 
                                                    'startDate', 'endDate', 'description']);
    $updateArr['lastUpdated'] = time();
    
    $db = DB::getInstance();
    
    $updated = $db->update('workExperience', $updateArr, ['id' => $this->id]);
    DB::handleError($db);
    
    if (isset($data['contacts'])){
      Contact::deleteAllForWorkExperience($this->id);
      $this->contacts = Contact::createAllForWorkExperience($data['contacts'], $this->id);
    }
    
    if (!isset($updated) || $updated != 1) {
      throw new Exception("An error occurred updating workExperience ". $this->title, 500);
    }
    
    foreach($updateArr as $key => $value) {
      $this->{$key} = $value;
    }
    $this->lastUpdated = $updateArr['lastUpdated'];
    
    return $this;
  }
  
  public function delete() {
    $db = DB::getInstance();
    
    Contact::deleteAllForWorkExperience($this->id);
    Tag::deleteAllForWorkExperience($this->id);
    
    $deleted = $db->delete('workExperience', ['id' => $this->id]);
    DB::handleError($db);
    
    if (!isset($deleted) || $deleted != 1) {
      throw new Exception("An error occurred deleting workExperience ". $this->title, 500);
    }
    
    return $this;
  }
  
}