RED = "\033[1;31m"
GREEN = "\033[1;32m"
YELLOW = "\033[1;33m"
BLUE = "\033[1;34m"
MAGENTA = "\033[1;35m"
CYAN = "\033[1;36m"
WHITE = "\033[1;37m"
NONE = "\033[0m"

all: build run

build: frontend backend

frontend:
	@clear
	@echo $(CYAN) "Building Angular app...\n" $(NONE)
	cd CocktailFrontend  && npm install
	cd CocktailFrontend  && ng build
	@echo $(GREEN) "Angular app built!\n" $(NONE)

backend:
	@echo $(CYAN) "Building .NET backend...\n" $(NONE)
	cd CocktailApp && dotnet build -c Release
	@echo $(GREEN) ".NET backend built!\n" $(NONE)

run:
	@echo $(CYAN) "Running backend...\n" $(NONE)
	cd CocktailApp && dotnet run
	@echo $(GREEN) "Backend is running!\n" $(NONE)

clean:
	@echo $(YELLOW) "Cleaning all!\n" $(NONE)
	@rm -rf CocktailApp/bin
	@rm -rf CocktailApp/obj
	@rm -rf CocktailApp/FillingDB/bin
	@rm -rf CocktailApp/FillingDB/obj
	@rm -rf CocktailFrontend/dist
	@clear

fill:
	@clear
	@echo $(BLUE) "Filling database.db...\n" $(GREEN)
	cd CocktailApp/FillingDB && dotnet run
	@echo $(NONE)

install:
	@echo $(BLUE) "🔍 Checking/installing Node.js..." $(NONE)
	@if ! command -v node >/dev/null 2>&1; then \
		echo $(RED) "❌ Node.js non trovato. Installa Node.js manualmente o usa nvm (https://github.com/nvm-sh/nvm)"; \
		exit 1; \
	else \
		echo $(GREEN) "✅ Node.js trovato: $$(node -v)"; \
	fi

	@echo $(BLUE) "🔍 Checking/installing Angular CLI 19.2.3..." $(NONE)
	@if ! command -v ng >/dev/null 2>&1; then \
		echo $(YELLOW) "⚠️ Angular CLI non trovato. Lo installiamo..."; \
		npm install -g @angular/cli@19.2.3; \
	else \
		if ! ng version | grep -q "Angular CLI: 19.2.3"; then \
			echo $(YELLOW) "⚠️ Versione Angular CLI diversa. Aggiorniamo a 19.2.3..."; \
			npm install -g @angular/cli@19.2.3; \
		else \
			echo $(GREEN) "✅ Angular CLI 19.2.3 già installato"; \
		fi \
	fi

	@echo $(BLUE) "🔍 Checking .NET SDK..." $(NONE)
	@if ! command -v dotnet >/dev/null 2>&1; then \
		echo $(RED) "❌ .NET SDK non trovato. Installa manualmente da https://dotnet.microsoft.com/en-us/download"; \
		exit 1; \
	else \
		echo $(GREEN) "✅ .NET SDK trovato: $$(dotnet --version)"; \
	fi

	@echo $(BLUE) "📦 Installing npm packages in CocktailFrontend..." $(NONE)
	cd CocktailFrontend && npm install

	@echo $(BLUE) "📦 Restoring .NET dependencies in CocktailApp..." $(NONE)
	cd CocktailApp && dotnet restore

	@echo $(GREEN) "✅ Tutto installato correttamente!" $(NONE)
