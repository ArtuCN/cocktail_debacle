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
	cd CocktailFrontend  && ng build --configuration development
	@echo $(GREEN) "Angular app built!\n" $(NONE)

backend:
	@echo $(CYAN) "Building .NET backend...\n" $(NONE)
	cd CocktailApp && dotnet build
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
	@rm -rf CocktailApp/dist
	@clear

fill:
	@clear
	@echo $(BLUE) "Filling cocktail.db...\n" $(GREEN)
	cd CocktailApp/FillingDB && dotnet run
	@echo $(NONE)
