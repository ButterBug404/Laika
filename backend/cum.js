import jwt from "jsonwebtoken";
import fs from "fs";

// Read keys
const privateKey = fs.readFileSync("./keys/private.key", "utf8");
const publicKey = fs.readFileSync("./keys/public.key", "utf8");

// Dummy user payload
const user = {
  id: 1,
  name: "Test User",
  email: "user1@woofmail.com"
};

// Generate a token
const token = jwt.sign(user, privateKey, {
  algorithm: "RS256",
  expiresIn: "1h"
});

console.log("Generated JWT:\n", token, "\n");

// Verify the token
try {
  const decoded = jwt.verify(token, publicKey, { algorithms: ["RS256"] });
  console.log("✅ Verification succeeded. Decoded payload:\n", decoded);
} catch (err) {
  console.error("❌ Verification failed:", err.message);
}

