import { useRef, useState } from "react";
import { Download, Sparkles, Youtube, Check, Copy, Share2 } from "lucide-react";
import confetti from "canvas-confetti";

interface CelebrationCardProps {
  channelName: string;
  subCount: number;
  daysTaken: number;
}

export function CelebrationCard({
  channelName,
  subCount,
  daysTaken,
}: CelebrationCardProps) {
  const [downloading, setDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleDownloadImage = async () => {
    setDownloading(true);

    try {
      // Create high-res canvas drawing of the celebration badge
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 630; // YouTube banner / Social share 16:9 ratio
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      // Dark background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 1200, 630);
      bgGrad.addColorStop(0, "#09090b");
      bgGrad.addColorStop(0.5, "#18181b");
      bgGrad.addColorStop(1, "#09090b");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1200, 630);

      // Yellow Glow circle
      const glowGrad = ctx.createRadialGradient(600, 200, 20, 600, 200, 450);
      glowGrad.addColorStop(0, "rgba(250, 204, 21, 0.35)");
      glowGrad.addColorStop(1, "rgba(250, 204, 21, 0)");
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, 1200, 630);

      // Golden Glow on bottom
      const goldGlow = ctx.createRadialGradient(600, 500, 10, 600, 500, 350);
      goldGlow.addColorStop(0, "rgba(245, 158, 11, 0.2)");
      goldGlow.addColorStop(1, "rgba(245, 158, 11, 0)");
      ctx.fillStyle = goldGlow;
      ctx.fillRect(0, 0, 1200, 630);

      // Outer Card Frame
      ctx.strokeStyle = "rgba(250, 204, 21, 0.4)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(40, 40, 1120, 550, 24);
      ctx.stroke();

      // Top Banana Badge
      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.roundRect(450, 70, 300, 50, 12);
      ctx.fill();

      ctx.fillStyle = "#09090b";
      ctx.font = "900 22px 'Plus Jakarta Sans', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🍌 MʀツBΛNΛNΛ VOICE", 600, 103);

      // Big "100" Number
      ctx.font = "900 110px 'Plus Jakarta Sans', sans-serif";
      const numGrad = ctx.createLinearGradient(0, 180, 0, 290);
      numGrad.addColorStop(0, "#ffffff");
      numGrad.addColorStop(0.5, "#fef08a");
      numGrad.addColorStop(1, "#f59e0b");
      ctx.fillStyle = numGrad;
      ctx.fillText(`${subCount}`, 600, 245);

      // "SUBSCRIBERS COMPLETED"
      ctx.fillStyle = "#facc15";
      ctx.font = "800 32px 'Plus Jakarta Sans', sans-serif";
      ctx.letterSpacing = "4px";
      ctx.fillText("SUBSCRIBERS COMPLETED! 🎉", 600, 305);

      // 7 Days Sprint Badge
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
      ctx.beginPath();
      ctx.roundRect(380, 340, 440, 44, 22);
      ctx.fill();
      ctx.strokeStyle = "rgba(245, 158, 11, 0.6)";
      ctx.stroke();

      ctx.fillStyle = "#fef08a";
      ctx.font = "600 20px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText(`⚡ মাত্র ${daysTaken} দিনে ১০০ সাবস্ক্রাইবার পূর্ণ!`, 600, 370);

      // Channel name and Bengali promise quote
      ctx.fillStyle = "#e4e4e7";
      ctx.font = "bold 26px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText(`Channel: ${channelName}`, 600, 435);

      ctx.fillStyle = "#a1a1aa";
      ctx.font = "18px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText("তোমরা পাশে থাকলে আমরা অতি দ্রুত ১,০০০ পরিবারের মাইলস্টোন ছোঁব!", 600, 480);

      // Footer
      ctx.fillStyle = "#71717a";
      ctx.font = "14px 'Plus Jakarta Sans', sans-serif";
      ctx.fillText("MʀツBΛNΛNΛ VOICE • AI Voice Studio • Powered by Gemini 3.1 Flash TTS", 600, 545);

      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `MR_BANANA_${channelName}_${subCount}_subs_card.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#facc15", "#f59e0b", "#10b981"],
      });
    } catch (e) {
      console.error("Canvas export failed", e);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyPost = () => {
    const textToCopy = `🎉 আলহামদুলিল্লাহ! মাত্র ${daysTaken} দিনে আমাদের ইউটিউব চ্যানেলে ১০০ জন সাবস্ক্রাইবার সম্পন্ন হলো! 🥳\n\nতোমরা যারা এতোটা সাপোর্ট করছো সবাইকে মন থেকে অনেক অনেক ধন্যবাদ ও ভালোবাসা! ❤️\n\nপাশে থেকো, ইনশাআল্লাহ অতি দ্রুত আমরা ১,০০০ পরিবারের মাইলস্টোন স্পর্শ করবো! 🚀✨\n#100subscribers #milestone #youtube #family`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div
      id="celebration-badge-card"
      className="rounded-2xl bg-zinc-900 border border-zinc-800 p-6 md:p-8 shadow-2xl space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-xl">🍌</span>
            <span>MʀツBΛNΛNΛ Milestone Poster & Trophy</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            ইউটিউব কমিউনিটি পোস্ট বা সোশ্যাল মিডিয়ায় শেয়ার করার জন্য তৈরি স্পেশাল পোস্টার।
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            id="copy-community-post-btn"
            onClick={handleCopyPost}
            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedLink ? "Copied Post!" : "Copy Community Post"}</span>
          </button>

          <button
            id="download-poster-png-btn"
            onClick={handleDownloadImage}
            disabled={downloading}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 hover:brightness-110 text-zinc-950 text-xs font-black transition flex items-center gap-2 cursor-pointer shadow-lg shadow-yellow-500/20"
          >
            <Download className="w-4 h-4 text-zinc-950" />
            <span>{downloading ? "Exporting..." : "Download HD Poster (.PNG)"}</span>
          </button>
        </div>
      </div>

      {/* Visual Poster Frame */}
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-950 via-neutral-900 to-zinc-950 border-2 border-yellow-500/40 p-8 text-center text-white shadow-2xl space-y-6 max-w-2xl mx-auto"
      >
        {/* Glow */}
        <div className="absolute inset-0 bg-radial from-yellow-500/10 via-transparent to-transparent pointer-events-none" />

        {/* Banana & YouTube Header badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-md shadow-yellow-500/30">
          <span>🍌</span>
          <span>MʀツBΛNΛNΛ VOICE MILESTONE</span>
        </div>

        {/* Big Number */}
        <div className="space-y-1">
          <div className="text-6xl md:text-7xl font-black tracking-tight bg-gradient-to-b from-white via-yellow-200 to-amber-400 bg-clip-text text-transparent drop-shadow-md">
            {subCount}
          </div>
          <div className="text-base md:text-lg font-extrabold uppercase tracking-widest text-yellow-400">
            Subscribers Completed! 🎉
          </div>
        </div>

        {/* Sprint Record */}
        <div className="inline-block px-4 py-1.5 rounded-full bg-zinc-800/80 border border-yellow-500/30 text-yellow-300 text-xs font-semibold">
          ⚡ মাত্র {daysTaken} দিনের রেকর্ড স্প্রিন্ট!
        </div>

        {/* Channel Name */}
        <div className="pt-2 border-t border-zinc-800/80">
          <h4 className="text-lg font-bold text-white tracking-wide">
            Channel: <span className="text-yellow-400">{channelName}</span>
          </h4>
          <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
            তোমরা পাশে থাকলে আমরা অতি দ্রুত ১ হাজারের একটা family বানিয়ে ফেলতে পারবো, ইনশাআল্লাহ!
          </p>
        </div>
      </div>
    </div>
  );
}
