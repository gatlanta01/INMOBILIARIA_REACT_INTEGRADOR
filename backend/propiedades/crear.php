<?php
// ============================================================
// ENDPOINT: crear propiedad
// Método: POST
// Body JSON: { titulo, descripcion, tipo, ciudad, sector, precio, area, habitaciones, banos, parqueaderos, imagen, estado, usuario_id }
// ============================================================

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Método no permitido"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

$titulo       = isset($data['titulo'])       ? trim($data['titulo'])        : '';
$descripcion  = isset($data['descripcion'])  ? trim($data['descripcion'])   : '';
$tipo         = isset($data['tipo'])         ? trim($data['tipo'])          : '';
$ciudad       = isset($data['ciudad'])       ? trim($data['ciudad'])        : '';
$sector       = isset($data['sector'])       ? trim($data['sector'])        : '';
$precio       = isset($data['precio'])       ? floatval($data['precio'])    : 0;
$area         = isset($data['area'])         ? floatval($data['area'])      : 0;
$habitaciones = isset($data['habitaciones']) ? intval($data['habitaciones']) : 0;
$banos        = isset($data['banos'])        ? intval($data['banos'])       : 0;
$parqueaderos = isset($data['parqueaderos']) ? intval($data['parqueaderos']) : 0;
$imagen       = isset($data['imagen'])       ? trim($data['imagen'])        : '';
$estado       = isset($data['estado'])       ? trim($data['estado'])        : 'disponible';
$usuario_id   = isset($data['usuario_id'])   ? intval($data['usuario_id'])  : null;

// Validaciones obligatorias
if (empty($titulo) || empty($ciudad) || empty($tipo) || $precio <= 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Título, ciudad, tipo y precio son obligatorios"]);
    exit();
}

// sssssddiiiisi => titulo, descripcion, tipo, ciudad, sector, precio(d), area(d), habitaciones(i), banos(i), parqueaderos(i), imagen, estado, usuario_id(i)
$stmt = $conn->prepare(
    "INSERT INTO propiedades 
     (titulo, descripcion, tipo, ciudad, sector, precio, area, habitaciones, banos, parqueaderos, imagen, estado, usuario_id) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
);
$stmt->bind_param(
    "sssssddiiiisi",
    $titulo, $descripcion, $tipo, $ciudad, $sector,
    $precio, $area, $habitaciones, $banos, $parqueaderos,
    $imagen, $estado, $usuario_id
);

if ($stmt->execute()) {
    $nuevoId = $conn->insert_id;
    http_response_code(201);
    echo json_encode([
        "success" => true,
        "message" => "Propiedad creada correctamente",
        "id"      => $nuevoId
    ]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error al crear la propiedad: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
