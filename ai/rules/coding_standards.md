# Coding Standards para IA

Al generar o refactorizar código para este proyecto, el LLM debe adherirse a las siguientes directrices estrictas:

1. **Stack Mínimo:** 
   - No proponer instalación de React, Vue, Svelte, Tailwind, Bootstrap u otras librerías pesadas en el frontend.
   - El código de interfaz debe ser exclusivamente HTML5 puro, CSS3 (con Custom Properties) y JavaScript ES6+ (Vanilla JS).

2. **Frontend Modular:**
   - Todo el JS debe estar encapsulado en el patrón "Revealing Module" (ej. `const MiModulo = (() => { ... return {...} })();`) para evitar la contaminación del namespace global.

3. **Backend Express Ligero:**
   - Usar `require` (CommonJS) por defecto, ya que Node 18 no requiere configurar `type: module` necesariamente.
   - Todo el acceso a la base de datos `sqlite3` debe hacerse mediante la librería síncrona `better-sqlite3`.

4. **Idioma y Nomenclatura:**
   - La interfaz gráfica, mensajes de error y comentarios deben estar en **Español**.
   - Nombres de variables y funciones internas pueden estar en inglés o español, pero se prefiere el estándar camelCase en inglés para variables lógicas y español para textos visibles por el usuario.
