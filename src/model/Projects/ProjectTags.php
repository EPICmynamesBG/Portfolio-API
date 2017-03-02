<?php

//Internal use only class

/**
 * @SWG\Definition(
 *  required={
 *      "id",
 *      "tagId",
 *      "projectId"
 *   },
 *   description="A ProjectTag object"
 *  )
 */
class ProjectTag {
  
  /**
   * @SWG\Property()
   * @var integer
   */
  public $id;
  
  /**
   * @SWG\Property()
   * @var int
   */
  private $tagId;
  
  /**
   * @SWG\Property()
   * @var string
   */
  private $projectId;
    
  public function __construct($data) {
    if (is_array($data)) {
      $this->id =  $data['id'];
      $this->tagId = $data['tagId'];
      $this->projectId = $data['projectId']; 
    }
  }
  
  
  public function getTagId() {
    return $this->tagId;
  }
  
  
  public function getProjectId(){
    return $this->projectId;
  }
  
  
  private static function create($tagId, $projId) {
    if (!isset($tagId)){
      throw new Exception("TagId required", 500);
    }
    
    if (!isset($projId)){
      throw new Exception("ProjectId required", 500);
    }
    
    $db = DB::getInstance();
    
    $results = $db->insert('projectTags', ['tagId' => $tagId, 'projectId' => $projId]);
    DB::handleError($db);
    
    if (sizeof($results) != 1){
      throw new Exception("An error occurred creating ProjectTag ", 500);
    }
    
    $lastInsertedId = $db->id();
    
    return self::getById($lastInsertedId);
  }
  
  
  public static function getAll(){
    $db = DB::getInstance();
    
    $results = $db->select('projectTags', '*');
    DB::handleError($db);
    
    $tags = [];
    foreach ($results as $row) {
      $tags[] = new ProjectTag($row);
    }
    
    return $tags;
  }
  
  
  public static function getById($id) {
    if (!isset($id)){
      throw new Exception("ProjectTag id required", 500);
    }
    
    $db = DB::getInstance();
    
    $results = $db->select('projectTags', '*', ['id' => $id]);
    DB::handleError($db);
    
    if (sizeof($results) != 1){
      throw new Exception("ProjectTag " . $id . " not found.", 404);
    }
    
    return new ProjectTag($results[0]);
  }
  
  //no need for update. Just delete and create a new one
  
  public function delete() {
    $db = DB::getInstance();
    
    $deleted = $db->delete('projectTags', ['id' => $this->id]);
    DB::handleError($db);
    
    if (!isset($deleted) || $deleted != 1) {
      throw new Exception("An error occurred deleting ProjectTag ". $this->id, 500);
    }
    
    return $this;
  }
  
  // --------- More Advanced Gets/Deletes ------------
  
  public static function findOrCreate($tagId, $projId) {
    if (!isset($tagId)){
      throw new Exception("TagId required", 500);
    }
    
    if (!isset($projId)){
      throw new Exception("ProjectId required", 500);
    }
    
    $db = DB::getInstance();
    
    $results = $db->select('projectTags', '*', ['tagId' => $tagId, 'projectId' => $projId]);
    DB::handleError($db);
    
    if (sizeof($results) == 1){
      return new ProjectTag($results[0]);
    }
    
    return self::create($tagId, $projId);
  }
  
  
  public static function getAllForProject($projId) {
    if (!isset($projId)){
      throw new Exception("ProjectTag projectId required", 500);
    }
    
    $db = DB::getInstance();
    
    $results = $db->select('projectTags', '*', ['projectId' => $projId]);
    DB::handleError($db);
    
    $tags = [];
    foreach ($results as $row) {
      $tags[] = new ProjectTag($row);
    }
    
    return $tags;
  }
  
  
  public static function deleteAllForProject($projId) {
    if (!isset($projId)){
      throw new Exception("ProjectTag projectId required", 500);
    }
    
    $db = DB::getInstance();
    
    $results = $db->delete('projectTags', ['projectId' => $projId]);
    DB::handleError($db);
    
    if (!isset($results)) {
      throw new Exception("An error occurred deleting ProjectTags with projectId ". $projId, 500);
    }
    
    return $results;
  }
  
}