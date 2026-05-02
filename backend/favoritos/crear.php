<?php
// ============================================================
// ENDPOINT: agregar favorito
// Método: POST
// Body JSON: { usuario_id, propiedad_id }
// ============================================================

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Método no permitido"]);
    exit();
}

$data        = json_decode(file_get_contents("php://input"), true);
$usuario_id  = isset($data['usuario_id'])  ? intval($data['usuario_id'])  : 0;
$propiedad_id = isset($data['propiedad_id']) ? intval($data['propiedad_id']) : 0;

if ($usuario_id <= 0 || $propiedad_id <= 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "usuario_id y propiedad_id son obligatorios"]);
    exit();
}

$stmt = $conn->prepare("INSERT IGNORE INTO favoritos (usuario_id, propiedad_id) VALUES (?, ?)");
$stmt->bind_param("ii", $usuario_id, $propiedad_id);

if ($stmt->execute()) {
    http_response_code(201);
    echo json_encode(["success" => true, "message" => "Favorito agregado"]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error al agregar favorito"]);
}

$stmt->close();
$conn->close();
?>
