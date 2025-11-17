import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = " ";
const MODEL_NAME = "gemini-2.0-flash"; 
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }],
        generationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024
        }
      })
    });

    const data = await response.json();

    if (data.candidates && data.candidates.length > 0) {
      res.json({ reply: data.candidates[0].content.parts[0].text });
    } else {
      console.error("API Response:", data);
      res.status(500).json({ error: data.error || "Tidak ada respons dari Gemini." });
    }
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Terjadi kesalahan server." });
  }
});

app.listen(3000, () => {
  console.log("✅ Server Gemini Flash berjalan di http://localhost:3000");
});
