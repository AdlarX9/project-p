#!bin/sh

# Génération des certificats SSL
cd /usr/local/project-p/certificate
if [ ! -f "chain.pem" ] || [ ! -f "privkey.pem" ] || [ ! -f "fullchain.pem" ]; then
    mkcert create-ca --cert chain.pem --key ca.pem
	mkcert create-cert \
		--ca-cert chain.pem \
		--ca-key ca.pem \
		--cert fullchain.pem \
		--key privkey.pem \
		--domains $DOMAIN_NAME,
	echo "Certificate files generated successfully."
else
	echo "Certificate files already exist. Skipping certificate generation."
fi

# Installation des packages npm
cd /usr/local/project-p/frontend
if [ ! -d "node_modules" ]; then
    pnpm install
	echo "Frontend dependencies installed successfully."
else
	echo "Frontend dependencies already installed. Skipping installation."
fi

exec npx webpack serve
