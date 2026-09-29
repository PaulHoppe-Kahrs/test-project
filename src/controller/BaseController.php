<?php

namespace App\controllers;

abstract class BaseController {
    protected function view($viewName, $data = []) {
        extract($data);
        require __DIR__ . "/../views/{$viewName}.php";
    }
}
