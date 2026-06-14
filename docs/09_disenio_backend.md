# 09. Diseño Backend

El servidor backend está diseñado para ser ligero y eficiente, construido sobre Node.js y Express 4.

## Middleware y Seguridad
* **Autenticación (JWT):** Las rutas protegidas requieren un token válido en el header `Authorization: Bearer <token>`.
* **Guardias de Rol:** Middleware `requireAdmin` interrumpe peticiones (`403 Forbidden`) si el usuario autenticado intenta acceder a rutas de gestión a las cuales no tiene privilegio (ej. modificar config de Telegram o crear usuarios).
* **Protección Anti-Brute Force:** El endpoint `/api/auth/login` rastrea las direcciones IP en memoria. Si una IP falla 3 intentos consecutivos, se rechaza cualquier petición adicional por 30 segundos (`429 Too Many Requests`).

## Organización de Rutas
Las rutas siguen los principios REST. Se organizan modularmente en la carpeta `src/backend/routes`:
* `/api/inventory` — CRUD de productos y endpoint especial `/move` para alterar el stock transaccionalmente.
* `/api/history` — Consultas paginadas/limitadas de la bitácora de movimientos.
* `/api/users`, `/api/categories`, `/api/suppliers`, `/api/logistics` — CRUD de catálogos y administración.
* `/api/stats` — Endpoint optimizado para alimentar las tarjetas del Dashboard con una sola petición.
* `/api/config` — Obtención y mutación segura de los ajustes globales (telegram y apariencia).

## Integración Telegram
El módulo `telegram.js` se comunica vía HTTPS nativo hacia `api.telegram.org`. 
* **Prevención de Spam:** Implementa un `debounce` persistido en la base de datos (`telegram_last_sent`). Asegura que no se enviarán dos mensajes en un lapso de 60 segundos, aunque existan cientos de movimientos de inventario simultáneos.
