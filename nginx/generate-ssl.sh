#!/bin/sh
# ==============================================================================
# Helper Script: Generate Local Self-Signed SSL Certificates for Testing
# Run this once if you want to test HTTPS locally before configuring Let's Encrypt
# ==============================================================================

SSL_DIR="./nginx/ssl"
mkdir -p "$SSL_DIR"

if [ ! -f "$SSL_DIR/fullchain.pem" ] || [ ! -f "$SSL_DIR/privkey.pem" ]; then
    echo "Generating self-signed SSL certificates in $SSL_DIR..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout "$SSL_DIR/privkey.pem" \
        -out "$SSL_DIR/fullchain.pem" \
        -subj "/C=IN/ST=Karnataka/L=Karkala/O=PranavR/OU=Engineering/CN=localhost"
    echo "Self-signed certificate generated successfully!"
else
    echo "SSL certificates already exist in $SSL_DIR. Skipping generation."
fi
