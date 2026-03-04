// ============================================================
//  Akshar AI — Vercel Serverless Function
//  Automatically mapped to /api/akshar by Vercel
// ============================================================

const fetch = require("node-fetch");

module.exports = async (req, res) => {
    // Only allow POST
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed." });
    }

    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
        return res.status(400).json({ error: "Prompt is required." });
    }

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
                model: "llama-3.1-8b-instant",
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
};
