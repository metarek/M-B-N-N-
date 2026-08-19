import { GoogleGenAI, Modality } from "@google/genai";

export function getEmojiActingDirective(
  textLine: string,
  language: "bengali" | "english" | "hindi",
  voiceName: string = "Mr.banana"
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

export function splitTextIntoTTSChunks(
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

let clientRotationIndex = 0;

export function getClientAvailableKeys(userKey?: string): string[] {
  const keys: string[] = [];

  if (userKey && typeof userKey === "string") {
    const userKeys = userKey.split(/[,\n]/).map((k) => k.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
    keys.push(...userKeys);
  }

  // Check localStorage in browser
  if (typeof window !== "undefined") {
    try {
      const savedKey = localStorage.getItem("banana_gemini_api_key");
      if (savedKey) {
        const savedKeys = savedKey.split(/[,\n]/).map((k) => k.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
        keys.push(...savedKeys);
      }
    } catch (_) {}

    // Check URL parameters (?key=... or ?apiKey=...)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlKey = urlParams.get("key") || urlParams.get("apiKey");
      if (urlKey && urlKey.trim().length > 10) {
        keys.push(urlKey.trim().replace(/^["']|["']$/g, ""));
      }
    } catch (_) {}
  }

  // Check Vite environment variable (set in Vercel or GitHub actions)
  try {
    const viteKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
    if (viteKey && typeof viteKey === "string") {
      const vKeys = viteKey.split(/[,\n]/).map((k: string) => k.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
      keys.push(...vKeys);
    }
  } catch (_) {}

  return Array.from(new Set(keys)).filter((k) => k.length > 10);
}

export async function generateSpeechDirectly(
  text: string,
  voiceName: string,
  language: "bengali" | "english" | "hindi",
  apiKey?: string,
  customPrompt = ""
): Promise<string | null> {
  const availableKeys = getClientAvailableKeys(apiKey);
  if (availableKeys.length === 0) {
    return null;
  }
  const langKey = language === "english" || language === "hindi" ? language : "bengali";
  const chunks = splitTextIntoTTSChunks(text, langKey, voiceName);

  const allowedVoices = ["Puck", "Zephyr", "Fenrir", "Charon", "Kore", "Aoede"];
  let chosenVoice = "Fenrir";
  if (allowedVoices.includes(voiceName)) {
    chosenVoice = voiceName;
  } else if (voiceName === "Mr.banana.pro" || voiceName?.toLowerCase()?.includes("banana.pro")) {
    chosenVoice = "Fenrir"; // Deep, smooth, charismatic YouTube narrator voice (Exact match to video!)
  } else if (voiceName === "Mr.banana.gaming") {
    chosenVoice = "Puck"; // High-energy, fast, breathless shouting gaming YouTuber engine
  } else if (voiceName === "Mr.banana.gaming.pro") {
    chosenVoice = "Zephyr"; // Crisp modern dynamic streamer
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

  // Generate audio for each chunk sequentially with intelligent multi-key instant failover and retry
  const audioBuffers: Uint8Array[] = [];
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
    const maxPasses = 3;

    for (let pass = 1; pass <= maxPasses; pass++) {
      for (let k = 0; k < availableKeys.length; k++) {
        const keyIdx = (clientRotationIndex + k) % availableKeys.length;
        const currentKey = availableKeys[keyIdx];
        const ai = new GoogleGenAI({ apiKey: currentKey });

        try {
          const currentPrompt =
            pass === 1
              ? promptText
              : `${chunk.directive || `Speak as a Bangladeshi gaming YouTuber in ${langKey}:`} ${chunk.text}`;

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
            const binaryString = atob(audioBase64);
            const bytes = new Uint8Array(binaryString.length);
            for (let j = 0; j < binaryString.length; j++) {
              bytes[j] = binaryString.charCodeAt(j);
            }
            audioBuffers.push(bytes);
            chunkGenerated = true;
            clientRotationIndex = (keyIdx + 1) % availableKeys.length;
            break; // Chunk succeeded!
          }
        } catch (chunkError: any) {
          lastErrorMsg = chunkError?.message || String(chunkError);
          console.warn(
            `Client Chunk ${i + 1}/${chunks.length} (Key ${keyIdx + 1}/${availableKeys.length}, pass ${pass}) error:`,
            lastErrorMsg.slice(0, 150)
          );

          if (
            lastErrorMsg.includes("429") ||
            lastErrorMsg.includes("Quota exceeded") ||
            lastErrorMsg.includes("RESOURCE_EXHAUSTED")
          ) {
            // Instant 0ms switch to next key!
            continue;
          }

          if (lastErrorMsg.includes("API key not valid") || lastErrorMsg.includes("API_KEY_INVALID")) {
            continue;
          }
        }
      }

      if (chunkGenerated) {
        break;
      }

      // If all keys failed in this pass, try one quick retry after 1s
      if (pass < maxPasses) {
        await new Promise((res) => setTimeout(res, 1200));
      }
    }

    if (!chunkGenerated) {
      allChunksSuccessful = false;
      break;
    }
  }

  if (!allChunksSuccessful || audioBuffers.length === 0 || audioBuffers.length < chunks.length) {
    if (
      lastErrorMsg.includes("429") ||
      lastErrorMsg.includes("Quota exceeded") ||
      lastErrorMsg.includes("RESOURCE_EXHAUSTED") ||
      lastErrorMsg.includes("rate-limits")
    ) {
      let retrySeconds = 25;
      const retryMatch =
        lastErrorMsg.match(/retry in\s+([\d\.]+)s/i) ||
        lastErrorMsg.match(/retryDelay["']?\s*:\s*["']?(\d+)s?/i);
      if (retryMatch && retryMatch[1]) {
        retrySeconds = Math.max(10, Math.ceil(parseFloat(retryMatch[1])));
      }
      const quotaErr: any = new Error(
        `গুগল এপিআই-এর প্রতি মিনিটের ফ্রি কোটা সাময়িকভাবে শেষ হয়েছে (429 Quota Exceeded)। অনুগ্রহ করে ${retrySeconds} সেকেন্ড অপেক্ষা করুন অথবা একাধিক কী যুক্ত করুন।`
      );
      quotaErr.isQuotaExceeded = true;
      quotaErr.retryAfter = retrySeconds;
      throw quotaErr;
    }
    throw new Error(
      `ভয়েস সম্পূর্ণভাবে তৈরি করা সম্ভব হয়নি (${lastErrorMsg || "API Error"}). আপনার API Key চেক করুন।`
    );
  }

  // Combine Uint8Arrays
  const totalLength = audioBuffers.reduce((acc, curr) => acc + curr.length, 0);
  const combined = new Uint8Array(totalLength);
  let offset = 0;
  for (const buf of audioBuffers) {
    combined.set(buf, offset);
    offset += buf.length;
  }

  // Convert to base64
  let binary = "";
  const len = combined.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(combined[i]);
  }
  return btoa(binary);
}
