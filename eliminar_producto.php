<?php

header("Content-Type: application/json; charset=utf-8");

require_once __DIR__ . "/admin_auth.php";
exigir_admin();

require_once "conexion.php";

$datos = json_decode(file_get_contents("php://input"), true);

if (!is_array($datos) || !isset($datos["id"])) {
    http_response_code(400);

    echo json_encode([
        "error" => "No se recibió un ID válido."
    ], JSON_UNESCAPED_UNICODE);

    $conexion->close();
    exit;
}

$id = filter_var($datos["id"], FILTER_VALIDATE_INT);

if ($id === false || $id <= 0) {
    http_response_code(400);

    echo json_encode([
        "error" => "El ID del producto no es válido."
    ], JSON_UNESCAPED_UNICODE);

    $conexion->close();
    exit;
}

$sql = "DELETE FROM productos WHERE id = ?";

$stmt = $conexion->prepare($sql);

if (!$stmt) {
    http_response_code(500);

    echo json_encode([
        "error" => "No se pudo preparar la eliminación."
    ], JSON_UNESCAPED_UNICODE);

    $conexion->close();
    exit;
}

$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode([
            "mensaje" => "Producto eliminado correctamente."
        ], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(404);

        echo json_encode([
            "error" => "No se encontró el producto."
        ], JSON_UNESCAPED_UNICODE);
    }
} else {
    http_response_code(500);

    echo json_encode([
        "error" => "No se pudo eliminar el producto."
    ], JSON_UNESCAPED_UNICODE);
}

$stmt->close();
$conexion->close();

exit;