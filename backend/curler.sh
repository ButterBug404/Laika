#!/bin/bash

URL="http://localhost:3001/api/register"
PASSWORD="SuperSecret123#"

for i in $(seq 1 10); do
  USERNAME="user_$i"
  EMAIL="user${i}@woofmail.com"

  echo "🐶 Curling user $USERNAME..."

  curl -X POST $URL \
    -H "Content-Type: application/json" \
    -d "{
      \"username\": \"${USERNAME}\",
      \"email\": \"${EMAIL}\",
      \"password\": \"${PASSWORD}\"
    }"

  echo -e "\n✅ Done with $USERNAME"
done

