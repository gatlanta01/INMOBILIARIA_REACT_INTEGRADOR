<?php
// ============================================================
// ENDPOINT: obtener propiedad por ID
// Método: GET
// Parámetro: ?id=1
// ============================================================

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Método no permitido"]);
    exit();
}

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "ID de propiedad inválido"]);
    exit();
}

$stmt = $conn->prepare(
    "SELECT p.*, u.nombre AS nombre_usuario 
     FROM propiedades p 
     LEFT JOIN usuarios u ON p.usuario_id = u.id 
     WHERE p.id = ?"
);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(404);
    echo json_encode(["success" => false, "message" => "Propiedad no encontrada"]);
    $stmt->close();
    exit();
}

$propiedad = $result->fetch_assoc();
$stmt->close();
$conn->close();

echo json_encode(["success" => true, "propiedad" => $propiedad]);
?>
