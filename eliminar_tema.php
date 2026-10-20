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

if (!$id || $id <= 0) {
    http_response_code(400);

    echo json_encode([
        "error" => "El ID del tema no es válido."
    ]);

    exit;
}

$sql = "DELETE FROM temas_interes WHERE id = ?";

$stmt = $conexion->prepare($sql);

if (!$stmt) {
    http_response_code(500);

    echo json_encode([
        "error" => "No se pudo preparar la eliminación."
    ]);

    exit;
}

$stmt->bind_param("i", $id);

if ($stmt->execute()) {

    if ($stmt->affected_rows > 0) {
        echo json_encode([
            "exito" => true,
            "mensaje" => "Tema eliminado correctamente."
        ], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(404);

        echo json_encode([
            "error" => "No se encontró el tema que deseas eliminar."
        ], JSON_UNESCAPED_UNICODE);
    }

} else {
    http_response_code(500);

    echo json_encode([
        "error" => "No se pudo eliminar el tema."
    ], JSON_UNESCAPED_UNICODE);
}

$stmt->close();
$conexion->close();

?>