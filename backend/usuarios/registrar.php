<?php
// ============================================================
// ENDPOINT: registrar usuario
// Método: POST
// Body JSON: { nombre, correo, password, rol }
// ============================================================

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Método no permitido"]);
    exit();
}

// Obtener datos del body JSON
$data = json_decode(file_get_contents("php://input"), true);

$nombre   = isset($data['nombre'])   ? trim($data['nombre'])   : '';
$correo   = isset($data['correo'])   ? trim($data['correo'])   : '';
$password = isset($data['password']) ? trim($data['password']) : '';
$rol      = isset($data['rol'])      ? trim($data['rol'])      : 'cliente';

// Validaciones básicas
if (empty($nombre) || empty($correo) || empty($password)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Nombre, correo y contraseña son obligatorios"]);
    exit();
}

if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Formato de correo inválido"]);
    exit();
}

// Verificar si el correo ya existe
$stmt = $conn->prepare("SELECT id FROM usuarios WHERE correo = ?");
$stmt->bind_param("s", $correo);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    http_response_code(409);
    echo json_encode(["success" => false, "message" => "El correo ya está registrado"]);
    $stmt->close();
    exit();
}
$stmt->close();

// Hashear contraseña de forma segura
$passwordHash = password_hash($password, PASSWORD_DEFAULT);

// Insertar usuario
$stmt = $conn->prepare("INSERT INTO usuarios (nombre, correo, password, rol) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $nombre, $correo, $passwordHash, $rol);

if ($stmt->execute()) {
    $nuevoId = $conn->insert_id;
    http_response_code(201);
    echo json_encode([
        "success" => true,
        "message" => "Usuario registrado correctamente",
        "usuario" => [
            "id"     => $nuevoId,
            "nombre" => $nombre,
            "correo" => $correo,
            "rol"    => $rol
        ]
    ]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error al registrar usuario"]);
}

$stmt->close();
$conn->close();
?>
