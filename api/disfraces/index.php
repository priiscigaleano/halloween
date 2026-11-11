<?php
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../config/database.php';
cors();

$db = new Database();
$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $stmt = $db->conn->query("SELECT id, nombre, descripcion, votos, foto FROM disfraces WHERE eliminado = 0 ORDER BY votos DESC, id DESC");
        echo json_encode($stmt->fetchAll());
        exit;
    }

    if ($method === 'POST') {
        requireAdmin();
        $nombre = trim($_POST['nombre'] ?? '');
        $desc   = trim($_POST['descripcion'] ?? '');
        if ($nombre === '' || $desc === '') fail(400, "Nombre y descripción obligatorios");
        if (mb_strlen($nombre) > 50)        fail(400, "El nombre admite hasta 50 caracteres");

        $foto = '';
        $blob = null;
        if (!empty($_FILES['foto']['tmp_name'])) {
            $tmp = $_FILES['foto']['tmp_name'];
            if ($_FILES['foto']['size'] > 2 * 1024 * 1024) fail(400, "La imagen supera los 2 MB");
            // Se valida el tipo REAL del archivo, no solo la extensión que declara el cliente
            $mime  = (new finfo(FILEINFO_MIME_TYPE))->file($tmp);
            $tipos = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/gif' => 'gif', 'image/webp' => 'webp'];
            if (!isset($tipos[$mime])) fail(400, "Formato de imagen no permitido");

            $dir = __DIR__ . '/../../uploads/';
            if (!is_dir($dir)) mkdir($dir, 0755, true);
            $foto = uniqid('dis_') . '.' . $tipos[$mime];
            move_uploaded_file($tmp, $dir . $foto);
            $blob = file_get_contents($dir . $foto);
        }

        $stmt = $db->conn->prepare("INSERT INTO disfraces (nombre, descripcion, votos, foto, foto_blob, eliminado) VALUES (?, ?, 0, ?, ?, 0)");
        $stmt->bindValue(1, $nombre);
        $stmt->bindValue(2, $desc);
        $stmt->bindValue(3, $foto);
        $stmt->bindValue(4, $blob, $blob === null ? PDO::PARAM_NULL : PDO::PARAM_LOB);
        $stmt->execute();
        http_response_code(201);
        echo json_encode(["ok" => true, "id" => (int)$db->conn->lastInsertId()]);
        exit;
    }

    fail(405, "Método no permitido");
} catch (PDOException $e) {
    error_log("disfraces: " . $e->getMessage());
    fail(500, "Error interno del servidor");
}
