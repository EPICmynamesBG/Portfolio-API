<?php
class DB {

    protected function __construct() {}

    public static function getInstance()
    {
        global $CONFIG;
        $db = new \Medoo\Medoo([
            'database_type' => 'mysql',
            'database_name' => $CONFIG['server_db'],
            'server' => $CONFIG['server_name'],
            'username' => $CONFIG['server_user'],
            'password' => $CONFIG['server_pass'],
            'port' => $CONFIG['server_port'],
            'charset' => 'utf8'
        ]);

        return $db;
    }

    public static function handleError($db) {
        global $CONFIG;
        $errorString = $db->error()[2];
        if (sizeof($errorString) > 0) {
          if ($CONFIG['debug']){
            throw new Exception('DB Error: '.$errorString . ' # Last query: ' . $db->last_query(), 500);
          }
            throw new Exception('DB Error: '.$errorString , 500);
        }

    }
}