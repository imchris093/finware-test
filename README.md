# Reto Finware - Plataforma de Inversión

## Arquitectura
- **Frontend**: Next.js 16 con TypeScript y Tailwind CSS
- **Backend**: Express.js con Sequelize y PostgreSQL
- **Base de Datos**: PostgreSQL 18
- **LLM**: Ollama para funcionalidades de IA

## Requisitos

- Docker y Docker Compose
- Node.js 25+ (si ejecutas localmente)
- PostgreSQL 18 (si ejecutas localmente)

## Inicio Rápido

### Desarrollo

1. Clona el repositorio
2. Copia `.env.example` a `.env`
3. Ejecuta:

```bash
docker-compose up --build 
```
4. Inicio por defecto de front `localhost:3000`
5. Links de los endpoints con postman en `.postman/`

## Estructura del Proyecto

```
reto_finware_1/
├── api/                 # Backend Express.js
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── middlewares/
│   ├── database/
│   │   ├── models/
│   │   ├── migrations/
│   │   └── seeders/
│   └── Dockerfile.api
├── front/               # Frontend Next.js
│   ├── pages/
│   ├── components/
│   ├── context/
│   └── Dockerfile.front
├── docker-compose.yml   # Desarrollo
├── docker-compose.prod.yml  # Producción
└── deploy.sh           # Script de despliegue
```
### Esquema de Base de Datos

| Tabla | Descripcion |
| ----- | ----------- |
| `usuarios`      | Información básica de cada inversionista. |
| `oportunidades` |  Oportunidades de inversión disponibles en la plataforma. |
| `transacciones` |  Registro histórico de cada inversión realizada por un usuario en una oportunidad. |
| `estados`       | Estado acumulado de la inversión de un usuario en una oportunidad (monto invertido total). |
| `usuarios_oportunidades` | Tabla pivote many-to-many usada por Sequelize para asociar usuarios con oportunidades. |


> Migraciones:
> - `api/database/migrations/20251123010255-create-initial-tables.js`
> - `api/database/migrations/20251123010256-create-initial-associations.js`

> Seeder (no necesario, agrega más oportunidades para invertir):
> - `20251123003924-demo-usuarios-oportunidades.js`

## Endpoints

Los routers definidos en `api/src/routes` exponen los siguientes endpoints (todos montados bajo `/api/v1` en `api/app.js`):


| Método | Endpoint completo | Descripción     | Middleware |
|--------|-----------------------|-------------|------------|
| `POST` | `/api/v1/auth/register`  | Registro de usuarios | — |
| `POST` | `/api/v1/auth/login`     | Inicio de sesión     | — |
| `GET`  | `/api/v1/oportunities` | Listado de oportunidades disponibles | `auth` |
| `POST` | `/api/v1/oportunities` | Crear oportunidad | `Desde POSTMAN`|
| `GET`  | `/api/v1/operations/user/:id/investments` | Inversiones del usuario | `auth` |
| `GET`  | `/api/v1/operations/user/:id/transactions` | Transacciones del usuario | `auth` |
| `POST` | `/api/v1/operations/invest` | Registrar inversión | `auth` |

### Postman

Importa la coleccion desde el workspace de Postman

- `./postman/Finware API.postman_collection.json`
- `./postman/Dev.postman_environment.json`

link público de colección de endpoints:

`https://www.postman.com/red-crater-6666/workspace/test-finware/request/29619990-43ba8c6f-51d0-4e41-8fb2-d84733146d66?action=share&creator=29619990&ctx=documentation&active-environment=29619990-1ec8e739-3696-4d17-9f4b-b74742182baa`

## LLM

El proyecto usa un contenedor de `docker` con la imagen de `ollama/ollama:latest`.
Es usada para generar unicamente texto desde el modelo `gemma3:270m`, para evitar consumir muchos recursos.

- Se configura automaticamente desde `docker-compose.yml`
- Su uso consta a travez del endpoint de `post - /api/v1/oportunidades`

## Frontend

Plantilla básica de `https://vercel.com/templates/next.js`

## Configuración

### Variables de Entorno

Copia `.env.example` a `.env` y configura:

- **Base de Datos**: Credenciales de PostgreSQL
- **JWT_SECRET**: Clave secreta para tokens JWT
- **WEBAPP_URL**: URL del frontend
- **NEXT_PUBLIC_API_URL**: URL del backend API

### Puertos por Defecto

- Frontend: `3000`
- Backend API: `8080`
- PostgreSQL: `5432`
- Ollama: `11434`

## Comandos Útiles

### Desarrollo

```bash
# Iniciar todos los servicios
docker compose up -d

# Ver logs
docker compose logs -f

# Detener servicios
docker compose down

# Ejecutar migraciones
docker compose exec api npm run migrate

# Ejecutar seeders
docker compose exec api npm run seed
```

## Seguridad

- Las contraseñas se hashean con bcrypt
- Autenticación JWT
- CORS configurado
- Headers de seguridad en Next.js
- Usuarios no-root en contenedores Docker

## Troubleshooting

**Si da problemas el contenedor de Ollama:**
- Permisos de ejecucion chmod+ en `/ollama/ollama.sh`

