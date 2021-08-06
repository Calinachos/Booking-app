makefile:

GCC=go
GCMD=run
GPATH=main.go
GOVERSION=1.15.7
GO_FILES=$(shell go list ./... | grep -v /vendor/)

all: fmt run

run:
	$(GCC) $(GCMD) $(GPATH)

fmt:
	@echo "All project source files were formatted with fmt."
	go fmt $(GO_FILES)

# Managing Go installations
# See https://golang.org/doc/manage-install

install_go:
	@echo "Starting to install go."
	#sudo apt update
	#sudo apt install curl
	#curl https://golang.org/dl/go1.15.7.linux-amd64.tar.gz > go$(GO_VERSION).linux-amd64.tar.gz
	sudo chmod 744 pathConfig.sh
	./pathConfig.sh
	wget https://golang.org/dl/go$(GOVERSION).linux-amd64.tar.gz
	sudo tar -C /usr/local -xzf go$(GOVERSION).linux-amd64.tar.gz
	sudo rm go$(GOVERSION).linux-amd64.tar.gz

install_dep:
	sudo apt install git
	go get ./...

install: install_go install_dep

.PHONY: all run fmt install_go install_dep  install