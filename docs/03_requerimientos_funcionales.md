# 03. Requerimientos Funcionales

| ID | Nombre | Descripción | Prioridad |
|---|---|---|---|
| RF-01 | Autenticación Segura | El sistema debe requerir nombre de usuario y contraseña cifrada para acceder. Debe bloquear temporalmente (30s) la IP tras 3 intentos fallidos. | Alta |
| RF-02 | Gestión de Inventario | El sistema debe permitir listar, crear, modificar stock (entradas/salidas/ajustes) y eliminar productos. | Alta |
| RF-03 | Filtrado por Logística | Los usuarios con rol `operador` solo verán e interactuarán con el inventario de su sede logística asignada. | Alta |
| RF-04 | Historial Inmutable | Todo movimiento de stock debe generar un registro automático con fecha, usuario, cantidad, stock resultante, tipo y logística. | Alta |
| RF-05 | Alarma Visual/Sonora | Si un producto alcanza o cae por debajo de su umbral mínimo, el cliente web debe emitir un sonido continuo, parpadear la pantalla en rojo y mostrar un modal bloqueante. | Alta |
| RF-06 | Notificaciones Telegram | El backend debe enviar un mensaje consolidado al chat de Telegram configurado cuando haya productos críticos (máximo 1 mensaje por minuto). | Media |
| RF-07 | Dashboard | El sistema debe presentar métricas globales: Total productos, Stock Total, Ítems Críticos, Movimientos totales y "Mejores salidas". | Media |
| RF-08 | Gestión de Usuarios | El administrador debe poder crear, listar y eliminar usuarios, asignándoles un rol (`admin`/`operador`) y una logística. | Alta |
| RF-09 | Catálogos Auxiliares | El administrador debe poder gestionar Proveedores, Categorías y Logísticas (crear, listar y eliminar). | Baja |
| RF-10 | Configuración de App | El administrador debe poder personalizar el nombre y el ícono de la aplicación, así como activar/desactivar y configurar las credenciales de Telegram. | Baja |
