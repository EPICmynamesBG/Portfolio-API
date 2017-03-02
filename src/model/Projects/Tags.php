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

  /**
   * @SWG\Property(description="a Tag name", default=null)
   * @var string
   */
  public $mdiIcon = null;
  
  public function __construct($data) {
    if (is_array($data)) {
      $this->id =  $data['id'];
      $this->name = $data['name'];
      $this->mdiIcon = $data['mdiIcon'];
    }
  }
  
  
  private static function create($data) {
    if (!isset($name)){
      throw new Exception("Tag name required", 400);
    }
    
    $db = DB::getInstance();

    $createArr = [
      'name' => $data['name']
    ];
    $createArr = Util::prepareOptionals($createArr, $data, ['mdiIcon']);

    $results = $db->insert('tags', $createArr);
    DB::handleError($db);
    
    if (sizeof($results) != 1){
      throw new Exception("An error occurred creating tag ". $name, 500);
    }
    
    $lastInsertedId = $db->id();
    
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
  
  
  public function update($data) {
    if (!isset($data)){
      throw new Exception("Tag update data required", 400);
    }

    $updateArr = Util::prepareOptionals([], $data, ['mdiIcon']);

    $db = DB::getInstance();
    
    $updated = $db->update('tags', $updateArr, ['id' => $this->id]);
    DB::handleError($db);
    
    if (!isset($updated) || $updated != 1) {
      throw new Exception("An error occurred updating tag ". $this->id, 500);
    }
    
    if (isset($data['name'])){
      $this->name = $data['name'];
    }
    if (isset($data['mdiIcon'])){
      $this->mdiIcon = $data['mdiIcon'];
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
      if (gettype($toCreate) == "string"){
        $createdTags[] = self::findOrCreate($toCreate);
      } else { //is object

        if (isset($toCreate['name'])){
          if (isset($toCreate['id'])){
            try {
              $createdTags[] = self::getById($toCreate['id']);
            } catch (Exception $e) {
              //this is ok
              $createdTags[] = self::findOrCreate($toCreate['name']);
            }
          } else {
            $createdTags[] = self::findOrCreate($toCreate['name']);
          }
        } else {
          throw new Exception('New tags passed as object must contain a name property', 400);
        }
      }


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
    $projectTags = ProjectTag::getAllForProject($projectId);
    
    $tagIdArr = [];
    foreach($projectTags as $projTag) {
      $tagIdArr[] = $projTag->getTagId();
    }
    
    if (sizeof($tagIdArr) == 0){
      return [];
    }
    
    $db = DB::getInstance();
    $results = $db->select('tags', '*', ['id' => $tagIdArr]);
    DB::handleError($db);
    
    $tags = [];
    foreach($results as $row) {
      $tags[] = new Tag($row);
    }
    return $tags;
  }
  
  //doesn't actually delete the table instance, but the relationship instanct
  public static function deleteAllForProject($projectId) {
    return ProjectTag::deleteAllForProject($projectId);
  }
  
}