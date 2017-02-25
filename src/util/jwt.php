<?php

require_once "./src/model/Admin.php";

class JWT {
  
  public static function generateJWTForAdmin($admin) {
    global $CONFIG;

    $tokenId    = base64_encode(openssl_random_pseudo_bytes(32));
    $issuedAt   = time();
    $notBefore  = $issuedAt;
    $expire     = $notBefore + (60 * 60 * 24);            // Adding 1 day
    $serverName = $CONFIG['jwt_iss']; // Retrieve the server name from config file

    /*
     * Create the token as an array
     */
    $data = [
        'iat'  => $issuedAt,         // Issued at: time when the token was generated
        'jti'  => $tokenId,          // Json Token Id: an unique identifier for the token
        'iss'  => $serverName,       // Issuer
        'nbf'  => $notBefore,        // Not before
        'exp'  => $expire,           // Expire
        'data' => [                  // Data related to the signer user
            'id'   => $admin->id,     // userid from the users table,
            'name'     => $admin->name,
            'email'    => $admin->email,
        ]
    ];

    $secretKey = base64_decode($CONFIG['jwt_key']);

    $jwt = \Firebase\JWT\JWT::encode(
        $data,
        $secretKey,
        'HS256'
    );

    $db = DB::getInstance();
    $db->update("admins", [
        "token" => $jwt
    ], [
        "id" => $admin->id
    ]);
    DB::handleError($db);

    return $jwt;
  }
  

  public static function validateJWTForAdmin($request) {
    global $CONFIG;

    if (!isset($request)) {
        throw new Exception('Auth token not provided', 400);
    }
  
    if (!isset($request->getHeader('Authorization')[0][1])){
      throw new Exception('Auth token not provided', 400);
    }

    $jwt = explode(' ', $request->getHeader('Authorization')[0])[1];
    if (!isset($jwt)) {
        throw new Exception('Auth token not provided', 400);
    }
    
    if (explode(' ', $request->getHeader('Authorization')[0])[0] != "Bearer"){
      throw new Exception('Invalid Authorization type', 400);
    }
    
    $secretKey = base64_decode($CONFIG['jwt_key']);
    
    try {
        $token = \Firebase\JWT\JWT::decode($jwt, $secretKey, array('HS256'));
    } catch (Exception $e) {
        throw new Exception('Token is invalid', 401);
    }

    $db = DB::getInstance();
    $admin = Admin::getById($token->data->id);

    if ($jwt != $admin->token) {
        throw new Exception('Token is invalid', 401);
    }
  
    if ($token->exp < time()){
      throw new Exception('Token expired', 401);
    }

    return $admin;
  }
  
}
