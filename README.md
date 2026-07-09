# Plataforma Despacho - CI/CD con Amazon EKS

Sistema de gestión de ventas y despachos con frontend React, dos APIs Spring Boot y PostgreSQL (Neon). Despliegue en **Amazon EKS** (Kubernetes) con pipeline **GitHub Actions**, alineado con la guía de **AWS Academy Learner Lab**.

## Ramas Git

| Rama | Uso |
|------|-----|
| `main` | Producción / entrega |
| `develop` | Integración y desarrollo |

Ver [docs/BRANCHING.md](docs/BRANCHING.md)

## Contenedores Docker

3 Dockerfiles multietapa (ventas, despachos, frontend). Ver [docs/DOCKER.md](docs/DOCKER.md)

## Arquitectura EKS

```
Internet
   │
   ▼
frontend-service (LoadBalancer, publico)
   │  nginx proxy interno
   ├── /api/v1/ventas    → ventas-service (ClusterIP, interno)
   └── /api/v1/despachos → despachos-service (ClusterIP, interno)
                                    │
                                    ▼
                              Amazon RDS (MySQL)
```

- **Frontend**: `LoadBalancer` — único punto público
- **Backends**: `ClusterIP` — solo accesibles dentro del cluster
- **Comunicación Front→Back**: DNS interno de Kubernetes (`ventas-service`, `despachos-service`)
- **HPA**: autoscaling al 50% CPU (mín 1, máx 3 réplicas)

## Estructura

```
├── front_despacho/           # React + Vite + nginx
├── back-Ventas_SpringBoot/   # API Ventas (:8080)
├── back-Despachos_SpringBoot/# API Despachos (:8081)
├── k8s/                      # Manifiestos Kubernetes
├── docker-compose.yml        # Desarrollo local
├── docs/
│   ├── BRANCHING.md          # Estrategia de ramas Git
│   └── DOCKER.md             # Evidencia Dockerfiles multietapa
└── .github/workflows/eks-deploy.yml
```

## Desarrollo local

```bash
cp .env.example .env
docker compose up --build
# http://localhost
```

## Setup EKS (Learner Lab) — orden de ejecución

### 1. Crear cluster en consola AWS
- EKS → Create cluster → Custom
- Region: `us-east-1`
- Cluster role: `LabEKSClusterRole`
- Node role: `LabEKSNodeRole`
- Logs: api, audit → CloudWatch
- Add-ons: VPC CNI, CloudWatch observability, **Metrics Server**
- Node Group: SPOT, `t3.large`, desired=1, min=1, max=3

### 2. Etiquetar subnets públicas
```
kubernetes.io/cluster/<nombre-eks> = shared
kubernetes.io/role/elb = 1
```

### 3. Crear repos ECR + preparar manifiestos
```bash
bash infra/scripts/setup-eks.sh
```

### 4. Conectar kubectl
```bash
aws eks update-kubeconfig --region us-east-1 --name <nombre-eks>
kubectl get nodes
```

### 5. Crear secreto de BD y aplicar manifiestos
```bash
kubectl create secret generic backend-env -n despacho \
  --from-literal=DB_ENDPOINT=TU-RDS.amazonaws.com \
  --from-literal=DB_PORT=3306 \
  --from-literal=DB_NAME=despacho_db \
  --from-literal=DB_USERNAME=admin \
  --from-literal=DB_PASSWORD=TU_PASSWORD

kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/ventas-deployment.yaml   # reemplazar ACCOUNT_ID antes
kubectl apply -f k8s/ventas-service.yaml
kubectl apply -f k8s/despachos-deployment.yaml
kubectl apply -f k8s/despachos-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
kubectl apply -f k8s/ventas-hpa.yaml
kubectl apply -f k8s/despachos-hpa.yaml
```

### 6. Obtener URL pública
```bash
kubectl get svc frontend-service -n despacho
# EXTERNAL-IP del LoadBalancer = URL de la app
```

## Secretos GitHub (Learner Lab)

| Secret | Descripción |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | Del panel Learner Lab |
| `AWS_SECRET_ACCESS_KEY` | Del panel Learner Lab |
| `AWS_SESSION_TOKEN` | **Obligatorio** — credenciales temporales STS |
| `AWS_ACCOUNT_ID` | 12 dígitos |
| `EKS_CLUSTER_NAME` | Nombre del cluster EKS |

> Cuando el lab renueva credenciales, actualizar los 3 secrets AWS en GitHub.

## Pipeline CI/CD

| Etapa | Acción |
|-------|--------|
| test | `mvn test` en ambas APIs |
| build+push | Docker build → ECR con tag `eks-{run_number}` |
| deploy | `kubectl set image` → rolling update |
| validate | Verifica pods RUNNING y rollout status |
| scan | Escaneo de vulnerabilidades en ECR |

## Validación (para presentación)

```bash
kubectl get pods -n despacho
kubectl rollout status deployment/ventas -n despacho
kubectl get svc -n despacho
kubectl logs deployment/frontend -n despacho
kubectl top pods -n despacho          # requiere metrics-server
```

## Equipo

Proyecto semestral - TAITE 7
