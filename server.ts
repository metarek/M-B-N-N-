import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Modality } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// Multi-Key Failover Pool: If Key 1 hits quota (429), automatically switches to Key 2 with 0ms delay!
export const GEMINI_KEYS_POOL = [
  "AIzaSyBSjAW0LOGzp7cPj0qMiU0Zi70aK0xsZvM", // Key 1
  "AIzaSyAR8RAi4YWaXHU9AT3oDBZIgU3yOP7se8U", // Key 2
];

let globalKeyRotationIndex = 0;

function getAllAvailableKeys(userKey?: string): string[] {
  const keys: string[] = [];
  if (userKey) {
    // Support comma or newline separated user keys
    const userKeys = userKey.split(/[,\n]/).map(k => k.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
    keys.push(...userKeys);
  }
  if (process.env.GEMINI_API_KEY) {
    const envKeys = process.env.GEMINI_API_KEY.split(/[,\n]/).map(k => k.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
    keys.push(...envKeys);
  }
  keys.push(...GEMINI_KEYS_POOL);
  // Deduplicate keys preserving order
  return Array.from(new Set(keys)).filter(k => k.length > 10);
}

function getAIClient(apiKey?: string): GoogleGenAI {
  const keys = getAllAvailableKeys(apiKey);
  const keyToUse = keys[0] || GEMINI_KEYS_POOL[0];
  return new GoogleGenAI({
    apiKey: keyToUse.trim().replace(/^["']|["']$/g, ""),
  });
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "MʀツBΛNΛNΛ VOICE", timestamp: new Date().toISOString() });
});

/**
 * Emoji & Voice Model to Acting Instruction Map
 */
function getEmojiActingDirective(
  textLine: string,
  language: "bengali" | "english" | "hindi",
  voiceName: string = "Mr.banana"
): string {
  const langPrompt =
    language === "bengali"
      ? "in crystal clear Bengali (বাংলা)"
      : language === "hindi"
      ? "in crystal clear Hindi (हिन्दी)"
      : "in crystal clear English";

  const isGamingModel =
    voiceName === "Mr.banana.gaming" ||
    voiceName === "Mr.banana.gaming.pro" ||
    voiceName === "Puck" ||
    voiceName?.toLowerCase()?.includes("gaming") ||
    voiceName?.toLowerCase()?.includes("freefire");

  // Strict breath-control directive for clean, professional studio audio without loud gasps or mic breath noise
  const cleanBreathNotice = "Speak with controlled, smooth, silent breathing without any loud inhalation gasps, heavy panting, or audible microphone breath noises. Maintain clean, continuous and punchy vocal delivery.";

  if (isGamingModel) {
    // Master System Prompt — Free Fire Bangladeshi YouTuber Gaming Voice Engine
    const baseGamingRole = `You are a real, famous Bangladeshi Free Fire gaming YouTuber and livestreamer talking directly into your studio mic while playing Free Fire. Speak ${langPrompt} with high-octane gamer energy, fast talking speed, lively YouTuber cadence, youthful charisma, and real human emotion (absolutely no robotic tone, no newsreader tone, no slow boring narrator tone). ${cleanBreathNotice}`;

    // 1. One-tap, Headshot, Booyah, Victory, Hype screaming
    if (/booyah|headshot|one tap|clutch|victory|জিত|উইনার|খতম|সব শেষ|kill|কিল|অসাধারণ|let's go|lets go|op|ওপি|🔥|⚡|🚀|💥|🥳|🎉/i.test(textLine)) {
      return `${baseGamingRole} Shout with explosive gamer joy, fast adrenaline-pumping hype, and victory excitement for the insane one-tap headshot and Booyah, with crisp vocal articulation and zero loud gasping sounds:`;
    }
    // 2. Suspense, HP Low, 1 vs 4, Zone, Clutch tension, Heartbeat
    if (/hp|low|১ জন|একাকী|1vs4|1v4|1 vs 4|zone|সাসপেন্স|আস্তে|ধীরে|লুকিয়ে|ক্যাম্প|😱|😨|😰|🫨|🤫|🤐|\.{3,}/i.test(textLine)) {
      return `${baseGamingRole} Speak with heart-pounding gaming suspense, tense gripping thrill, and dramatic quick pauses as enemy approaches, with clean quiet vocals and no audible breathing noises:`;
    }
    // 3. Rage, Knocked, Rush, Aggressive Fight, Squad clash
    if (/knock|নক|rush|রাশ|মেরে দিল|রিভাইভ|পালা|গুলিবৃষ্টি|এনিমি|enemy|gloo wall|গ্লু ওয়াল|দাঁড়া|দাঁড়াও|😡|🤬|👿|💢|😤/i.test(textLine)) {
      return `${baseGamingRole} Speak with hyper-fast combat intensity, aggressive loud gamer battle cry, shouting fast squad orders with intense adrenaline, clean vocal tone and no loud panting:`;
    }
    // 4. Troll, Funny moments, Noob, Laughing, Roasting
    if (/noob|নুব|বট|bot|লল|lol|হাহা|মজা|troll|ফানি|😂|🤣|😹|😆|😃|😄|😁/.test(textLine)) {
      return `${baseGamingRole} Burst into hilarious gamer laughter, playful teasing and teasing chuckles, delivering comedic YouTube trolling commentary cleanly:`;
    }
    // 5. Emotional, Sadness, Lost match, Heartbreak, Minus rank
    if (/হারলাম|মায়েন্স|minus|rank down|দুঃখ|কষ্ট|স্যারি|😭|😢|😿|🥺|💔/.test(textLine)) {
      return `${baseGamingRole} Deliver with genuine sorrowful gamer tone, emotional trembling voice, sincere sadness after losing rank, without heavy gasping:`;
    }
    // 6. Settings, Sensitivity, DPI, Tips & Tricks, Hook, Subscribe
    if (/setting|সেটিংস|sensitivity|সেনসিটিভিটি|dpi|টিপস|tips|ট্রিকস|গোপন|secret|সাবস্ক্রাইব|subscribe|লাইক|like|ভিডিও|video/i.test(textLine)) {
      return `${baseGamingRole} Deliver with a snappy, viral YouTube Shorts hook, fast engaging confidence, charismatic YouTuber intro and punchy subscriber call to action:`;
    }

    // Default Gaming Master Streamer Tone (Puck / Gaming models)
    return `${baseGamingRole} Deliver with fast-paced, entertaining, lively Bangladeshi gaming streamer hype, natural gamer cadence, smooth silent breath control, and loud punchy emphasis on gaming words:`;
  }

  const isDeepBananaModel =
    voiceName === "Mr.banana" ||
    voiceName === "MrBanana" ||
    voiceName === "Bunny" ||
    voiceName?.toLowerCase()?.includes("banana") ||
    voiceName === "Fenrir";

  if (isDeepBananaModel) {
    if (/😭|😢|😿|🥺|💔/.test(textLine)) {
      return `Say ${langPrompt} in a deep, heavy, emotional baritone voice with sincere sorrow, deep-toned sorrowful trembling and crystal clear diction (no loud sniffing or mic breath noise):`;
    }
    if (/😂|🤣|😹|😆|😃|😄|😁/.test(textLine)) {
      return `Say ${langPrompt} in a deep, rich, masculine baritone bursting into hearty booming laughter, natural chuckles and joyful resonance:`;
    }
    if (/😡|🤬|👿|💢|😤/.test(textLine)) {
      return `Say ${langPrompt} in a thunderous, deep, heavy masculine baritone with commanding fury, aggressive weight and powerful authority (clean vocal projection, no panting):`;
    }
    if (/😱|😨|😰|🫨|👻|💀/.test(textLine)) {
      return `Say ${langPrompt} in a deep, heavy, dramatic tone with intense shock, striking suspense, and clean silent breath control:`;
    }
    if (/😍|🥰|😘|💖|❤️|💕|😻/.test(textLine)) {
      return `Say ${langPrompt} in a warm, rich, deep baritone voice with gentle affection, smooth melody and charismatic charm:`;
    }
    if (/🥳|🎉|🚀|💥|🔥|⚡/.test(textLine)) {
      return `Say ${langPrompt} in a commanding, energetic, deep booming celebration voice with heavy punchy excitement, vibrant hype and clean audio:`;
    }
    if (/😎|😏|🕶️|👑|💅/.test(textLine)) {
      return `Say ${langPrompt} in an ultra-confident, deep, heavy boss voice with stylish swagger, masculine authority and charismatic weight:`;
    }
    // Default Mr.banana signature: Deep, heavy, crystal clear, rich baritone
    return `Say ${langPrompt} in a signature deep, heavy, crystal-clear, commanding masculine voice with rich baritone bass, studio broadcast clarity, full acoustic depth, smooth silent breathing and powerful delivery (no high-pitch, no squeakiness, no loud breath noise):`;
  }

  // Check emojis for other voices
  if (/😭|😢|😿|🥺|💔/.test(textLine)) {
    return `Say ${langPrompt} with genuine weeping, tearful sobbing, trembling voice, and heartbreaking grief with clear diction and clean audio:`;
  }
  if (/😂|🤣|😹|😆|😃|😄|😁/.test(textLine)) {
    return `Say ${langPrompt} bursting into loud laughter, giggling uncontrollably, hearty chuckles, and clear joyful amusement:`;
  }
  if (/😡|🤬|👿|💢|😤/.test(textLine)) {
    return `Say ${langPrompt} with fierce boiling anger, screaming rage, fiery aggression, and loud intense hostile furious emotion, with clean vocal delivery and no heavy panting:`;
  }
  if (/😱|😨|😰|🫨|👻|💀/.test(textLine)) {
    return `Say ${langPrompt} with extreme shock and panicked terror, maintaining clear speech and controlled breath (no loud gasping or mic breath sounds):`;
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
    return `Say ${langPrompt} with explosive hype, wild celebration screams, festive energy, and party excitement, with clean vocals:`;
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
    return `Say ${langPrompt} in a deep, heavy, charismatic, signature MʀツBΛNΛNΛ creator voice with rich baritone clarity and smooth silent breathing:`;
  }
  if (/🤢|🤮|🤧/.test(textLine)) {
    return `Say ${langPrompt} with sickening disgust, nausea, and groaning revulsion:`;
  }
  if (/🥶|❄️|🧊/.test(textLine)) {
    return `Say ${langPrompt} while shivering in freezing cold with teeth chattering:`;
  }
  if (/🥵|🔥/.test(textLine)) {
    return `Say ${langPrompt} with heat-struck fatigue and weary tone, but clean voice without loud mic panting or breath noise:`;
  }

  // Default clean language delivery
  return `Say ${langPrompt} with crisp, crystal-clear studio pronunciation, lively natural expression, and smooth breath control (no loud breath noises or gasps):`;
}

/**
 * Split massive text into optimal TTS chunks (up to 2000 chars per chunk to avoid hitting API rate limits)
 */
function splitTextIntoTTSChunks(
  rawText: string,
  language: "bengali" | "english" | "hindi",
  voiceName: string = "Puck"
): Array<{ text: string; directive: string }> {
  // If the total text is within 2000 characters, send as a SINGLE chunk for instant, quota-friendly generation!
  if (rawText.trim().length <= 2000) {
    return [{
      text: rawText.trim(),
      directive: getEmojiActingDirective(rawText, language, voiceName),
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
          directive: getEmojiActingDirective(currentBlock, language, voiceName),
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
              directive: getEmojiActingDirective(currentBlock, language, voiceName),
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
      directive: getEmojiActingDirective(currentBlock, language, voiceName),
    });
  }

  if (chunks.length === 0 && rawText.trim().length > 0) {
    chunks.push({
      text: rawText.trim(),
      directive: getEmojiActingDirective(rawText, language, voiceName),
    });
  }

  return chunks;
}

// Gemini 3.1 Flash TTS Endpoint with Ultra-Capacity & Emoji-Acting support
app.post("/api/tts", async (req, res) => {
  try {
    const {
      text,
      voiceName = "Mr.banana",
      language = "bengali",
      speed = 1.0,
      customPrompt = "",
      apiKey = "",
    } = req.body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({ error: "Text is required for voice generation." });
    }

    const availableKeys = getAllAvailableKeys(apiKey);
    const langKey = (language === "english" || language === "hindi") ? language : "bengali";

    // Split text into chunks
    const chunks = splitTextIntoTTSChunks(text, langKey, voiceName);

    const allowedVoices = [
      "Fenrir",
      "Charon",
      "Zephyr",
      "Puck",
      "Kore",
      "Aoede",
    ];
    let chosenVoice = "Puck";
    if (allowedVoices.includes(voiceName)) {
      chosenVoice = voiceName;
    } else if (voiceName === "Mr.banana.gaming") {
      chosenVoice = "Puck"; // High-energy, fast, breathless shouting gaming YouTuber engine
    } else if (voiceName === "Mr.banana.gaming.pro") {
      chosenVoice = "Zephyr"; // Crisp modern dynamic streamer
    } else if (
      voiceName === "Mr.banana" ||
      voiceName === "Bunny" ||
      voiceName === "MrBanana"
    ) {
      chosenVoice = "Fenrir"; // Rich, deep, heavy masculine baritone
    } else if (voiceName?.toLowerCase()?.includes("female") || voiceName === "Leda") {
      chosenVoice = "Kore";
    } else if (voiceName === "Orus") {
      chosenVoice = "Fenrir";
    }

    // Generate audio for each chunk sequentially with intelligent multi-key instant failover and retry
    const audioBuffers: Buffer[] = [];
    let lastErrorMsg = "";
    let allChunksSuccessful = true;

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      let promptText = "";

      if (customPrompt && customPrompt.trim()) {
        promptText = `${customPrompt.trim()}: ${chunk.text}`;
      } else {
        promptText = `${chunk.directive} ${chunk.text}`;
      }

      let chunkGenerated = false;
      const maxPasses = 3; // Retry cycles if all keys are temporarily limited

      for (let pass = 1; pass <= maxPasses; pass++) {
        // Try each key in the pool with 0ms delay on 429 quota exhaustion
        for (let k = 0; k < availableKeys.length; k++) {
          const keyIdx = (globalKeyRotationIndex + k) % availableKeys.length;
          const currentKey = availableKeys[keyIdx];
          const aiInstance = getAIClient(currentKey);

          try {
            const currentPrompt =
              pass === 1
                ? promptText
                : `${chunk.directive || `Speak as a Bangladeshi gaming YouTuber in ${langKey}:`} ${chunk.text}`;

            const response = await aiInstance.models.generateContent({
              model: "gemini-3.1-flash-tts-preview",
              contents: [{ parts: [{ text: currentPrompt }] }],
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
              chunkGenerated = true;
              // Advance rotation index for fair distribution
              globalKeyRotationIndex = (keyIdx + 1) % availableKeys.length;
              break; // Success for this chunk!
            }
          } catch (chunkError: any) {
            lastErrorMsg = chunkError?.message || String(chunkError);
            console.warn(
              `Chunk ${i + 1}/${chunks.length} (Key ${keyIdx + 1}/${availableKeys.length}, pass ${pass}) error:`,
              lastErrorMsg.slice(0, 150)
            );

            // If this key hit 429 quota or resource exhaustion, loop immediately moves to the next key with 0ms delay!
            if (
              lastErrorMsg.includes("429") ||
              lastErrorMsg.includes("Quota exceeded") ||
              lastErrorMsg.includes("RESOURCE_EXHAUSTED")
            ) {
              // Try next key immediately!
              continue;
            }

            if (lastErrorMsg.includes("API key not valid") || lastErrorMsg.includes("API_KEY_INVALID")) {
              // Try next key if this one is invalid
              continue;
            }
          }
        }

        if (chunkGenerated) {
          break; // Chunk succeeded
        }

        // If all keys failed in this pass, wait if there are remaining passes
        if (pass < maxPasses) {
          let waitMs = 3000;
          const retryMatch =
            lastErrorMsg.match(/retry in\s+([\d\.]+)s/i) ||
            lastErrorMsg.match(/retryDelay["']?\s*:\s*["']?(\d+)s?/i);
          if (retryMatch && retryMatch[1]) {
            const parsedSeconds = parseFloat(retryMatch[1]);
            if (parsedSeconds <= 65) {
              waitMs = Math.ceil(parsedSeconds * 1000) + 700;
            } else {
              break;
            }
          }
          await new Promise((res) => setTimeout(res, waitMs));
        }
      }

      // If this chunk failed after all attempts, break
      if (!chunkGenerated) {
        allChunksSuccessful = false;
        break;
      }
    }

    // If not all chunks succeeded, do NOT send a truncated (e.g. 6s) audio!
    if (!allChunksSuccessful || audioBuffers.length === 0 || audioBuffers.length < chunks.length) {
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
        let retrySeconds = 40;
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
        error: `ভয়েস সম্পূর্ণভাবে তৈরি করা সম্ভব হয়নি (${lastErrorMsg || "API Error"}). অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।`,
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
