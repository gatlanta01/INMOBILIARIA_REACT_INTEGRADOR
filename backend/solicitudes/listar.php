<?php
// ============================================================
// ENDPOINT: Listar solicitudes (para el asesor/admin)
// GET /solicitudes/listar.php
// Query params opcionales:
//   estado    (sin_leer|pendiente|ejecutada)
//   asesor_id (int) — si se pasa, solo devuelve las de ese asesor
// ============================================================
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit();
}

$estado    = isset($_GET['estado'])    ? trim($_GET['estado'])    : '';
$asesor_id = isset($_GET['asesor_id']) ? (int) $_GET['asesor_id'] : 0;
$estadosValidos = ['sin_leer', 'pendiente', 'ejecutada'];

$sql = "SELECT s.id, s.propiedad_id, s.cliente_id, s.nombre_cliente,
               s.correo_cliente, s.telefono, s.mensaje, s.estado,
               s.asesor_id, s.fecha_envio, s.fecha_actualizacion,
               p.titulo AS titulo_propiedad, p.ciudad, p.imagen,
               u.nombre AS nombre_asesor
        FROM solicitudes s
        LEFT JOIN propiedades p ON p.id = s.propiedad_id
        LEFT JOIN usuarios u ON u.id = s.asesor_id";

$wheres = [];
$params = [];
$types  = '';

if ($estado !== '' && in_array($estado, $estadosValidos, true)) {
    $wheres[] = "s.estado = ?";
    $params[]  = $estado;
    $types    .= 's';
}

if ($asesor_id > 0) {
    $wheres[] = "s.asesor_id = ?";
    $params[]  = $asesor_id;
    $types    .= 'i';
}

if (!empty($wheres)) {
    $sql .= " WHERE " . implode(' AND ', $wheres);
}
$sql .= " ORDER BY s.fecha_envio DESC";

$stmt = $conn->prepare($sql);
if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();

$solicitudes = [];
while ($row = $result->fetch_assoc()) {
    $solicitudes[] = $row;
}

echo json_encode([
    'success'     => true,
    'solicitudes' => $solicitudes,
    'total'       => count($solicitudes),
]);

$stmt->close();
$conn->close();
?>
