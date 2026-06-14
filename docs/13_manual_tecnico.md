# 13. Manual Técnico (Instalación y Despliegue)

Este documento guía a los desarrolladores en la puesta en marcha de la aplicación **Gestión Comedor v4.0** en entornos locales o de servidor.

## Requisitos Previos
1. **Node.js** v18 o superior.
2. **NPM** (incluido nativamente con Node).
3. **Navegador Web Moderno** (para interactuar con el cliente).

## Entorno Local (Desarrollo)

### Paso 1: Clonar y Preparar
Abre tu terminal y navega hasta la raíz del proyecto. Instala las dependencias declaradas en `package.json`.
```bash
cd comedor-web
npm install
```
*Dependencias principales:* `express`, `better-sqlite3`, `jsonwebtoken`, `bcryptjs`.

### Paso 2: Inicialización
En el primer arranque, la aplicación inicializará el archivo de base de datos (`comedor.db`) en la raíz del proyecto si este no existe, inyectando los datos semilla (Usuario admin inicial y catálogos).
Para arrancar el servidor en modo *hot-reload*:
```bash
npm run dev
```

### Paso 3: Acceso
Abre el navegador en [http://localhost:3000](http://localhost:3000).
- **Usuario por defecto:** `admin`
- **Contraseña:** `admin`

## Entorno de Producción (Servidor Linux)

1. Sube los archivos al servidor (omitir `node_modules` y ejecutar `npm install --omit=dev` en remoto).
2. Se recomienda instalar el gestor de procesos **PM2** para mantener el servicio activo permanentemente.
```bash
sudo npm install -g pm2
pm2 start src/backend/server.js --name "comedor"
pm2 save
pm2 startup
```
3. Utiliza Nginx o Apache como proxy inverso para mapear el puerto 3000 al puerto 80 (HTTP) o 443 (HTTPS) de tu dominio.

## Consideraciones sobre la Base de Datos
Dado que SQLite es un sistema basado en archivos, toda la información reside en `comedor.db`.
- **Copias de seguridad (Backups):** Es suficiente con programar un script Cron que copie el archivo `comedor.db` periódicamente a una ubicación segura.
