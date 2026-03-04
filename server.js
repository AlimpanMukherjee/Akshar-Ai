// ============================================================
//  Akshar AI — Backend Server
//  Proxies requests to Groq API, keeping your key hidden
// ============================================================

const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // serves akshar-ai.html from /public folder

// ── Health check ─────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "Akshar AI is running 🪔" });
});

// ── Main API proxy route ──────────────────────────────────────
app.post("/api/akshar", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    return res.status(400).json({ error: "Prompt is required." });
  }

  // Basic abuse guard — reject huge payloads
  if (prompt.length > 8000) {
    return res.status(400).json({ error: "Text is too long. Please keep it under 8000 characters." });
  }

  try {
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",   // fastest & free
        max_tokens: 1500,
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content:
              "You are Akshar AI, an expert English writing assistant. Always follow the exact output format specified in the user's prompt.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    if (!groqResponse.ok) {
      const errBody = await groqResponse.text();
      console.error("Groq API error:", errBody);
      return res.status(502).json({ error: "Groq API returned an error. Please try again." });
    }

    const data = await groqResponse.json();
    const result = data.choices?.[0]?.message?.content || "";
    return res.json({ result });

  } catch (err) {
    console.error("Server error:", err.message);
    return res.status(500).json({ error: "Internal server error. Please try again." });
  }
});

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🪔 Akshar AI server running at http://localhost:${PORT}`);
  console.log(`   Press Ctrl+C to stop.\n`);
});
