<?php
// ============================================================
// ENDPOINT: eliminar favorito
// Método: DELETE
// Parámetros: ?usuario_id=1&propiedad_id=2
// ============================================================

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Método no permitido"]);
    exit();
}

$usuario_id   = isset($_GET['usuario_id'])   ? intval($_GET['usuario_id'])   : 0;
$propiedad_id = isset($_GET['propiedad_id']) ? intval($_GET['propiedad_id']) : 0;

if ($usuario_id <= 0 || $propiedad_id <= 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "usuario_id y propiedad_id son obligatorios"]);
    exit();
}

$stmt = $conn->prepare("DELETE FROM favoritos WHERE usuario_id = ? AND propiedad_id = ?");
$stmt->bind_param("ii", $usuario_id, $propiedad_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Favorito eliminado"]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error al eliminar favorito"]);
}

$stmt->close();
$conn->close();
?>
