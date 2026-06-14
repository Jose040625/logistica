# 🍽 Gestión Comedor v4.0

Una aplicación web completa y profesional para la gestión de inventario y monitoreo en tiempo real de insumos en comedores, construida siguiendo estrictos estándares de la industria y diseñada desde cero con asistencia de IA.

![Portada](docs/placeholder_portada.jpg) *(Nota: reemplaza con captura de pantalla real)*

## 🚀 Características Principales
* **100% Web / SPA:** Carga instantánea sin recargas de página.
* **Seguridad:** JWT, encriptación bcrypt, mitigación *brute force* del lado del servidor.
* **Alarma Integrada:** Generador de tonos ascendentes usando `AudioContext` en el navegador + parpadeo rojo de pantalla.
* **Telegram Push:** Notificaciones automáticas al administrador cuando el stock es crítico, con algoritmo Anti-Spam incorporado.
* **Multi-Sede (Logísticas):** Inventarios separados por ubicación; los operadores ven solo lo que les corresponde.
* **Trazabilidad Absoluta:** Base de datos SQLite inmutable para los historiales de movimiento.

## 🛠 Pila Tecnológica (Stack)
* **Backend:** Node.js, Express.js
* **Base de Datos:** SQLite (`better-sqlite3`) en modo WAL.
* **Frontend:** HTML5, CSS3 Variables (Dark Theme Nativo), Vanilla JavaScript (Sin Frameworks).

## 📚 Documentación
Toda la documentación técnica, arquitectónica y operativa se encuentra en la carpeta `/docs`.
Te recomendamos empezar por [docs/index.md](docs/index.md).

## 🤖 Integración IA
El desarrollo de esta aplicación utilizó agentes virtuales para segmentar los requerimientos (Arquitectura, Frontend, Backend, QA). Las directrices y prompts se ubican en la carpeta `/ai/`.

## 📦 Instalación Rápida
```bash
# 1. Clonar
git clone https://github.com/tu-usuario/comedor-web.git
cd comedor-web

# 2. Instalar
npm install

# 3. Correr
npm run dev
```
Accede a `http://localhost:3000`. 
**Credenciales Iniciales:** `admin` / `admin`.

---
*Desarrollado para resolver los quiebres de stock y modernizar la operativa de comedores institucionales.*
