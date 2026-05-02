<?php
// ============================================================
// ENDPOINT: login de usuario
// Método: POST
// Body JSON: { correo, password }
// ============================================================

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Método no permitido"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

$correo   = isset($data['correo'])   ? trim($data['correo'])   : '';
$password = isset($data['password']) ? trim($data['password']) : '';

if (empty($correo) || empty($password)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Correo y contraseña son obligatorios"]);
    exit();
}

// Buscar usuario por correo
$stmt = $conn->prepare("SELECT id, nombre, correo, password, rol FROM usuarios WHERE correo = ?");
$stmt->bind_param("s", $correo);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Credenciales incorrectas"]);
    $stmt->close();
    exit();
}

$usuario = $result->fetch_assoc();

// Verificar contraseña de forma segura
if (!password_verify($password, $usuario['password'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Credenciales incorrectas"]);
    $stmt->close();
    exit();
}

$stmt->close();
$conn->close();

// Responder con datos del usuario (sin password)
echo json_encode([
    "success" => true,
    "message" => "Login exitoso",
    "usuario" => [
        "id"     => $usuario['id'],
        "nombre" => $usuario['nombre'],
        "correo" => $usuario['correo'],
        "rol"    => $usuario['rol']
    ]
]);
?>
