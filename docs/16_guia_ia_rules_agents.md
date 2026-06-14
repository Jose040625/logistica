# 16. Guía de Integración IA (Rules & Agents)

Como parte de los entregables del repositorio, el sistema de Gestión Comedor fue construido apoyándose en herramientas de IA Generativa.
La estructuración de roles e interacciones se dividió mediante *Agentes* simulados y *Reglas* (Rules) para mantener el enfoque y la consistencia del código.

## Ubicación de las Directrices
Los lineamientos completos residen en el directorio raíz `/ai/`.

### Rules (Reglas de Conducta IA)
* `coding_standards.md`: Forzó a la IA a escribir CSS y JS puro en lugar de importar librerías tipo React/Tailwind, para asegurar un bundle mínimo.
* `architecture_rules.md`: Impuso el uso del patrón "Single Page Application" en frontend y "Micro-Router" en backend.
* `documentation_rules.md`: Garantizó que todo el código esté documentado en español y las tablas Markdown sean legibles.

### Agentes
Se segmentó el conocimiento en perfiles simulados:
1. `arquitecto.md`: Responsable de la topología Express + SQLite.
2. `frontend_dev.md`: Encargado de emular la estética del script Python original (CustomTkinter) en HTML/CSS oscuro.
3. `backend_dev.md`: Manejó middlewares, JWT y algoritmos antispam para Telegram.
4. `qa_tester.md`: Creador de los escenarios definidos en el Plan de Pruebas.
5. `documentador.md`: Autor simulado de esta serie de 16 documentos (docs/).
