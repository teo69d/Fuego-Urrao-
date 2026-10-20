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

$id = filter_var($_POST["id"] ?? null, FILTER_VALIDATE_INT);
$nombre = trim($_POST["nombre"] ?? "");
$descripcion = trim($_POST["descripcion"] ?? "");
$presentacion = trim($_POST["presentacion"] ?? "");
$precio = $_POST["precio"] ?? null;
$categoria = trim($_POST["categoria"] ?? "");
$stock = filter_var($_POST["stock"] ?? null, FILTER_VALIDATE_INT);

if (
    $id === false || $id === null || $id <= 0 ||
    $nombre === "" ||
    $descripcion === "" ||
    $presentacion === "" ||
    !is_numeric($precio) ||
    (float)$precio <= 0 ||
    $categoria === "" ||
    $stock === false || $stock === null || $stock < 0
) {
    http_response_code(400);
    echo json_encode(["error" => "Revisa los datos del producto y su cantidad."], JSON_UNESCAPED_UNICODE);
    exit;
}

/* Buscar la imagen actual */
$buscar = $conexion->prepare("SELECT imagen FROM productos WHERE id = ?");

if (!$buscar) {
    http_response_code(500);
    echo json_encode(["error" => "No se pudo consultar el producto."], JSON_UNESCAPED_UNICODE);
    exit;
}

$buscar->bind_param("i", $id);
$buscar->execute();
$resultado = $buscar->get_result();
$productoActual = $resultado->fetch_assoc();
$buscar->close();

if (!$productoActual) {
    http_response_code(404);
    echo json_encode(["error" => "No se encontró el producto."], JSON_UNESCAPED_UNICODE);
    exit;
}

$rutaImagen = $productoActual["imagen"];
$rutaNuevaImagen = null;

/* Si se seleccionó una imagen nueva, guardarla */
if (isset($_FILES["imagen"]) && $_FILES["imagen"]["error"] !== UPLOAD_ERR_NO_FILE) {

    if ($_FILES["imagen"]["error"] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(["error" => "No se pudo recibir la nueva imagen."], JSON_UNESCAPED_UNICODE);
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

    $carpeta = __DIR__ . "/imagenes/";

    if (!is_dir($carpeta) && !mkdir($carpeta, 0755, true)) {
        http_response_code(500);
        echo json_encode(["error" => "No se pudo crear la carpeta de imágenes."], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $nombreArchivo = uniqid("producto_", true) . "." . $tiposPermitidos[$tipo];
    $rutaCompleta = $carpeta . $nombreArchivo;

    if (!move_uploaded_file($_FILES["imagen"]["tmp_name"], $rutaCompleta)) {
        http_response_code(500);
        echo json_encode(["error" => "No se pudo guardar la nueva imagen."], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $rutaNuevaImagen = $rutaCompleta;
    $rutaImagen = "imagenes/" . $nombreArchivo;
}

$precio = (float)$precio;
$stock = (int)$stock;

$sql = "UPDATE productos
        SET nombre = ?, descripcion = ?, presentacion = ?,
            precio = ?, categoria = ?, imagen = ?, stock = ?
        WHERE id = ?";

$consulta = $conexion->prepare($sql);

if (!$consulta) {
    if ($rutaNuevaImagen !== null && file_exists($rutaNuevaImagen)) {
        unlink($rutaNuevaImagen);
    }

    http_response_code(500);
    echo json_encode(["error" => "No se pudo preparar la actualización.", "detalle" => $conexion->error], JSON_UNESCAPED_UNICODE);
    exit;
}

$consulta->bind_param(
    "sssdssii",
    $nombre,
    $descripcion,
    $presentacion,
    $precio,
    $categoria,
    $rutaImagen,
    $stock,
    $id
);

if ($consulta->execute()) {

    /* Borrar la imagen anterior solo si se reemplazó */
    if ($rutaNuevaImagen !== null) {
        $imagenAnterior = __DIR__ . "/" . $productoActual["imagen"];

        if (is_file($imagenAnterior)) {
            unlink($imagenAnterior);
        }
    }

    echo json_encode([
        "mensaje" => "Producto actualizado correctamente.",
        "id" => $id,
        "imagen" => $rutaImagen,
        "stock" => $stock
    ], JSON_UNESCAPED_UNICODE);

} else {
    if ($rutaNuevaImagen !== null && file_exists($rutaNuevaImagen)) {
        unlink($rutaNuevaImagen);
    }

    http_response_code(500);
    echo json_encode(["error" => "No se pudo actualizar el producto.", "detalle" => $consulta->error], JSON_UNESCAPED_UNICODE);
}

$consulta->close();
$conexion->close();
?>
