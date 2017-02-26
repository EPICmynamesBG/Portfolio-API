<?php

//Internal use only class

/**
 * @SWG\Definition(
 *  required={
 *      "id",
 *      "imageId",
 *      "projectId"
 *   },
 *   description="A ProjectImage object"
 *  )
 */
class ProjectImage {
  
  /**
   * @SWG\Property()
   * @var integer
   */
  public $id;
  
  /**
   * @SWG\Property()
   * @var int
   */
  private $imageId;
  
  /**
   * @SWG\Property()
   * @var string
   */
  private $projectId;
  
  /**
   * @SWG\Property(description="the order the image should be in the carousel")
   * @var integer
   */
  public $orderNum;
    
  public function __construct($data) {
    if (is_array($data)) {
      $this->id =  intval($data['id']);
      $this->imageId = intval($data['imageId']);
      $this->projectId = intval($data['projectId']);
      $this->orderNum = intval($data['orderNum']); 
    }
  }
  
  
  public function getImageId() {
    return $this->imageId;
  }
  
  
  public function getProjectId(){
    return $this->projectId;
  }
  
  
  private static function create($imageId, $projId) {
    if (!isset($imageId)){
      throw new Exception("ImageId required", 500);
    }
    
    if (!isset($projId)){
      throw new Exception("ProjectId required", 500);
    }
    
    $db = DB::getInstance();
    
    $nextOrderNum = self::findNextOrderForProject($projId);
    
    $results = $db->insert('projectImages', [
      'imageId' => $imageId,
      'projectId' => $projId,
      'orderNum'=> $nextOrderNum
    ]);
    DB::handleError($db);
    
    if (sizeof($results) != 1){
      throw new Exception("An error occurred creating ProjectImage ", 500);
    }
    
    $lastInsertedId = $db->lastInsertId();
    
    return self::getById($lastInsertedId);
  }
  
  
  public static function getAll(){
    $db = DB::getInstance();
    
    $results = $db->select('projectImages', '*');
    DB::handleError($db);
    
    $images = [];
    foreach ($results as $row) {
      $images[] = new ProjectImage($row);
    }
    
    return $images;
  }
  
  
  public static function getById($id) {
    if (!isset($id)){
      throw new Exception("ProjectImage id required", 500);
    }
    
    $db = DB::getInstance();
    
    $results = $db->select('projectImages', '*', ['id' => $id]);
    DB::handleError($db);
    
    if (sizeof($results) != 1){
      throw new Exception("ProjectImage " . $id . " not found.", 404);
    }
    
    return new ProjectImage($results[0]);
  }  
  
  public function updateOrder($newOrderNum) {
    
    self::correctOrderNumsForProject($this->projectId);
    
    $projImages = self::getAllForProject($this->projectId);
    
    $updatedProjImages = [];
    $currentOrderNum = $this->orderNum;
    
    if ($currentOrderNum < $newOrderNum) {
      
      foreach ($projImages as $image) {
        if ($image->id == $this->id) {
          //The image that actually is being moved
          $image->setOrder($newOrderNum);
          $this->orderNum = $newOrderNum;
          continue;
        } else if ($image->orderNum < $currentOrderNum){
          //do nothing
          continue;
        } else if ($image->orderNum >= $currentOrderNum && 
                  $image->orderNum < $newOrderNum){
          $image->setOrder($image->orderNum - 1);
        } else {
          //nothing to do, this is greater than the affected area
          continue;
        }
      }
      
    } else if ($currentOrderNum > $newOrderNum){
      
      foreach ($projImages as $image) {
        if ($image->id == $this->id) {
          //The image that actually is being moved
          $image->setOrder($newOrderNum);
          $this->orderNum = $newOrderNum;
          continue;
        } else if ($image->orderNum < $newOrderNum){
          //do nothing
          continue;
        } else if ($image->orderNum >= $newOrderNum && 
                  $image->orderNum < $currentOrderNum){
          $image->setOrder($image->orderNum + 1);
        } else {
          //nothing to do, this is greater than the affected area
          continue;
        }
      }
      
    }
    
    return $this;
  }
  
  
  public function delete() {
    $db = DB::getInstance();
    
    $deleted = $db->delete('projectImages', ['id' => $this->id]);
    DB::handleError($db);
    
    if (!isset($deleted) || $deleted != 1) {
      throw new Exception("An error occurred deleting ProjectImage ". $this->id, 500);
    }
    
    self::correctOrderNumsForProject($this->projectId);
    
    return $this;
  }
  
  // --------- More Advanced Gets/Deletes ------------
  
  public static function findOrCreate($imageId, $projId) {
    if (!isset($imageId)){
      throw new Exception("ImageId required", 500);
    }
    
    if (!isset($projId)){
      throw new Exception("ProjectId required", 500);
    }
    
    self::correctOrderNumsForProject($projId);
    
    $db = DB::getInstance();
    
    $results = $db->select('projectImages', '*', ['imageId' => $imageId, 'projectId' => $projId]);
    DB::handleError($db);
    
    if (sizeof($results) == 1){
      return new ProjectImage($results[0]);
    }
    
    return self::create($imageId, $projId);
  }
  
  
  public static function getAllForProject($projId) {
    if (!isset($projId)){
      throw new Exception("ProjectImage projectId required", 500);
    }
    
    $db = DB::getInstance();
    
    $results = $db->select('projectImages', '*', [
      'projectId' => $projId,
      'ORDER' => [
        'orderNum' => 'ASC'
      ]
    ]);
    DB::handleError($db);
    
    $images = [];
    foreach ($results as $row) {
      $images[] = new ProjectImage($row);
    }
    
    return $images;
  }
  
  
  public static function deleteAllForProject($projId) {
    if (!isset($projId)){
      throw new Exception("ProjectImage projectId required", 500);
    }
    
    $db = DB::getInstance();
    
    $results = $db->delete('projectImages', ['projectId' => $projId]);
    DB::handleError($db);
    
    if (!isset($results)) {
      throw new Exception("An error occurred deleting ProjectImages with projectId ". $projId, 500);
    }
    
    return $results;
  }
  
  // ------- OrderNum Calcualtions --------
  
  private static function findNextOrderForProject($projId) {
    if (!isset($projId)){
      throw new Exception("Proj required", 500);
    }
    
    $projImages = self::getAllForProject($projId);
    
    $nextOpenIndex = 0;
    if (sizeof($projImages) == 0){
      return $nextOpenIndex;
    }
    
    
    foreach ($projImages as $projImage) {
      //All numbers should be sequential
      $nextOpenIndex += 1;
      if ($projImage->orderNum != $nextOpenIndex){
        break;
      }
    }
      
    return $nextOpenIndex;
  }
  
  private function setOrder($newOrderNum) {
    $db = DB::getInstance();
    
    $results = $db->update('projectImages', ['order'=> $newOrderNum], ['id' => $this->id]);
    DB::handleError($db);
    
    if (sizeof($results) != 1){
      throw new Exception("ProjectImage " . $id . " orderNum couldn't be updated.", 404);
    }
    
    $this->orderNum = $newOrderNum;
    return $this;
  }
  
  private static function correctOrderNumsForProject($projId) {
    if (!isset($projId)){
      throw new Exception("Proj required", 500);
    }
    
    $projImages = self::getAllForProject($projId);
    
    for ($i = 0; $i < sizeof($projImages); $i++){
      $image = $projImages[$i];
      if ($image->orderNum != $i){
        $image->setOrder(self::findNextOrderForProject($projId));
      }
    }
    
    return true;
  }
  
}