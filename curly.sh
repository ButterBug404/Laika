#!/bin/bash

API_URL="http://localhost:3001/api/register"
PASSWORD="LosPatos33@"

for i in {1..10}; do
  USERNAME="user$i"
  EMAIL="user$i@example.com"

  curl -s -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -d "{\"username\":\"$USERNAME\", \"email\":\"$EMAIL\", \"password\":\"$PASSWORD\"}"

  echo "Created account $USERNAME"
done

