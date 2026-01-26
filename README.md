# Backend Ecommerce - Usuarios y JWT

Este proyecto implementa un CRUD de usuarios con autenticacion y autorizacion usando Passport y JWT.

## Datos de entrega
- Jeshua Romero Guadarrama
- Backend II: DISEÑO Y ARQUITECTURA BACKEND
- Comisión 76950

## Checklist 1 Pre-Entrega
- Modelo de usuario + bcrypt.hashSync: realizado
- Estrategias Passport (registro, login, current/JWT): realizado
- Login con JWT: realizado
- Endpoint /api/sessions/current: realizado

## Requisitos
- Node.js
- MongoDB

## Configuracion
1) Copia `.env.example` a `.env` y ajusta los valores.
2) Instala dependencias y levanta el servidor.

```bash
npm install
npm start
```

## Ejecucion desde cero (paso a paso)
1) Iniciar MongoDB.
2) Crear `.env` desde `.env.example`.
3) Ejecutar `npm install`.
4) Ejecutar `npm start`.
5) Registrar un admin, hacer login y guardar el token.
6) Usar el token para probar los endpoints protegidos.

## Modelo de usuario (campos)
- first_name
- last_name
- email (unico)
- age
- password (hash)
- cart (ObjectId de Carts)
- role (default: user)

## Endpoints

### Registro
`POST /api/sessions/registro`

```json
{
  "first_name": "Juan",
  "last_name": "Perez",
  "email": "juan@correo.com",
  "age": 30,
  "password": "secreto",
  "role": "admin"
}
```

### Login
`POST /api/sessions/login`

```json
{
  "email": "juan@correo.com",
  "password": "secreto"
}
```

Respuesta:

```json
{
  "estado": "success",
  "token": "<jwt>",
  "usuario": { "email": "juan@correo.com" }
}
```

### Usuario actual
`GET /api/sessions/current`

Header:
`Authorization: Bearer <jwt>`

### CRUD de usuarios
- `GET /api/usuarios` (solo admin)
- `GET /api/usuarios/:id` (admin o mismo usuario)
- `POST /api/usuarios` (solo admin)
- `PUT /api/usuarios/:id` (admin o mismo usuario)
- `DELETE /api/usuarios/:id` (solo admin)

Header:
`Authorization: Bearer <jwt>`

## Flujo completo recomendado (PowerShell)

### 1) Registro de admin
```powershell
$body = @{
  first_name = "Juan"
  last_name  = "Perez"
  email      = "juan@correo.com"
  age        = 30
  password   = "secreto"
  role       = "admin"
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/sessions/registro" `
  -ContentType "application/json" -Body $body
```

### 2) Login de admin y token
```powershell
$body = @{ email = "juan@correo.com"; password = "secreto" } | ConvertTo-Json

$resp = Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/sessions/login" `
  -ContentType "application/json" -Body $body

$token = $resp.token
$token
```

### 3) Crear usuario normal (admin)
```powershell
$body = @{
  first_name = "Ana"
  last_name  = "Lopez"
  email      = "ana@correo.com"
  age        = 25
  password   = "secreto"
  role       = "user"
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/usuarios" `
  -ContentType "application/json" -Headers @{ Authorization = "Bearer $token" } -Body $body
```

### 4) Listar usuarios (admin)
```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:8080/api/usuarios" `
  -Headers @{ Authorization = "Bearer $token" }
```

### 5) Usuario actual (admin)
```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:8080/api/sessions/current" `
  -Headers @{ Authorization = "Bearer $token" }
```

### 6) Actualizar usuario por id (admin o mismo usuario)
```powershell
$body = @{ last_name = "Lopez Diaz" } | ConvertTo-Json

Invoke-RestMethod -Method Put -Uri "http://localhost:8080/api/usuarios/<ID_USUARIO>" `
  -ContentType "application/json" -Headers @{ Authorization = "Bearer $token" } -Body $body
```

### 7) Cambiar contrasena (admin o mismo usuario)
```powershell
$body = @{ password = "nueva_secreta" } | ConvertTo-Json

Invoke-RestMethod -Method Put -Uri "http://localhost:8080/api/usuarios/<ID_USUARIO>" `
  -ContentType "application/json" -Headers @{ Authorization = "Bearer $token" } -Body $body
```

### 8) Eliminar usuario (admin)
```powershell
Invoke-RestMethod -Method Delete -Uri "http://localhost:8080/api/usuarios/<ID_USUARIO>" `
  -Headers @{ Authorization = "Bearer $token" }
```

## Ejemplos con curl.exe en PowerShell
PowerShell altera el JSON, por eso se recomienda `--%`.

### Registro
```powershell
curl.exe --% -X POST "http://localhost:8080/api/sessions/registro" -H "Content-Type: application/json" -d "{\"first_name\":\"Juan\",\"last_name\":\"Perez\",\"email\":\"juan2@correo.com\",\"age\":30,\"password\":\"secreto\",\"role\":\"admin\"}"
```

### Login
```powershell
curl.exe --% -X POST "http://localhost:8080/api/sessions/login" -H "Content-Type: application/json" -d "{\"email\":\"juan2@correo.com\",\"password\":\"secreto\"}"
```

### Current
```powershell
curl.exe --% "http://localhost:8080/api/sessions/current" -H "Authorization: Bearer <JWT>"
```

## Respuestas de error comunes

### Email duplicado
```json
{
  "estado": "error",
  "mensaje": "El email ya existe"
}
```

### Token faltante o invalido
```json
{
  "estado": "error",
  "mensaje": "No autorizado"
}
```

### JWT malformado
```json
{
  "estado": "error",
  "mensaje": "jwt malformed"
}
```
