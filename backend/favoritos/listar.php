<?php
// ============================================================
// ENDPOINT: listar favoritos por usuario
// Método: GET
// Parámetro: ?usuario_id=1
// ============================================================

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Método no permitido"]);
    exit();
}

$usuario_id = isset($_GET['usuario_id']) ? intval($_GET['usuario_id']) : 0;

if ($usuario_id <= 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "usuario_id es obligatorio"]);
    exit();
}

$stmt = $conn->prepare(
    "SELECT f.id AS favorito_id, p.* 
     FROM favoritos f 
     JOIN propiedades p ON f.propiedad_id = p.id 
     WHERE f.usuario_id = ? 
     ORDER BY f.fecha_creacion DESC"
);
$stmt->bind_param("i", $usuario_id);
$stmt->execute();
$result = $stmt->get_result();

$favoritos = [];
while ($row = $result->fetch_assoc()) {
    $favoritos[] = $row;
}

$stmt->close();
$conn->close();

echo json_encode(["success" => true, "favoritos" => $favoritos]);
?>
