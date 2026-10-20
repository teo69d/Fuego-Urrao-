<?php

header("Content-Type: application/json; charset=utf-8");
require_once __DIR__ . "/admin_auth.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    enviar_error_admin("Método no permitido.", 405);
}

verificar_origen_admin();

$archivoConfiguracion = __DIR__ . "/admin_config.php";
if (!is_file($archivoConfiguracion)) {
    enviar_error_admin(
        "Falta configurar el acceso administrativo. Sigue las instrucciones del README.",
        503
    );
}

$configuracion = require $archivoConfiguracion;
if (
    !is_array($configuracion) ||
    !isset($configuracion["usuario"], $configuracion["hash_contrasena"]) ||
    !is_string($configuracion["usuario"]) ||
    !is_string($configuracion["hash_contrasena"])
) {
    enviar_error_admin("La configuración administrativa no es válida.", 500);
}

$usuario = $_POST["usuario"] ?? "";
$contrasena = $_POST["password"] ?? "";

if (!is_string($usuario) || !is_string($contrasena)) {
    enviar_error_admin("Las credenciales no son válidas.", 400);
}

$usuario = trim($usuario);

if (
    !hash_equals($configuracion["usuario"], $usuario) ||
    !password_verify($contrasena, $configuracion["hash_contrasena"])
) {
    enviar_error_admin("Usuario o contraseña incorrectos.", 401);
}

if (!session_regenerate_id(true)) {
    enviar_error_admin("No se pudo iniciar una sesión segura.", 500);
}

$_SESSION["admin_autenticado"] = true;
$_SESSION["admin_ultima_actividad"] = time();

echo json_encode([
    "autenticado" => true,
    "mensaje" => "Bienvenida, administradora."
], JSON_UNESCAPED_UNICODE);
