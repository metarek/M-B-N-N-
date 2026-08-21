import { GoogleGenAI, Modality } from "@google/genai";
import { DEFAULT_KEY_POOL } from "../constants/apiKeys";

export function getEmojiActingDirective(
  textLine: string,
  language: "bengali" | "english" | "hindi",
  voiceName: string = "Mr.banana"
): string {
  const langPrompt =
    language === "bengali"
      ? "Bengali (বাংলায় সহজ, সাবলীল ও স্পষ্ট উচ্চারণ)"
      : language === "hindi"
      ? "Hindi (हिन्दी)"
      : "English";

  // Strict anti-drag rule to prevent stretched vowels, trailing throat squeeze, or vocal fry
  const CADENCE = "Speak smoothly with brisk, crisp cadence. Finish words and sentences cleanly without dragging, without stretching ending vowels, without vocal fry, and without trailing squeezed or drawled tone (কোনো শব্দ বা সুর টেনে লম্বা করবে না, একদম স্পষ্ট ও স্বাভাবিক গতিতে শেষ করবে):";

  const isBananaProModel =
    voiceName === "Mr.banana.pro" ||
    voiceName?.toLowerCase()?.includes("banana.pro");

  if (isBananaProModel) {
    if (/পার্থক্য|কি\?|কেন\?|কেমন|জানো|স্নাইপার|রাশার|sniper|rush|\?/i.test(textLine)) {
      return `Speak in an engaging, deep, charismatic YouTube explainer and curious narrator voice in ${langPrompt}. ${CADENCE}`;
    }
    if (/তো গাইজ|গাইজ|সাবস্ক্রাইব|লাইক|কমেন্ট|জানাও|subscribe|comment|share/i.test(textLine)) {
      return `Speak in a warm, confident, engaging YouTuber call-to-action tone in ${langPrompt}. ${CADENCE}`;
    }
    if (/booyah|headshot|শট|পাওয়ার|বিজয়|heroic|master|গ্র্যান্ড|🔥|⚡|🚀|💥/i.test(textLine)) {
      return `Speak in a deep, confident, epic gaming narrator voice in ${langPrompt}. ${CADENCE}`;
    }
    if (/😂|🤣|হাহাহা|haha|lol/i.test(textLine)) {
      return `Speak in a deep, rich baritone chuckle and humorous storyteller tone in ${langPrompt}. ${CADENCE}`;
    }
    return `Speak in a smooth, deep, charismatic, confident Free Fire YouTube narrator voice with clear pronunciation in ${langPrompt}. ${CADENCE}`;
  }

  const isGamingModel =
    voiceName === "Mr.banana.gaming" ||
    voiceName === "Mr.banana.gaming.pro" ||
    voiceName === "Puck" ||
    voiceName?.toLowerCase()?.includes("gaming") ||
    voiceName?.toLowerCase()?.includes("freefire");

  if (isGamingModel) {
    if (/booyah|headshot|one tap|clutch|victory|জিত|উইনার|খতম|সব শেষ|kill|কিল|অসাধারণ|let's go|lets go|op|ওপি|🔥|⚡|🚀|💥|🥳|🎉/i.test(textLine)) {
      return `Speak in energetic Bangladeshi gaming YouTuber victory hype in ${langPrompt}. ${CADENCE}`;
    }
    if (/hp|low|১ জন|একাকী|1vs4|1v4|1 vs 4|zone|সাসপেন্স|আস্তে|ধীরে|লুকিয়ে|ক্যাম্প|😱|😨|😰|🫨|🤫|🤐|\.{3,}/i.test(textLine)) {
      return `Speak in intense gaming suspense tone in ${langPrompt}. ${CADENCE}`;
    }
    if (/knock|নক|rush|রাশ|মেরে দিল|রিভাইভ|পালা|গুলিবৃষ্টি|এনিমি|enemy|gloo wall|গ্লু ওয়াল|দাঁড়া|দাঁড়াও|😡|🤬|👿|💢|😤/i.test(textLine)) {
      return `Speak in aggressive fast-paced gaming battle cry in ${langPrompt}. ${CADENCE}`;
    }
    if (/noob|নুব|বট|bot|লল|lol|হাহা|মজা|troll|ফানি|😂|🤣|😹|😆|😃|😄|😁/.test(textLine)) {
      return `Speak with playful YouTuber laughter and teasing comedy in ${langPrompt}. ${CADENCE}`;
    }
    if (/হারলাম|মায়েন্স|minus|rank down|দুঃখ|কষ্ট|স্যারি|😭|😢|😿|🥺|💔/.test(textLine)) {
      return `Speak with sad emotional gamer tone in ${langPrompt}. ${CADENCE}`;
    }
    return `Speak as a lively, energetic Bangladeshi gaming YouTuber in ${langPrompt}. ${CADENCE}`;
  }

  const isBabyGirlModel =
    voiceName === "Aoede" ||
    voiceName?.toLowerCase()?.includes("aoede") ||
    voiceName?.toLowerCase()?.includes("anya") ||
    voiceName?.toLowerCase()?.includes("আন্যা") ||
    voiceName?.toLowerCase()?.includes("baby") ||
    voiceName?.toLowerCase()?.includes("বাচ্চা");

  if (isBabyGirlModel) {
    const anyaCadence = "Character Persona: Anya Forger (Spy x Family). Voice: Ultra-high-pitched, squeaky, adorable 4-5 year old toddler girl (Atsumi Tanezaki style). Key traits: Extreme cute baby nakra (আদুরে নেকামি), childish lisp and slight stutter (তোতলামি ও বায়না), referring to herself in third person ('আন্যা / Anya'), playful spoiled whining, exaggerated funny gasps, mischievous cute smug giggles, and signature high-energy 'Waku Waku!'. She must sound 100% like a tiny mischievous 4-5 year old anime kid baby, NOT an adult woman:";
    if (/ওয়াকু|waku|রোমাঞ্চ|স্পাই|মিশন|পিনাট|বাদাম|🤩|✨|🎉|🥳|🔥/i.test(textLine)) {
      return `Speak in Anya Forger's iconic ecstatic squeaky 4-year-old toddler scream "Waku Waku!" full of anime child excitement and wide-eyed baby energy in ${langPrompt}. ${anyaCadence}`;
    }
    if (/হেহ|heh|smug|হিহি|হাহা|মজা|funny|কার্টুন|খিলখিল|😂|🤣|😹|😆|😃|😄|😁|😏|🤭/i.test(textLine)) {
      return `Speak in Anya Forger's legendary mischievous smug "Heh 😏" face voice with cute spoiled baby snickers and funny childish teasing in ${langPrompt}. ${anyaCadence}`;
    }
    if (/😱|😨|😰|ওরে বাবা|হায় হায়|ধরা পড়ে গেছি|সিক্রেট|secret|mind|পড়ে ফেললাম/i.test(textLine)) {
      return `Speak in Anya Forger's panicked, dramatic squeaky anime toddler shock, funny high-pitched baby shriek and dramatic toddler gasp in ${langPrompt}. ${anyaCadence}`;
    }
    if (/😭|😢|😿|🥺|💔|কান্না|কেঁদে|ভ্যা|পচা|মারবো|মারব|দেবো না|হুঁ/i.test(textLine)) {
      return `Speak in Anya Forger's iconic cute spoiled baby crying tantrum with heavy baby whines, sniffling, cute childish sobbing and dramatic pouting (একদম ৪-৫ বছরের আদুরে বাচ্চার মিষ্টি কান্না ও নেকামিভরা বায়না) in ${langPrompt}. ${anyaCadence}`;
    }
    if (/😍|🥰|😘|💖|❤️|💕|😻|ভালোবাসি|আই লাভ ইউ|বাবু|আম্মু|আব্বু|পুতুল|চকলেট|আইসক্রিম|বাবা|মা/i.test(textLine)) {
      return `Speak in Anya Forger's sweetest spoiled 4-year-old cuddle voice whining affectionately to Papa Loid and Mama Yor with adorable baby charm in ${langPrompt}. ${anyaCadence}`;
    }
    if (/\?|কি\?|কেন\?|কেমন\?|কই\?/i.test(textLine)) {
      return `Speak in Anya Forger's curious, squeaky, cute 4-year-old child questioning tone with total innocent toddler curiosity in ${langPrompt}. ${anyaCadence}`;
    }
    return `Speak as Anya Forger from Spy x Family: A 4-5 year old ultra squeaky, spoiled, adorable anime toddler girl with extreme baby nakra (মিষ্টি নেকামি), funny childish innocence, cute squeaks and fast lively toddler rhythm in ${langPrompt}. ${anyaCadence}`;
  }

  const isKoreSweetRomanticModel =
    voiceName === "Kore" ||
    voiceName?.toLowerCase()?.includes("kore") ||
    voiceName?.toLowerCase()?.includes("মিষ্টি") ||
    voiceName?.toLowerCase()?.includes("রোমান্টিক") ||
    voiceName?.toLowerCase()?.includes("মেয়ে");

  if (isKoreSweetRomanticModel) {
    const koreCadence = "Character Persona: A 12 to 15 year old young teenage schoolgirl (১২-১৫ বছরের কিশোরী মেয়ে). Voice Characteristics: Naturally high-pitched, sweet, bright, light, and charming young teenage voice. Completely avoid adult woman/mature deep low tones. Speak with youthful softness, innocent charm, cheerful cadence, and crystal-clear pronunciation in Bengali.";
    if (/😍|🥰|😘|💖|❤️|💕|😻|ভালোবাসি|প্রেম|প্রিয়|হৃদয়|মন|কাছে/i.test(textLine)) {
      return `Speak in a very sweet, soft, shy, and heartfelt 12-15 year old teenage girl's voice with innocent charm and bright melodic warmth in ${langPrompt}. ${koreCadence}`;
    }
    if (/😭|😢|😿|🥺|💔|কষ্ট|বেদনা|অশ্রু|ব্যথা|কেন এমন হলো|ছেড়ে গেলে/i.test(textLine)) {
      return `Speak in an emotional, fragile, tearful, and tender 12-15 year old young girl's voice with soft trembling sincerity in ${langPrompt}. ${koreCadence}`;
    }
    if (/😂|🤣|হিহি|হাহা|হাসি|আনন্দ|মজা|মুচকি|ধুর|আরে/i.test(textLine)) {
      return `Speak with a bubbly, cheerful, high-pitched, giggly 12-15 year old teenage girl's laughter and lively bounce in ${langPrompt}. ${koreCadence}`;
    }
    if (/🤫|গোপন|ফিসফিস|আস্তে|শোনো|বলছি/i.test(textLine)) {
      return `Speak in a whispery, curious, sweet teenage girl storytelling tone in ${langPrompt}. ${koreCadence}`;
    }
    if (/\?|কি\?|কেন\?|সত্যি\?|তাই\?/i.test(textLine)) {
      return `Speak in an inquisitive, bright, high-pitched teenage girl's questioning tone in ${langPrompt}. ${koreCadence}`;
    }
    return `Speak in a naturally sweet, high-pitched, light, and cute 12-15 year old teenage girl's voice with lively natural flow in ${langPrompt}. ${koreCadence}`;
  }

  const isDeepBananaModel =
    voiceName === "Mr.banana" ||
    voiceName === "MrBanana" ||
    voiceName === "Bunny" ||
    voiceName?.toLowerCase()?.includes("banana") ||
    voiceName === "Fenrir";

  if (isDeepBananaModel) {
    if (/😭|😢|😿|🥺|💔/.test(textLine)) {
      return `Speak in deep, sorrowful emotional baritone in ${langPrompt}. ${CADENCE}`;
    }
    if (/😂|🤣|😹|😆|😃|😄|😁/.test(textLine)) {
      return `Speak in deep booming masculine laughter in ${langPrompt}. ${CADENCE}`;
    }
    if (/😡|🤬|👿|💢|😤/.test(textLine)) {
      return `Speak in commanding, deep angry baritone in ${langPrompt}. ${CADENCE}`;
    }
    if (/😍|🥰|😘|💖|❤️|💕|😻/.test(textLine)) {
      return `Speak in warm, deep romantic baritone in ${langPrompt}. ${CADENCE}`;
    }
    return `Speak in signature deep, heavy, rich studio baritone voice in ${langPrompt}. ${CADENCE}`;
  }

  if (/😭|😢|😿|🥺|💔/.test(textLine)) {
    return `Speak in emotional, crying tone in ${langPrompt}. ${CADENCE}`;
  }
  if (/😂|🤣|😹|😆|😃|😄|😁/.test(textLine)) {
    return `Speak in hearty joyful laughter in ${langPrompt}. ${CADENCE}`;
  }
  if (/😡|🤬|👿|💢|😤/.test(textLine)) {
    return `Speak with fierce anger and shouting emotion in ${langPrompt}. ${CADENCE}`;
  }
  if (/😍|🥰|😘|💖|❤️|💕|😻/.test(textLine)) {
    return `Speak with sweet romantic affection in ${langPrompt}. ${CADENCE}`;
  }
  if (/🍌/.test(textLine)) {
    return `Speak in signature MʀツBΛNΛNΛ creator voice in ${langPrompt}. ${CADENCE}`;
  }

  return `Speak in natural, expressive, crystal clear ${langPrompt}. ${CADENCE}`;
}

export function sanitizeSpeechText(text: string): string {
  return text
    .replace(/[~]+/g, '')
    .replace(/\.{3,}/g, '.')
    .replace(/!{2,}/g, '!')
    .replace(/\?{2,}/g, '?')
    .replace(/\s+/g, ' ')
    .trim();
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

  // Check fallback keys pool
  try {
    if (DEFAULT_KEY_POOL && Array.isArray(DEFAULT_KEY_POOL)) {
      keys.push(...DEFAULT_KEY_POOL);
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
  const cleanSpeechText = sanitizeSpeechText(text);
  const chunks = splitTextIntoTTSChunks(cleanSpeechText, langKey, voiceName);

  const allowedVoices = ["Puck", "Zephyr", "Fenrir", "Charon", "Kore", "Aoede"];
  let chosenVoice = "Fenrir";
  if (voiceName === "Aoede" || voiceName?.toLowerCase()?.includes("anya") || voiceName?.toLowerCase()?.includes("আন্যা") || voiceName?.toLowerCase()?.includes("baby") || voiceName?.toLowerCase()?.includes("বাচ্চা")) {
    chosenVoice = "Aoede"; // Aoede provides authentic high-pitched cute young anime child/girl voice
  } else if (allowedVoices.includes(voiceName)) {
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
    const maxPasses = 2;
    const permanentlyFailedKeys = new Set<string>();

    for (let pass = 1; pass <= maxPasses; pass++) {
      for (let k = 0; k < availableKeys.length; k++) {
        const keyIdx = (clientRotationIndex + k) % availableKeys.length;
        const currentKey = availableKeys[keyIdx];
        if (permanentlyFailedKeys.has(currentKey)) continue;

        const ai = new GoogleGenAI({ apiKey: currentKey });

        const modelsToTry = [
          "gemini-3.1-flash-tts-preview",
        ];

        for (const modelName of modelsToTry) {
          try {
            const currentPrompt =
              pass === 1
                ? promptText
                : `${chunk.directive || `Speak as a Bangladeshi gaming YouTuber in ${langKey}:`} ${chunk.text}`;

            const response = await ai.models.generateContent({
              model: modelName,
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
              clientRotationIndex = keyIdx;
              break; // Chunk succeeded!
            }
          } catch (chunkError: any) {
            lastErrorMsg = chunkError?.message || String(chunkError);
            console.warn(
              `Client Chunk ${i + 1}/${chunks.length} (Model ${modelName}, Key ${keyIdx + 1}/${availableKeys.length}, pass ${pass}) error:`,
              lastErrorMsg.slice(0, 150)
            );

            if (
              lastErrorMsg.includes("leaked") ||
              lastErrorMsg.includes("PERMISSION_DENIED") ||
              lastErrorMsg.includes("API key not valid") ||
              lastErrorMsg.includes("API_KEY_INVALID") ||
              lastErrorMsg.includes("exceeded your current quota")
            ) {
              permanentlyFailedKeys.add(currentKey);
              break; // Don't try other models with dead key
            }
            if (lastErrorMsg.includes("not found") || lastErrorMsg.includes("404") || lastErrorMsg.includes("unsupported")) {
              continue;
            }
            break;
          }
        }

        if (chunkGenerated) {
          break;
        }
      }

      if (chunkGenerated) {
        break;
      }

      if (pass < maxPasses && availableKeys.length > 0) {
        const waitTime = lastErrorMsg.includes("429") ? 1500 : 500;
        await new Promise((res) => setTimeout(res, waitTime));
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
      lastErrorMsg.includes("quota") ||
      lastErrorMsg.includes("Quota") ||
      lastErrorMsg.includes("RESOURCE_EXHAUSTED") ||
      lastErrorMsg.includes("rate-limits")
    ) {
      let retrySeconds = 20;
      const retryMatch =
        lastErrorMsg.match(/retry in\s+([\d\.]+)s/i) ||
        lastErrorMsg.match(/retryDelay["']?\s*:\s*["']?(\d+)s?/i);
      if (retryMatch && retryMatch[1]) {
        retrySeconds = Math.max(10, Math.ceil(parseFloat(retryMatch[1])));
      }
      const quotaErr: any = new Error(
        `আপনার বর্তমান Gemini API Key-এর ফ্রি কোটা শেষ হয়েছে (429 Quota Exceeded)। অনুগ্রহ করে ${retrySeconds} সেকেন্ড অপেক্ষা করুন অথবা '🔑 API Key' বাটনে aistudio.google.com থেকে নতুন ফ্রি Key যুক্ত করুন।`
      );
      quotaErr.isQuotaExceeded = true;
      quotaErr.retryAfter = retrySeconds;
      quotaErr.needsApiKey = true;
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
