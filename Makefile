.PHONY: help build-%
.DEFAULT_GOAL := help

TAG := latest

help: ## Print help message
	@printf "\nUsage: make <command>\n"
	@grep -F -h "##" $(MAKEFILE_LIST) | grep -F -v grep -F | sed -e 's/\\$$//' | awk 'BEGIN {FS = ":*[[:space:]]*##"}; \
	{ \
		if($$2 == "") \
			pass; \
		else if($$0 ~ /^#/) \
			printf "\n%s\n", $$2; \
		else if($$1 == "") \
			printf "     %-28s%s\n", "", $$2; \
		else \
			printf "    \033[34m%-28s\033[0m %s\n", $$1, $$2; \
	}'

build-%: ## Build image locally for the given module
         ## e.g., make build-base
         ##       make TAG=v1.0.0 build-playwright
	@docker build -t ghcr.io/babelcloud/gbox-$*:$(TAG) -f ./$*/Dockerfile ./$*

buildx-%: ## Build image for multiple architectures and push to registry
          ## e.g., make buildx-base
          ##       make TAG=v1.0.0 buildx-base
	@docker buildx build \
		--platform linux/amd64,linux/arm64 \
		--push \
		-t ghcr.io/babelcloud/gbox-$*:$(TAG) \
		-f ./$*/Dockerfile $*
