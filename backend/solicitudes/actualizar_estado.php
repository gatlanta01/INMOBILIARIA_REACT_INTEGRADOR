<?php
// ============================================================
// ENDPOINT: Actualizar estado de una solicitud
// PUT /solicitudes/actualizar_estado.php
// Body: { id, estado }  — estado: sin_leer | pendiente | ejecutada
// ============================================================
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit();
}

$body  = json_decode(file_get_contents('php://input'), true);
$id    = isset($body['id'])     ? (int) $body['id']       : 0;
$estado = isset($body['estado']) ? trim($body['estado'])  : '';

$estadosValidos = ['sin_leer', 'pendiente', 'ejecutada'];

if ($id <= 0 || !in_array($estado, $estadosValidos, true)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Datos inválidos']);
    exit();
}

$stmt = $conn->prepare("UPDATE solicitudes SET estado = ? WHERE id = ?");
$stmt->bind_param('si', $estado, $id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'Estado actualizado']);
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Solicitud no encontrada']);
    }
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al actualizar']);
}

$stmt->close();
$conn->close();
?>
