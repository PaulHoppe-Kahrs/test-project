<?php
require_once("router.php");
require_once("src/controllers/HomeController.php"); 
require_once("src/controllers/AboutController.php"); 
require_once("src/controllers/BooksController.php");

$router = new router();
$router->add("GET", "/testus/", "HomeController@index");
$router->add("GET", "/testus/about", "AboutController@index");
$router->add("GET", "/testus/books", "BooksController@index");

$router->dispatch();