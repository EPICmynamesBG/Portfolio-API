<?php

/**
 * @SWG\Definition(
 *  required={
 *      "name"
 *   },
 *   description="An Skill object"
 *  )
 */
class Skill {
  
  /**
   * @SWG\Property(description="a Skill's unique id")
   * @var integer
   */
  public $id;
  
  /**
   * @SWG\Property(description="a Skill name")
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
      throw new Exception("Skill name required", 400);
    }
    
    $db = DB::getInstance();
    
    $results = $db->insert('skills', ['name' => $name]);
    DB::handleError($db);
    
    if (sizeof($results) != 1){
      throw new Exception("An error occurred creating interest ". $name, 500);
    }
    
    $lastInsertedId = $db->lastInsertId();
    
    return self::getById($lastInsertedId);
  }
  
  
  public static function getAll(){
    $db = DB::getInstance();
    
    $results = $db->select('skills', '*');
    DB::handleError($db);
    
    $skills = [];
    foreach ($results as $row) {
      $skills[] = new Skill($row);
    }
    
    return $skills;
  }
  
  
  public static function getById($id) {
    if (!isset($id)){
      throw new Exception("Skill id required", 400);
    }
    
    $db = DB::getInstance();
    
    $results = $db->select('skills', '*', ['id' => $id]);
    DB::handleError($db);
    
    if (sizeof($results) != 1){
      throw new Exception("Skill " . $id . " not found.", 404);
    }
    
    return new Skill($results[0]);
  }
  
  
  public function update($name) {
    if (!isset($name)){
      throw new Exception("Skill name required", 400);
    }
    
    $db = DB::getInstance();
    
    $updated = $db->update('skills', ['name' => $name], ['id' => $this->id]);
    DB::handleError($db);
    
    if (!isset($updated) || $updated != 1) {
      throw new Exception("An error occurred updating interest ". $this->id, 500);
    }
    
    $this->name = $name;
    return $this;
  }
  
  public function delete() {
    $db = DB::getInstance();
    
    $deleted = $db->delete('skills', ['id' => $this->id]);
    DB::handleError($db);
    
    if (!isset($deleted) || $deleted != 1) {
      throw new Exception("An error occurred deleting interest ". $this->id, 500);
    }
    
    return $this;
  }
  
}