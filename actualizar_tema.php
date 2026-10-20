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

$id = filter_input(INPUT_POST, "id", FILTER_VALIDATE_INT);
$titulo = trim($_POST["titulo"] ?? "");
$contenido = trim($_POST["contenido"] ?? "");

if (!$id || $id <= 0 || $titulo === "" || $contenido === "") {
    http_response_code(400);

    echo json_encode([
        "error" => "Debes ingresar un ID válido, el título y el contenido."
    ]);

    exit;
}

$sql = "UPDATE temas_interes
        SET titulo = ?, contenido = ?
        WHERE id = ?";

$stmt = $conexion->prepare($sql);

if (!$stmt) {
    http_response_code(500);

    echo json_encode([
        "error" => "No se pudo preparar la actualización."
    ]);

    exit;
}

$stmt->bind_param("ssi", $titulo, $contenido, $id);

if ($stmt->execute()) {

    if ($stmt->affected_rows > 0) {
        echo json_encode([
            "exito" => true,
            "mensaje" => "Tema actualizado correctamente."
        ], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode([
            "exito" => true,
            "mensaje" => "La solicitud se procesó, pero el tema no cambió o el ID no existe."
        ], JSON_UNESCAPED_UNICODE);
    }

} else {
    http_response_code(500);

    echo json_encode([
        "error" => "No se pudo actualizar el tema."
    ], JSON_UNESCAPED_UNICODE);
}

$stmt->close();
$conexion->close();

?>