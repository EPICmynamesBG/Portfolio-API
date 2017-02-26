<?php

class Util {
  
  public static function prepareOptionals($outputArr, $inputData, $optionals){
    foreach($optionals as $key) {
      if (isset($inputData[$key])){
        $outputArr[$key] = $inputData[$key];
      }
    }
    return $outputArr;
  }
  
  public static function arrayIsAssoc(array $arr){
      if (array() === $arr) return false;
      return array_keys($arr) !== range(0, count($arr) - 1);
  }
  
}