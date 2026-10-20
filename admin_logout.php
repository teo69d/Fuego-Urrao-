<?php

header("Content-Type: application/json; charset=utf-8");
require_once __DIR__ . "/admin_auth.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    enviar_error_admin("Método no permitido.", 405);
}

exigir_admin();
$_SESSION = [];

if (ini_get("session.use_cookies")) {
    $parametros = session_get_cookie_params();
    setcookie(session_name(), "", [
        "expires" => time() - 42000,
        "path" => $parametros["path"],
        "domain" => $parametros["domain"],
        "secure" => $parametros["secure"],
        "httponly" => $parametros["httponly"],
        "samesite" => "Strict"
    ]);
}

session_destroy();

echo json_encode([
    "mensaje" => "Sesión cerrada correctamente."
], JSON_UNESCAPED_UNICODE);
