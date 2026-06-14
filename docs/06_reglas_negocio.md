# 06. Reglas de Negocio

### RN-01: Unicidad de Inventario
No pueden existir dos productos con el mismo nombre dentro de la misma locación logística.

### RN-02: Stock Negativo
Bajo ninguna circunstancia el stock de un producto puede ser menor a cero. Las transacciones que resulten en valores negativos serán rechazadas por la base de datos (lógica validada en el backend).

### RN-03: Privilegios Administrativos
Los usuarios con rol `operador` tienen denegado el acceso a la creación/eliminación de usuarios, logística, categorías, proveedores y configuración general. El backend debe rechazar (HTTP 403 Forbidden) cualquier petición a esos endpoints por parte de operadores.

### RN-04: Visibilidad por Logística
Los usuarios que pertenezcan a una logística específica (ej. `Almacén 1`) NO podrán ver, consultar ni modificar el inventario que pertenece a otra logística. Solo el rol `admin` o usuarios asignados a `Todas` las logísticas tendrán visión global.

### RN-05: Inmutabilidad del Historial
Una vez registrado un movimiento en la tabla `historial` (entrada, salida o ajuste), el registro no puede ser modificado ni eliminado desde la interfaz de usuario. Cualquier corrección debe hacerse a través de un nuevo movimiento de tipo "ajuste" que compense el error.

### RN-06: Anti-Spam Telegram
Para evitar bloqueos por parte de la API de Telegram y no saturar al administrador, el sistema no enviará más de 1 alerta de stock crítico por minuto (60,000 ms), sin importar cuántos movimientos generen alertas dentro de ese periodo de tiempo.
