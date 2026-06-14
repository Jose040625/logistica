# 02. Objetivos y Alcance

## Objetivo General
Desarrollar e implementar una aplicación web profesional para la gestión integral de inventario en comedores, que permita el monitoreo en tiempo real, la trazabilidad de movimientos y la emisión proactiva de alertas ante niveles críticos de stock.

## Objetivos Específicos
1. **Digitalizar el inventario:** Migrar el control manual a una base de datos centralizada (SQLite) con acceso mediante roles de usuario.
2. **Garantizar trazabilidad:** Registrar automáticamente cada entrada, salida y ajuste de inventario, asociándolo a un usuario, fecha y ubicación logística.
3. **Prevenir quiebres de stock:** Implementar un sistema de alertas bidireccional (visual/sonora en el navegador y notificaciones push vía Telegram) cuando un producto alcance su nivel mínimo establecido.
4. **Soportar múltiples locaciones:** Permitir la segmentación del inventario por "Logísticas" (sedes) para que el personal visualice solo lo correspondiente a su ubicación.
5. **Ofrecer un panel gerencial:** Proveer un dashboard en tiempo real con métricas clave, productos más consumidos y estado actual del inventario global.

## Alcance del Proyecto

**Incluye:**
* Módulo de autenticación segura (JWT, bcrypt, protección contra fuerza bruta).
* Módulo CRUD de inventario completo (creación, edición de stock, eliminación).
* Historial inmutable de movimientos con filtros avanzados.
* Sistema intensivo de alarmas (AudioContext API) para el personal en sitio.
* Integración de notificaciones push vía Telegram Bot API.
* Módulos de administración para Usuarios, Categorías, Proveedores y Logísticas.
* Interfaz web responsiva y adaptada a pantallas de comedores (Dark mode).

**No Incluye (Fuera de Alcance):**
* Integración con sistemas de facturación o pasarelas de pago (no es un sistema de ventas).
* Gestión de recetas y cálculo automático de mermas por porciones (el descuento es manual o por integración futura).
* Aplicación nativa para iOS/Android (el acceso móvil se realiza mediante el navegador web responsivo).
