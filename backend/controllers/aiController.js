const { GoogleGenAI } = require("@google/genai");
require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

exports.generateTitle = async (req, res) => {
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Summarize this complaint into a concise title (max 6 words). Do not use quotes: "${description}"`,
      config: {
        temperature: 0.1,
      },
    });

    const suggestedTitle = response.text.trim();

    res.status(200).json({ title: suggestedTitle });

  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate title', 
      details: error.message 
    });
  }
};