<?php

header("Content-Type: application/json; charset=utf-8");

require_once __DIR__ . "/admin_auth.php";
exigir_admin();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    enviar_error_admin("Método no permitido.", 405);
}

require_once "conexion.php";

// Comprobar si ya existen productos.
$consulta = $conexion->query("SELECT COUNT(*) AS cantidad FROM productos");
$fila = $consulta->fetch_assoc();

if ((int) $fila["cantidad"] > 0) {
    echo json_encode([
        "mensaje" => "La tabla ya contiene productos. No se agregaron duplicados."
    ], JSON_UNESCAPED_UNICODE);

    $conexion->close();
    exit;
}

// Productos iniciales del catálogo.
$productos = [
    [
        "Prenda de Lencería",
        "Prenda de lencería para complementar tu colección.",
        "Consultar disponibilidad",
        50000,
        "lenceria",
        "https://placehold.co/300x300?text=Lenceria"
    ],
    [
        "Energizantes Masculinos",
        "Bebida energizante a base de frutos naturales y enriquecida con vitaminas.",
        "Consultar presentación en el empaque",
        18000,
        "Energizantes",
        "XBULL.png"
    ],
    [
        "Conjunto Especial",
        "Conjunto especial de lencería.",
        "Consultar disponibilidad",
        65000,
        "lenceria",
        "https://placehold.co/300x300?text=Conjunto"
    ],
    [
        "Energizantes Femeninos",
        "Bebida energizante en sachet con frutos exóticos y vitaminas.",
        "Sachet",
        6200,
        "Energizantes",
        "ENM.png"
    ],
    [
        "Lubricante anal electrizante x 30 ml",
        "Lubricante anal electrizante sin anestésico.",
        "30 ml",
        34000,
        "lubricantes anales",
        "Electrizante.png"
    ],
    [
        "Lubricante anal electrizante x 7 ml",
        "Lubricante anal electrizante sin anestésico.",
        "7 ml",
        34000,
        "lubricantes anales",
        "electripq.png"
    ],
    [
        "Lubricante anal desensibilizante x 30 ml",
        "Lubricante anal desensibilizante con anestésico. Sigue las instrucciones del fabricante.",
        "30 ml",
        31500,
        "lubricantes anales",
        "anal(2).png"
    ],
    [
        "Lubricante anal desensibilizante x 7 ml",
        "Lubricante anal desensibilizante con anestésico. Sigue las instrucciones del fabricante.",
        "7 ml",
        9000,
        "lubricantes anales",
        "desensibilizantePq.png"
    ],
    [
        "Lubricante Neutro x 15 ml",
        "Lubricante a base de agua. Consulta las indicaciones del fabricante sobre compatibilidad y uso.",
        "15 ml",
        20500,
        "lubricantes",
        "NEUTRO.png"
    ],
    [
        "Lubricante Neutro x 7 ml",
        "Lubricante a base de agua. Consulta las indicaciones del fabricante sobre compatibilidad y uso.",
        "7 ml",
        9000,
        "lubricantes",
        "Neutropq.png"
    ],
    [
        "Lubricante Íntimo Retardante x 15 ml",
        "Lubricante íntimo retardante. Revisa las instrucciones y precauciones del producto.",
        "15 ml",
        32500,
        "lubricantes",
        "Retardante.png"
    ],
    [
        "Lubricante Íntimo Retardante x 7 ml",
        "Lubricante íntimo retardante. Revisa las instrucciones y precauciones del producto.",
        "7 ml",
        7700,
        "lubricantes",
        "RETARDANTEPq.png"
    ],
    [
        "Lubricante Íntimo Estrechante Sachet",
        "Producto íntimo en presentación individual. Consulta las indicaciones del fabricante.",
        "Sachet de 7 ml",
        6500,
        "lubricantes",
        "Estrechante.png"
    ],
    [
        "Lubricante Íntimo Silicona",
        "Lubricante íntimo de silicona resistente al agua. Revisa las recomendaciones de compatibilidad del fabricante.",
        "30 ml",
        34000,
        "lubricantes",
        "Silicona.png"
    ],
    [
        "Lubricante Neutro con Ácido Hialurónico y Aloe",
        "Lubricante íntimo neutro con ácido hialurónico y aloe.",
        "55 ml",
        25500,
        "lubricantes",
        "aloe.png"
    ],
    [
        "Lubricante Íntimo Trío",
        "Lubricante con aroma y sabor. Consulta las indicaciones de uso del fabricante.",
        "30 ml",
        25500,
        "lubricantes",
        "TRIO.png"
    ],
    [
        "Lubricante Íntimo Híbrido",
        "Lubricante íntimo de fórmula híbrida. Revisa su compatibilidad con preservativos y juguetes.",
        "30 ml",
        25500,
        "lubricantes",
        "Hibrido.png"
    ],
    [
        "Lubricante Chocolate Sensación Caliente",
        "Lubricante íntimo con sabor a chocolate. Consulta las instrucciones del fabricante.",
        "30 ml",
        21000,
        "lubricantes saborizados",
        "chocolate.png"
    ],
    [
        "Lubricante Chocolate Sensación Caliente",
        "Lubricante íntimo con sabor a chocolate. Consulta las instrucciones del fabricante.",
        "7 ml",
        6900,
        "lubricantes saborizados",
        "chocolatePq.png"
    ],
    [
        "Lubricante Caramelo Sensación Caliente",
        "Lubricante íntimo con sabor a caramelo. Consulta las instrucciones del fabricante.",
        "7 ml",
        6900,
        "lubricantes saborizados",
        "caramelo.png"
    ],
    [
        "Lubricante Moka Whisky Sensación Caliente",
        "Lubricante íntimo saborizado. Revisa las indicaciones del fabricante.",
        "30 ml",
        21000,
        "lubricantes saborizados",
        "whisky.png"
    ],
    [
        "Lubricante Moka Whisky Sensación Caliente",
        "Lubricante íntimo saborizado. Revisa las indicaciones del fabricante.",
        "7 ml",
        6900,
        "lubricantes saborizados",
        "whiskyPq.png"
    ],
    [
        "Lubricante Lychee Sensación Caliente",
        "Lubricante íntimo con sabor a lychee. Consulta las indicaciones del fabricante.",
        "7 ml",
        9000,
        "lubricantes saborizados",
        "lycheePq.png"
    ],
    [
        "Lubricante Tequila Sensación Caliente",
        "Lubricante íntimo saborizado. Consulta las indicaciones del fabricante.",
        "30 ml",
        34000,
        "lubricantes saborizados",
        "tequila.png"
    ],
    [
        "Lubricante Lychee Sensación Caliente",
        "Lubricante íntimo con sabor a lychee. Consulta las indicaciones del fabricante.",
        "30 ml",
        34000,
        "lubricantes saborizados",
        "lycheeG.png"
    ],
    [
        "Lubricante Crema de Whisky",
        "Lubricante íntimo saborizado. Revisa las instrucciones del fabricante.",
        "30 ml",
        34000,
        "lubricantes saborizados",
        "WhiskiE.png"
    ],
    [
        "Lubricante Mango Sensación Caliente",
        "Lubricante íntimo con sabor a mango. Consulta las indicaciones del fabricante.",
        "30 ml",
        33500,
        "lubricantes saborizados",
        "mango.png"
    ],
    [
        "Lubricante Moka Café Sensación Caliente",
        "Lubricante íntimo con sabor a café. Consulta las indicaciones del fabricante.",
        "30 ml",
        21000,
        "lubricantes saborizados",
        "cafemoka.png"
    ],
    [
        "Lubricante Menta Sensación Fría",
        "Lubricante íntimo con sensación fría. Consulta las indicaciones del fabricante.",
        "30 ml",
        21000,
        "lubricantes saborizados",
        "Menta.png"
    ]
];

$sql = "INSERT INTO productos
        (nombre, descripcion, presentacion, precio, categoria, imagen)
        VALUES (?, ?, ?, ?, ?, ?)";

$stmt = $conexion->prepare($sql);

if (!$stmt) {
    http_response_code(500);

    echo json_encode([
        "error" => "No se pudo preparar la consulta."
    ], JSON_UNESCAPED_UNICODE);

    $conexion->close();
    exit;
}

$stmt->bind_param(
    "sssdss",
    $nombre,
    $descripcion,
    $presentacion,
    $precio,
    $categoria,
    $imagen
);

$conexion->begin_transaction();

try {
    foreach ($productos as $producto) {
        [
            $nombre,
            $descripcion,
            $presentacion,
            $precio,
            $categoria,
            $imagen
        ] = $producto;

        if (!$stmt->execute()) {
            throw new Exception("No se pudo guardar un producto.");
        }
    }

    $conexion->commit();

    echo json_encode([
        "mensaje" => "Los 29 productos se guardaron correctamente.",
        "cantidad" => count($productos)
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    $conexion->rollback();
    http_response_code(500);

    echo json_encode([
        "error" => "Ocurrió un error al guardar los productos."
    ], JSON_UNESCAPED_UNICODE);
}

$stmt->close();
$conexion->close();

?>
