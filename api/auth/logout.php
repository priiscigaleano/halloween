<?php
require_once __DIR__ . '/../helpers/auth.php';
cors();
session_destroy();
echo json_encode(["ok" => true]);