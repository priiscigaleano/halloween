<?php
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';
cors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail(405, "Método no permitido");

$data   = jsonInput();
$nombre = trim($data['nombre'] ?? '');
$clave  = $data['clave'] ?? '';

if (mb_strlen($nombre) < 3 || mb_strlen($nombre) > 50 || strlen($clave) < 4) {
    fail(400, "Nombre de 3 a 50 caracteres y contraseña mínimo 4 caracteres");
}

$db = new Database();
try {
    $hash = password_hash($clave, PASSWORD_BCRYPT);
    $stmt = $db->conn->prepare("INSERT INTO usuarios (nombre, clave, rol) VALUES (?, ?, 'usuario')");
    $stmt->execute([$nombre, $hash]);
    http_response_code(201);
    echo json_encode(["ok" => true, "id" => (int)$db->conn->lastInsertId()]);
} catch (PDOException $e) {
    if ($e->getCode() === '23000') fail(409, "El usuario ya existe");   // UNIQUE(nombre)
    error_log("register: " . $e->getMessage());
    fail(500, "Error interno del servidor");
}
