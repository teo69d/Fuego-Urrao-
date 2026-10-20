<?php

function enviar_error_admin($mensaje, $estado)
{
    http_response_code($estado);
    echo json_encode(["error" => $mensaje], JSON_UNESCAPED_UNICODE);
    exit;
}

function verificar_origen_admin()
{
    $origen = $_SERVER["HTTP_ORIGIN"] ?? "";
    $host = $_SERVER["HTTP_HOST"] ?? "";
    $esHttps = isset($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] !== "off";
    $origenEsperado = ($esHttps ? "https://" : "http://") . $host;

    if ($origen === "" || !hash_equals($origenEsperado, $origen)) {
        enviar_error_admin("Origen de solicitud no permitido.", 403);
    }
}

function iniciar_sesion_admin()
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    $esHttps = isset($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] !== "off";
    ini_set("session.use_strict_mode", "1");
    session_name("fuego_admin");
    session_set_cookie_params([
        "lifetime" => 0,
        "path" => "/",
        "secure" => $esHttps,
        "httponly" => true,
        "samesite" => "Strict"
    ]);
    session_start();
}

function admin_autenticado()
{
    iniciar_sesion_admin();

    $ultimaActividad = $_SESSION["admin_ultima_actividad"] ?? 0;
    if (
        ($_SESSION["admin_autenticado"] ?? false) !== true ||
        !is_int($ultimaActividad) ||
        $ultimaActividad < time() - 1800
    ) {
        unset($_SESSION["admin_autenticado"], $_SESSION["admin_ultima_actividad"]);
        return false;
    }

    $_SESSION["admin_ultima_actividad"] = time();
    return true;
}

function exigir_admin()
{
    verificar_origen_admin();

    if (!admin_autenticado()) {
        enviar_error_admin("Debes iniciar sesión como administradora.", 401);
    }
}

iniciar_sesion_admin();
