<?php

require_once './src/model/Projects/ProjectTags.php';

/**
 * @SWG\Definition(
 *  required={
 *      "name"
 *   },
 *   description="A Tag object"
 *  )
 */
class Tag {
  
  /**
   * @SWG\Property(description="a Tag's unique id")
   * @var integer
   */
  public $id;
  
  /**
   * @SWG\Property(description="a Tag name")
   * @var string
   */
  public $name;
  
  public function __construct($data) {
    if (is_array($data)) {
      $this->id =  $data['id'];
      $this->name = $data['name'];
    }
  }
  
  
  private static function create($name) {
    if (!isset($name)){
      throw new Exception("Tag name required", 400);
    }
    
    $db = DB::getInstance();
    
    $results = $db->insert('tags', ['name' => $name]);
    DB::handleError($db);
    
    if (sizeof($results) != 1){
      throw new Exception("An error occurred creating tag ". $name, 500);
    }
    
    $lastInsertedId = $db->lastInsertId();
    
    return self::getById($lastInsertedId);
  }
  
  
  public static function getAll(){
    $db = DB::getInstance();
    
    $results = $db->select('tags', '*');
    DB::handleError($db);
    
    $tags = [];
    foreach ($results as $row) {
      $tags[] = new Tag($row);
    }
    
    return $tags;
  }
  
  
  public static function getById($id) {
    if (!isset($id)){
      throw new Exception("Tag id required", 400);
    }
    
    $db = DB::getInstance();
    
    $results = $db->select('tags', '*', ['id' => $id]);
    DB::handleError($db);
    
    if (sizeof($results) != 1){
      throw new Exception("Tag " . $id . " not found.", 404);
    }
    
    return new Tag($results[0]);
  }
  
  
  public function update($name) {
    if (!isset($name)){
      throw new Exception("Tag name required", 400);
    }
    
    $db = DB::getInstance();
    
    $updated = $db->update('tags', ['name' => $name], ['id' => $this->id]);
    DB::handleError($db);
    
    if (!isset($updated) || $updated != 1) {
      throw new Exception("An error occurred updating tag ". $this->id, 500);
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
    
    $deleted = $db->delete('tags', ['id' => $this->id]);
    DB::handleError($db);
    
    if (!isset($deleted) || $deleted != 1) {
      throw new Exception("An error occurred deleting tag ". $this->id, 500);
    }
    
    return $this;
  }
  
  // ------- Begin more advance create/delete --------
  
  public static function findOrCreate($name) {
    if (!isset($name)){
      throw new Exception("Tag name required", 400);
    }
    
    $db = DB::getInstance();
    
    $results = $db->select('tags', '*', [
      'name' => $name
    ]);
    DB::handleError($db);
    
    if (sizeof($results) == 1){
      return new Tag($results[0]);
    } else {
      return self::create($name);
    }
    
  }
  
  public static function createAllForProject($newTags, $projectId) {
    
    $createdTags = [];
    foreach($newTags as $toCreate) {
      $createdTags[] = self::findOrCreate($toCreate);
    }
    
    $createdWorkTags = [];
    foreach($createdTags as $tag) {
      $createdWorkTags[] = ProjectTag::findOrCreate($tag->id, $projectId);
    }
    
    if (sizeof($createdWorkTags) != sizeof($createdTags)){
      throw new Exception('Created Tags count does not match created Project Tags count', 500);
    }
    
    return $createdTags;
  }
  
  public static function getAllForProject($projectId) {
    $projectTags = ProjectTag::getAllForWorkExperience($projectId);
    
    $tagIdArr = [];
    foreach($projectTags as $projTag) {
      $tagIdArr[] = $projTag->getTagId();
    }
    
    if (sizeof($projIdArr) == 0){
      return [];
    }
    
    $db = DB::getInstance();
    $results = $db->select('tags', '*', ['id' => $projIdArr]);
    DB::handleError($db);
    
    $tags = [];
    foreach($results as $row) {
      $tags[] = new Tag($row);
    }
    return $tags;
  }
  
  //doesn't actually delete the table instance, but the relationship instanct
  public static function deleteAllForProject($projectId) {
    return ProjectTag::deleteAllForWorkExperience($projectId);
  }
  
}