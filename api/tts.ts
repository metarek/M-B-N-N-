import { GoogleGenAI, Modality } from "@google/genai";

function getEmojiActingDirective(textLine: string, language: "bengali" | "english" | "hindi"): string {
  const langPrompt =
    language === "bengali"
      ? "in crystal clear Bengali (বাংলা)"
      : language === "hindi"
      ? "in crystal clear Hindi (हिन्दी)"
      : "in crystal clear English";

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

  return `Say ${langPrompt} with crisp, crystal-clear studio pronunciation and lively natural expression:`;
}

function splitTextIntoTTSChunks(rawText: string, language: "bengali" | "english" | "hindi"): Array<{ text: string; directive: string }> {
  const rawLines = rawText.split(/\r?\n+/).map((l) => l.trim()).filter((l) => l.length > 0);
  const chunks: Array<{ text: string; directive: string }> = [];

  for (const line of rawLines) {
    const directive = getEmojiActingDirective(line, language);

    if (line.length <= 350) {
      chunks.push({ text: line, directive });
    } else {
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

  if (chunks.length === 0 && rawText.trim().length > 0) {
    chunks.push({
      text: rawText.trim(),
      directive: getEmojiActingDirective(rawText, language),
    });
  }

  return chunks;
}

export default async function handler(req: any, res: any) {
  // Enable CORS for Vercel
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
      voiceName = "Puck",
      language = "bengali",
      customPrompt = "",
      apiKey: clientApiKey = "",
    } = req.body || {};

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({ error: "Text is required for voice generation." });
    }

    const apiKey = clientApiKey || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(401).json({
        error:
          "GEMINI_API_KEY পাওয়া যায়নি। Vercel Dashboard এর Settings -> Environment Variables এ GEMINI_API_KEY যোগ করুন অথবা অ্যাপের Settings থেকে API Key প্রবেশ করান।",
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

    const langKey = language === "english" || language === "hindi" ? language : "bengali";
    const chunks = splitTextIntoTTSChunks(text, langKey);

    const allowedVoices = ["Puck", "Charon", "Kore", "Fenrir", "Aoede", "Zephyr"];
    let chosenVoice = "Puck";
    if (allowedVoices.includes(voiceName)) {
      chosenVoice = voiceName;
    } else if (voiceName?.toLowerCase()?.includes("female") || voiceName === "Leda") {
      chosenVoice = "Kore";
    } else if (voiceName === "Orus") {
      chosenVoice = "Fenrir";
    }

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
        const audioPart = candidate?.content?.parts?.find((p: any) => p.inlineData && p.inlineData.data);
        const audioBase64 = audioPart?.inlineData?.data || candidate?.content?.parts?.[0]?.inlineData?.data;

        if (audioBase64) {
          const chunkBuffer = Buffer.from(audioBase64, "base64");
          audioBuffers.push(chunkBuffer);
          generated = true;
        }
      } catch (chunkError: any) {
        lastErrorMsg = chunkError?.message || String(chunkError);
        console.warn(`Chunk ${i + 1}/${chunks.length} attempt 1 failed with voice ${chosenVoice}:`, lastErrorMsg);
      }

      // Attempt 2 (Fallback)
      if (!generated) {
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
          const audioPart = candidate?.content?.parts?.find((p: any) => p.inlineData && p.inlineData.data);
          const audioBase64 = audioPart?.inlineData?.data || candidate?.content?.parts?.[0]?.inlineData?.data;

          if (audioBase64) {
            const chunkBuffer = Buffer.from(audioBase64, "base64");
            audioBuffers.push(chunkBuffer);
            generated = true;
          }
        } catch (fallbackErr: any) {
          lastErrorMsg = fallbackErr?.message || String(fallbackErr);
          console.error(`Chunk ${i + 1}/${chunks.length} fallback failed:`, lastErrorMsg);
        }
      }
    }

    if (audioBuffers.length === 0) {
      return res.status(500).json({
        error: `ভয়েস তৈরি করা সম্ভব হয়নি (${lastErrorMsg || "API Error"}). অনুগ্রহ করে নিশ্চিত করুন যে আপনার GEMINI_API_KEY সক্রিয় আছে।`,
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
