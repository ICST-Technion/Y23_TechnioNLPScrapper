# Makefile to build the dockerfiles and push them to dockerhub
# use build-images to build locally, oush-images to push to dockerhun
# user 'all' to do both

# you can change the dockerhub user and image tag here
DOCKERHUB_USER=jouwana
IMAGE_TAG=latest

.PHONY: all
all: build-images push-images

.PHONY: build-images
build-images: docker-build-api docker-build-service_ui docker-build-server

.PHONY: push-images
push-images: docker-push-api docker-push-service_ui docker-push-server

.PHONY: docker-build-api
docker-build-api:
	docker build -t $(DOCKERHUB_USER)/api:$(IMAGE_TAG) ./API

.PHONY: docker-build-service_ui
docker-build-service_ui:
	docker build -t $(DOCKERHUB_USER)/service_ui:$(IMAGE_TAG) ./service_ui

.PHONY: docker-build-server
docker-build-server:
	docker build -t $(DOCKERHUB_USER)/server:$(IMAGE_TAG) ./server

.PHONY: docker-push-api
docker-push-api:
	docker push $(DOCKERHUB_USER)/api:$(IMAGE_TAG)

.PHONY: docker-push-service_ui
docker-push-service_ui:
	docker push $(DOCKERHUB_USER)/service_ui:$(IMAGE_TAG)

.PHONY: docker-push-server
docker-push-server:
	docker push $(DOCKERHUB_USER)/server:$(IMAGE_TAG)