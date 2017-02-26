<?php

$c = new \Slim\Container();

if ($CONFIG['debug']){
  
  $c['settings']['displayErrorDetails'] = true;
  $c['settings']['addContentLengthHeader'] = false;
  $c['settings']['logger'] = [
      'name' => 'slim-app',
      'path' => __DIR__ . '/logs/app.log',
      'level' => \Monolog\Logger::DEBUG,
  ];
  $c['settings']['renderer'] = [
    'template_path' => __DIR__ . '/templates/'
  ];
    
  $c['mode'] = 'development';
  
} else {
  
  $c['settings']['displayErrorDetails'] = false;
  $c['settings']['addContentLengthHeader'] = true;
  $c['settings']['logger'] = [
      'name' => 'slim-app',
      'path' => __DIR__ . '/logs/app.log',
      'level' => \Monolog\Logger::DEBUG,
  ];
  $c['settings']['renderer'] = [
    'template_path' => __DIR__ . '/templates/'
  ];
    
  $c['mode'] = 'production';
  
}

/**
 * @SWG\Definition(
 * 	  definition="Error",
 *    type="object",
 * 		required={"status", "error", "msg"},
 *		@SWG\Property(property="status", type="int"),
 *		@SWG\Property(property="error", type="bool", default="true"),
 *		@SWG\Property(property="msg", type="string")
 * 	 )
 *  
 */ 
$c['errorHandler'] = function ($c) {
    return function ($request, $response, $exception) use ($c) {
        global $app;
        $data = [
            'status' => $exception->getCode(),
            'error' => true,
            'msg' => $exception->getMessage()
        ];
        return $c['response']->withStatus($exception->getCode() != 0 ? $exception->getCode(): 500)
                             ->withHeader('Content-Type', 'application/json')
                             ->write(json_encode($data));
    };
};

$c['phpErrorHandler'] = function ($c) {
    return function ($request, $response, $exception) use ($c) {
        global $app;
        $data = [
            'status' => $exception->getCode(),
            'error' => true,
            'msg' => $exception->getMessage()
        ];
        return $c['response']->withStatus($exception->getCode() != 0 ? $exception->getCode(): 500)
                             ->withHeader('Content-Type', 'application/json')
                             ->write(json_encode($data));
    };
};

$c['notFoundHandler'] = function ($c) {
    return function ($request, $response) use ($c) {
        global $app;
        $data = [
            'status' => 404,
            'error' => true,
            'msg' => 'Not found'
        ];
        return $c['response']->withStatus(404)
                             ->withHeader('Content-Type', 'application/json')
                             ->write(json_encode($data));
    };
};


return $c;
