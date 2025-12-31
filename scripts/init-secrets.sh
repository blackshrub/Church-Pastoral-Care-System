#!/bin/bash
set -euo pipefail

SECRETS_DIR="./secrets"

echo "Initializing Docker secrets..."

mkdir -p "$SECRETS_DIR"
chmod 700 "$SECRETS_DIR"

create_secret() {
    local name=$1
    local env_var=$2
    local file="$SECRETS_DIR/$name"
    
    if [ -f "$file" ]; then
        echo "  [skip] $name already exists"
        return
    fi
    
    local value="${!env_var:-}"
    
    if [ -z "$value" ]; then
        echo "  [warn] $env_var not set in .env, generating random value for $name"
        if [ "$name" = "jwt_secret" ]; then
            value=$(openssl rand -hex 32)
        elif [ "$name" = "encryption_key" ]; then
            value=$(python3 -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())" 2>/dev/null || openssl rand -base64 32)
        else
            value=$(openssl rand -base64 32)
        fi
    fi
    
    echo "$value" > "$file"
    chmod 600 "$file"
    echo "  [created] $name"
}

if [ -f .env ]; then
    set -a
    source .env
    set +a
fi

create_secret "mongo_password" "MONGO_ROOT_PASSWORD"
create_secret "jwt_secret" "JWT_SECRET"
create_secret "encryption_key" "ENCRYPTION_KEY"

echo ""
echo "Secrets initialized in $SECRETS_DIR/"
echo ""
echo "Files created:"
ls -la "$SECRETS_DIR/"
echo ""
echo "IMPORTANT: Add 'secrets/' to .gitignore if not already present"
