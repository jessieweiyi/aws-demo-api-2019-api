PROJECT := aws-demo-app-2019-api
REGISTRY := 897785104057.dkr.ecr.ap-southeast-2.amazonaws.com
AWS_REGION := ap-southeast-2
ENVIRONMENT := dev

VERSION := $(shell whoami)
APP_IMAGE := $(PROJECT):$(VERSION)

.PHONY: build
build:
	@echo Building the Docker image... 
	docker build -t $(APP_IMAGE) .

.PHONY: login-ecr
login-ecr:
	@echo Logging in to Amazon ECR...
	 `aws ecr get-login --region $(AWS_REGION) --no-include-email`

IMAGE_URL := $(REGISTRY)/$(PROJECT):$(VERSION)

.PHONY: publish
publish: 
	@echo Tagging and Pushing the Docker images...
	docker tag $(APP_IMAGE) $(IMAGE_URL)
	docker push $(IMAGE_URL)
	docker tag $(APP_IMAGE) $(REGISTRY)/$(PROJECT):latest
	docker push $(REGISTRY)/$(PROJECT):latest

.PHONY: write-image-definitions
write-image-definitions:
	@echo Writing image definitions file...
	printf '[{"name":"%s","imageUri":"%s")}]' $(PROJECT) $(IMAGE_URL) > imagedefinitions.json

FOLDER_CF_TEMPLATES := $(PWD)/infra
FILE_CF_TEMPLATE_ENV_API := aws-env-api.yml
FILE_CF_TEMPLATE_PIPELINE_API := aws-pipeline-api.yml
STACK_NAME_ENV_API := aws-demo-app-2019-api-$(ENVIRONMENT)
STACK_NAME_PIPELINE_API := aws-demo-app-2019-api-pipeline

PROVISION_PARAMETERS_STACK_PIPELINE := --stack-name $(STACK_NAME_PIPELINE_API) \
		--template-body file://$(FOLDER_CF_TEMPLATES)/$(FILE_CF_TEMPLATE_PIPELINE_API) \
		--parameters ParameterKey=ECRRepositoryName,ParameterValue=$(PROJECT) \
		--capabilities CAPABILITY_NAMED_IAM \
		--region $(AWS_REGION)

.PHONY: create-pipeline
create-pipeline: 
	aws cloudformation create-stack $(PROVISION_PARAMETERS_STACK_PIPELINE)
	aws cloudformation wait stack-create-complete --stack-name $(STACK_NAME_PIPELINE_API)

CLUSTER_STACK_NAME := aws-demo-app-2019-cluster-$(ENVIRONMENT)
AWS_SERVICES_STACK_NAME := aws-demo-app-2019-aws-services-$(ENVIRONMENT)

DEV_ROUTE53_HOSTEDZONE := jessieweiyi.com
DEV_DOMAIN_NAME := api.aws-demo-app-2019.dev.jessieweiyi.com
PROD_ROUTE53_HOSTEDZONE := jessieweiyi.com
PROD_DOMAIN_NAME := api.aws-demo-app-2019.jessieweiyi.com

ifeq (dev, $(ENVIRONMENT))
	ROUTE53_HOSTEDZONE := $(DEV_ROUTE53_HOSTEDZONE)
	DOMAIN_NAME := $(DEV_DOMAIN_NAME)
endif

ifeq (prod, $(ENVIRONMENT))
	ROUTE53_HOSTEDZONE := $(PROD_ROUTE53_HOSTEDZONE)
	DOMAIN_NAME := $(PROD_DOMAIN_NAME)
endif

PROVISION_PARAMETERS_STACK_ENV := --stack-name $(STACK_NAME_ENV_API) \
		--template-body file://$(FOLDER_CF_TEMPLATES)/$(FILE_CF_TEMPLATE_ENV_API) \
		--parameters ParameterKey=Environment,ParameterValue=$(ENVIRONMENT) \
			ParameterKey=ClusterStackName,ParameterValue=$(CLUSTER_STACK_NAME) \
			ParameterKey=ServiceName,ParameterValue=$(PROJECT)-$(ENVIRONMENT) \
			ParameterKey=Route53HostedZone,ParameterValue=$(ROUTE53_HOSTEDZONE) \
			ParameterKey=DomainName,ParameterValue=$(DOMAIN_NAME) \
			ParameterKey=ImageURL,ParameterValue=$(IMAGE_URL) \
			ParameterKey=AWSServicesStackName,ParameterValue=$(AWS_SERVICES_STACK_NAME) \
		--capabilities CAPABILITY_NAMED_IAM \
		--region $(AWS_REGION)

.PHONY: create-env-api
create-env-api: 
	aws cloudformation create-stack $(PROVISION_PARAMETERS_STACK_ENV)
	aws cloudformation wait stack-create-complete --stack-name $(STACK_NAME_ENV_API)

.PHONY: update-env-api
update-env-api: 
	aws cloudformation update-stack $(PROVISION_PARAMETERS_STACK_ENV)
	aws cloudformation wait stack-update-complete --stack-name $(STACK_NAME_ENV_API)