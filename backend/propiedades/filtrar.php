<?php
// ============================================================
// ENDPOINT: filtrar propiedades
// Método: GET
// Parámetros opcionales: tipo, ciudad, sector, estado, precio_min, precio_max
// ============================================================

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Método no permitido"]);
    exit();
}

$tipo      = isset($_GET['tipo'])      ? trim($_GET['tipo'])      : '';
$ciudad    = isset($_GET['ciudad'])    ? trim($_GET['ciudad'])    : '';
$sector    = isset($_GET['sector'])    ? trim($_GET['sector'])    : '';
$estado    = isset($_GET['estado'])    ? trim($_GET['estado'])    : '';
$precioMin = isset($_GET['precio_min']) ? floatval($_GET['precio_min']) : 0;
$precioMax = isset($_GET['precio_max']) ? floatval($_GET['precio_max']) : 9999999999;

$conditions = ["1=1"];
$params     = [];
$types      = "";

if (!empty($tipo)) {
    $conditions[] = "p.tipo = ?";
    $params[]     = $tipo;
    $types        .= "s";
}
if (!empty($ciudad)) {
    $conditions[] = "p.ciudad = ?";
    $params[]     = $ciudad;
    $types        .= "s";
}
if (!empty($sector)) {
    $conditions[] = "p.sector LIKE ?";
    $params[]     = '%' . $sector . '%';
    $types        .= "s";
}
if (!empty($estado)) {
    $conditions[] = "p.estado = ?";
    $params[]     = $estado;
    $types        .= "s";
}

$conditions[] = "p.precio >= ?";
$params[]     = $precioMin;
$types        .= "d";

$conditions[] = "p.precio <= ?";
$params[]     = $precioMax;
$types        .= "d";

$where = implode(" AND ", $conditions);
$sql   = "SELECT p.*, u.nombre AS nombre_usuario 
          FROM propiedades p 
          LEFT JOIN usuarios u ON p.usuario_id = u.id 
          WHERE $where 
          ORDER BY p.fecha_creacion DESC";

$stmt = $conn->prepare($sql);

if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

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
