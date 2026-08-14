import React from "react";
import { Sparkles, ExternalLink } from "lucide-react";
import confetti from "canvas-confetti";

export function SocialChannelsBanner() {
  const socialLinks = [
    {
      id: "youtube",
      name: "YouTube",
      handle: "@mrbanana8461",
      url: "https://youtube.com/@mrbanana8461?si=ZJRZlO1gIGhVGkjX",
      bgColor: "bg-red-600 hover:bg-red-500",
      glowColor: "group-hover:shadow-red-600/50",
      borderColor: "border-red-500/40 hover:border-red-400",
      textColor: "text-red-500",
      icon: (
        <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      id: "tiktok",
      name: "TikTok",
      handle: "@mrbanana8461",
      url: "https://www.tiktok.com/@mrbanana8461?_r=1&_t=ZS-98sHYn0skL9",
      bgColor: "bg-black hover:bg-zinc-900",
      glowColor: "group-hover:shadow-cyan-400/40",
      borderColor: "border-zinc-700 hover:border-cyan-400",
      textColor: "text-cyan-400",
      icon: (
        <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.77 1.81-.02 3.28-1.53 3.32-3.35.03-3.45.01-6.91.01-10.37.01-2.13.01-4.26.01-6.39z" />
        </svg>
      ),
    },
    {
      id: "facebook",
      name: "Facebook",
      handle: "Facebook Page",
      url: "https://www.facebook.com/share/199hLFPaeW/",
      bgColor: "bg-[#1877F2] hover:bg-[#166fe5]",
      glowColor: "group-hover:shadow-blue-500/50",
      borderColor: "border-blue-500/40 hover:border-blue-400",
      textColor: "text-[#1877F2]",
      icon: (
        <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
  ];

  const handleIconClick = (name: string) => {
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.2 },
      colors: ["#facc15", "#ef4444", "#1877F2", "#00f2fe"],
    });
  };

  return (
    <div
      id="social-channels-bar"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-4 sm:p-5 text-white border border-yellow-500/30 shadow-xl"
    >
      {/* Background ambient light */}
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left Side: Creator Tag & Banana Brand */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-yellow-400 via-amber-500 to-yellow-600 flex items-center justify-center text-zinc-950 font-black text-xl shadow-lg shadow-yellow-950/40">
            🍌
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-black text-white tracking-wide">
                MʀツBΛNΛNΛ Official Channels
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-400/20 text-yellow-300 border border-yellow-400/40">
                <Sparkles className="w-2.5 h-2.5" />
                Follow Us
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              ক্লিক করে সরাসরি ইউটিউব, টিকটক ও ফেসবুক পেজে যুক্ত হন
            </p>
          </div>
        </div>

        {/* Right Side: Exact 3 Official Social Icons (YouTube, TikTok, Facebook) */}
        <div className="flex items-center gap-3.5">
          {socialLinks.map((social) => (
            <a
              key={social.id}
              id={`social-link-${social.id}`}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleIconClick(social.name)}
              className={`group relative flex items-center justify-center w-12 h-12 rounded-2xl ${social.bgColor} ${social.borderColor} border shadow-lg ${social.glowColor} transition-all duration-300 transform hover:-translate-y-1 hover:scale-110 active:scale-95 cursor-pointer`}
              title={`Visit MʀツBΛNΛNΛ on ${social.name}`}
            >
              {/* Icon */}
              {social.icon}

              {/* Hover Badge / Tooltip */}
              <span className="absolute -bottom-8 px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-700 text-[10px] font-bold text-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-xl z-20">
                {social.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
