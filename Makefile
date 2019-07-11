IMG_NS?=BLANK

#image label, default to latest
IMG_TAG?=""

image="ccr.ccs.tencentyun.com/$(IMG_NS)/salarytrea:sale$(IMG_TAG)"
base="ccr.ccs.tencentyun.com/$(IMG_NS)/salarytrea:sale-node"

all: image push

env:
	@echo building $(base) ...
	@docker build -t $(base) -f env.Dockerfile --no-cache .
	@docker push $(base)

image:
	@echo building $(image) ...
	@docker build -t $(image) \
	--build-arg BASE=$(base) \
	--pull \
	.

push:
	@echo pushing $(image) ...
	@docker push $(image)



.PHONY: build image push all

