import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Modality } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "MʀツBΛNΛNΛ VOICE", timestamp: new Date().toISOString() });
});

/**
 * Emoji to Acting Instruction Map
 */
function getEmojiActingDirective(textLine: string, language: "bengali" | "english" | "hindi"): string {
  const langPrompt =
    language === "bengali"
      ? "in crystal clear Bengali (বাংলা)"
      : language === "hindi"
      ? "in crystal clear Hindi (हिन्दी)"
      : "in crystal clear English";

  // Check emojis
  if (/😭|😢|😿|🥺|💔/.test(textLine)) {
    return `Say ${langPrompt} with genuine weeping, tearful sobbing, trembling voice, sniffing, and heartbreaking grief as if crying intensely:`;
  }
  if (/😂|🤣|😹|😆|😃|😄|😁/.test(textLine)) {
    return `Say ${langPrompt} bursting into loud laughter, giggling uncontrollably, hearty chuckles, and extreme hilarity and joyful amusement:`;
  }
  if (/😡|🤬|👿|💢|😤/.test(textLine)) {
    return `Say ${langPrompt} with fierce boiling anger, screaming rage, fiery aggression, and loud intense hostile furious emotion:`;
  }
  if (/😱|😨|😰|🫨|👻|💀/.test(textLine)) {
    return `Say ${langPrompt} with extreme shock, gasping horror, panicked terror, and trembling frightened breath:`;
  }
  if (/😍|🥰|😘|💖|❤️|💕|😻/.test(textLine)) {
    return `Say ${langPrompt} with deeply romantic, sweet, loving, gentle, affectionate, and charming honey-sweet melody:`;
  }
  if (/🥱|😴|💤|🛌/.test(textLine)) {
    return `Say ${langPrompt} with a sleepy, yawning, lazy, exhausted, drowsy bedtime slow murmur:`;
  }
  if (/🤫|🤐|😶/.test(textLine)) {
    return `Say ${langPrompt} in a quiet, confidential, secretive, thrilling mystery whisper:`;
  }
  if (/🤖|👾|🦾/.test(textLine)) {
    return `Say ${langPrompt} in a precise, metallic, futuristic robotic monotone cadence:`;
  }
  if (/🥳|🎉|🚀|💥|🔥|⚡/.test(textLine)) {
    return `Say ${langPrompt} with explosive hype, wild celebration screams, festive energy, and party excitement:`;
  }
  if (/🤔|🧐|🤨|🕵️/.test(textLine)) {
    return `Say ${langPrompt} with thoughtful curiosity, investigative suspicion, and deep intriguing ponder:`;
  }
  if (/😎|😏|🕶️|👑|💅/.test(textLine)) {
    return `Say ${langPrompt} with swagger, stylish cool confidence, playful sarcasm, and boss attitude:`;
  }
  if (/😇|🙏|🤲|🕊️/.test(textLine)) {
    return `Say ${langPrompt} in a peaceful, respectful, humble, devout, serene, and blessed prayerful tone:`;
  }
  if (/🍌/.test(textLine)) {
    return `Say ${langPrompt} in the legendary, quirky, energetic, signature MʀツBΛNΛNΛ banana creator style with comedic charisma:`;
  }
  if (/🤢|🤮|🤧/.test(textLine)) {
    return `Say ${langPrompt} with sickening disgust, nausea, and groaning revulsion:`;
  }
  if (/🥶|❄️|🧊/.test(textLine)) {
    return `Say ${langPrompt} while shivering in freezing cold with teeth chattering:`;
  }
  if (/🥵|🔥/.test(textLine)) {
    return `Say ${langPrompt} panting heavily from scorching heat, out of breath and exhausted:`;
  }

  // Default clean language delivery
  return `Say ${langPrompt} with crisp, crystal-clear studio pronunciation and lively natural expression:`;
}

/**
 * Split massive text (up to 20,000+ words/lines) into optimal TTS chunks
 */
function splitTextIntoTTSChunks(rawText: string, language: "bengali" | "english" | "hindi"): Array<{ text: string; directive: string }> {
  // First split by explicit line breaks to preserve line-by-line emoji acting
  const rawLines = rawText.split(/\r?\n+/).map((l) => l.trim()).filter((l) => l.length > 0);
  const chunks: Array<{ text: string; directive: string }> = [];

  for (const line of rawLines) {
    const directive = getEmojiActingDirective(line, language);

    // If a line is reasonably short (<= 350 chars), keep it as a unit
    if (line.length <= 350) {
      chunks.push({ text: line, directive });
    } else {
      // Split long line into sentences
      const sentences = line.split(/(?<=[.?!।|])\s+/).filter((s) => s.trim().length > 0);
      let currentSubChunk = "";

      for (const sent of sentences) {
        if ((currentSubChunk + " " + sent).length > 350 && currentSubChunk.length > 0) {
          chunks.push({ text: currentSubChunk.trim(), directive });
          currentSubChunk = sent;
        } else {
          currentSubChunk = currentSubChunk ? `${currentSubChunk} ${sent}` : sent;
        }
      }
      if (currentSubChunk.trim().length > 0) {
        chunks.push({ text: currentSubChunk.trim(), directive });
      }
    }
  }

  // Fallback if no line breaks
  if (chunks.length === 0 && rawText.trim().length > 0) {
    chunks.push({
      text: rawText.trim(),
      directive: getEmojiActingDirective(rawText, language),
    });
  }

  return chunks;
}

// Gemini 3.1 Flash TTS Endpoint with Ultra-Capacity & Emoji-Acting support
app.post("/api/tts", async (req, res) => {
  try {
    const {
      text,
      voiceName = "Puck",
      language = "bengali",
      speed = 1.0,
      customPrompt = "",
    } = req.body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({ error: "Text is required for voice generation." });
    }

    const ai = getAIClient();
    const langKey = (language === "english" || language === "hindi") ? language : "bengali";

    // Split text into chunks
    const chunks = splitTextIntoTTSChunks(text, langKey);

    const allowedVoices = [
      "Puck",
      "Charon",
      "Kore",
      "Fenrir",
      "Zephyr",
      "Aoede",
      "Leda",
      "Orus",
    ];
    const chosenVoice = allowedVoices.includes(voiceName) ? voiceName : "Puck";

    // Generate audio for each chunk sequentially or with controlled concurrency
    const audioBuffers: Buffer[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      let promptText = "";

      if (customPrompt && customPrompt.trim()) {
        promptText = `${customPrompt.trim()}: ${chunk.text}`;
      } else {
        promptText = `${chunk.directive} ${chunk.text}`;
      }

      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.1-flash-tts-preview",
          contents: [{ parts: [{ text: promptText }] }],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: chosenVoice },
              },
            },
          },
        });

        const candidate = response.candidates?.[0];
        const audioPart = candidate?.content?.parts?.find((p) => p.inlineData && p.inlineData.data);
        const audioBase64 = audioPart?.inlineData?.data || candidate?.content?.parts?.[0]?.inlineData?.data;

        if (audioBase64) {
          const chunkBuffer = Buffer.from(audioBase64, "base64");
          audioBuffers.push(chunkBuffer);
        }
      } catch (chunkError: any) {
        console.error(`Error generating chunk ${i + 1}/${chunks.length}:`, chunkError);
        // Continue with other chunks if any fail
      }
    }

    if (audioBuffers.length === 0) {
      return res.status(500).json({
        error: "Failed to generate audio chunks. Please verify your GEMINI_API_KEY.",
      });
    }

    // Concatenate all PCM chunks into one single seamless buffer
    const combinedPcmBuffer = Buffer.concat(audioBuffers);
    const combinedBase64 = combinedPcmBuffer.toString("base64");

    res.json({
      success: true,
      audio: combinedBase64,
      mimeType: "audio/pcm;rate=24000",
      sampleRate: 24000,
      voice: chosenVoice,
      language: langKey,
      totalChunks: chunks.length,
      byteLength: combinedPcmBuffer.length,
    });
  } catch (error: any) {
    console.error("TTS Generation Error:", error);
    res.status(500).json({
      error: error?.message || "Failed to generate speech audio.",
    });
  }
});

// AI Script Enhancer, Storyteller & Emoji Director (Gemini 3.7 Flash)
app.post("/api/enhance-script", async (req, res) => {
  try {
    const { originalText, action = "add_emojis", language = "bengali" } = req.body;

    if (!originalText) {
      return res.status(400).json({ error: "Original text is required." });
    }

    const ai = getAIClient();

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
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    res.json({
      success: true,
      result: response.text || "",
    });
  } catch (error: any) {
    console.error("Script Enhancement Error:", error);
    res.status(500).json({
      error: error?.message || "Failed to process script enhancement.",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MʀツBΛNΛNΛ VOICE server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
