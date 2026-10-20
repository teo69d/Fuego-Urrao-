<?php

header("Content-Type: application/json; charset=utf-8");

require_once __DIR__ . "/admin_auth.php";
exigir_admin();

require_once "conexion.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido."], JSON_UNESCAPED_UNICODE);
    exit;
}

$nombre = trim($_POST["nombre"] ?? "");
$descripcion = trim($_POST["descripcion"] ?? "");
$presentacion = trim($_POST["presentacion"] ?? "");
$precio = $_POST["precio"] ?? null;
$categoria = trim($_POST["categoria"] ?? "");
$stock = filter_var($_POST["stock"] ?? null, FILTER_VALIDATE_INT);

if (
    $nombre === "" ||
    $descripcion === "" ||
    $presentacion === "" ||
    !is_numeric($precio) ||
    (float)$precio <= 0 ||
    $categoria === "" ||
    $stock === false ||
    $stock === null ||
    $stock < 0
) {
    http_response_code(400);
    echo json_encode(["error" => "Revisa los datos del producto y su cantidad."], JSON_UNESCAPED_UNICODE);
    exit;
}

if (!isset($_FILES["imagen"]) || $_FILES["imagen"]["error"] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(["error" => "Selecciona una imagen válida para el producto."], JSON_UNESCAPED_UNICODE);
    exit;
}

$carpeta = __DIR__ . "/imagenes/";

if (!is_dir($carpeta) && !mkdir($carpeta, 0755, true)) {
    http_response_code(500);
    echo json_encode(["error" => "No se pudo crear la carpeta de imágenes."], JSON_UNESCAPED_UNICODE);
    exit;
}

$tipo = mime_content_type($_FILES["imagen"]["tmp_name"]);
$tiposPermitidos = [
    "image/jpeg" => "jpg",
    "image/png" => "png",
    "image/webp" => "webp",
    "image/gif" => "gif"
];

if (!isset($tiposPermitidos[$tipo])) {
    http_response_code(400);
    echo json_encode(["error" => "El formato de imagen no está permitido."], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_FILES["imagen"]["size"] > 5 * 1024 * 1024) {
    http_response_code(400);
    echo json_encode(["error" => "La imagen no puede superar los 5 MB."], JSON_UNESCAPED_UNICODE);
    exit;
}

$nombreArchivo = uniqid("producto_", true) . "." . $tiposPermitidos[$tipo];
$rutaCompleta = $carpeta . $nombreArchivo;

if (!move_uploaded_file($_FILES["imagen"]["tmp_name"], $rutaCompleta)) {
    http_response_code(500);
    echo json_encode(["error" => "No se pudo guardar el archivo de imagen."], JSON_UNESCAPED_UNICODE);
    exit;
}

$rutaImagen = "imagenes/" . $nombreArchivo;

$sql = "INSERT INTO productos
        (nombre, descripcion, presentacion, precio, imagen, categoria, stock)
        VALUES (?, ?, ?, ?, ?, ?, ?)";

$consulta = $conexion->prepare($sql);

if (!$consulta) {
    if (file_exists($rutaCompleta)) {
        unlink($rutaCompleta);
    }

    http_response_code(500);
    echo json_encode(["error" => "No se pudo preparar el registro.", "detalle" => $conexion->error], JSON_UNESCAPED_UNICODE);
    exit;
}

$precio = (float)$precio;
$stock = (int)$stock;

$consulta->bind_param(
    "sssdssi",
    $nombre,
    $descripcion,
    $presentacion,
    $precio,
    $rutaImagen,
    $categoria,
    $stock
);

if ($consulta->execute()) {
    echo json_encode([
        "mensaje" => "Producto agregado correctamente.",
        "id" => $consulta->insert_id,
        "imagen" => $rutaImagen,
        "stock" => $stock
    ], JSON_UNESCAPED_UNICODE);
} else {
    if (file_exists($rutaCompleta)) {
        unlink($rutaCompleta);
    }

    http_response_code(500);
    echo json_encode(["error" => "No se pudo guardar el producto.", "detalle" => $consulta->error], JSON_UNESCAPED_UNICODE);
}

$consulta->close();
$conexion->close();
?>
