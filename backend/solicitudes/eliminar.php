<?php
// ============================================================
// ENDPOINT: Eliminar solicitud
// DELETE /solicitudes/eliminar.php
// Body: { id }
// ============================================================
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit();
}

$body = json_decode(file_get_contents('php://input'), true);
$id   = isset($body['id']) ? (int) $body['id'] : 0;

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'ID inválido']);
    exit();
}

$stmt = $conn->prepare("DELETE FROM solicitudes WHERE id = ?");
$stmt->bind_param('i', $id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Solicitud eliminada']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al eliminar']);
}

$stmt->close();
$conn->close();
?>
