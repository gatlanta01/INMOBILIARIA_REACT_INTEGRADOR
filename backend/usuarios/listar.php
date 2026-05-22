<?php
// ============================================================
// ENDPOINT: listar usuarios
// Método: GET
// Query params opcionales: rol (admin|asesor|cliente)
// ============================================================

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Método no permitido"]);
    exit();
}

$rol = isset($_GET['rol']) ? trim($_GET['rol']) : '';

if ($rol !== '') {
    $stmt = $conn->prepare("SELECT id, nombre, correo, rol, fecha_registro FROM usuarios WHERE rol = ? ORDER BY nombre ASC");
    $stmt->bind_param('s', $rol);
    $stmt->execute();
    $result = $stmt->get_result();
} else {
    $result = $conn->query("SELECT id, nombre, correo, rol, fecha_registro FROM usuarios ORDER BY fecha_registro DESC");
}

$usuarios = [];
while ($row = $result->fetch_assoc()) {
    $usuarios[] = $row;
}

echo json_encode(["success" => true, "usuarios" => $usuarios]);

$conn->close();
?>
