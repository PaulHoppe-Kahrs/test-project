<?php

namespace App\models;
use App\database\Database;
use PDO;

class TodoModel extends BaseModel {

  public function getTodos() {
    $query = "SELECT * FROM todos";
    $stmt = $this->conn->prepare($query);
    $stmt->execute();
    return $stmt->fetchAll(\PDO::FETCH_ASSOC);
  }

}