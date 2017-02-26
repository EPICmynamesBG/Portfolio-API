<?php

/**
 * @SWG\Definition(
 *  required={
 *      "name"
 *   },
 *   description="An Interest object"
 *  )
 */
class Interest {
  
  /**
   * @SWG\Property(description="an Interest's unique id")
   * @var integer
   */
  public $id;
  
  /**
   * @SWG\Property(description="an Interest name")
   * @var string
   */
  public $name;
  
  public function __construct($data) {
    if (is_array($data)) {
      $this->id =  $data['id'];
      $this->name = $data['name'];
    }
  }
  
  
  public static function create($name) {
    if (!isset($name)){
      throw new Exception("Interest name required", 400);
    }
    
    $db = DB::getInstance();
    
    $results = $db->insert('interests', ['name' => $name]);
    DB::handleError($db);
    
    if (sizeof($results) != 1){
      throw new Exception("An error occurred creating interest ". $name, 500);
    }
    
    $lastInsertedId = $db->lastInsertId();
    
    return self::getById($lastInsertedId);
  }
  
  
  public static function getAll(){
    $db = DB::getInstance();
    
    $results = $db->select('interests', '*');
    DB::handleError($db);
    
    $interests = [];
    foreach ($results as $row) {
      $interests[] = new Interest($row);
    }
    
    return $interests;
  }
  
  
  public static function getById($id) {
    if (!isset($id)){
      throw new Exception("Interest id required", 400);
    }
    
    $db = DB::getInstance();
    
    $results = $db->select('interests', '*', ['id' => $id]);
    DB::handleError($db);
    
    if (sizeof($results) != 1){
      throw new Exception("Interest " . $id . " not found.", 404);
    }
    
    return new Interest($results[0]);
  }
  
  
  public function update($name) {
    if (!isset($name)){
      throw new Exception("Interest name required", 400);
    }
    
    $db = DB::getInstance();
    
    $updated = $db->update('interests', ['name' => $name], ['id' => $this->id]);
    DB::handleError($db);
    
    if (!isset($updated) || $updated != 1) {
      throw new Exception("An error occurred updating interest ". $this->id, 500);
    }
    
    $this->name = $name;
    return $this;
  }
  
  public function delete() {
    $db = DB::getInstance();
    
    $deleted = $db->delete('interests', ['id' => $this->id]);
    DB::handleError($db);
    
    if (!isset($deleted) || $deleted != 1) {
      throw new Exception("An error occurred deleting interest ". $this->id, 500);
    }
    
    return $this;
  }
  
}