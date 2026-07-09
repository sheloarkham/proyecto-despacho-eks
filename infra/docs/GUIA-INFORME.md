# Guía para el informe Word - EKS (AWS Academy)

## Diagrama de arquitectura

```
                    ┌─────────────────────────────────┐
                    │           Internet               │
                    └───────────────┬─────────────────┘
                                    │
                    ┌───────────────▼─────────────────┐
                    │  frontend-service (LoadBalancer) │  ← PUBLICO
                    │  nginx: proxy /api/* → backends  │
                    └───────┬─────────────┬───────────┘
                            │             │
              ┌─────────────▼──┐   ┌──────▼──────────┐
              │ ventas-service │   │ despachos-service│  ← INTERNOS
              │  (ClusterIP)   │   │   (ClusterIP)    │     (ClusterIP)
              │  Deployment    │   │   Deployment     │
              │  + HPA 50% CPU │   │   + HPA 50% CPU  │
              └────────┬───────┘   └────────┬─────────┘
                       └─────────┬──────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   Amazon RDS (MySQL)    │
                    └─────────────────────────┘

    GitHub Actions ──► ECR ──► kubectl set image ──► EKS Rolling Update
         │
         └── Learner Lab: ACCESS_KEY + SECRET_KEY + SESSION_TOKEN
```

## Puntos del encargo → evidencia

| Punto del informe | Dónde está |
|-------------------|------------|
| Integración Front-Back-DB | nginx proxy → ClusterIP → RDS |
| Contenedores multietapa | `Dockerfile` en cada componente |
| docker-compose local | `docker-compose.yml` raíz |
| Registro ECR con tags | Pipeline tag `eks-{run_number}` |
| CI/CD GitHub Actions | `.github/workflows/eks-deploy.yml` |
| Infra AWS | EKS + VPC + Node Group + RDS (capturas consola) |
| Secretos | GitHub Secrets + K8s Secret `backend-env` |
| Observabilidad | CloudWatch (control plane logs) + `kubectl logs` + metrics-server |
| Seguridad | Backends internos, imágenes alpine, ECR scan, SG RDS |
| Orquestación EKS | Manifiestos `k8s/`, HPA, justificación vs EC2 manual |

## Justificación EKS (para defensa individual)

- **Escalabilidad**: HPA escala pods automáticamente al 50% CPU
- **Aislamiento**: Backends no expuestos a internet (ClusterIP)
- **Rolling updates**: Zero-downtime con `kubectl rollout status`
- **Portabilidad**: Manifiestos YAML reutilizables
- **Integración CI/CD**: GitHub → ECR → EKS es el flujo estándar de la industria

## Comandos para capturas de evidencia

```bash
# Pods corriendo
kubectl get pods -n despacho

# Servicios y URL pública
kubectl get svc -n despacho

# HPA activo
kubectl get hpa -n despacho

# Métricas (metrics-server)
kubectl top pods -n despacho

# Logs del pipeline
# → GitHub → Actions → último workflow run

# Logs de la app
kubectl logs deployment/frontend -n despacho
kubectl logs deployment/ventas -n despacho
```

## Nota Learner Lab

Las credenciales AWS expiran. Cada vez que el lab renueva:
1. Copiar nuevos valores del panel Learner Lab
2. Actualizar en GitHub Secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`
3. Re-ejecutar el pipeline
