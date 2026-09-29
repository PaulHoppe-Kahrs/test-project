<?php

namespace App\database;

use PDO;
use PDOException;

class Database {
    private $host = 'localhost';
    private $db_name = 'todos';
    private $username = 'root';
    private $password = '';
    private $conn = null;

    public function getConection() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->exec("set names utf8");
        } catch (PDOException $exception) {
            echo "Database connection error: " . $exception->getMessage();
        }

        return $this->conn;
    }
}
