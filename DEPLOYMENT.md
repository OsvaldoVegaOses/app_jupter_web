# Guía de Despliegue - Azure Static Web Apps

Este proyecto está configurado para desplegarse automáticamente en Azure Static Web Apps usando GitHub Actions.

## Configuración Inicial

### Información del Proyecto
- **Framework**: Astro con Tailwind CSS
- **Subscription ID de Azure**: `54ce7e6a-e909-4bef-b0cd-8133c2087dcf`
- **Directorio**: ONG Tren Ciudadano (ongtrenciudadano.onmicrosoft.com)
- **Carpeta de salida del build**: `dist` (salida estándar de Astro)
- **Assets estáticos**: `public` (copiados automáticamente por Astro)

## Pasos para Completar la Configuración

### 1. Crear el Recurso Azure Static Web App

1. Ir al Portal de Azure: https://portal.azure.com
2. Seleccionar la suscripción: `54ce7e6a-e909-4bef-b0cd-8133c2087dcf`
3. Crear nuevo recurso > Static Web App
4. Configuración recomendada:
   - **Nombre**: `ong-tren-ciudadano-web` (o el nombre que prefieras)
   - **Region**: Elegir la más cercana a tus usuarios (ej: East US 2, West Europe)
   - **Deployment source**: GitHub
   - **Organización**: OsvaldoVegaOses
   - **Repositorio**: app_jupter_web
   - **Rama**: main
   - **Build Presets**: Custom
   - **App location**: /
   - **Output location**: dist
   - **API location**: (dejar vacío)

### 2. Obtener el API Token

1. Una vez creado el recurso, ir a "Manage deployment token" en el portal de Azure
2. Copiar el token de despliegue

### 3. Configurar el Secret en GitHub

1. Ir a: https://github.com/OsvaldoVegaOses/app_jupter_web/settings/secrets/actions
2. Hacer clic en "New repository secret"
3. Crear un nuevo secret con:
   - **Name**: `AZURE_STATIC_WEB_APPS_API_TOKEN`
   - **Value**: Pegar el token copiado de Azure

### 4. Despliegue Automático

Una vez configurado el secret:

- **Cada push a `main`** desplegará automáticamente el sitio
- **Los Pull Requests** crearán preview deployments temporales
- Azure proporcionará una URL pública para tu sitio
- Los preview deployments se eliminarán automáticamente cuando se cierre el PR

## Workflow de GitHub Actions

El workflow está configurado en `.github/workflows/azure-static-web-apps.yml` y realiza:

1. **Build Job** (en push a main o PR abierto/actualizado):
   - Checkout del código
   - Setup de Node.js 18
   - Instalación de dependencias con `npm ci`
   - Build del sitio con `npm run build`
   - Deploy a Azure Static Web Apps

2. **Close PR Job** (cuando se cierra un PR):
   - Elimina el preview deployment asociado al PR

## Verificación del Despliegue

1. Ve a la pestaña "Actions" en GitHub para ver el progreso del workflow
2. En el portal de Azure, el recurso Static Web App mostrará:
   - El estado del despliegue
   - La URL del sitio desplegado
   - Logs de despliegue
   - Configuración de dominio personalizado (opcional)

## Comandos de Build Local

Para verificar el build localmente antes de desplegar:

```bash
# Instalar dependencias
npm install

# Build del sitio
npm run build

# Preview del build
npm run preview
```

El sitio construido estará en la carpeta `dist/`.

## Resolución de Problemas

### El workflow falla en el step de deploy
- Verificar que el secret `AZURE_STATIC_WEB_APPS_API_TOKEN` esté configurado correctamente
- Verificar que el token no haya expirado

### El sitio no se ve correctamente después del despliegue
- Verificar que `npm run build` funcione correctamente en local
- Revisar los logs del workflow en GitHub Actions
- Verificar la configuración de rutas en `astro.config.mjs`

### Preview deployments no se crean para PRs
- Verificar que el PR esté dirigido a la rama `main`
- Verificar que el workflow tenga permisos para ejecutarse en PRs

## Recursos Adicionales

- [Documentación de Azure Static Web Apps](https://docs.microsoft.com/azure/static-web-apps/)
- [Documentación de Astro](https://docs.astro.build/)
- [GitHub Actions - Azure Static Web Apps Deploy](https://github.com/Azure/static-web-apps-deploy)
