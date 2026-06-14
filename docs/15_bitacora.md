# 15. Bitácora de Desarrollo

Este documento narra el proceso de migración de la aplicación escritorio (CustomTkinter/Python) hacia una arquitectura Web escalable (Node/Vanilla JS).

| Fecha / Fase | Actividad y Decisiones Técnicas |
|---|---|
| **Fase 1: Análisis** | Se auditó el código original `comedor.py`. Se identificaron los cuellos de botella: dependencia del sistema operativo Windows (`winsound`) y la interfaz gráfica no distribuible. Se propuso una pila tecnológica web de bajo peso (Node.js + Vanilla JS) sin transpiladores pesados. |
| **Fase 2: Backend & DB** | Se mapeó el esquema SQLite existente a Node.js mediante `better-sqlite3`. Se agregó cifrado JWT para las comunicaciones y un endpoint genérico `/api/config` para evitar archivos locales tipo `config.json`. |
| **Fase 3: Frontend Shell** | Se implementó la estructura de Single Page Application. Se definió el Design System (Dark Theme) en CSS puro con variables `--card`, `--bg`, etc. Se logró imitar el comportamiento del modo oscuro original de CustomTkinter. |
| **Fase 4: Alarma y Audio** | Gran desafío: Los navegadores modernos bloquean la reproducción de audio si el usuario no ha interactuado con la página. Se solucionó encapsulando la alerta usando `AudioContext` y enganchándolo al bucle de renderizado solo después del Login (que ya cuenta como interacción válida). |
| **Fase 5: Telegram** | Se movió la lógica de envío HTTP hacia Telegram desde el cliente (como era en Python) hacia el Servidor (Express). Esto oculta el Token y mejora drásticamente la seguridad de la red institucional. Se programó un *cooldown* de 60 segundos anti-spam. |
| **Fase 6: Documentación** | Se prepararon los 16 documentos requeridos por el estándar del proyecto, reflejando el diseño de la versión web 4.0. |
