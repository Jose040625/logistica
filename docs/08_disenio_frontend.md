# 08. Diseño Frontend

El frontend de la aplicación web fue diseñado para ser altamente responsivo, rápido y con un bajo impacto cognitivo para los operadores en entornos de alto estrés como comedores y cocinas.

## Conceptos de Interfaz
* **Single Page Application (SPA):** Todo el contenido se carga una vez en el archivo `index.html`. La navegación entre secciones no requiere recargas completas, mejorando significativamente la velocidad percibida.
* **Sistema de Diseño Oscuro (Dark Mode):** Se utiliza una paleta de colores oscuros (`--bg: #080E1A`, `--surface: #0D1626`) por defecto. Esto minimiza el cansancio visual y resalta eficazmente las alertas (rojo/amarillo) por contraste.
* **Microinteracciones:** Se emplean animaciones sutiles CSS para *hover*, expansiones y notificaciones tipo *Toast*, dando retroalimentación inmediata a las acciones del usuario.

## Estructura de Módulos (JS)
El código de cliente no utiliza frameworks pesados (React/Angular), logrando un bundle de tamaño mínimo.
* `app.js` — Orquestador, manejador del enrutamiento de vistas y bucle de polling (verificación periódica) para el stock crítico.
* `api.js` — *Wrapper* estandarizado de la API Fetch para peticiones JSON con inyección automática de tokens.
* `auth.js` — Lógica de inicio de sesión, almacenamiento local del JWT y protección contra fuerza bruta del lado cliente.
* `alarm.js` — Módulo crítico que manipula el `AudioContext` para la generación de la onda de sonido tipo sirena, así como la manipulación del DOM para el parpadeo de pantalla y visualización del modal.
* Resto de módulos (ej. `inventory.js`, `dashboard.js`, etc.) — Encapsulan la lógica específica de cada vista (renderizado de tablas/tarjetas, y eventos de botones).
