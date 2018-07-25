install:
	go get ./...
.PHONY: install

start:
	go run main.go
.PHONY: start