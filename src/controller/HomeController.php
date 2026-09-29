<?php

namespace App\controllers;
use App\controllers\BaseController;
use App\models\TodoModel;

class HomeController extends BaseController {
    public function index() {
        $todoModel = new TodoModel();
        $todos = $todoModel->getTodos();

        $this->view("home", ["message" => "Hello, World!"]);
    }
}

