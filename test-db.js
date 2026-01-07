import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

async function test() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is missing");
    process.exit(1);
  }

  try {
    console.log("Connecting to:", uri.replace(/:([^:@]+)@/, ":****@"));
    await mongoose.connect(uri);
    console.log("Connected successfully");

    // Test models
    console.log("Checking models...");
    // We can't easily import them if they use @/ alias without setup,
    // but we can try relative paths if it's a simple project.

    process.exit(0);
  } catch (err) {
    console.error("Test failed:", err);
    process.exit(1);
  }
}

test();
