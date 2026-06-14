# 10. Modelo de Datos

La aplicación utiliza `SQLite`, una base de datos relacional sin servidor, altamente robusta para aplicaciones de este tamaño. Está configurada en modo WAL (*Write-Ahead Logging*) para habilitar lecturas y escrituras simultáneas sin bloqueos.

## Esquema de Tablas (Entidad-Relación Lógica)

### 1. `usuarios`
| Columna | Tipo | Restricción | Descripción |
|---|---|---|---|
| id | INTEGER | PK, Auto | Identificador único |
| username | TEXT | Unique, Not Null | Nombre de ingreso |
| password | TEXT | Not Null | Hash Bcrypt |
| rol | TEXT | Default 'operador' | `admin` u `operador` |
| logistica | TEXT | Default 'Principal' | Sede a la que pertenece |

### 2. `inventario`
| Columna | Tipo | Restricción | Descripción |
|---|---|---|---|
| id | INTEGER | PK, Auto | Identificador único |
| producto | TEXT | Not Null | Nombre del producto |
| logistica | TEXT | Default 'Principal' | Sede a la que pertenece |
| stock | INTEGER | Default 0 | Existencia actual |
| minimo | INTEGER | Default 5 | Umbral para disparo de alarma |
| categoria | TEXT | Default 'General' | Referencia a categorías |
| unidad | TEXT | Default 'unidades' | Tipo de medida (kg, l, ud) |
| precio | REAL | Default 0 | Costo de referencia |
| proveedor | TEXT | Default '' | Referencia a proveedores |
*Nota: Existe una restricción `UNIQUE(producto, logistica)` para evitar duplicados del mismo producto en la misma sede.*

### 3. `historial`
| Columna | Tipo | Restricción | Descripción |
|---|---|---|---|
| id | INTEGER | PK, Auto | Identificador único |
| fecha | TEXT | Not Null | Marca de tiempo (ISO 8601 string) |
| usuario | TEXT | Not Null | Quién hizo el movimiento |
| producto | TEXT | Not Null | Qué producto fue afectado |
| logistica | TEXT | Not Null | Sede donde ocurrió el cambio |
| cambio | INTEGER | Not Null | Cantidad de afectación (positivo o negativo) |
| stock_final | INTEGER | Not Null | Existencia luego de la transacción |
| tipo | TEXT | Default 'movimiento' | `entrada`, `salida`, `ajuste` |
| nota | TEXT | | Comentario opcional justificador |

### Tablas Secundarias (Catálogos)
- `logisticas`: Listado de sedes válidas (`id`, `nombre`).
- `categorias`: Clasificaciones posibles (`id`, `nombre`, `icono`).
- `proveedores`: Lista de contactos comerciales (`id`, `nombre`, `telefono`, `email`, `notas`).
- `ajustes`: Tabla clave-valor genérica para opciones del sistema (`id`, `clave`, `valor`). Aquí reside la configuración de Telegram.
