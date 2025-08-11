// whatsapp.js
import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const FROM_NUMBER = "whatsapp:+14155238886";

export async function sendText(to, body) {
  try {
    const message = await client.messages.create({
      from: FROM_NUMBER,
      to: `whatsapp:${to}`,
      body
    });
    return message;
  } catch (error) {
    console.error("Error sending text:", error);
    throw error;
  }
}

export async function sendImage(to, imageUrl, caption = "") {
  try {
    const message = await client.messages.create({
      from: FROM_NUMBER,
      to: `whatsapp:${to}`,
      body: caption,
      mediaUrl: [imageUrl]
    });
    return message;
  } catch (error) {
    console.error("Error sending image:", error);
    throw error;
  }
}
