<?php
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';
cors();
requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail(405, "Método no permitido");

$data      = jsonInput();
$idDisfraz = intval($data['id_disfraz'] ?? 0);
$idUsuario = $_SESSION['user_id'];

if (!$idDisfraz) fail(400, "ID disfraz requerido");

$db = new Database();
try {
    $stmt = $db->conn->prepare("SELECT id FROM disfraces WHERE id = ? AND eliminado = 0");
    $stmt->execute([$idDisfraz]);
    if (!$stmt->fetch()) fail(404, "Disfraz no existe");

    // Transacción: insertar voto + sumar. UNIQUE(id_usuario, id_disfraz) impide el duplicado
    // aunque lleguen dos peticiones a la vez.
    $db->conn->beginTransaction();
    $db->conn->prepare("INSERT INTO votos (id_usuario, id_disfraz) VALUES (?, ?)")->execute([$idUsuario, $idDisfraz]);
    $db->conn->prepare("UPDATE disfraces SET votos = votos + 1 WHERE id = ?")->execute([$idDisfraz]);
    $db->conn->commit();

    echo json_encode(["ok" => true]);
} catch (PDOException $e) {
    if ($db->conn->inTransaction()) $db->conn->rollBack();
    if ($e->getCode() === '23000') fail(409, "Ya votaste por este disfraz");
    error_log("votar: " . $e->getMessage());
    fail(500, "Error al votar");
}
