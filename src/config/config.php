<?php
static $CONFIG = [];

$CONFIG['debug'] = true;


if ($CONFIG['debug']){
  $CONFIG['local_config_file'] = 'dev';
} else {
  $CONFIG['local_config_file'] = 'prod';
}

require(dirname(__FILE__) . "/db_configs/{$CONFIG['local_config_file']}.php");

$CONFIG['jwt_key'] = "cYB5OFrCV0F1cGRWYUtZdmh6UFBUYnhRTUowf3BMQmpuNUtOWjhQJTJPd2JUWGxTOTllNW1QTUF4UG1PYmtrMB==";
$CONFIG['jwt_iss'] = $CONFIG['server_name'];

//This is equivalent to JavaScript momentjs DateTime format 'YYYY-MM-DD HH:mm:ss'
$CONFIG['dateTimeFormat'] = 'Y-m-d H:i:s';