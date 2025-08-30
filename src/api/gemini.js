const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const BASE_URL = import.meta.env.VITE_GEMINI_URL;

export const askGemini = async (question) => {
  try {
    const response = await fetch(`${BASE_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: question }] }],
      }),
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
export const askGeminiStream = async (
  question,
  onChunk,
  batchSize = 3,
  delay = 25
) => {
  try {
    const fullText = await askGemini(question);

    for (let i = 0; i < fullText.length; i += batchSize) {
      const chunk = fullText.slice(i, i + batchSize);
      onChunk(chunk);
      await new Promise((res) => setTimeout(res, delay));
    }
  } catch (err) {
    console.warn("Streaming fallback due to error:", err.message);
    const fallbackText = "Hello! This is a simulated Gemini response.";
    for (let i = 0; i < fallbackText.length; i += batchSize) {
      onChunk(fallbackText.slice(i, i + batchSize));
      await new Promise((res) => setTimeout(res, delay));
    }
  }
};
