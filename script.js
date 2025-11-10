const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

async function getAIResponse(userText) {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userText }),
    });

    if (!res.ok) {
      throw new Error("API response not OK");
    }

    const data = await res.json();
    return data.reply;
  } catch (err) {
    console.error("Error:", err);
    return "Error contacting AI service.";
  }
}

function addMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener("click", async () => {
  const userText = userInput.value.trim();
  if (!userText) return;
  addMessage("user", userText);
  userInput.value = "";

  const aiReply = await getAIResponse(userText);
  addMessage("ai", aiReply);
});

userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendBtn.click();
  }
});
