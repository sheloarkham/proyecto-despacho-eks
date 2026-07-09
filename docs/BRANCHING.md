# Estrategia de ramas Git

## Ramas del proyecto

| Rama | Proposito | CI/CD |
|------|-----------|-------|
| `main` | Produccion / entrega final | Tests + Build + Deploy EKS |
| `develop` | Integracion y desarrollo | Solo tests (verde en GitHub) |

## Flujo de trabajo

```
develop  ──merge──>  main  ──deploy──>  EKS
   │                  │
   └── feature/*      └── tags de release (eks-N)
```

## Evidencia para presentacion

- Commits descriptivos en ambas ramas
- Pull Request de `develop` → `main` (opcional)
- GitHub Actions: checks verdes en `develop`, pipeline completo en `main`

## Comandos utiles

```bash
git checkout develop
git pull origin develop
# ... cambios ...
git add .
git commit -m "feat: descripcion del cambio"
git push origin develop

git checkout main
git merge develop
git push origin main
```
