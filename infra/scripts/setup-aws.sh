# Script de setup AWS para ECS Fargate
# Requisitos: AWS CLI configurado (aws configure)
# Uso: bash infra/scripts/setup-aws.sh

set -euo pipefail

AWS_REGION="${AWS_REGION:-us-east-1}"
CLUSTER_NAME="${ECS_CLUSTER:-despacho-cluster}"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

echo "==> Cuenta AWS: $ACCOUNT_ID | Region: $AWS_REGION"

# 1. Repositorios ECR
for REPO in ventas-api despachos-api frontend; do
  echo "==> Creando repositorio ECR: $REPO"
  aws ecr create-repository \
    --repository-name "$REPO" \
    --image-scanning-configuration scanOnPush=true \
    --region "$AWS_REGION" 2>/dev/null || echo "    (ya existe)"
done

# 2. Log groups CloudWatch
for LOG_GROUP in /ecs/ventas-api /ecs/despachos-api /ecs/frontend; do
  echo "==> Creando log group: $LOG_GROUP"
  aws logs create-log-group \
    --log-group-name "$LOG_GROUP" \
    --region "$AWS_REGION" 2>/dev/null || echo "    (ya existe)"
done

# 3. Cluster ECS
echo "==> Creando cluster ECS: $CLUSTER_NAME"
aws ecs create-cluster \
  --cluster-name "$CLUSTER_NAME" \
  --capacity-providers FARGATE FARGATE_SPOT \
  --default-capacity-provider-strategy capacityProvider=FARGATE,weight=1 \
  --region "$AWS_REGION" 2>/dev/null || echo "    (ya existe)"

# 4. Secretos de base de datos (editar valores reales)
echo "==> Creando secreto despacho/db (si no existe)"
aws secretsmanager create-secret \
  --name despacho/db \
  --description "Credenciales RDS para APIs" \
  --secret-string '{
    "DB_ENDPOINT": "TU-RDS-ENDPOINT.rds.amazonaws.com",
    "DB_NAME": "despacho_db",
    "DB_USERNAME": "admin",
    "DB_PASSWORD": "CAMBIAR_PASSWORD"
  }' \
  --region "$AWS_REGION" 2>/dev/null || echo "    (ya existe - actualizar valores manualmente)"

echo ""
echo "=== Siguiente paso manual en AWS Console ==="
echo "1. Crear VPC con 2 subnets publicas (o usar default VPC)"
echo "2. Crear Security Groups:"
echo "   - ALB-SG: puertos 80/443 desde 0.0.0.0/0"
echo "   - ECS-SG: puertos 8080,8081,80 desde ALB-SG"
echo "   - RDS-SG: puerto 3306 desde ECS-SG"
echo "3. Crear Application Load Balancer con 3 Target Groups:"
echo "   - ventas-tg     -> puerto 8080, health: /actuator/health"
echo "   - despachos-tg  -> puerto 8081, health: /actuator/health"
echo "   - frontend-tg   -> puerto 80"
echo "4. Reglas ALB:"
echo "   - /api/v1/ventas*    -> ventas-tg"
echo "   - /api/v1/despachos* -> despachos-tg"
echo "   - /*                 -> frontend-tg"
echo "5. Registrar task definitions (reemplazar ACCOUNT_ID en JSON):"
echo "   sed 's/ACCOUNT_ID/$ACCOUNT_ID/g' infra/ecs/task-definition-ventas.json > /tmp/ventas.json"
echo "   aws ecs register-task-definition --cli-input-json file:///tmp/ventas.json"
echo "6. Crear 3 ECS Services (Fargate) vinculados al ALB"
echo ""
echo "Account ID para reemplazar en task definitions: $ACCOUNT_ID"
