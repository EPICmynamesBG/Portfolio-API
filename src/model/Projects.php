<?php

require_once './src/model/Projects/Images.php';
require_once './src/model/Projects/Tags.php';


/**
 * @SWG\Definition(
 *  required={
 *      "title",
 *      "startDate"
 *   },
 *   description="A Tag object"
 *  )
 */
class Project {
  
  /**
   * @SWG\Property()
   * @var integer
   */
  public $id;
  
  /**
   * @SWG\Property()
   * @var string
   */
  public $title;
  
  /**
   * @SWG\Property(default=null)
   * @var string
   */
  public $linkText = null;
  
  /**
   * @SWG\Property(default=null)
   * @var int
   */
  private $linkImageId = null;
  
  /**
   * @SWG\Property(default=null)
   * @var Image
   */
  public $linkImage = null;
  
  /**
   * @SWG\Property(default=null, description="the link/url to use in href")
   * @var string
   */
  public $linkLocation = null;
  
  /**
   * @SWG\Property(format="date")
   * @var string
   */
  public $startDate;
  
  /**
   * @SWG\Property(format="date", default=null)
   * @var string
   */
  public $endDate = null;
  
  /**
   * @SWG\Property(default=null, description="The project's current status. ie: complete, in progress, etc.")
   * @var string
   */
  public $status = null;
  
  /**
   * @SWG\Property(default=null, description="raw hmtl formatted description")
   * @var string
   */
  public $description = null;
  
  /**
   * @SWG\Property(default=true)
   * @var boolean
   */
  public $hidden = true;
  
  /**
   * @SWG\Property(format="timestamp", default="time()")
   * @var string
   */
  public $lastUpdated;
  
  /**
   * @SWG\Property()
   * @var Tag[]
   */
  public $tags = [];
  
  /**
   * @SWG\Property()
   * @var Image[]
   */
  public $images = [];
  
  
  public function __construct($data) {
    if (is_array($data)){
      $this->id = intval($data['id']);
      $this->title = $data['title'];
      $this->linkText = $data['linkText'];
      $this->linkImageId = $data['linkImageId'];
      if ($this->linkImageId != null) {
        $this->linkImage = Image::getById($this->linkImageId);
      }
      $this->linkLocation = $data['linkLocation'];
      $this->startDate = $data['startDate'];
      $this->endDate = $data['endDate'];
      $this->status = $data['status'];
      $this->description = $data['description'];
      $this->hidden = boolval($data['hidden']);
      $this->lastUpdated = $data['lastUpdated'];
      $this->tags = Tag::getAllForProject($this->id);
      $this->images = Image::getAllForProject($this->id);
    }
  }
  
  
  public static function create($data) {
    if (!isset($data)){
      throw new Exception('Data required', 400);
    }
    if (!isset($data['title'])){
      throw new Exception('Missing required: title', 400);
    }
    if (!isset($data['startDate'])){
      throw new Exception('Missing required: startDate', 400);
    }
    
    $createArr = [
      'title' => $data['title'],
      'startDate' => $data['startDate']
    ];
    
    $createArr = Util::prepareOptionals($createArr, $data,  ['linkText', 'linkImageId', 'linkLocation', 'endDate',
                                                            'status', 'description']);
    
    $db = DB::getInstance();
    $results = $db->create('projects', $createArr);
    DB::handleError($db);
    
    if (sizeof($results) != 1){
      throw new Exception("An error occurred creating project ". $data['title'], 500);
    }
    
    $lastInsertedId = $db->lastInsertId();
    
    if (isset($data['tags']) && is_array($data['tags'])){
      Tag::createAllForProject($data['tags'], $lastInsertedId);
    }
    if (isset($data['images']) && is_array($data['images'])){
      Image::createAllForProject($data['images'], $lastInsertedId);
    }
    
    return self::getById($lastInsertedId);
  }
  
  
  public static function getAll() {
    $db = DB::getInstance();
    
    $results = $db->select('projects', '*');
    DB::handleError($db);
    
    if (sizeof($results) == 0){
      return [];
    }
    
    $projects = [];
    foreach($results as $row) {
      $projects[] = new Project($row);
    }
    
    return $projects;
  }
  
  
  public static function getAllVisible() {
    
    $db = DB::getInstance();
    
    $results = $db->select('projects', '*', ['hidden' => false]);
    DB::handleError($db);
    
    if (sizeof($results) == 0){
      return [];
    }
    
    $projects = [];
    foreach($results as $row) {
      $projects[] = new Project($row);
    }
    
    return $projects;
  }
  
  
  public static function getById($id) {
    if (!isset($id)){
      throw new Exception("Project id required", 400);
    }
    
    $db = DB::getInstance();
    
    $results = $db->select('projects', '*', ['id' => $id]);
    DB::handleError($db);
    
    if (sizeof($results) != 1){
      throw new Exception("Project " . $id . " not found.", 404);
    }
    
    return new Project($results[0]);
  }
  
  
  public function update($data) {
    if (!isset($data)){
      throw new Exception('Data required', 400);
    }
    
    $updateArr = Util::prepareOptionals([], $data,  ['title', 'linkText', 'linkImageId', 'linkLocation','startDate',
                                                     'endDate', 'status', 'description']);
    $updateArr['lastUpdated'] = time();
    
    $db = DB::getInstance();
    $updated = $db->update('projects', $updateArr, ['id' => $this->id]);
    DB::handleError($db);
    
    if (!isset($updated) || $updated != 1) {
      throw new Exception("An error occurred updating project ". $this->title, 500);
    }
    
    if (isset($data['tags'])){
      Tag::deleteAllForProject($this->id);
      $this->tags = Tag::createAllForWorkExperience($data['tags'], $this->id);
    }
    
    if (isset($data['images'])){
      Image::deleteAllForProject($this->id);
      $this->images = Image::createAllForWorkExperience($data['images'], $this->id);
    }
    
    foreach($updateArr as $key => $value) {
      $this->{$key} = $value;
    }
    
    return $this;
  }
  
  public function delete() {
    $db = DB::getInstance();
    
    Image::deleteAllForProject($this->id);
    Tag::deleteAllForWorkProject($this->id);
    
    $deleted = $db->delete('projects', ['id' => $this->id]);
    DB::handleError($db);
    
    if (!isset($deleted) || $deleted != 1) {
      throw new Exception("An error occurred deleting project ". $this->title, 500);
    }
    
    return $this;
  }
  
}