<?php
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';
cors();
requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') fail(405, "Método no permitido");

$data   = jsonInput();
$id     = intval($data['id'] ?? 0);
$nombre = trim($data['nombre'] ?? '');
$desc   = trim($data['descripcion'] ?? '');

if (!$id || $nombre === '' || $desc === '' || mb_strlen($nombre) > 50) fail(400, "Datos incompletos o inválidos");

$db = new Database();
try {
    $stmt = $db->conn->prepare("UPDATE disfraces SET nombre = ?, descripcion = ? WHERE id = ?");
    $stmt->execute([$nombre, $desc, $id]);
    echo json_encode(["ok" => true]);
} catch (PDOException $e) {
    error_log("update: " . $e->getMessage());
    fail(500, "Error interno del servidor");
}
