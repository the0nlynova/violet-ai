export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { message } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error("❌ API Key missing");
    return res.status(500).json({ reply: "Server missing API key" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are Violet, a friendly AI assistant." },
          { role: "user", content: message },
        ],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("❌ OpenAI API Error:", text);
      return res.status(500).json({ reply: "Error contacting AI service." });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I didn’t get that.";
    res.status(200).json({ reply });

  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ reply: "Error contacting AI service." });
  }
}
