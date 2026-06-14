# 11. API Endpoints

A continuación se listan las rutas REST expuestas por el servidor Node.js. Salvo el endpoint de Login, todos requieren el header `Authorization: Bearer <token>`.

## Autenticación
* **POST** `/api/auth/login`
  - Body: `{ username, password }`
  - Respuesta 200: `{ token, user: {...} }`
  - Respuestas Error: `401 Unauthorized` (Credenciales incorrectas), `429 Too Many Requests` (IP bloqueada por 30s).

## Inventario
* **GET** `/api/inventory`
  - Query Params: `logistica` (opcional), `categoria` (opcional), `q` (opcional string de búsqueda).
  - Respuesta: Array de productos.
* **POST** `/api/inventory`
  - Body: `{ producto, logistica, stock, minimo, categoria, unidad, precio, proveedor }`
* **DELETE** `/api/inventory/:id` (Elimina un producto)
* **POST** `/api/inventory/:id/move`
  - Registra una transacción de entrada/salida.
  - Body: `{ cambio: number, nota: string, tipo: string }`
  - Respuesta: `{ ok: true, stock: <nuevo_stock>, criticos: <cant_criticos_actuales> }`
* **GET** `/api/inventory/criticos`
  - Devuelve exclusivamente el array de productos cuyo stock es <= al stock mínimo.

## Historial y Dashboard
* **GET** `/api/history`
  - Parámetros de filtro y límite.
* **GET** `/api/stats`
  - Query Params: `logistica` (opcional).
  - Respuesta: `{ total_productos, stock_total, criticos, movimientos, ultimo: {...}, criticos_lista: [...] }`

## Catálogos y Admin (Requieren Rol 'admin')
* **Usuarios:** `GET /api/users`, `POST /api/users`, `DELETE /api/users/:id`
* **Proveedores:** `GET /api/suppliers`, `POST /api/suppliers`, `DELETE /api/suppliers/:id`
* **Logísticas:** `GET /api/logistics`, `POST /api/logistics`, `DELETE /api/logistics/:id`
* **Categorías:** `GET /api/categories`, `POST /api/categories`
* **Config (App y Telegram):** `GET /api/config`, `PUT /api/config`, `POST /api/config/telegram/test`
