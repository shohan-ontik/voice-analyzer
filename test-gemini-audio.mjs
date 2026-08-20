import { GoogleGenAI } from "@google/genai";
import { readFileSync } from "node:fs";
import { spawn } from "node:child_process";
import ffmpegPath from "/Users/shahriarshohan/Desktop/voice-analyzer/node_modules/ffmpeg-static/index.js";

function transcodeToWav(input) {
  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpegPath, ["-hide_banner","-loglevel","error","-i","pipe:0","-ac","1","-ar","16000","-f","wav","pipe:1"]);
    const chunks = [];
    proc.stdout.on("data", (c) => chunks.push(c));
    proc.on("error", reject);
    proc.on("close", (code) => code === 0 ? resolve(Buffer.concat(chunks)) : reject(new Error("ffmpeg failed " + code)));
    proc.stdin.write(input);
    proc.stdin.end();
  });
}

// read .env.local manually
const env = readFileSync("/Users/shahriarshohan/Desktop/voice-analyzer/.env.local", "utf8");
const apiKey = env.match(/GEMINI_API_KEY=(.+)/)[1].trim();

const webm = readFileSync("test-silence.webm");
const wav = await transcodeToWav(webm);
console.log("wav bytes:", wav.length);
const data = wav.toString("base64");

const ai = new GoogleGenAI({ apiKey });
const interaction = await ai.interactions.create({
  model: "gemini-3.7-flash",
  input: [
    { type: "text", text: "Listen to this audio clip very carefully. Describe EXACTLY what you hear - is there any speech? Any tone? Is it silent? Be extremely literal and honest, do not assume or guess content." },
    { type: "audio", data, mime_type: "audio/wav" },
  ],
});
console.log("=== FREE TEXT RESPONSE (silence.webm) ===");
console.log(interaction.output_text);
