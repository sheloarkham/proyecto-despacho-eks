# Estrategia de ramas Git

## Ramas del proyecto

| Rama | Proposito | CI/CD |
|------|-----------|-------|
| `main` | Produccion / entrega final | Tests + Build + Deploy EKS |
| `develop` | Integracion y desarrollo | Solo tests (verde en GitHub) |
| `feature` | Rama de trabajo diario del equipo | Tests al integrar en develop |
| `feat/*` | Nuevas funcionalidades puntuales | Tests al mergear a develop |

## Flujo de trabajo (GitFlow)

```
feat/dashboard-ui-mejoras  ──merge──>  develop  ──PR──>  main  ──deploy──>  EKS
```

## Rama de trabajo

La rama `feature` es la rama principal de desarrollo del equipo. Todo el trabajo diario se realiza aqui antes de integrar a `develop`.

```
feature  ──merge──>  develop  ──PR──>  main
```

| Rama | Commit | Cambio |
|------|--------|--------|
| `feat/dashboard-ui-mejoras` | feat: panel resumen y breadcrumb | Stats, iconos navbar, v1.1.0 |
| `develop` | fix: CI tests + docs Docker | Tests H2, DOCKER.md, BRANCHING.md |
| `main` | merge via Pull Request | Version estable para entrega |

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
