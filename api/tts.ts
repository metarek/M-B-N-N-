import { GoogleGenAI, Modality } from "@google/genai";

function getEmojiActingDirective(
  textLine: string,
  language: "bengali" | "english" | "hindi",
  voiceName: string = "Mr.banana.pro"
): string {
  const langPrompt =
    language === "bengali"
      ? "Bengali (বাংলা)"
      : language === "hindi"
      ? "Hindi (हिन्दी)"
      : "English";

  const isBananaProModel =
    voiceName === "Mr.banana.pro" ||
    voiceName?.toLowerCase()?.includes("banana.pro");

  if (isBananaProModel) {
    if (/পার্থক্য|কি\?|কেন\?|কেমন|জানো|স্নাইপার|রাশার|sniper|rush|\?/i.test(textLine)) {
      return `Speak in an engaging, deep, charismatic YouTube explainer and curious narrator voice in ${langPrompt}:`;
    }
    if (/তো গাইজ|গাইজ|সাবস্ক্রাইব|লাইক|কমেন্ট|জানাও|subscribe|comment|share/i.test(textLine)) {
      return `Speak in a warm, confident, engaging YouTuber call-to-action tone in ${langPrompt}:`;
    }
    if (/booyah|headshot|শট|পাওয়ার|বিজয়|heroic|master|গ্র্যান্ড|🔥|⚡|🚀|💥/i.test(textLine)) {
      return `Speak in a deep, confident, epic gaming narrator voice in ${langPrompt}:`;
    }
    if (/😂|🤣|হাহাহা|haha|lol/i.test(textLine)) {
      return `Speak in a deep, rich baritone chuckle and humorous storyteller tone in ${langPrompt}:`;
    }
    return `Speak in a smooth, deep, charismatic, confident Free Fire YouTube narrator voice with clear pronunciation in ${langPrompt}:`;
  }

  const isGamingModel =
    voiceName === "Mr.banana.gaming" ||
    voiceName === "Mr.banana.gaming.pro" ||
    voiceName === "Puck" ||
    voiceName?.toLowerCase()?.includes("gaming") ||
    voiceName?.toLowerCase()?.includes("freefire");

  if (isGamingModel) {
    if (/booyah|headshot|one tap|clutch|victory|জিত|উইনার|খতম|সব শেষ|kill|কিল|অসাধারণ|let's go|lets go|op|ওপি|🔥|⚡|🚀|💥|🥳|🎉/i.test(textLine)) {
      return `Speak in energetic Bangladeshi gaming YouTuber victory hype in ${langPrompt}:`;
    }
    if (/hp|low|১ জন|একাকী|1vs4|1v4|1 vs 4|zone|সাসপেন্স|আস্তে|ধীরে|লুকিয়ে|ক্যাম্প|😱|😨|😰|🫨|🤫|🤐|\.{3,}/i.test(textLine)) {
      return `Speak in intense gaming suspense tone in ${langPrompt}:`;
    }
    if (/knock|নক|rush|রাশ|মেরে দিল|রিভাইভ|পালা|গুলিবৃষ্টি|এনিমি|enemy|gloo wall|গ্লু ওয়াল|দাঁড়া|দাঁড়াও|😡|🤬|👿|💢|😤/i.test(textLine)) {
      return `Speak in aggressive fast-paced gaming battle cry in ${langPrompt}:`;
    }
    if (/noob|নুব|বট|bot|লল|lol|হাহা|মজা|troll|ফানি|😂|🤣|😹|😆|😃|😄|😁/.test(textLine)) {
      return `Speak with playful YouTuber laughter and teasing comedy in ${langPrompt}:`;
    }
    if (/হারলাম|মায়েন্স|minus|rank down|দুঃখ|কষ্ট|স্যারি|😭|😢|😿|🥺|💔/.test(textLine)) {
      return `Speak with sad emotional gamer tone in ${langPrompt}:`;
    }
    return `Speak as a lively, energetic Bangladeshi gaming YouTuber in ${langPrompt}:`;
  }

  const isDeepBananaModel =
    voiceName === "Mr.banana" ||
    voiceName === "MrBanana" ||
    voiceName === "Bunny" ||
    voiceName?.toLowerCase()?.includes("banana") ||
    voiceName === "Fenrir";

  if (isDeepBananaModel) {
    if (/😭|😢|😿|🥺|💔/.test(textLine)) {
      return `Speak in deep, sorrowful emotional baritone in ${langPrompt}:`;
    }
    if (/😂|🤣|😹|😆|😃|😄|😁/.test(textLine)) {
      return `Speak in deep booming masculine laughter in ${langPrompt}:`;
    }
    if (/😡|🤬|👿|💢|😤/.test(textLine)) {
      return `Speak in commanding, deep angry baritone in ${langPrompt}:`;
    }
    if (/😍|🥰|😘|💖|❤️|💕|😻/.test(textLine)) {
      return `Speak in warm, deep romantic baritone in ${langPrompt}:`;
    }
    return `Speak in signature deep, heavy, rich studio baritone voice in ${langPrompt}:`;
  }

  if (/😭|😢|😿|🥺|💔/.test(textLine)) {
    return `Speak in emotional, crying tone in ${langPrompt}:`;
  }
  if (/😂|🤣|😹|😆|😃|😄|😁/.test(textLine)) {
    return `Speak in hearty joyful laughter in ${langPrompt}:`;
  }
  if (/😡|🤬|👿|💢|😤/.test(textLine)) {
    return `Speak with fierce anger and shouting emotion in ${langPrompt}:`;
  }
  if (/😍|🥰|😘|💖|❤️|💕|😻/.test(textLine)) {
    return `Speak with sweet romantic affection in ${langPrompt}:`;
  }
  if (/🍌/.test(textLine)) {
    return `Speak in signature MʀツBΛNΛNΛ creator voice in ${langPrompt}:`;
  }

  return `Speak in natural, expressive, crystal clear ${langPrompt}:`;
}

function splitTextIntoTTSChunks(
  rawText: string,
  language: "bengali" | "english" | "hindi",
  voiceName: string = "Mr.banana.pro"
): Array<{ text: string; directive: string }> {
  if (rawText.trim().length <= 3500) {
    return [{
      text: rawText.trim(),
      directive: getEmojiActingDirective(rawText, language, voiceName),
    }];
  }

  const rawLines = rawText.split(/\r?\n+/).map((l) => l.trim()).filter((l) => l.length > 0);
  const chunks: Array<{ text: string; directive: string }> = [];
  let currentBlock = "";

  for (const line of rawLines) {
    if ((currentBlock + "\n" + line).length <= 3000) {
      currentBlock = currentBlock ? `${currentBlock}\n${line}` : line;
    } else {
      if (currentBlock) {
        chunks.push({
          text: currentBlock.trim(),
          directive: getEmojiActingDirective(currentBlock, language, voiceName),
        });
      }
      if (line.length <= 3000) {
        currentBlock = line;
      } else {
        const sentences = line.split(/(?<=[.?!।|])\s+/).filter((s) => s.trim().length > 0);
        currentBlock = "";
        for (const sent of sentences) {
          if ((currentBlock + " " + sent).length > 3000 && currentBlock.length > 0) {
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

let vercelKeyRotationIndex = 0;

function getAllAvailableKeys(userKey?: string): string[] {
  const keys: string[] = [];
  if (userKey && typeof userKey === "string") {
    const userKeys = userKey.split(/[,\n]/).map((k) => k.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
    keys.push(...userKeys);
  }
  const envSources = [
    process.env.GEMINI_API_KEY,
    process.env.VITE_GEMINI_API_KEY,
    process.env.AI_STUDIO_KEY,
    process.env.GOOGLE_API_KEY,
    process.env.API_KEY,
  ];
  for (const envVal of envSources) {
    if (envVal && typeof envVal === "string") {
      const splitKeys = envVal.split(/[,\n]/).map((k) => k.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
      keys.push(...splitKeys);
    }
  }
  return Array.from(new Set(keys)).filter((k) => k.length > 10);
}

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
      text,
      voiceName = "Mr.banana.pro",
      language = "bengali",
      customPrompt = "",
      apiKey = "",
    } = req.body || {};

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({ error: "Text is required for voice generation." });
    }

    const availableKeys = getAllAvailableKeys(apiKey);
    const langKey = language === "english" || language === "hindi" ? language : "bengali";

    if (availableKeys.length === 0) {
      return res.status(400).json({
        error:
          "কোনো সক্রিয় Gemini API Key পাওয়া যায়নি। Vercel Dashboard এর Settings -> Environment Variables এ GEMINI_API_KEY যোগ করুন অথবা অ্যাপের '🔑 API Key' বাটনে আপনার নিজস্ব ফ্রি কী দিন।",
        needsApiKey: true,
      });
    }

    const chunks = splitTextIntoTTSChunks(text, langKey, voiceName);

    const allowedVoices = ["Fenrir", "Charon", "Zephyr", "Puck", "Kore", "Aoede"];
    let chosenVoice = "Fenrir";
    if (allowedVoices.includes(voiceName)) {
      chosenVoice = voiceName;
    } else if (voiceName === "Mr.banana.pro" || voiceName?.toLowerCase()?.includes("banana.pro")) {
      chosenVoice = "Fenrir";
    } else if (voiceName === "Mr.banana.gaming") {
      chosenVoice = "Puck";
    } else if (voiceName === "Mr.banana.gaming.pro") {
      chosenVoice = "Zephyr";
    } else if (
      voiceName === "Mr.banana" ||
      voiceName === "Bunny" ||
      voiceName === "MrBanana"
    ) {
      chosenVoice = "Fenrir";
    } else if (voiceName?.toLowerCase()?.includes("female") || voiceName === "Leda") {
      chosenVoice = "Kore";
    } else if (voiceName === "Orus") {
      chosenVoice = "Fenrir";
    }

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
      const maxPasses = 4;

      for (let pass = 1; pass <= maxPasses; pass++) {
        for (let k = 0; k < availableKeys.length; k++) {
          const keyIdx = (vercelKeyRotationIndex + k) % availableKeys.length;
          const currentKey = availableKeys[keyIdx];
          const ai = new GoogleGenAI({ apiKey: currentKey });

          try {
            const currentPrompt =
              pass === 1
                ? promptText
                : `${chunk.directive || `Speak in natural, expressive, crystal clear ${langKey}:`} ${chunk.text}`;

            const response = await ai.models.generateContent({
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
            const audioPart = candidate?.content?.parts?.find((p: any) => p.inlineData && p.inlineData.data);
            const audioBase64 = audioPart?.inlineData?.data || candidate?.content?.parts?.[0]?.inlineData?.data;

            if (audioBase64) {
              const chunkBuffer = Buffer.from(audioBase64, "base64");
              audioBuffers.push(chunkBuffer);
              chunkGenerated = true;
              vercelKeyRotationIndex = (keyIdx + 1) % availableKeys.length;
              break;
            }
          } catch (chunkError: any) {
            lastErrorMsg = chunkError?.message || String(chunkError);
            console.warn(
              `Vercel Chunk ${i + 1}/${chunks.length} (Key ${keyIdx + 1}/${availableKeys.length}, pass ${pass}) error:`,
              lastErrorMsg.slice(0, 150)
            );

            if (
              lastErrorMsg.includes("429") ||
              lastErrorMsg.includes("Quota exceeded") ||
              lastErrorMsg.includes("RESOURCE_EXHAUSTED") ||
              lastErrorMsg.includes("leaked") ||
              lastErrorMsg.includes("PERMISSION_DENIED") ||
              lastErrorMsg.includes("API key not valid") ||
              lastErrorMsg.includes("API_KEY_INVALID")
            ) {
              continue;
            }
          }
        }

        if (chunkGenerated) {
          break;
        }

        if (pass < maxPasses) {
          await new Promise((res) => setTimeout(res, pass * 1200));
        }
      }

      if (!chunkGenerated) {
        allChunksSuccessful = false;
        break;
      }
    }

    if (!allChunksSuccessful || audioBuffers.length === 0 || audioBuffers.length < chunks.length) {
      if (
        lastErrorMsg.includes("leaked") ||
        lastErrorMsg.includes("PERMISSION_DENIED") ||
        lastErrorMsg.includes("API key not valid") ||
        lastErrorMsg.includes("API_KEY_INVALID")
      ) {
        return res.status(400).json({
          error: "API Key টি সক্রিয় নয় বা Google দ্বারা ব্লক/Revoked হয়েছে। অনুগ্রহ করে aistudio.google.com/app/apikey থেকে আপনার নিজস্ব নতুন ফ্রি Gemini API Key দিন।",
          needsApiKey: true,
        });
      }
      if (
        lastErrorMsg.includes("429") ||
        lastErrorMsg.includes("Quota exceeded") ||
        lastErrorMsg.includes("RESOURCE_EXHAUSTED") ||
        lastErrorMsg.includes("rate-limits")
      ) {
        let retrySeconds = 25;
        const retryMatch = lastErrorMsg.match(/retry in\s+([\d\.]+)s/i) || lastErrorMsg.match(/retryDelay["']?\s*:\s*["']?(\d+)s?/i);
        if (retryMatch && retryMatch[1]) {
          retrySeconds = Math.ceil(parseFloat(retryMatch[1]));
        }
        return res.status(429).json({
          error: `গুগল এআই স্টুডিওর প্রতি মিনিটের ফ্রি সীমা (Rate Limit / Quota) সাময়িকভাবে শেষ হয়েছে। অনুগ্রহ করে ${retrySeconds} সেকেন্ড অপেক্ষা করুন অথবা একাধিক কী (Key 1, Key 2) যুক্ত করুন।`,
          retryAfter: retrySeconds,
          isQuotaExceeded: true,
        });
      }
      return res.status(500).json({
        error: `ভয়েস তৈরি করা সম্ভব হয়নি (${lastErrorMsg || "API Error"}). আপনার GEMINI_API_KEY সক্রিয় আছে কিনা চেক করুন।`,
      });
    }

    const combinedPcmBuffer = Buffer.concat(audioBuffers);
    const combinedBase64 = combinedPcmBuffer.toString("base64");

    return res.status(200).json({
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
    console.error("Vercel TTS Generation Error:", error);
    return res.status(500).json({
      error: error?.message || "Failed to generate speech audio.",
    });
  }
}

