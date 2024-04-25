#!/bin/bash

REPO_FOLDER:=app
WORKDIR:=/app

starter:
	docker run --rm -it -v $(PWD)/$(REPO_FOLDER):$(WORKDIR) -w $(WORKDIR) node:latest npm i

start:
	docker-compose up

startd:
	docker-compose up -d

stop:
	docker-compose stop

down:
	docker-compose down

exec:
	docker-compose exec -it app /bin/bash

exec-root:
	docker-compose exec -it --user root app /bin/bash
