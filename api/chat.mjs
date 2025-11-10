export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { message } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

   if (!apiKey) {
    console.error("❌ Missing OPENAI_API_KEY");
    return res.status(500).json({ reply: "Server error: API key missing." });
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are Violet, a helpful, smart, and friendly AI assistant who uses a soft tone." },
        { role: "user", content: message },
      ],
    }),
  });

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || "Sorry, I didn’t get that.";
  res.status(200).json({ reply });
}

