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

function getAIClient(userKey?: string): GoogleGenAI {
  const apiKey = userKey || process.env.GEMINI_API_KEY || "";
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
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
 * Split massive text into optimal TTS chunks (up to 2000 chars per chunk to avoid hitting API rate limits)
 */
function splitTextIntoTTSChunks(rawText: string, language: "bengali" | "english" | "hindi"): Array<{ text: string; directive: string }> {
  // If the total text is within 2000 characters, send as a SINGLE chunk for instant, quota-friendly generation!
  if (rawText.trim().length <= 2000) {
    return [{
      text: rawText.trim(),
      directive: getEmojiActingDirective(rawText, language),
    }];
  }

  // First split by explicit line breaks/paragraphs
  const rawLines = rawText.split(/\r?\n+/).map((l) => l.trim()).filter((l) => l.length > 0);
  const chunks: Array<{ text: string; directive: string }> = [];

  let currentBlock = "";

  for (const line of rawLines) {
    if ((currentBlock + "\n" + line).length <= 1800) {
      currentBlock = currentBlock ? `${currentBlock}\n${line}` : line;
    } else {
      if (currentBlock) {
        chunks.push({
          text: currentBlock.trim(),
          directive: getEmojiActingDirective(currentBlock, language),
        });
      }
      if (line.length <= 1800) {
        currentBlock = line;
      } else {
        // Break super long line into sentences
        const sentences = line.split(/(?<=[.?!।|])\s+/).filter((s) => s.trim().length > 0);
        currentBlock = "";
        for (const sent of sentences) {
          if ((currentBlock + " " + sent).length > 1800 && currentBlock.length > 0) {
            chunks.push({
              text: currentBlock.trim(),
              directive: getEmojiActingDirective(currentBlock, language),
            });
            currentBlock = sent;
          } else {
            currentBlock = currentBlock ? `${currentBlock} ${sent}` : sent;
          }
        }
      }
    }
  }

  if (currentBlock.trim().length > 0) {
    chunks.push({
      text: currentBlock.trim(),
      directive: getEmojiActingDirective(currentBlock, language),
    });
  }

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
      apiKey = "",
    } = req.body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({ error: "Text is required for voice generation." });
    }

    const ai = getAIClient(apiKey);
    const langKey = (language === "english" || language === "hindi") ? language : "bengali";

    // Split text into chunks
    const chunks = splitTextIntoTTSChunks(text, langKey);

    const allowedVoices = [
      "Puck",
      "Charon",
      "Kore",
      "Fenrir",
      "Aoede",
      "Zephyr",
    ];
    let chosenVoice = "Puck";
    if (allowedVoices.includes(voiceName)) {
      chosenVoice = voiceName;
    } else if (voiceName?.toLowerCase()?.includes("female") || voiceName === "Leda") {
      chosenVoice = "Kore";
    } else if (voiceName === "Orus") {
      chosenVoice = "Fenrir";
    }

    // Generate audio for each chunk sequentially with retry
    const audioBuffers: Buffer[] = [];
    let lastErrorMsg = "";

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      let promptText = "";

      if (customPrompt && customPrompt.trim()) {
        promptText = `${customPrompt.trim()}: ${chunk.text}`;
      } else {
        promptText = `${chunk.directive} ${chunk.text}`;
      }

      let generated = false;

      // Attempt 1: with expressive directive
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
          generated = true;
        }
      } catch (chunkError: any) {
        lastErrorMsg = chunkError?.message || String(chunkError);
        console.warn(`Chunk ${i + 1}/${chunks.length} attempt 1 failed with voice ${chosenVoice}:`, lastErrorMsg);
        if (
          lastErrorMsg.includes("API key not valid") ||
          lastErrorMsg.includes("API_KEY_INVALID") ||
          lastErrorMsg.includes("400") ||
          lastErrorMsg.includes("429") ||
          lastErrorMsg.includes("Quota exceeded") ||
          lastErrorMsg.includes("RESOURCE_EXHAUSTED")
        ) {
          break;
        }
      }

      // Attempt 2 (Fallback): simpler prompt if attempt 1 failed
      if (
        !generated &&
        !lastErrorMsg.includes("API key not valid") &&
        !lastErrorMsg.includes("API_KEY_INVALID") &&
        !lastErrorMsg.includes("429") &&
        !lastErrorMsg.includes("RESOURCE_EXHAUSTED")
      ) {
        try {
          const fallbackPrompt = `Say in ${langKey}: ${chunk.text}`;
          const fallbackVoice = chosenVoice === "Kore" || chosenVoice === "Aoede" ? "Kore" : "Puck";
          const response = await ai.models.generateContent({
            model: "gemini-3.1-flash-tts-preview",
            contents: [{ parts: [{ text: fallbackPrompt }] }],
            config: {
              responseModalities: [Modality.AUDIO],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: fallbackVoice },
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
            generated = true;
          }
        } catch (fallbackErr: any) {
          lastErrorMsg = fallbackErr?.message || String(fallbackErr);
          console.error(`Chunk ${i + 1}/${chunks.length} fallback failed:`, lastErrorMsg);
          if (
            lastErrorMsg.includes("API key not valid") ||
            lastErrorMsg.includes("API_KEY_INVALID") ||
            lastErrorMsg.includes("429") ||
            lastErrorMsg.includes("RESOURCE_EXHAUSTED")
          ) {
            break;
          }
        }
      }
    }

    if (audioBuffers.length === 0) {
      if (lastErrorMsg.includes("API key not valid") || lastErrorMsg.includes("API_KEY_INVALID")) {
        return res.status(400).json({
          error: "API Key টি সঠিক নয় বা মেয়াদোত্তীর্ণ (API key not valid)। অনুগ্রহ করে aistudio.google.com/app/apikey থেকে নতুন একটি ফ্রি Gemini API Key তৈরি করে বসান।",
        });
      }
      if (
        lastErrorMsg.includes("429") ||
        lastErrorMsg.includes("Quota exceeded") ||
        lastErrorMsg.includes("RESOURCE_EXHAUSTED") ||
        lastErrorMsg.includes("rate-limits")
      ) {
        // Try extracting retry delay if available
        let retrySeconds = 50;
        const retryMatch = lastErrorMsg.match(/retry in\s+([\d\.]+)s/i) || lastErrorMsg.match(/retryDelay["']?\s*:\s*["']?(\d+)s?/i);
        if (retryMatch && retryMatch[1]) {
          retrySeconds = Math.ceil(parseFloat(retryMatch[1]));
        }
        return res.status(429).json({
          error: `গুগল এপিআই-এর প্রতি মিনিটের ফ্রি সীমা (Rate Limit) সাময়িকভাবে শেষ হয়েছে। অনুগ্রহ করে ${retrySeconds} সেকেন্ড অপেক্ষা করুন অথবা নতুন API Key ব্যবহার করুন।`,
          retryAfter: retrySeconds,
        });
      }
      return res.status(500).json({
        error: `ভয়েস তৈরি করা সম্ভব হয়নি (${lastErrorMsg || "API Error"}). অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।`,
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

// Fallback for unhandled API routes
app.all("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    error: `API Route not found: ${req.method} ${req.path}`,
  });
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
