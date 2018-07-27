install:
	@make install.api
	@make install.frontend
.PHONY: install

install.api:
	@echo "Installing API dependencies..."
	go get ./...
.PHONY: install.api

install.frontend:
	@echo "Installing frontend dependencies..."
	npm install
.PHONY: install.frontend

start:
	make install start.api
	make install start.frontend
.PHONY: start

start.api:
	@echo "Running api setup..."
	go run main.go
.PHONY: start.api

start.frontend:
	@echo "Running frontend setup..."
	npm run start
.PHONY: start.frontend