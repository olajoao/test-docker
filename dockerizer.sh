# Dockerfile
cat >Dockerfile <<'EOF'
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
EOF

# docker-compose.yml
cat >docker-compose.yml <<'EOF'
version: "3.9"
services:
  web:
    build: .
    container_name: react-vite-web
    working_dir: /app
    ports:
      - "5173:5173"
    volumes:
      - .:/app
      - ./node_modules:/app/node_modules
    stdin_open: true
    tty: true
EOF

# Makefile
cat >Makefile <<'EOF'
COMPOSE = docker compose
up:
	@$(COMPOSE) up --build -d
	@echo "✅ Rodando em http://localhost:5173"
down:
	@$(COMPOSE) down
	@echo "🛑 Container parado."
logs:
	@$(COMPOSE) logs -f web
sh:
	@$(COMPOSE) exec web sh
install:
	@$(COMPOSE) run --rm web npm install
	@echo "📦 Dependências instaladas no container (visíveis no host)."
EOF
