<?php
// ============================================================
// ENDPOINT: listar propiedades
// Método: GET
// ============================================================

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Método no permitido"]);
    exit();
}

$sql = "SELECT p.*, u.nombre AS nombre_usuario 
        FROM propiedades p 
        LEFT JOIN usuarios u ON p.usuario_id = u.id 
        ORDER BY p.fecha_creacion DESC";

$result = $conn->query($sql);

$propiedades = [];
while ($row = $result->fetch_assoc()) {
    $propiedades[] = $row;
}

echo json_encode(["success" => true, "propiedades" => $propiedades]);

$conn->close();
?>
