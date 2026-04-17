.PHONY: build test clean

build:
	cargo build --target wasm32-unknown-unknown --release

test:
	cargo test

clean:
	cargo clean

deploy-oracle:
	stellar contract deploy \
		--wasm target/wasm32-unknown-unknown/release/oracle.wasm \
		--source-account $(NGO_SECRET_KEY) \
		--network testnet

deploy-escrow:
	stellar contract deploy \
		--wasm target/wasm32-unknown-unknown/release/escrow.wasm \
		--source-account $(NGO_SECRET_KEY) \
		--network testnet
