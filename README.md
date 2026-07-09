# Arquitectura automatizada para Plataforma de Despachos

## Portada del proyecto

**Proyecto:** Plataforma de gestión de ventas y despachos  
**Autores:** Diego Herrera y Luis Rosales  
**Institución:** Duoc UC — TAITE 7  
**Repositorio:** [proyecto-despacho-eks](https://github.com/sheloarkham/proyecto-despacho-eks)

---

## Descripción del proyecto

### Objetivo del sistema

Diseñar e implementar una plataforma web que permita gestionar el ciclo de **ventas** y **despachos** de forma integrada, desplegada en la nube con prácticas DevOps: contenerización, CI/CD automatizado, orquestación en Kubernetes y observabilidad centralizada.

### Funcionalidad principal

| Módulo | Descripción |
|--------|-------------|
| **Frontend** | Panel web en React/Vite con navegación por secciones (usuarios, productos, configuración, dashboard) |
| **API Ventas** | CRUD de ventas, generación de despachos asociados (Spring Boot, puerto 8080) |
| **API Despachos** | Gestión y seguimiento de despachos (Spring Boot, puerto 8081) |
| **Base de datos** | PostgreSQL en Neon (persistencia relacional en la nube) |

### Tecnologías utilizadas

| Capa | Tecnología |
|------|------------|
| Frontend | React, Vite, nginx |
| Backend | Java 17, Spring Boot, Spring Data JPA, Actuator |
| Base de datos | PostgreSQL (Neon) |
| Contenedores | Docker (Dockerfiles multietapa) |
| Orquestación local | Docker Compose |
| Orquestación cloud | **Amazon EKS** (Kubernetes) |
| Registro de imágenes | **Amazon ECR** |
| CI/CD | **GitHub Actions** |
| Observabilidad | **Amazon CloudWatch** + `kubectl logs` |
| Cloud | **AWS** (región `us-east-1`, AWS Academy Learner Lab) |

---

## Arquitectura general

### Región AWS

- **Región:** `us-east-1` (Norte de Virginia)
- **Account ID:** `889327993925`
- **Cluster EKS:** `devopseks`

### Red y componentes

```
                         Internet
                            │
                            ▼
              ┌─────────────────────────────┐
              │  frontend-service           │
              │  (LoadBalancer — público)   │
              │  nginx + React              │
              └──────────┬──────────────────┘
                         │ proxy interno K8s
           ┌─────────────┴─────────────┐
           ▼                           ▼
┌──────────────────┐        ┌──────────────────┐
│ ventas-service   │        │ despachos-service│
│ (ClusterIP)      │        │ (ClusterIP)      │
│ Spring Boot :8080│        │ Spring Boot :8081│
└────────┬─────────┘        └────────┬─────────┘
         └──────────────┬─────────────┘
                        ▼
              ┌──────────────────┐
              │ Neon PostgreSQL  │
              │ (BD externa)     │
              └──────────────────┘
```

### VPC y subredes

El cluster EKS se despliega sobre la VPC creada por el stack de CloudFormation del Learner Lab:

| Elemento | Rol |
|----------|-----|
| **VPC** | Red aislada del proyecto |
| **Subredes públicas** | Nodos EKS, LoadBalancer del frontend |
| **Subredes privadas** | Tráfico interno del cluster |
| **Internet Gateway** | Acceso público al LoadBalancer |
| **Security Groups** | Control de tráfico entre ALB, nodos y servicios |

### Capas de la aplicación

| Capa | Implementación | Exposición |
|------|----------------|------------|
| **Front** | Pod `frontend` (nginx + React) | Pública vía LoadBalancer |
| **Back** | Pods `ventas` y `despachos` (Spring Boot) | Interna (ClusterIP) |
| **Data** | Neon PostgreSQL | Externa, acceso por credenciales en K8s Secret |

> Los backends **no** están expuestos a internet. Solo el frontend recibe tráfico externo y hace proxy a las APIs por DNS interno de Kubernetes.

---

## Gestión de versiones

### Uso de ramas: `main`, `develop`, `feature`

| Rama | Propósito | Pipeline |
|------|-----------|----------|
| `main` | Producción / entrega final | Tests + Build + Push ECR + Deploy EKS |
| `develop` | Integración continua | Solo tests automáticos |
| `feature` | Trabajo diario del equipo | Tests al integrar en `develop` |
| `feat/*` | Funcionalidades puntuales | Tests al mergear a `develop` |

### Flujo de commits y merges

```
feat/*  ──merge──>  feature  ──merge──>  develop  ──PR──>  main  ──deploy──>  EKS
```

### Autoría y control de cambios

- Commits descriptivos con convención (`feat:`, `fix:`, `chore:`)
- Pull Requests para integrar `develop` → `main`
- Historial visible en GitHub con autoría por colaborador
- Documentación de ramas en [docs/BRANCHING.md](docs/BRANCHING.md)

---

## Contenerización

### 3 contenedores

| Contenedor | Dockerfile | Puerto | Imagen base runtime |
|------------|------------|--------|---------------------|
| API Ventas | `back-Ventas_SpringBoot/Springboot-API-REST/Dockerfile` | 8080 | `eclipse-temurin:17-jre-alpine` |
| API Despachos | `back-Despachos_SpringBoot/Springboot-API-REST-DESPACHO/Dockerfile` | 8081 | `eclipse-temurin:17-jre-alpine` |
| Frontend | `front_despacho/Dockerfile` | 80 | `nginx:1.27-alpine` |

### Dockerfile con etapas build y runtime

Cada Dockerfile usa **multistage build**:

```
Etapa 1 (builder):
  → Maven o Node compilan el proyecto
  → Descarga de dependencias
  → Copia del código fuente

Etapa 2 (runtime):
  → Solo el artefacto final (.jar o /dist)
  → Imagen slim/alpine
  → Usuario no-root (backends)
  → Health checks (Actuator / HTTP)
```

Detalle completo en [docs/DOCKER.md](docs/DOCKER.md).

### Configuración de puertos

| Servicio | Puerto contenedor | Puerto local (compose) |
|----------|-------------------|------------------------|
| Ventas API | 8080 | 8080 |
| Despachos API | 8081 | 8081 |
| Frontend | 80 | 80 |
| MySQL (solo local) | 3306 | 3306 |

---

## Docker Compose

### Definición de servicios multi-contenedor

Archivo: `docker-compose.yml` (raíz del repositorio)

Orquesta localmente los 4 servicios:

- `mysql` — base de datos local de desarrollo
- `ventas-service` — API Ventas
- `despachos-service` — API Despachos
- `frontend` — interfaz web con nginx

### Orquestación local de aplicaciones

```bash
cp .env.example .env
docker compose up --build
# App disponible en http://localhost
```

> Docker Compose se usa para **desarrollo local**. En producción, **Kubernetes (EKS)** reemplaza a Compose como orquestador.

---

## Pipeline CI/CD

### Flujo general

```
Push en GitHub
      │
      ▼
┌─────────────────┐
│ Tests (mvn test)│  ← H2 en memoria, perfil test
└────────┬────────┘
         ▼
┌─────────────────┐
│ Docker Build    │  ← 3 imágenes en paralelo
└────────┬────────┘
         ▼
┌─────────────────┐
│ Push a ECR      │  ← tag eks-{run_number}
└────────┬────────┘
         ▼
┌─────────────────┐
│ Deploy EKS      │  ← kubectl set image (rolling update)
└────────┬────────┘
         ▼
┌─────────────────┐
│ Validar pods    │  ← kubectl get pods/svc
└─────────────────┘
```

### Push en GitHub → Build y ejecución de tests

- Trigger: push a `main`, `develop`, `deploy` o ejecución manual
- Tests: `mvn test -Dspring.profiles.active=test` en ambas APIs
- Base de datos de prueba: H2 en memoria (sin dependencia externa)

### Docker Build → Push a Amazon ECR

- Build de imágenes con Docker en GitHub Actions runner
- Push a repositorios ECR: `ventas-backend`, `despachos-backend`, `frontend`
- Tag versionado: `eks-{número de ejecución}`

### GitHub Actions

Archivo: `.github/workflows/eks-deploy.yml`

| Job | Descripción |
|-----|-------------|
| `test-backends` | Ejecuta tests de ambas APIs Spring Boot |
| `check-aws` | Verifica credenciales AWS configuradas |
| `build-push-deploy` | Build, push ECR y rolling update en EKS (matriz x3) |
| `validate` | Verifica pods y servicios en namespace `despacho` |

### Workflow en YAML — pasos principales

1. **Checkout** del repositorio
2. **Set up JDK 17** con cache Maven
3. **Test Ventas API** y **Test Despachos API**
4. **Configurar AWS credentials** (Learner Lab con session token)
5. **Login a ECR**
6. **Build + Push** imagen Docker
7. **Instalar kubectl** y conectar al cluster EKS
8. **Rolling update** del deployment
9. **Escanear imagen** en ECR (seguridad)
10. **Validar** pods y servicios

---

## Gestión de secretos

### Variables sensibles

| Secret | Dónde | Uso |
|--------|-------|-----|
| `AWS_ACCESS_KEY_ID` | GitHub Secrets | Pipeline CI/CD |
| `AWS_SECRET_ACCESS_KEY` | GitHub Secrets | Pipeline CI/CD |
| `AWS_SESSION_TOKEN` | GitHub Secrets | Credenciales temporales Learner Lab |
| `AWS_ACCOUNT_ID` | GitHub Secrets | Login ECR |
| `EKS_CLUSTER_NAME` | GitHub Secrets | Conexión kubectl |
| `DB_ENDPOINT`, `DB_PORT`, etc. | K8s Secret `backend-env` | Conexión Neon PostgreSQL |

### Seguridad en repositorios

- Secretos **nunca** en el código fuente
- `.gitignore` excluye `.env` y archivos sensibles
- Credenciales de BD inyectadas como variables de entorno en runtime
- Ejemplo de secret documentado en `k8s/backend-env-secret.example.yaml`
- Escaneo de vulnerabilidades en imágenes ECR desde el pipeline

---

## Infraestructura AWS

### Security Groups y reglas

| Grupo | Reglas principales |
|-------|-------------------|
| Cluster EKS | Comunicación control plane ↔ nodos |
| Nodos | Tráfico interno del cluster |
| LoadBalancer | Puerto 80/443 desde internet |

### Subredes

- Subredes **públicas**: LoadBalancer del frontend, nodos EKS
- Subredes **privadas**: tráfico interno entre pods y servicios

### Orquestación: ¿Por qué EKS?

Se eligió **Amazon EKS** (Elastic Kubernetes Service) en lugar de despliegue manual en EC2:

| Beneficio | Descripción |
|-----------|-------------|
| **Automatización** | Rolling updates sin downtime vía `kubectl rollout` |
| **Menor carga operativa** | Kubernetes gestiona pods, reinicios y networking |
| **Escalabilidad automática** | HPA escala pods al 50% CPU (mín 1, máx 3 réplicas) |
| **Alta disponibilidad** | Kubernetes reemplaza pods fallidos automáticamente |
| **Administración simplificada** | Manifiestos YAML declarativos en `k8s/` |
| **Integración CI/CD** | Flujo estándar GitHub → ECR → EKS |

### Manifiestos Kubernetes (`k8s/`)

```
k8s/
├── namespace.yaml
├── ventas-deployment.yaml / ventas-service.yaml / ventas-hpa.yaml
├── despachos-deployment.yaml / despachos-service.yaml / despachos-hpa.yaml
├── frontend-deployment.yaml / frontend-service.yaml
└── backend-env-secret.example.yaml
```

---

## Observabilidad y seguridad

### Monitoreo con CloudWatch

| Recurso | Contenido |
|---------|-----------|
| `/aws/eks/devopseks/cluster` | Logs del control plane EKS (api, audit) |
| `/aws/containerinsights/devopseks/application` | Logs de contenedores (si add-on activo) |
| `kubectl logs` | Logs en tiempo real de ventas, despachos, frontend |

### Health checks

- **Spring Actuator:** `/actuator/health` en ambas APIs
- **nginx:** health check HTTP en puerto 80
- **Readiness/Liveness probes** configurados en los Deployments

### Seguridad implementada

| Medida | Detalle |
|--------|---------|
| Backends internos | Services tipo ClusterIP (no expuestos a internet) |
| Imágenes minimalistas | JRE-alpine, nginx-alpine |
| Usuario no-root | Contenedores backend corren como `spring` |
| ECR image scan | Escaneo de vulnerabilidades en cada deploy |
| Secretos centralizados | GitHub Secrets + K8s Secrets |
| HTTPS BD | Neon PostgreSQL con `sslmode=require` |

---

## Estructura del repositorio

```
proyecto-despacho-eks/
├── front_despacho/              # React + Vite + nginx
├── back-Ventas_SpringBoot/      # API Ventas (Spring Boot)
├── back-Despachos_SpringBoot/   # API Despachos (Spring Boot)
├── k8s/                         # Manifiestos Kubernetes
├── infra/                       # Scripts y documentación infra
├── docs/
│   ├── BRANCHING.md             # Estrategia de ramas
│   └── DOCKER.md                # Evidencia Dockerfiles
├── docker-compose.yml           # Orquestación local
├── .github/workflows/
│   └── eks-deploy.yml           # Pipeline CI/CD
└── README.md
```

---

## Comandos útiles

### Desarrollo local

```bash
docker compose up --build
```

### Despliegue y validación en EKS

```bash
aws eks update-kubeconfig --region us-east-1 --name devopseks
kubectl get pods -n despacho
kubectl get svc -n despacho
kubectl logs deployment/ventas -n despacho
kubectl top pods -n despacho
```

### URL de la aplicación

```bash
kubectl get svc frontend-service -n despacho
# EXTERNAL-IP del LoadBalancer = URL pública
```

---

## Conclusiones

| Práctica DevOps | Implementación |
|-----------------|----------------|
| **Git** | Ramas `main`, `develop`, `feature` con flujo controlado |
| **CI/CD** | GitHub Actions: tests → build → ECR → EKS |
| **Contenerización** | 3 Dockerfiles multietapa + Docker Compose local |
| **Cloud** | Amazon EKS + ECR + CloudWatch en AWS |
| **Monitoreo** | CloudWatch Logs + Actuator + kubectl |
| **Seguridad** | Secretos gestionados, backends internos, ECR scan |

El proyecto demuestra un flujo DevOps completo: desde el desarrollo local con Docker Compose, pasando por integración continua con tests automatizados, hasta el despliegue automatizado en Kubernetes con observabilidad y buenas prácticas de seguridad.

---

## Equipo

**Diego Herrera** y **Luis Rosales** — Proyecto Semestral TAITE 7, Duoc UC
