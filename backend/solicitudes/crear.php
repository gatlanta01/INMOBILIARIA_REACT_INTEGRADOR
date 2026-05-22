<?php
// ============================================================
// ENDPOINT: Crear solicitud de interés
// POST /solicitudes/crear.php
// Body: { propiedad_id?, cliente_id?, nombre_cliente, correo_cliente, telefono, mensaje, asesor_id? }
// ============================================================
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit();
}

$body = json_decode(file_get_contents('php://input'), true);

$propiedad_id    = isset($body['propiedad_id'])    ? (int) $body['propiedad_id']           : null;
$cliente_id      = isset($body['cliente_id'])      ? (int) $body['cliente_id']             : null;
$nombre_cliente  = isset($body['nombre_cliente'])  ? trim($body['nombre_cliente'])         : '';
$correo_cliente  = isset($body['correo_cliente'])  ? trim($body['correo_cliente'])         : '';
$telefono        = isset($body['telefono'])        ? trim($body['telefono'])               : '';
$mensaje         = isset($body['mensaje'])         ? trim($body['mensaje'])                : '';
$asesor_id       = isset($body['asesor_id'])       ? (int) $body['asesor_id']             : null;

// Validaciones básicas
if ($nombre_cliente === '' || $correo_cliente === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Faltan campos requeridos']);
    exit();
}

if (!filter_var($correo_cliente, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Correo electrónico no válido']);
    exit();
}

// Convertir 0 a null
if ($propiedad_id <= 0) $propiedad_id = null;
if ($cliente_id   <= 0) $cliente_id   = null;
if ($asesor_id    <= 0) $asesor_id    = null;

$stmt = $conn->prepare(
    "INSERT INTO solicitudes (propiedad_id, cliente_id, nombre_cliente, correo_cliente, telefono, mensaje, asesor_id)
     VALUES (?, ?, ?, ?, ?, ?, ?)"
);
$stmt->bind_param('iissssi', $propiedad_id, $cliente_id, $nombre_cliente, $correo_cliente, $telefono, $mensaje, $asesor_id);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Solicitud enviada correctamente',
        'id'      => $conn->insert_id,
    ]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al guardar la solicitud']);
}

$stmt->close();
$conn->close();
?>
