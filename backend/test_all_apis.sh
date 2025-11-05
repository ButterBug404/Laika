#!/bin/bash

BASE_URL="http://localhost:3001/api"
FAKE_TOKEN="FAKE_TEST_TOKEN"

# Simple helpers
get() {
  echo "GET $1"
  curl -s -H "Authorization: Bearer $FAKE_TOKEN" "$BASE_URL$1"
  echo -e "\n"
}

post() {
  echo "POST $1"
  curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $FAKE_TOKEN" -d "$2" "$BASE_URL$1"
  echo -e "\n"
}

put() {
  echo "PUT $1"
  curl -s -X PUT -H "Content-Type: application/json" -H "Authorization: Bearer $FAKE_TOKEN" -d "$2" "$BASE_URL$1"
  echo -e "\n"
}

delete() {
  echo "DELETE $1"
  curl -s -X DELETE -H "Authorization: Bearer $FAKE_TOKEN" "$BASE_URL$1"
  echo -e "\n"
}

put_file() {
  echo "PUT $1 (upload)"
  curl -s -X PUT -H "Authorization: Bearer $FAKE_TOKEN" -F "profile_picture=@$2" "$BASE_URL$1"
  echo -e "\n"
}

echo "Testing user routes"
get "/users/1"
get "/profile-picture"
put_file "/profile-picture" "../gettyimages-586890581.avif"

echo "Testing pets routes"
get "/get_pets"

post "/register_pet" "$(cat <<EOF
{
  "record_type": "PRESENT",
  "name": "test_pet",
  "species": "DOG",
  "breed": "test_breed",
  "color": "test_color",
  "age": 1,
  "age_unit": "YEARS",
  "sex": "MALE",
  "size": "BIG",
  "vaccinated": true,
  "description": "test_description",
  "skin_condition": false
}
EOF
)"

post "/register_alert" "$(cat <<EOF
{
  "record_type": "LOST",
  "name": "test_pet_alert",
  "species": "DOG",
  "breed": "test_breed",
  "color": "test_color",
  "age": 1,
  "age_unit": "YEARS",
  "sex": "MALE",
  "size": "BIG",
  "vaccinated": true,
  "description": "test_description",
  "skin_condition": false,
  "time": "2025-10-30T10:00:00.000Z",
  "last_seen_location": "-99.1332,19.4326",
  "has_reward": true,
  "reward_description": "test_reward_description",
  "reward_amount": 100
}
EOF
)"

post "/register_adoption" "$(cat <<EOF
{
  "name": "test_pet_adoption",
  "species": "DOG",
  "breed": "test_breed",
  "color": "test_color",
  "age": 1,
  "age_unit": "YEARS",
  "sex": "MALE",
  "size": "BIG",
  "vaccinated": true,
  "description": "test_description",
  "skin_condition": false,
  "contact_info": "test_contact_info",
  "contact_method": "EMAIL"
}
EOF
)"

put "/update_pet/1" "$(cat <<EOF
{
  "name": "test_pet_updated",
  "species": "DOG",
  "breed": "test_breed",
  "color": "test_color",
  "age": 1,
  "age_unit": "YEARS",
  "sex": "MALE",
  "size": "BIG",
  "vaccinated": true,
  "description": "test_description",
  "skin_condition": false
}
EOF
)"

delete "/delete_pet/13"

delete "/delete_pet_alert/5"
