const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const BASE_URL = import.meta.env.VITE_GEMINI_URL;

export const askGemini = async (question) => {
  try {
    const response = await fetch(`${BASE_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: question }] }] }),
    });

    if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
  } catch (err) {
    console.error("Error in askGemini:", err);
    return "Error contacting Gemini API.";
  }
};

// Batched streaming
export const askGeminiStream = async (question, onChunk) => {
  try {
    const fullText = await askGemini(question);

    let buffer = "";
    const batchSize = 4; // Number of characters per batch
    for (let i = 0; i < fullText.length; i++) {
      buffer += fullText[i];
      if (buffer.length >= batchSize || i === fullText.length - 1) {
        onChunk(buffer);
        buffer = "";
        await new Promise((res) => setTimeout(res, 20)); // adjust speed here
      }
    }
  } catch (err) {
    console.warn("Streaming fallback due to error:", err.message);
    const fallbackText = "Hello! This is a simulated Gemini response.";
    for (let i = 0; i < fallbackText.length; i++) {
      onChunk(fallbackText[i]);
      await new Promise((res) => setTimeout(res, 25));
    }
  }
};
