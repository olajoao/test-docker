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
	@$(COMPOSE) run --rm --remove-orphans web npm install
	@echo "📦 Dependências instaladas no container (visíveis no host)."
