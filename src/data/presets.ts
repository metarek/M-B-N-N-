import { EmojiActingRule, VoiceOption, ScriptPreset } from "../types";

export const EMOJI_ACTING_RULES: EmojiActingRule[] = [
  {
    emoji: "😭",
    name: "Crying & Sobbing",
    bengaliName: "কান্না ও চোখের পানি",
    hindiName: "रोना और सिसकना",
    styleDescription: "Tearful sobbing, trembling grief, sniffing & crying voice",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/40",
    exampleLine: "😭 ভাইরে ভাই, আমার কি যে কষ্ট হচ্ছে বোঝাতে পারবো না!",
  },
  {
    emoji: "😂",
    name: "Bursting Laughter",
    bengaliName: "দমফাটা হাসি",
    hindiName: "हंस-हंस कर लोटपोट",
    styleDescription: "Uncontrollable hearty giggles, chuckles & laughing bursts",
    badgeColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
    exampleLine: "😂 হাহাহা! এই কান্ড দেখে তো আমার হাসতে হাসতে পেট ফেটে যাচ্ছে!",
  },
  {
    emoji: "😡",
    name: "Boiling Anger",
    bengaliName: "প্রচণ্ড রাগ ও গর্জন",
    hindiName: "गुस्सा और चीखना",
    styleDescription: "Fiery scream, aggressive rage & furious hostile energy",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/40",
    exampleLine: "😡 তোদের সাহস কীভাবে হলো এই কাজটা করার! এখনই এখান থেকে বের হ!",
  },
  {
    emoji: "😱",
    name: "Horror & Panic",
    bengaliName: "আতঙ্ক ও ভয়",
    hindiName: "खौफ और डर",
    styleDescription: "Terrified trembling, gasping shock, spooky panic",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/40",
    exampleLine: "😱 ওরে বাপরে! ওই অন্ধকারের ভেতর কে যেন দাঁড়িয়ে আছে!",
  },
  {
    emoji: "😍",
    name: "Romantic & Loving",
    bengaliName: "রোমান্টিক ভালোবাসা",
    hindiName: "प्यार और रोमांस",
    styleDescription: "Sweet, honeyed, gentle, affectionate & charming melody",
    badgeColor: "bg-pink-500/20 text-pink-400 border-pink-500/40",
    exampleLine: "😍 তুমি পাশে থাকলে সারা পৃথিবীটাই যেন অপরূপ সুন্দর হয়ে যায়!",
  },
  {
    emoji: "🥳",
    name: "Party & Hype",
    bengaliName: "সেলিব্রেশন ধামাকা",
    hindiName: "धमाकेदार जश्न",
    styleDescription: "Wild celebration, confetti screaming & energetic party vibes",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
    exampleLine: "🥳 ইয়াহু! মাত্র ৭ দিনে ১০০ সাবস্ক্রাইবার কমপ্লিট! আজকের রাতটা ধামাকার!",
  },
  {
    emoji: "😎",
    name: "Swag & Boss",
    bengaliName: "সোয়াগ ও এটিটিউড",
    hindiName: "स्वैग और एटीट्यूड",
    styleDescription: "Cool swagger, boss confidence, sarcastic pride",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    exampleLine: "😎 আমরা যেটা মুখে বলি, সেটা বাস্তবে করে দেখাই! মনে রাখিস বস!",
  },
  {
    emoji: "🍌",
    name: "Mʀ BΛNΛNΛ Special",
    bengaliName: "মিস্টার ব্যানানা কমেডি",
    hindiName: "मिस्टर बनाना स्पेशल",
    styleDescription: "Signature bananas comedy, quirky voice and epic creator flair",
    badgeColor: "bg-yellow-400/30 text-yellow-300 border-yellow-400/60",
    exampleLine: "🍌 আরে আমি তো মিস্টার ব্যানানা! আমাদের এনার্জি দেখে সবাই পুরা থরথরিয়ে কাপবে!",
  },
  {
    emoji: "🤫",
    name: "Secret Whisper",
    bengaliName: "রহস্যময় ফিসফিস",
    hindiName: "रहस्यमयी फुसफुसाहट",
    styleDescription: "Quiet, thrilling, close-mic suspense whisper",
    badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40",
    exampleLine: "🤫 একদম শব্দ করো না... ওরা কিন্তু আমাদের দিকেই আসছে...",
  },
  {
    emoji: "🤖",
    name: "Futuristic Robot",
    bengaliName: "রোবোটিক ভয়েস",
    hindiName: "रोबोट आवाज",
    styleDescription: "Metallic monotonic cadence, cybernetic delivery",
    badgeColor: "bg-slate-500/20 text-slate-300 border-slate-500/40",
    exampleLine: "🤖 সিস্টেম ইনিশিয়ালাইজেশন সম্পন্ন। মিস্টার ব্যানানা প্রোটোকল সক্রিয় করা হলো।",
  },
  {
    emoji: "🥱",
    name: "Sleepy & Drowsy",
    bengaliName: "ঘুমন্ত ও ক্লান্ত",
    hindiName: "नींद और सुस्ती",
    styleDescription: "Slow yawning, lazy bedtime murmurs",
    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
    exampleLine: "🥱 উফফ... খুব ঘুম পাচ্ছে রে ভাই... চোখ দুটো আর খোলা রাখতে পারছি না...",
  },
  {
    emoji: "😇",
    name: "Humble Prayer",
    bengaliName: "বিনম্র প্রার্থনা",
    hindiName: "प्रार्थना और शांति",
    styleDescription: "Serene, peaceful, pious, gentle blessings",
    badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/40",
    exampleLine: "😇 মহান আল্লাহ তায়ালার কাছে লাখ লাখ শুকরিয়া, তিনি আমাদের সাথে আছেন।",
  },
];

export const VOICES: VoiceOption[] = [
  // --- FREE FIRE SPECIALIZED GAMING MODELS (মাস্টার গেমিং মডেল) ---
  {
    id: "Mr.banana.gaming",
    name: "Mr.banana.gaming (🔥 High Energy FF Streamer)",
    gender: "Male",
    description: "আসল বাংলাদেশি ফ্রি ফায়ার ইউটিউবার স্টাইল — দ্রুত বাচনভঙ্গি, চিৎকারে ফেটে পড়া হেডশট, ক্লাচ ও বুইয়াহ হাইপ (Live Streamer & YouTuber Hype)",
    bengaliVibe: "🔥 লাইভ ফ্রি ফায়ার স্ট্রিমার, ওয়ান ট্যাপ হেডশট ও পাগলাটে এনার্জি",
    color: "from-red-500 via-orange-500 to-amber-500",
    tag: "🔥 FF Hype Streamer",
    isViral: true,
  },
  {
    id: "Mr.banana.gaming.pro",
    name: "Mr.banana.gaming.pro (⚡ Smart Pro Gamer & Roaster)",
    gender: "Male",
    description: "স্মার্ট, দ্রুত, ক্রিস্প ও ডাইনামিক ইউটিউব গেমিং রোস্টিং ও টিপস/ট্রিকস কমেণ্ট্রি ভয়েস",
    bengaliVibe: "⚡ স্মার্ট প্রো গেমার, টিপস-ট্রিকস ও রোস্টিং কমেণ্ট্রি",
    color: "from-amber-400 via-yellow-500 to-orange-600",
    tag: "⚡ Pro Gamer Roaster",
    isViral: true,
  },

  // --- VIRAL SIGNATURE DEEP & HEAVY MODEL (ডিপ ও ভারী পুরুষালি কণ্ঠ) ---
  {
    id: "Mr.banana",
    name: "Mr.banana (Deep & Heavy Voice - ডিপ ও ভারী কণ্ঠ)",
    gender: "Male",
    description: "গভীর বেস, ভারী ও স্পষ্ট বুকফাটা পুরুষালি কণ্ঠ (Deep Baritone, Heavy Bass & Crystal Clear Diction)",
    bengaliVibe: "ডিপ, ভারি, স্পষ্ট ও আকর্ষণীয় ভাইরাল ভয়েস",
    color: "from-yellow-400 via-amber-400 to-orange-500",
    tag: "🔥 ডিপ ও ভারী কণ্ঠ",
    isViral: true,
  },

  // --- MALE VOICES (ছেলের কণ্ঠ) ---
  {
    id: "Fenrir",
    name: "Fenrir (Ultra Deep Bass & Cinematic)",
    gender: "Male",
    description: "আল্ট্রা ডিপ বেস, গম্ভীর ভারী কণ্ঠ, ট্রেলার ও কমান্ডিং স্টাইল",
    bengaliVibe: "অতিরিক্ত ভারী, গভীর ও ট্রেলার মুভি স্টাইল",
    color: "from-purple-600 via-indigo-600 to-slate-800",
    tag: "🎬 আল্ট্রা ডিপ বেস",
  },
  {
    id: "Charon",
    name: "Charon (Mature & Deep Thriller)",
    gender: "Male",
    description: "গম্ভীর, স্পষ্ট, থ্রিলার ও পরিণত পডকাস্ট ভয়েস",
    bengaliVibe: "শান্ত, পরিণত ও গভীর থ্রিলার স্টাইল",
    color: "from-zinc-600 to-stone-800",
    tag: "🤫 গম্ভীর থ্রিলার",
  },
  {
    id: "Zephyr",
    name: "Zephyr (Crisp & Modern Male)",
    gender: "Male",
    description: "ক্লিয়ার, আধুনিক, ডাইনামিক রোস্টিং ও গেমিং ভয়েস",
    bengaliVibe: "স্মার্ট, আধুনিক ও স্পষ্ট গেমিং/রোস্ট স্টাইল",
    color: "from-cyan-500 to-blue-600",
    tag: "🎮 স্পষ্ট ও ডাইনামিক",
  },
  {
    id: "Puck",
    name: "Puck (High Energy Creator)",
    gender: "Male",
    description: "উচ্ছ্বসিত, প্রাণবন্ত, দ্রুত ও কমেডি অ্যাক্টিং",
    bengaliVibe: "উচ্ছ্বসিত, প্রাণবন্ত ও দ্রুত আবেগ প্রকাশে সেরা",
    color: "from-amber-400 via-orange-500 to-red-500",
    tag: "⚡ দ্রুত এনার্জি",
  },

  // --- FEMALE VOICES (মেয়ের কণ্ঠ) ---
  {
    id: "Kore",
    name: "Kore (Sweet & Crystal Clear)",
    gender: "Female",
    description: "মিষ্টি, আবেগময়, স্ফটিকের মতো পরিষ্কার উচ্চারণ ও নিখুঁত ফিমেল ভয়েস",
    bengaliVibe: "মিষ্টি, আবেগময় ও হৃদয়ছোঁয়া স্পষ্ট কণ্ঠ",
    color: "from-pink-500 via-rose-500 to-red-400",
    tag: "👩 সুইট ফিমেল",
  },
  {
    id: "Aoede",
    name: "Aoede (Warm Storyteller)",
    gender: "Female",
    description: "গভীর, শান্ত, মধুর গল্পকার ও শিক্ষণীয় উপস্থাপনা",
    bengaliVibe: "শান্ত, মধুর গল্পকার ও শিক্ষণীয় উপস্থাপনা",
    color: "from-purple-500 via-fuchsia-500 to-pink-500",
    tag: "🎙️ স্টোরিটেলার",
  },
];

export const SAMPLE_MULTI_EMOJI_BENGALI = `🍌 হ্যালো গাইস! আমি মিস্টার ব্যানানা!
🥳 আজকে এমন একটা ঘটনা ঘটছে যা শুনলে আপনারা পুরো হা হয়ে যাবেন!
😂 আরে ভাইরে ভাই, হাসতে হাসতে তো আমার পেটেই খিল ধরে গেছে, হাহাহা!
😭 বিশ্বাস করো, শুরুতে আমার এতো ভয় লাগছিল যে বুকটা ধড়ফড় করছিল!
😱 কিন্তু হঠাৎ দেখি পুরো দৃশ্যটাই পাল্টে গেছে!
😎 তো বন্ধুরা, যারা যারা টিকটকে ভিডিও বানাতে চাও, এখনই চ্যানেল সাবস্ক্রাইব করে সঙ্গে থাকো!
🍌 মিস্টার ব্যানানা সবসময় তোমাদের জন্য চরম এনার্জির ভাইরাল বিনোদন নিয়ে আসবে!`;

export const SAMPLE_MULTI_EMOJI_ENGLISH = `🍌 What's up guys! Welcome to Mr.banana viral voice studio!
🥳 Look at this insane energy, ElevenLabs Bunny style is now live on TikTok!
😂 Bro, I literally cannot stop laughing right now, hahahaha!
😱 Are you kidding me?! This is blowing up on TikTok and YouTube Shorts like crazy!
😎 If you haven't smashed that subscribe and follow button yet, do it right now!
🍌 Stay tuned with Mr.banana for the most hilarious meme content on the internet!`;

export const SAMPLE_MULTI_EMOJI_HINDI = `🍌 अरे भाई सुनो! आ गया है Mr.banana वायरल टिकटक मॉडल!
🥳 आज ऐसा मज़ाक हुआ कि पूरा इंटरनेट ही हिल गया!
😂 हाहाहा! हँसते-हँसते भाई पेट में दर्द हो गया रे!
😱 अरे बाप रे, ऐसा नज़ारा जिंदगी में कभी नहीं देखा था!
😎 तो जिसने भी अभी तक फॉलो और सब्सक्राइब नहीं किया, जल्दी से ठोक दो!
🍌 मिस्टर बनाना हमेशा आपके लिए वायरल मीम कॉमेडी लाता रहेगा!`;

export const SCRIPT_PRESETS: ScriptPreset[] = [
  {
    id: "freefire_1vs4_clutch",
    title: "🔥 Free Fire 1 vs 4 Epic Clutch (Mr.banana.gaming)",
    bengaliTitle: "🔥 ফ্রি ফায়ার ১ বনাম ৪ অসম্ভব ক্লাচ",
    language: "bengali",
    text: `😱 WHAT?! পুরো স্কোয়াড রাশ দিচ্ছে ভাই!
😡 একজন নক... গ্লু ওয়াল ফেল... আরেকজন নক!
😱 একজন বাকি... HP একদম LOW... কিন্তু GAME এখনো শেষ হয়নি...
🔥 একদম ONE TAP HEADSHOT! LET'S GO BOOYAH!
😎 ওপি লেভেলের গেমপ্লে! ভিডিও ভালো লাগলে এখনই লাইক আর সাবস্ক্রাইব ঠোকো!`,
    recommendedVoice: "Mr.banana.gaming",
  },
  {
    id: "freefire_sensitivity_hook",
    title: "⚡ Free Fire Secret Sensitivity & Headshot Trick (Shorts Hook)",
    bengaliTitle: "⚡ সিক্রেট হেডশট ও সেনসিটিভিটি ট্রিক",
    language: "bengali",
    text: `🔥 এই সিক্রেট সেটিংটা ব্যবহার করলে তোমার HEADSHOT কিন্তু আগের চেয়ে অনেক বেশি লাগবে!
😎 মাত্র ২ টা ড্র্যাগ করলেই এনিমি একদম ক্লিয়ার নক!
😂 যারা ভাবছো নোব প্লেয়ার, তারা এটা ট্রাই করার পর পুরো প্রো প্লেয়ার হয়ে যাবা!
🚀 এখনই চ্যানেল সাবস্ক্রাইব করে বেল আইকন অল করে দাও!`,
    recommendedVoice: "Mr.banana.gaming",
  },
  {
    id: "viral_deep_heavy_boss",
    title: "🔥 Mr.banana Deep & Heavy Viral Boss Voice (ডিপ ও ভারী পুরুষালি কণ্ঠ)",
    bengaliTitle: "🔥 Mr.banana ডিপ ও ভারী বস কণ্ঠ",
    language: "bengali",
    text: SAMPLE_MULTI_EMOJI_BENGALI,
    recommendedVoice: "Mr.banana",
  },
  {
    id: "bn_emoji_drama",
    title: "Bengali 100 Subs Drama (ডিপ বেস ও ইমোজি অ্যাক্টিং)",
    bengaliTitle: "বাংলা ১০০ সাবস ড্রামা (ডিপ কণ্ঠ)",
    language: "bengali",
    text: `🥳 হ্যালো guys! আজকে আমি অনেক অনেক খুশি!
😭 কারণ তোমরা আমাকে এতোটা সাপোর্ট করবা আমি জীবনেও ভাবতে পারিনাই!
😂 মাত্র ৭ দিনে আমাদের চ্যানেলে ১০০ টা subscriber complete হয়ে গেছে, হাহাহা!
😱 বিশ্বাসই হচ্ছে না রে ভাই! কি মারাত্মক গতিতে চ্যানেল বড় হচ্ছে!
😍 তোমাদের এই ভালোবাসা আমি কোনোদিনও ভুলবো না!
😎 তো যারা এখনো subscribe করনাই, তাড়াতাড়ি subscribe করো!
🍌 তোমরা পাশে থাকলে মিস্টার ব্যানানা অতি দ্রুত ১ হাজারের একটা family বানিয়ে ফেলবে, ইনশাআল্লাহ!`,
    recommendedVoice: "Mr.banana",
  },
  {
    id: "en_emoji_creator",
    title: "English Mr.banana Deep Voice Celebration",
    bengaliTitle: "ইংরেজি Mr.banana ডিপ ভয়েস",
    language: "english",
    text: SAMPLE_MULTI_EMOJI_ENGLISH,
    recommendedVoice: "Mr.banana",
  },
  {
    id: "hi_emoji_celebration",
    title: "Hindi 100 Subs Deep Dhamaka",
    bengaliTitle: "হিন্দি Mr.banana ডিপ ধামাকা",
    language: "hindi",
    text: SAMPLE_MULTI_EMOJI_HINDI,
    recommendedVoice: "Mr.banana",
  },
  {
    id: "bn_female_vlog_story",
    title: "Female Creator Emotional Story (মেয়েদের ভয়েস স্পেশাল)",
    bengaliTitle: "মেয়েদের আবেগঘন স্টোরি ও ব্লগ",
    language: "bengali",
    text: `🥳 আসসালামু আলাইকুম সবাইকে! ওয়েলকাম টু মাই চ্যানেল!
😍 আজকের দিনটা আমার জীবনের অন্যতম সেরা একটা দিন!
😭 সত্যি বলছি, এতোটা ভালোবাসা আর সাপোর্ট পাবো আমি ভাবতেই পারিনি...
🥰 তোমাদের সুন্দর সুন্দর কমেন্টগুলো পড়ে আমার মনটা ভরে গেছে!
🥳 সবাই প্লিজ পাশে থেকো আর লাইক ও সাবস্ক্রাইব করে দিও!`,
    recommendedVoice: "Kore",
  },
  {
    id: "bn_crying_laughing_show",
    title: "Emotional Rollercoaster (কান্না থেকে হাসি)",
    bengaliTitle: "কান্না ও হাসির ফুল অ্যাক্টিং",
    language: "bengali",
    text: `😭 ভাইরে ভাই... মনটা খুব খারাপ ছিল আজকে...
😂 কিন্তু হঠাৎ চ্যানেলে ঢুকে দেখি ১০০ সাবস্ক্রাইবার হয়ে গেছে! হাহাহা!
😡 যারা বলছিল পারবিনা, তাদের মুখে একদম চুনকালি পড়ে গেছে!
😍 আমার দর্শকদের জন্য অন্তরের গভীর থেকে অফুরন্ত ভালোবাসা!
🥳 লেটস সেলিব্রেট গাইস! পার্টি শুরু!`,
    recommendedVoice: "Mr.banana",
  },
];
