<?php

require_once "./src/model/Auth.php";

class Admin {
  
  public $id;
  
  public $name;
  
  public $email;
  
  private $password;
  
  public $token;
  
  public function __construct($data) {
    if (is_array($data)) {
      $this->id =  $data['id'];
      $this->name = $data['name'];
      $this->email = $data['email'];
      $this->password = $data['password'];
      $this->token = $data['token'];
    }
  }
  
  public static function getById($id) {
    if (!isset($id)) {
      throw new Exception('Admin id not provided', 400);
    }
    
    $db = DB::getInstance();
    
    $results = $db->select('admins', '*', ['id' => $id]);
    DB::handleError($db);
    
    if (sizeof($results) != 1) {
      throw new Exception('Admin does not exist for that id', 404);
    }
    
    return new Admin($results[0]);
  }
  
  public static function getByName($name) {
    if (!isset($name)) {
      throw new Exception('Admin name not provided', 400);
    }
    
    $db = DB::getInstance();
    
    $results = $db->select('admins', '*', ['name' => $name]);
    DB::handleError($db);
    
    if (sizeof($results) != 1) {
      throw new Exception('Admin does not exist for that name', 404);
    }
    
    return new Admin($results[0]);
  }
  
  public static function getByEmail($email) {
    if (!isset($email)) {
      throw new Exception('Admin email not provided', 400);
    }
    
    $db = DB::getInstance();
    
    $results = $db->select('admins', '*', ['email' => $email]);
    DB::handleError($db);
    
    if (sizeof($results) != 1) {
      throw new Exception('Admin does not exist for that email', 404);
    }
    
    return new Admin($results[0]);
  }
  
  public static function getByToken($token) {
    if (!isset($token)) {
      throw new Exception('Admin token not provided', 400);
    }
    
    $db = DB::getInstance();
    
    $results = $db->select('admins', '*', ['token' => $token]);
    DB::handleError($db);
    
    if (sizeof($results) != 1) {
      throw new Exception('Admin does not exist for that token', 404);
    }
    
    return new Admin($results[0]);
  }
  
  
  
  
  
  
  
  
  // ------- End CRUD ----------
  
  
  public static function login($email, $password) {
    if (!isset($email)) {
      throw new Exception('Admin email not provided', 400);
    }
    if (!isset($password)){
      throw new Exception('Admin password not provided', 400);
    }
        
    $db = DB::getInstance();
    
    $results = $db->select('admins', '*', [
      'email' => $email
    ]);
    DB::handleError($db);
    
    if (sizeof($results) != 1) {
      throw new Exception('Bad login', 400);
    }
    
    $admin = new Admin($results[0]);
    
    if (!Auth::verify($password, $admin->password)){
      throw new Exception('Bad login', 400);
    }
    
    $admin->token = JWT::generateJWTForAdmin($admin);
    
    return $admin;
  }
  
  
  public function logout() {
    $db = DB::getInstance();
    
    $results = $db->update('admins', ['token' => null], [
      'id' => $this->id
    ]);
    DB::handleError($db);
    
    return ['logout' => 'success'];
  }
  
}