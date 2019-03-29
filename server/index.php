<?php
include_once('./args.php');
include_once('./inteligencia.php');

header('Content-type:application/json;charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

function route(){
    $uri = $_SERVER['REQUEST_URI'];
    $route_path = explode('?',$uri)[0];
    $route_parts = explode('/',$route_path);
    $action = strtolower($route_parts[count($route_parts)-1]);
    $base_datos = ["servidor"=>"localhost",
                   "base_datos"=>"Oxigeno",
                   "usuario"=>"prueba",
                   "clave"=>"12345678",
                  ];
    $serverPHP = new serverPHP($base_datos);
    return json_encode($serverPHP->$action(getArgs()));
}

echo route();