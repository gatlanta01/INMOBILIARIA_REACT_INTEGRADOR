<?php
// ============================================================
// ENDPOINT: eliminar propiedad
// Método: DELETE
// Parámetro: ?id=1
// ============================================================

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Método no permitido"]);
    exit();
}

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "ID inválido"]);
    exit();
}

$stmt = $conn->prepare("DELETE FROM propiedades WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Propiedad eliminada correctamente"]);
    } else {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Propiedad no encontrada"]);
    }
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error al eliminar"]);
}

$stmt->close();
$conn->close();
?>
