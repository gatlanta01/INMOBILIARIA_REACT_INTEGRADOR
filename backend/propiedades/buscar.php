<?php
// ============================================================
// ENDPOINT: buscar propiedades
// Método: GET
// Parámetro: ?q=texto
// ============================================================

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Método no permitido"]);
    exit();
}

$q = isset($_GET['q']) ? '%' . trim($_GET['q']) . '%' : '%%';

$stmt = $conn->prepare(
    "SELECT p.*, u.nombre AS nombre_usuario 
     FROM propiedades p 
     LEFT JOIN usuarios u ON p.usuario_id = u.id 
     WHERE p.titulo LIKE ? OR p.ciudad LIKE ? OR p.sector LIKE ?
     ORDER BY p.fecha_creacion DESC"
);
$stmt->bind_param("sss", $q, $q, $q);
$stmt->execute();
$result = $stmt->get_result();

$propiedades = [];
while ($row = $result->fetch_assoc()) {
    $propiedades[] = $row;
}

$stmt->close();
$conn->close();

echo json_encode(["success" => true, "propiedades" => $propiedades]);
?>
