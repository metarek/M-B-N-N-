import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const {
      originalText,
      action = "add_emojis",
      language = "bengali",
      apiKey: clientApiKey = "",
    } = req.body || {};

    if (!originalText) {
      return res.status(400).json({ error: "Original text is required." });
    }

    const apiKey = clientApiKey || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(401).json({
        error: "GEMINI_API_KEY পাওয়া যায়নি। অনুগ্রহ করে Vercel Settings অথবা অ্যাপ সেটিংসে API Key যোগ করুন।",
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    let systemPrompt =
      "You are MʀツBΛNΛNΛ, the ultimate master voice actor director and YouTube creator scriptwriter. You specialize in adding expressive theatrical emojis (like 😭, 😂, 😡, 😱, 😍, 🥱, 🤫, 🥳, 😎, 🍌) before each line so the TTS engine acts with extreme emotions, clear pronunciation, and unmatched viral excitement.";

    let userPrompt = "";

    if (action === "add_emojis") {
      userPrompt = `Analyze the following script and format it line-by-line. At the very beginning of each line, place the exact matching emotional emoji (for example: 😭 for crying/sadness, 😂 for laughing/humor, 😡 for anger, 😱 for shock/scare, 😍 for love/sweetness, 🥳 for celebration/hype, 😎 for swag/attitude, 🍌 for signature banana humor) so each line is acted out accordingly. Keep the text in ${language} without losing any words.

Script:
"""${originalText}"""

Output ONLY the formatted script with emojis at each line start.`;
    } else if (action === "youtuber_energy") {
      userPrompt = `Rewrite the following script with maximum viral YouTube creator energy in ${language}. Put dramatic emotional emojis (🥳, 😂, 😱, 😎, 🍌) before each line to give it high-intensity spoken voiceacting dynamics.

Script:
"""${originalText}"""

Output ONLY the ready-to-speak script.`;
    } else if (action === "translate_bengali") {
      userPrompt = `Translate and adapt the following text into crystal-clear, authentic conversational Bengali (বাংলা) with emotional emojis (😭, 😂, 🥳, 😍, 😎) preceding each line for dramatic acting.

Original:
"""${originalText}"""

Output ONLY the Bengali text.`;
    } else if (action === "translate_hindi") {
      userPrompt = `Translate and adapt the following text into crystal-clear, expressive Hindi (हिन्दी) with emotional emojis (😭, 😂, 🥳, 😍, 😎) preceding each line for dramatic acting.

Original:
"""${originalText}"""

Output ONLY the Hindi text.`;
    } else if (action === "translate_english") {
      userPrompt = `Translate and adapt the following text into crisp, high-impact English with emotional emojis (😭, 😂, 🥳, 😍, 😎) preceding each line for dramatic acting.

Original:
"""${originalText}"""

Output ONLY the English text.`;
    } else {
      userPrompt = `Format this script line by line with expressive emojis (😭, 😂, 😡, 😱, 😍, 🥳, 😎, 🍌) at each line's start:\n\n"""${originalText}"""`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction: { parts: [{ text: systemPrompt }] },
        temperature: 0.7,
      },
    });

    const result = response.text || "";

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error: any) {
    console.error("AI Script Enhancement Error:", error);
    return res.status(500).json({
      error: error?.message || "Failed to enhance script.",
    });
  }
}
