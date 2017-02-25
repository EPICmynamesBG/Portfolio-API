<?php

class Auth {
  
  public static function generateHash($password) {
    if (defined("CRYPT_BLOWFISH") && CRYPT_BLOWFISH) {
        $salt = '$2y$11$' . substr(md5(uniqid(rand(), true)), 0, 22);
        return crypt($password, $salt);
    } else {
      throw new Exception('CRYPT_BLOWFISH not defined', 500);
    }
  }
  
  public static function verify($password, $hashedPassword){
    return crypt($password, $hashedPassword) == $hashedPassword;
  }
  
}