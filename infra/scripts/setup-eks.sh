# Guía EKS - AWS Academy Learner Lab
# Ejecutar con credenciales temporales del lab (aws configure o variables STS)

set -euo pipefail

AWS_REGION="${AWS_REGION:-us-east-1}"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
CLUSTER_NAME="${EKS_CLUSTER_NAME:-despacho-eks}"

echo "==> Cuenta: $ACCOUNT_ID | Region: $AWS_REGION"

# 1. Repositorios ECR
for REPO in ventas-backend despachos-backend frontend; do
  echo "==> ECR repo: $REPO"
  aws ecr create-repository \
    --repository-name "$REPO" \
    --image-scanning-configuration scanOnPush=true \
    --region "$AWS_REGION" 2>/dev/null || echo "    (ya existe)"
done

# 2. Reemplazar ACCOUNT_ID en manifiestos k8s
echo "==> Generando manifiestos con Account ID..."
sed "s/ACCOUNT_ID/$ACCOUNT_ID/g" k8s/ventas-deployment.yaml > /tmp/ventas-deployment.yaml
sed "s/ACCOUNT_ID/$ACCOUNT_ID/g" k8s/despachos-deployment.yaml > /tmp/despachos-deployment.yaml
sed "s/ACCOUNT_ID/$ACCOUNT_ID/g" k8s/frontend-deployment.yaml > /tmp/frontend-deployment.yaml

echo ""
echo "=== PASO 1: Crear cluster EKS en consola AWS (Learner Lab) ==="
echo "  - Roles: LabEKSClusterRole + LabEKSNodeRole"
echo "  - Region: us-east-1"
echo "  - Add-ons: VPC CNI, CloudWatch observability, Metrics Server"
echo "  - Node Group: SPOT, t3.large, desired=1, min=1, max=3"
echo ""
echo "=== PASO 2: Etiquetar subnets publicas ==="
echo "  kubernetes.io/cluster/$CLUSTER_NAME = shared"
echo "  kubernetes.io/role/elb = 1"
echo ""
echo "=== PASO 3: Conectar kubectl ==="
echo "  aws eks update-kubeconfig --region $AWS_REGION --name $CLUSTER_NAME"
echo "  kubectl get nodes"
echo ""
echo "=== PASO 4: Crear secreto de BD ==="
echo "  kubectl create secret generic backend-env -n despacho \\"
echo "    --from-literal=DB_ENDPOINT=TU-RDS.amazonaws.com \\"
echo "    --from-literal=DB_PORT=3306 \\"
echo "    --from-literal=DB_NAME=despacho_db \\"
echo "    --from-literal=DB_USERNAME=admin \\"
echo "    --from-literal=DB_PASSWORD=TU_PASSWORD"
echo ""
echo "=== PASO 5: Aplicar manifiestos ==="
echo "  kubectl apply -f k8s/namespace.yaml"
echo "  kubectl apply -f /tmp/ventas-deployment.yaml"
echo "  kubectl apply -f k8s/ventas-service.yaml"
echo "  kubectl apply -f /tmp/despachos-deployment.yaml"
echo "  kubectl apply -f k8s/despachos-service.yaml"
echo "  kubectl apply -f /tmp/frontend-deployment.yaml"
echo "  kubectl apply -f k8s/frontend-service.yaml"
echo "  kubectl apply -f k8s/ventas-hpa.yaml"
echo "  kubectl apply -f k8s/despachos-hpa.yaml"
echo ""
echo "=== PASO 6: Obtener URL publica ==="
echo "  kubectl get svc frontend-service -n despacho"
echo "  (esperar EXTERNAL-IP del LoadBalancer)"
echo ""
echo "Account ID: $ACCOUNT_ID"
