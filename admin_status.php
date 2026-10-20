<?php

header("Content-Type: application/json; charset=utf-8");
require_once __DIR__ . "/admin_auth.php";

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    enviar_error_admin("Método no permitido.", 405);
}

echo json_encode([
    "autenticado" => admin_autenticado()
], JSON_UNESCAPED_UNICODE);
