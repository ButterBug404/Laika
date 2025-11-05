#!/usr/bin/env bash
BASE_URL="https://monitor-loyal-openly.ngrok-free.app"
EMAIL="user1@woofmail.com"
PASSWORD="SuperSecret123$"

echo "🔐 Logging in..."

TOKEN=$(curl -s -X POST "$BASE_URL/api/login" \
  -H "Content-Type: application/json" \
  -H "ngrok-skip-browser-warning: true" \
  -d "{\"email\":\"$EMAIL\", \"password\":\"$PASSWORD\"}" | jq -r '.token')

if [[ -z "$TOKEN" || "$TOKEN" == "null" ]]; then
  echo "❌ Failed to get token"
  exit 1
fi

echo "✅ Token retrieved"

# Get profile picture - ALSO add the header here
curl -s -X GET "$BASE_URL/api/profile-picture" \
  -H "Authorization: Bearer $TOKEN" \
  -H "ngrok-skip-browser-warning: true" \
  -o "profile_picture.jpg"

echo "✅ Profile picture saved as profile_picture.jpg"
