#!/bin/bash

# --- Instructions ---
# 1. Make sure the 'supplementary' file in this directory contains your JWT token.
# 2. Make sure the image paths for faceImage and images are correct.
#    You can use the gettyimages-586890581.avif file in the project root for testing.
# 3. Adjust the form fields below as needed for your test case.

TOKEN=$(cat supplementary)
URL="http://localhost:3001/api/register_pet"

# Note: curl on Windows might require you to use backslashes for file paths,
# e.g., -F "faceImage=@C:\Users\David\Projects\Laika\gettyimages-586890581.avif"

echo "🐾 Registering a new pet..."

curl -X POST "$URL" \
  -H "Authorization: Bearer $TOKEN" \
  -F "faceImage=@../gettyimages-586890581.avif" \
  -F "images=@../gettyimages-586890581.avif" \
  -F "record_type=LOST" \
  -F "name=Buddy" \
  -F "species=DOG" \
  -F "breed=Labrador" \
  -F "color=Black" \
  -F "age=3" \
  -F "age_unit=YEARS" \
  -F "sex=MALE" \
  -F "size=MEDIUM" \
  -F "vaccinated=true" \
  -F "description=Friendly and energetic" \
  -F "skin_condition=false" \
  -F "time=2025-10-28T12:00:00Z" \
  -F "last_seen_location=-103.3496,20.6597" \
  -F "contact_info=user@example.com" \
  -F "contact_method=EMAIL" \
  -F "has_reward=false" \
  -F "reward_description=" \
  -F "reward_amount=0"

echo -e "\n\n✅ Done."
