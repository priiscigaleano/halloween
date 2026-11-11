<?php
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';
cors();

$id = intval($_GET['id'] ?? 0);
if (!$id) fail(400, "ID requerido");

$db = new Database();
try {
    $stmt = $db->conn->prepare("SELECT id, nombre, descripcion, votos, foto FROM disfraces WHERE id = ? AND eliminado = 0");
    $stmt->execute([$id]);
    $res = $stmt->fetch();
    if (!$res) fail(404, "No encontrado");
    echo json_encode($res);
} catch (PDOException $e) {
    error_log("show: " . $e->getMessage());
    fail(500, "Error interno del servidor");
}
