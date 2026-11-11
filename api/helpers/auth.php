<?php
session_set_cookie_params(['httponly' => true, 'samesite' => 'Lax']);
session_start();

function cors() {
    // Solo se acepta el origen propio (antes se reflejaba cualquier origen con credenciales)
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin && parse_url($origin, PHP_URL_HOST) === ($_SERVER['SERVER_NAME'] ?? '')) {
        header("Access-Control-Allow-Origin: " . $origin);
        header("Access-Control-Allow-Credentials: true");
    }
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-Type: application/json; charset=utf-8");
    header("X-Content-Type-Options: nosniff");
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
}

// Respuesta de error JSON con código HTTP semántico
function fail($code, $msg) {
    http_response_code($code);
    echo json_encode(["error" => $msg]);
    exit;
}

function requireAuth() {
    if (empty($_SESSION['user_id'])) fail(401, "No autenticado");
}

function requireAdmin() {
    requireAuth();
    if (($_SESSION['rol'] ?? '') !== 'admin') fail(403, "Acceso denegado: solo administrador");
}

function jsonInput() {
    $raw = file_get_contents("php://input");
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}
