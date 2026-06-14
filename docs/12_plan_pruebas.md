# 12. Plan de Pruebas

Para garantizar la fiabilidad del sistema antes del paso a producción, el equipo de QA (Quality Assurance) debe ejecutar los siguientes escenarios manuales.

## Pruebas de Autenticación y Seguridad
- [ ] Intentar acceder a cualquier ruta (ej. `/api/inventory`) mediante cliente HTTP sin enviar token JWT. Esperado: `401 Unauthorized`.
- [ ] Fallar la contraseña 3 veces seguidas para un usuario. Esperado: Al tercer intento, el cliente web muestra advertencia de bloqueo y las siguientes peticiones devuelven `429 Too Many Requests` durante 30 segundos.
- [ ] Iniciar sesión con una cuenta de rol `operador` asignada a una logística específica. Navegar o intentar acceder mediante URL a la sección de configuración de Telegram. Esperado: Interfaz bloqueada o respuesta de la API `403 Forbidden`.

## Pruebas Lógicas de Inventario
- [ ] Crear un producto llamado "Pan" en la logística "Principal". Intentar crear otro producto idéntico en "Principal". Esperado: Error de duplicado (`409 Conflict`).
- [ ] Intentar hacer una salida de stock de "Pan" con cantidad que deje el stock negativo. Esperado: Error, operación cancelada, el registro no debe insertarse en el historial.
- [ ] Crear un producto con stock 10 y mínimo 5. Registrar una salida de -6 unidades. Esperado: 
  1. El stock baja a 4.
  2. La pantalla web comienza a emitir sonido de alarma y destellos rojos.
  3. Se muestra un modal que indica el estado crítico.

## Pruebas de Trazabilidad y Dashboard
- [ ] Realizar un movimiento (entrada o ajuste). Ir a la vista de "Historial". Esperado: El primer registro de la tabla debe reflejar el movimiento exacto (fecha, usuario correcto, nota).
- [ ] Ir a "Dashboard". Esperado: El panel de "Último Movimiento" debe coincidir con la transacción reciente.

## Pruebas de Notificaciones (Integración)
- [ ] Configurar tokens y Chat ID válidos en el módulo de Telegram (rol Admin).
- [ ] Realizar una salida de stock que convierta un producto a "Crítico". Esperado: Llega un mensaje a la aplicación de Telegram correspondiente al Chat ID.
- [ ] Inmediatamente, agotar otro producto distinto. Esperado: NO llega notificación de Telegram (debido a la protección Anti-Spam de 60 segundos configurada en las reglas de negocio).
