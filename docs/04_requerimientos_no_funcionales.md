# 04. Requerimientos No Funcionales

| ID | Atributo | Descripción |
|---|---|---|
| RNF-01 | Rendimiento | El sistema debe responder a las consultas de inventario en menos de 500ms bajo condiciones normales (base de datos local). |
| RNF-02 | Seguridad | Las contraseñas deben almacenarse hasheadas utilizando `bcrypt`. Toda comunicación cliente-servidor para acciones autenticadas debe usar `JWT` (JSON Web Tokens). |
| RNF-03 | Usabilidad | La interfaz debe ser tipo *Single Page Application* (SPA), operando de manera fluida sin recargas completas de página. Debe incluir un modo oscuro por defecto para reducir fatiga visual en pantallas de comedores. |
| RNF-04 | Disponibilidad | El backend debe poder recuperarse y reiniciar sus servicios en caso de caída mediante el gestor de procesos (ej. `pm2` o reinicio nativo). |
| RNF-05 | Compatibilidad | El sistema de alarma debe funcionar mediante la `Web Audio API`, compatible con navegadores modernos (Chrome, Firefox, Safari, Edge) sin requerir instalación de software adicional en los clientes. |
| RNF-06 | Integridad de Datos | Se utilizará `SQLite` en modo WAL (*Write-Ahead Logging*) para asegurar la consistencia y permitir lecturas y escrituras concurrentes seguras. |
| RNF-07 | Interoperabilidad | El backend se expondrá como una API RESTful completamente documentada, facilitando futuras integraciones con aplicaciones móviles o de facturación. |
