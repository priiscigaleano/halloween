<?php
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';
cors();
requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') fail(405, "Método no permitido");

$data = jsonInput();
$id   = intval($data['id'] ?? 0);
if (!$id) fail(400, "ID requerido");

$db = new Database();
try {
    $stmt = $db->conn->prepare("UPDATE disfraces SET eliminado = 1 WHERE id = ?");   // borrado lógico
    $stmt->execute([$id]);
    echo json_encode(["ok" => true]);
} catch (PDOException $e) {
    error_log("delete: " . $e->getMessage());
    fail(500, "Error interno del servidor");
}
