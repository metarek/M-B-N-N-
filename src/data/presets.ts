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
  // --- FEMALE VOICES (মেয়ের কণ্ঠ) ---
  {
    id: "Kore",
    name: "Kore (Emotional & Sweet)",
    gender: "Female",
    description: "Deeply emotional, clear, crystal-crisp diction and melodic warmth",
    bengaliVibe: "মিষ্টি, আবেগময় ও হৃদয়ছোঁয়া স্পষ্ট কণ্ঠ",
    color: "from-pink-500 via-rose-500 to-red-400",
  },
  {
    id: "Aoede",
    name: "Aoede (Warm Storyteller)",
    gender: "Female",
    description: "Warm, soothing, calm, expressive storytelling & podcast voice",
    bengaliVibe: "শান্ত, মধুর গল্পকার ও শিক্ষণীয় উপস্থাপনা",
    color: "from-purple-500 via-fuchsia-500 to-pink-500",
  },
  {
    id: "Leda",
    name: "Leda (Youthful & Energetic)",
    gender: "Female",
    description: "Bright, cheerful, enthusiastic YouTuber & modern creator voice",
    bengaliVibe: "প্রাণবন্ত, উচ্ছ্বসিত তরুণী ও স্মার্ট ইউটিউবার স্টাইল",
    color: "from-amber-400 via-orange-500 to-rose-500",
  },

  // --- MALE VOICES (ছেলের কণ্ঠ) ---
  {
    id: "Puck",
    name: "Puck (Mr Banana Signature)",
    gender: "Male",
    description: "High-energy, hyper-expressive, perfect for emoji acting & YouTube",
    bengaliVibe: "উচ্ছ্বসিত, প্রাণবন্ত ও দ্রুত আবেগ প্রকাশে সেরা",
    color: "from-yellow-400 via-amber-500 to-red-500",
  },
  {
    id: "Zephyr",
    name: "Zephyr (Smart & Modern)",
    gender: "Male",
    description: "Crisp, dynamic, punchy, suited for tech, gaming & commentary",
    bengaliVibe: "স্মার্ট, আধুনিক ও স্পষ্ট গেমিং/রোস্ট স্টাইল",
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: "Fenrir",
    name: "Fenrir (Epic & Deep)",
    gender: "Male",
    description: "Heavy cinematic trailer voice, roaring anger and dramatic power",
    bengaliVibe: "গম্ভীর, ড্রামাটিক ও ট্রেলার মুভি স্টাইল",
    color: "from-purple-600 to-indigo-700",
  },
  {
    id: "Charon",
    name: "Charon (Calm & Mysterious)",
    gender: "Male",
    description: "Smooth, whispery, psychological thriller and chill podcast",
    bengaliVibe: "শান্ত, থ্রিলার ও ফিসফিসানি স্টাইল",
    color: "from-zinc-600 to-stone-800",
  },
  {
    id: "Orus",
    name: "Orus (Confident & Authority)",
    gender: "Male",
    description: "Authoritative, inspiring, motivational & broadcaster voice",
    bengaliVibe: "আত্মবিশ্বাসী, মোটিভেশনাল ও বলিষ্ঠ বাচনভঙ্গি",
    color: "from-emerald-500 to-teal-700",
  },
];

export const SAMPLE_MULTI_EMOJI_BENGALI = `🥳 হ্যালো guys! আজকে আমি অনেক অনেক খুশি!
😭 কারণ তোমরা আমাকে এতোটা সাপোর্ট করবা আমি জীবনেও ভাবতে পারিনাই!
😂 মাত্র ৭ দিনে আমাদের চ্যানেলে ১০০ টা subscriber complete হয়ে গেছে, হাহাহা!
😱 বিশ্বাসই হচ্ছে না রে ভাই! কি মারাত্মক গতিতে চ্যানেল বড় হচ্ছে!
😍 তোমাদের এই ভালোবাসা আমি কোনোদিনও ভুলবো না!
😎 তো যারা এখনো subscribe করনাই, তাড়াতাড়ি subscribe করো!
🍌 তোমরা পাশে থাকলে মিস্টার ব্যানানা অতি দ্রুত ১ হাজারের একটা family বানিয়ে ফেলবে, ইনশাআল্লাহ!`;

export const SAMPLE_MULTI_EMOJI_ENGLISH = `🥳 Hello guys! Welcome to MʀツBΛNΛNΛ VOICE!
😂 Look at this, we just hit 100 subscribers in only 7 days, hahahaha!
😭 Honestly, I am so touched by your immense love and support!
😱 Can you even believe how crazy fast we are growing?!
😎 If you haven't subscribed yet, smash that subscribe button right now!
🍌 Together with Mr Banana, we are building a 1,000 subscriber family very soon, InshaAllah!`;

export const SAMPLE_MULTI_EMOJI_HINDI = `🥳 हेलो दोस्तों! आज मैं बहुत ही ज्यादा खुश हूँ!
😂 अरे भाई देखो, सिर्फ 7 दिनों में हमारे 100 subscribers पूरे हो गए, हाहाहा!
😭 सच कहूँ तो आप लोगों का इतना सारा प्यार देख कर मेरी आँखें भर आईं!
😱 मुझे यकीन ही नहीं हो रहा कि हमारा चैनल इतनी तेजी से आगे बढ़ रहा है!
😎 तो जिसने अभी तक सब्सक्राइब नहीं किया, जल्दी से सब्सक्राइब कर लो!
🍌 आप सबका साथ रहा तो हम बहुत जल्द 1,000 की फैमिली बना लेंगे, इंशाअल्लाह!`;

export const SCRIPT_PRESETS: ScriptPreset[] = [
  {
    id: "bn_emoji_drama",
    title: "Bengali 100 Subs Drama (ইমোজি অ্যাক্টিং)",
    bengaliTitle: "বাংলা ১০০ সাবস ইমোজি ড্রামা",
    language: "bengali",
    text: SAMPLE_MULTI_EMOJI_BENGALI,
    recommendedVoice: "Puck",
  },
  {
    id: "en_emoji_creator",
    title: "English Mr Banana Celebration",
    bengaliTitle: "ইংরেজি মিস্টার ব্যানানা সেলিব্রেশন",
    language: "english",
    text: SAMPLE_MULTI_EMOJI_ENGLISH,
    recommendedVoice: "Puck",
  },
  {
    id: "hi_emoji_celebration",
    title: "Hindi 100 Subs Dhamaka",
    bengaliTitle: "হিন্দি ১০০ সাবস্ক্রাইবার ধামাকা",
    language: "hindi",
    text: SAMPLE_MULTI_EMOJI_HINDI,
    recommendedVoice: "Puck",
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
    recommendedVoice: "Puck",
  },
];
