<?php
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';
cors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail(405, "Método no permitido");

$data   = jsonInput();
$nombre = trim($data['nombre'] ?? '');
$clave  = $data['clave'] ?? '';

$db = new Database();
try {
    $stmt = $db->conn->prepare("SELECT id, nombre, clave, rol FROM usuarios WHERE nombre = ?");
    $stmt->execute([$nombre]);
    $res = $stmt->fetch();

    if (!$res || !password_verify($clave, $res['clave'])) fail(401, "Credenciales inválidas");

    session_regenerate_id(true);   // evita fijación de sesión
    $_SESSION['user_id'] = $res['id'];
    $_SESSION['nombre']  = $res['nombre'];
    $_SESSION['rol']     = $res['rol'];

    echo json_encode(["ok" => true, "usuario" => [
        "id" => $res['id'], "nombre" => $res['nombre'], "rol" => $res['rol']
    ]]);
} catch (PDOException $e) {
    error_log("login: " . $e->getMessage());
    fail(500, "Error interno del servidor");
}
