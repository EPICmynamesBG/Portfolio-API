<?php

require_once './src/model/Information/Interests.php';
require_once './src/model/Information/Skills.php';

/**
 * @SWG\Definition(
 *  required={
 *      "interests",
 *      "skills"
 *   },
 *   description="Cumulative information"
 *  )
 */
class Information {
  
  /**
   * @SWG\Property()
   * @var Interest[]
   */
  public $interests;
  
  /**
   * @SWG\Property()
   * @var Skill[]
   */
  public $skills;
  
  public function __construct($interests, $skills) {
    $this->interests = $interests;
    $this->skills = $skills;
  }
  
  public static function getAll() {
    $interests = Interest::getAll();
    $skills = Skill::getAll();
    return new Information($interests, $skills);
  }
  
}