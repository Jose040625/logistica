# 05. Casos de Uso

## Actores del Sistema
1. **Operador:** Personal encargado de manejar los insumos en el comedor (cocineros, despachadores).
2. **Administrador:** Gerente o supervisor encargado del sistema y compras.

---

## CU-01: Iniciar Sesión
- **Actor:** Operador, Administrador.
- **Flujo Principal:** El usuario ingresa credenciales válidas. El sistema valida contra SQLite, genera un token JWT y renderiza el Dashboard correspondiente a su rol.
- **Excepción:** Credenciales inválidas. Al tercer intento fallido, el sistema bloquea por 30 segundos la IP.

## CU-02: Registrar Entrada/Salida de Stock
- **Actor:** Operador, Administrador.
- **Flujo Principal:** El actor busca el producto en la vista de Inventario. Hace clic en el botón '+' (Entrada) o '-' (Salida). Ingresa la cantidad y, opcionalmente, una nota. Confirma la acción. El sistema actualiza el stock y genera el registro en el historial.
- **Excepción:** Si la salida resulta en un stock menor a cero, el sistema bloquea la transacción con un error.

## CU-03: Activación de Alarma de Stock
- **Actor:** Sistema.
- **Flujo Principal:** Tras cualquier movimiento de salida (CU-02), el sistema verifica si el stock resultante es menor o igual al stock mínimo. Si es así, se inicia la alerta audiovisual en el cliente y se envía una notificación Push por Telegram al administrador.

## CU-04: Gestión de Usuarios
- **Actor:** Administrador.
- **Flujo Principal:** El admin accede a "Usuarios", hace clic en "Nuevo Usuario". Asigna nombre, contraseña, rol (Operador) y Logística (ej. "Sede Norte"). El usuario se crea y solo podrá ver inventario de "Sede Norte".

## CU-05: Silenciar Alarma
- **Actor:** Operador, Administrador.
- **Flujo Principal:** Ante una alerta en pantalla, el usuario lee los productos críticos y hace clic en "Silenciar Alarma" en el modal. La pantalla deja de parpadear y el sonido se detiene. El indicador rojo en el menú lateral permanece hasta que se reponga el stock.
