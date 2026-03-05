.PHONY: install dev record save

install:
	bun install

SEED ?= $(shell head -c 16 /dev/urandom | base64 | tr -dc 'a-zA-Z0-9' | head -c 16)

dev: install
	SEED=$(SEED) bun run start

record:
	asciinema rec -f asciicast-v2 verify-demo.cast

save:
	@read -p "Enter name for SVG (without extension): " name; \
	mkdir -p ./docs; \
	svg-term --in verify-demo.cast --out "./docs/$$name.svg"; \
	rm verify-demo.cast; \
	echo "Saved to docs/$$name.svg"
