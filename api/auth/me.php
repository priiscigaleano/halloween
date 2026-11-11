<?php
require_once __DIR__ . '/../helpers/auth.php';
cors();
if (empty($_SESSION['user_id'])) {
    echo json_encode(["logged" => false]);
    exit;
}
echo json_encode(["logged" => true, "usuario" => [
    "id" => $_SESSION['user_id'],
    "nombre" => $_SESSION['nombre'],
    "rol" => $_SESSION['rol']
]]);