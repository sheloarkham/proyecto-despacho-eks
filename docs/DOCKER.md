# Dockerfiles del proyecto - Evidencia

Este documento describe los **3 Dockerfiles multietapa** del monorepo, requisito del encargo y de la guía DevOps.

## Resumen

| Componente | Ruta del Dockerfile | Etapas | Imagen base runtime | Puerto |
|------------|---------------------|--------|---------------------|--------|
| API Ventas | `back-Ventas_SpringBoot/Springboot-API-REST/Dockerfile` | 2 | `eclipse-temurin:17-jre-alpine` | 8080 |
| API Despachos | `back-Despachos_SpringBoot/Springboot-API-REST-DESPACHO/Dockerfile` | 2 | `eclipse-temurin:17-jre-alpine` | 8081 |
| Frontend | `front_despacho/Dockerfile` | 2 | `nginx:1.27-alpine` | 80 |

## Buenas practicas aplicadas

- **Multietapa (multi-stage)**: etapa `builder` + etapa runtime minimalista
- **`.dockerignore`**: excluye `target/`, `node_modules/`, `.git`, `.env`
- **Imagenes slim/alpine**: JRE-alpine y nginx-alpine
- **Usuario no-root**: backends corren como usuario `spring`
- **Health checks**: Actuator en APIs, HTTP en nginx
- **Variables de entorno**: `VITE_*` en build del frontend

## Dockerfile API Ventas (multietapa)

```
Etapa 1 (builder): maven:3.9-eclipse-temurin-17-alpine
  → mvn dependency:go-offline
  → mvn package -DskipTests

Etapa 2 (runtime): eclipse-temurin:17-jre-alpine
  → solo copia el .jar compilado
  → HEALTHCHECK /actuator/health
```

**Archivo:** `back-Ventas_SpringBoot/Springboot-API-REST/Dockerfile`

## Dockerfile API Despachos (multietapa)

Misma estructura que Ventas, puerto **8081**.

**Archivo:** `back-Despachos_SpringBoot/Springboot-API-REST-DESPACHO/Dockerfile`

## Dockerfile Frontend (multietapa)

```
Etapa 1 (builder): node:20-alpine
  → npm ci
  → npm run build (Vite)

Etapa 2 (runtime): nginx:1.27-alpine
  → sirve /dist estatico
  → proxy /api/* a servicios internos K8s
```

**Archivo:** `front_despacho/Dockerfile`  
**Config nginx:** `front_despacho/nginx.conf`

## Orquestacion local

```bash
docker compose up --build
```

Archivo: `docker-compose.yml` (raiz del repo)

## Publicacion en ECR

Imagenes publicadas en Amazon ECR:

```
889327993925.dkr.ecr.us-east-1.amazonaws.com/ventas-backend:eks-1
889327993925.dkr.ecr.us-east-1.amazonaws.com/despachos-backend:eks-1
889327993925.dkr.ecr.us-east-1.amazonaws.com/frontend:eks-1
```

Tags de trazabilidad en CI/CD: `eks-{run_number}`

## Comandos para demostrar en presentacion

```bash
# Listar Dockerfiles en el repo
find . -name "Dockerfile" -not -path "./.git/*"

# Ver estructura multietapa
head -15 back-Ventas_SpringBoot/Springboot-API-REST/Dockerfile
head -15 front_despacho/Dockerfile

# Build local de prueba
docker build -t ventas-local ./back-Ventas_SpringBoot/Springboot-API-REST
docker images | grep ventas-local
```

## Capturas sugeridas para el informe

1. Arbol del repo mostrando los 3 `Dockerfile`
2. Contenido de un Dockerfile aberto en IDE (etapas builder + runtime)
3. Consola ECR con las 3 imagenes
4. `docker compose up --build` levantando los servicios
