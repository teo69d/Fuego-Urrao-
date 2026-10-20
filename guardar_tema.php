<?php

header("Content-Type: application/json; charset=utf-8");

require_once __DIR__ . "/admin_auth.php";
exigir_admin();

require_once "conexion.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);

    echo json_encode([
        "error" => "Método no permitido."
    ]);

    exit;
}

$titulo = trim($_POST["titulo"] ?? "");
$contenido = trim($_POST["contenido"] ?? "");

if ($titulo === "" || $contenido === "") {
    http_response_code(400);

    echo json_encode([
        "error" => "Debes ingresar el título y el contenido del tema."
    ]);

    exit;
}

$sql = "INSERT INTO temas_interes (titulo, contenido)
        VALUES (?, ?)";

$stmt = $conexion->prepare($sql);

if (!$stmt) {
    http_response_code(500);

    echo json_encode([
        "error" => "No se pudo preparar el registro del tema."
    ]);

    exit;
}

$stmt->bind_param("ss", $titulo, $contenido);

if ($stmt->execute()) {
    echo json_encode([
        "exito" => true,
        "mensaje" => "Tema guardado correctamente.",
        "id" => $conexion->insert_id
    ], JSON_UNESCAPED_UNICODE);
} else {
    http_response_code(500);

    echo json_encode([
        "error" => "No se pudo guardar el tema."
    ]);
}

$stmt->close();
$conexion->close();

?>