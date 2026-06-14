# Architecture Rules

1. **Single Page Application (SPA):**
   - Solo existe un punto de entrada HTML (`index.html`). 
   - Todas las "vistas" son etiquetas `<section>` ocultas con una clase `.hidden`. El cambio de vista se hace manipulando el DOM.

2. **API First:**
   - El backend **nunca** renderizará plantillas (ej. EJS, Pug, Jinja). Su única salida deben ser objetos JSON y códigos de estado HTTP.
   - El front **siempre** debe consumir la API mediante `fetch`, enviando el JWT en los headers en cada solicitud protegida.

3. **Seguridad Stateless:**
   - El backend no mantendrá variables de sesión en memoria. Todo el estado de autenticación viaja cifrado en el JWT.
   - Solo existe una memoria volátil tolerada en el servidor: el mapa de IPs para prevenir fuerza bruta y el temporizador anti-spam de Telegram.
