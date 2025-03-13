RED = "\033[1;31m"
GREEN = "\033[1;32m"
YELLOW = "\033[1;33m"
BLUE = "\033[1;34m"
MAGENTA = "\033[1;35m"
CYAN = "\033[1;36m"
WHITE = "\033[1;37m"
NONE = "\033[0m"


all:
	@clear
	cd CocktailApp && dotnet run

clean:
	@echo $(YELLOW) "I'm cleaning all!\n" $(NONE)
	@rm -rf CocktailApp/bin
	@rm -rf CocktailApp/obj
	@rm -rf CocktailApp/FillingDB/bin
	@rm -rf CocktailApp/FillingDB/obj
	@clear

fill:
	@clear
	@echo $(BLUE) "I'm filling cocktail.db!\n" $(GREEN)
	cd CocktailApp/FillingDB && dotnet run
	@echo $(NONE)