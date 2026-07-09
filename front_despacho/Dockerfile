# Etapa 1: build del frontend
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_VENTAS_API_URL=/api/v1/ventas
ARG VITE_DESPACHOS_API_URL=/api/v1/despachos
ENV VITE_VENTAS_API_URL=$VITE_VENTAS_API_URL
ENV VITE_DESPACHOS_API_URL=$VITE_DESPACHOS_API_URL

RUN npm run build

# Etapa 2: servir con nginx (imagen slim)
FROM nginx:1.27-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:80/ || exit 1
