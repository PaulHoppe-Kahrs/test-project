<?php
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$baseDir = __DIR__;

if ($uri === '/' || $uri === '') {
    require $baseDir . '/index.php';
    return;
}

$requestedFile = $baseDir . $uri;

if (file_exists($requestedFile) && !is_dir($requestedFile)) {
    return false;
}

require $baseDir . '/index.php';
