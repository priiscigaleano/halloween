<?php
// Conexión PDO: excepciones activadas, prepared statements reales y sin filtrar detalles internos al cliente.
class Database {
    private $host = "localhost";
    private $db   = "halloween";
    private $user = "root";
    private $pass = "";
    public  $conn;

    public function __construct() {
        try {
            $this->conn = new PDO(
                "mysql:host={$this->host};dbname={$this->db};charset=utf8mb4",
                $this->user, $this->pass,
                [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                ]
            );
        } catch (PDOException $e) {
            error_log("DB: " . $e->getMessage());   // el detalle va al log, no al usuario
            http_response_code(500);
            echo json_encode(["error" => "Error interno del servidor"]);
            exit;
        }
    }
}
