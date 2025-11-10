export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { message } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error("❌ No API key found in environment variables");
    return res.status(500).json({ reply: "Server error: API key missing." });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are Violet, a helpful, kind, and creative AI assistant." },
          { role: "user", content: message },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ OpenAI API error:", response.status, errorText);
      return res.status(500).json({ reply: "Error contacting AI service." });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I didn’t get that.";
    res.status(200).json({ reply });
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ reply: "Internal server error." });
  }
}


