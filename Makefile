all:
	@clear
	cd CocktailApp && dotnet run

clean:
	rm -rf CocktailApp/bin
	rm -rf CocktailApp/obj
	@clear