import { GoogleGenAI, Modality } from "@google/genai";

export function getEmojiActingDirective(textLine: string, language: "bengali" | "english" | "hindi"): string {
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

export function splitTextIntoTTSChunks(
  rawText: string,
  language: "bengali" | "english" | "hindi"
): Array<{ text: string; directive: string }> {
  if (rawText.trim().length <= 2000) {
    return [{
      text: rawText.trim(),
      directive: getEmojiActingDirective(rawText, language),
    }];
  }

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

export async function generateSpeechDirectly(
  text: string,
  voiceName: string,
  language: "bengali" | "english" | "hindi",
  apiKey: string,
  customPrompt = ""
): Promise<string> {
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
        const binaryString = atob(audioBase64);
        const bytes = new Uint8Array(binaryString.length);
        for (let j = 0; j < binaryString.length; j++) {
          bytes[j] = binaryString.charCodeAt(j);
        }
        audioBuffers.push(bytes);
        chunkGenerated = true;
      }
    } catch (chunkError: any) {
      lastErrorMsg = chunkError?.message || String(chunkError);
    }

    // Attempt 2: If attempt 1 failed, wait 1.5s and retry
    if (!chunkGenerated && !lastErrorMsg.includes("API key not valid") && !lastErrorMsg.includes("API_KEY_INVALID")) {
      try {
        await new Promise((res) => setTimeout(res, 1500));
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
          const binaryString = atob(audioBase64);
          const bytes = new Uint8Array(binaryString.length);
          for (let j = 0; j < binaryString.length; j++) {
            bytes[j] = binaryString.charCodeAt(j);
          }
          audioBuffers.push(bytes);
          chunkGenerated = true;
        }
      } catch (fallbackErr: any) {
        lastErrorMsg = fallbackErr?.message || String(fallbackErr);
      }
    }

    if (!chunkGenerated) {
      allChunksSuccessful = false;
      break;
    }
  }

  if (!allChunksSuccessful || audioBuffers.length === 0 || audioBuffers.length < chunks.length) {
    if (lastErrorMsg.includes("429") || lastErrorMsg.includes("Quota exceeded") || lastErrorMsg.includes("RESOURCE_EXHAUSTED")) {
      throw new Error(
        "গুগল এপিআই-এর প্রতি মিনিটের ফ্রি কোটা সীমা শেষ হয়েছে। অনুগ্রহ করে ৩০-৪০ সেকেন্ড অপেক্ষা করে আবার চেষ্টা করুন।"
      );
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
