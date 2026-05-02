<?php
// ============================================================
// ENDPOINT: actualizar propiedad
// Método: PUT
// Body JSON: { id, titulo, descripcion, tipo, ciudad, sector, precio, area, habitaciones, banos, parqueaderos, imagen, estado }
// ============================================================

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Método no permitido"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

$id           = isset($data['id'])           ? intval($data['id'])         : 0;
$titulo       = isset($data['titulo'])       ? trim($data['titulo'])       : '';
$descripcion  = isset($data['descripcion'])  ? trim($data['descripcion'])  : '';
$tipo         = isset($data['tipo'])         ? trim($data['tipo'])         : '';
$ciudad       = isset($data['ciudad'])       ? trim($data['ciudad'])       : '';
$sector       = isset($data['sector'])       ? trim($data['sector'])       : '';
$precio       = isset($data['precio'])       ? floatval($data['precio'])   : 0;
$area         = isset($data['area'])         ? floatval($data['area'])     : 0;
$habitaciones = isset($data['habitaciones']) ? intval($data['habitaciones']): 0;
$banos        = isset($data['banos'])        ? intval($data['banos'])      : 0;
$parqueaderos = isset($data['parqueaderos']) ? intval($data['parqueaderos']): 0;
$imagen       = isset($data['imagen'])       ? trim($data['imagen'])       : '';
$estado       = isset($data['estado'])       ? trim($data['estado'])       : 'disponible';

if ($id <= 0 || empty($titulo) || empty($ciudad) || empty($tipo) || $precio <= 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "ID, título, ciudad, tipo y precio son obligatorios"]);
    exit();
}

$stmt = $conn->prepare(
    "UPDATE propiedades SET 
        titulo=?, descripcion=?, tipo=?, ciudad=?, sector=?,
        precio=?, area=?, habitaciones=?, banos=?, parqueaderos=?,
        imagen=?, estado=?
     WHERE id=?"
);
$stmt->bind_param(
    "sssssddiiiisi",
    $titulo, $descripcion, $tipo, $ciudad, $sector,
    $precio, $area, $habitaciones, $banos, $parqueaderos,
    $imagen, $estado, $id
);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Propiedad actualizada correctamente"]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error al actualizar: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
