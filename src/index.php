<?php
require_once __DIR__ . '/autoloader.php';

use App\Router\Router;
use App\controllers\HomeController;

$router = new Router();
$router->add("GET", "/testus/", "HomeController@index");

$router->dispatch();