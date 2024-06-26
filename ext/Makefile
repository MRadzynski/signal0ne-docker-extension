IMAGE?=322456/signalone-extension
PROD_IMAGE?=signaloneai/signalone-extension
FRONTEND_IMAGE?=322456/signalonefrontend
PROD_FRONTEND_IMAGE?=signaloneai/signalonefrontend
PROD_TAG?=0.0.8
TAG?=dev

BUILDER=buildx-multi-arch

INFO_COLOR = \033[0;36m
NO_COLOR   = \033[m
BACKEND_NETWORK?=backend_default #for local development only

build-extension: build-extension-dependencies ## Build service image to be deployed as a desktop extension
	docker build --tag=$(IMAGE):$(TAG) .

validate-extension-production: 
	docker buildx build --load --tag=$(PROD_IMAGE):$(PROD_TAG) .
	docker extension validate $(PROD_IMAGE):$(PROD_TAG)

build-extension-production: build-extension-dependencies-production ## Build service image to be deployed as a desktop extension
	docker buildx build --platform=linux/arm64,linux/amd64  --push --tag=$(PROD_IMAGE):$(PROD_TAG) .

install-extension: ## Install the extension
	docker extension install $(IMAGE):$(TAG)

install-extension-local: install-extension ## Install the extension locally (for development)
	docker network connect $(BACKEND_NETWORK) signaloneagent
	docker network connect $(BACKEND_NETWORK) signalonefrontend

update-extension: build-extension ## Update the extension
	docker extension update $(IMAGE):$(TAG)

push-extension: prepare-buildx ## Build & Upload extension image to hub. Do not push if tag already exists: make push-extension tag=0.1
	docker pull $(IMAGE):$(TAG) && echo "Failure: Tag already exists" || docker buildx build --push --builder=$(BUILDER) --platform=linux/amd64,linux/arm64 --build-arg TAG=$(TAG) --tag=$(IMAGE):$(TAG) .

build-extension-dependencies: ## Build dependencies for the extension
	docker build --tag=$(FRONTEND_IMAGE):$(TAG) -f ./frontend/dev.Dockerfile ./frontend

build-extension-dependencies-production: ## Build dependencies for the extension
	docker buildx build --platform=linux/arm64,linux/amd64 --push --tag=$(PROD_FRONTEND_IMAGE):$(PROD_TAG) -f ./frontend/prod.Dockerfile ./frontend

start-devenv: ## Start development environment
	docker compose -f ./devenv/docker-compose.yaml up -d
	curl http://localhost:8081