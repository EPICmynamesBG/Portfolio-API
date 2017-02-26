<?php

require_once './src/model/Projects/ProjectImages.php';

/**
 * @SWG\Definition(
 *  required={
 *      "name",
 *      "url"
 *   },
 *   description="An Image object"
 *  )
 */
class Image {
  
  /**
   * @SWG\Property()
   * @var integer
   */
  public $id;
  
  /**
   * @SWG\Property(description="image name")
   * @var string
   */
  public $name;
  
  /**
   * @SWG\Property(description="the image location")
   * @var string
   */
  public $url;
  
  /**
   * @SWG\Property(description="html label/caption")
   * @var string
   */
  public $label = null;
  
  /**
   * @SWG\Property(description="html alt attribute")
   * @var string
   */
  public $alt = null;
  
  public function __construct($data) {
    if (is_array($data)) {
      $this->id =  $data['id'];
      $this->name = $data['name'];
      $this->url = $data['url'];
      $this->label = $data['label'];
      $this->alt = $data['alt'];
    }
  }
  
  
  private static function create($data) {
    if (!isset($data['name'])){
      throw new Exception("Image name required", 400);
    }
    if (!isset($data['url'])){
      throw new Exception("Image url required", 400);
    }
    
    $insertArr = [
      'name' => $data['name'],
      'url' => $data['url']
    ];
    $insertArr = Util::prepareOptionals($insertArr, $data, ['label', 'alt']);
    
    $db = DB::getInstance();
    
    $results = $db->insert('images', $insertArr);
    DB::handleError($db);
    
    if (sizeof($results) != 1){
      throw new Exception("An error occurred creating image ". $name, 500);
    }
    
    $lastInsertedId = $db->lastInsertId();
    
    return self::getById($lastInsertedId);
  }
  
  
  public static function getAll(){
    $db = DB::getInstance();
    
    $results = $db->select('images', '*');
    DB::handleError($db);
    
    $images = [];
    foreach ($results as $row) {
      $images[] = new Image($row);
    }
    
    return $images;
  }
  
  
  public static function getById($id) {
    if (!isset($id)){
      throw new Exception("Image id required", 400);
    }
    
    $db = DB::getInstance();
    
    $results = $db->select('images', '*', ['id' => $id]);
    DB::handleError($db);
    
    if (sizeof($results) != 1){
      throw new Exception("Image " . $id . " not found.", 404);
    }
    
    return new Image($results[0]);
  }
  
  
  public function update($data) {
    if (!isset($data) || !Util::arrayIsAssoc($data)){
      throw new Exception("Image data required", 400);
    }
    
    $updateArr = Util::prepareOptionals([], $data, ['name', 'url', 'label', 'alt']);
    
    $db = DB::getInstance();
    
    $updated = $db->update('images', $updateArr, ['id' => $this->id]);
    DB::handleError($db);
    
    if (!isset($updated) || $updated != 1) {
      throw new Exception("An error occurred updating image ". $this->id, 500);
    }
    
    foreach ($updateArr as $key => $value) {
      $this->{$key} = $value;
    }
    
    return $this;
  }
  
  public function delete() {
    $db = DB::getInstance();
    
    $deleted = $db->delete('images', ['id' => $this->id]);
    DB::handleError($db);
    
    if (!isset($deleted) || $deleted != 1) {
      throw new Exception("An error occurred deleting image ". $this->id, 500);
    }
    
    return $this;
  }
  
  // ------- Begin more advance create/delete --------
  
  public static function findOrCreate($data) {
    if (!isset($data['url'])){
      throw new Exception("Image url required", 400);
    }
    
    $db = DB::getInstance();
    
    $results = $db->select('images', '*', [
      'url' => $data['url']
    ]);
    DB::handleError($db);
    
    if (sizeof($results) == 1){
      return new Image($results[0]);
    } else {
      return self::create($name);
    }
    
  }
  
  public static function createAllForProject($newImages, $projectId) {
    
    $createdImages = [];
    foreach($newImages as $toCreate) {
      $createdImages[] = self::findOrCreate($toCreate);
    }
    
    $createdWorkImages = [];
    foreach($createdImages as $image) {
      $createdWorkImages[] = ProjectImage::findOrCreate($image->id, $projectId);
    }
    
    if (sizeof($createdWorkImages) != sizeof($createdImages)){
      throw new Exception('Created Images count does not match created Project Images count', 500);
    }
    
    return $createdImages;
  }
  
  public static function getAllForProject($projectId) {
    $projectImages = ProjectImage::getAllForWorkExperience($projectId);
    
    $imageIdArr = [];
    foreach($projectImages as $projImage) {
      $imageIdArr[] = $projImage->getImageId();
    }
    
    if (sizeof($projIdArr) == 0){
      return [];
    }
    
    $db = DB::getInstance();
    $results = $db->select('images', '*', ['id' => $projIdArr]);
    DB::handleError($db);
    
    $images = [];
    foreach($results as $row) {
      $images[] = new Image($row);
    }
    return $images;
  }
  
  //doesn't actually delete the table instance, but the relationship instance
  public static function deleteAllForProject($projectId) {
    return ProjectImage::deleteAllForWorkExperience($projectId);
  }
  
}