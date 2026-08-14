import { useState } from "react";
import confetti from "canvas-confetti";
import { Sparkles, Trophy, Users, Award, Flame, Star, Zap } from "lucide-react";

interface MilestoneCelebrationProps {
  channelName: string;
  currentSubs: number;
  targetSubs: number;
  daysTaken: number;
}

export function MilestoneCelebration({
  channelName,
  currentSubs,
  targetSubs,
  daysTaken,
}: MilestoneCelebrationProps) {
  const [isSparkling, setIsSparkling] = useState(false);

  const percentage = Math.min(100, Math.round((currentSubs / targetSubs) * 100));

  const triggerConfetti = () => {
    setIsSparkling(true);
    // Multi-stage confetti fireworks
    const duration = 2.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#facc15", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#facc15", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"],
      });
    }, 250);

    setTimeout(() => setIsSparkling(false), 2500);
  };

  return (
    <div
      id="milestone-celebration-card"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-neutral-900 to-zinc-950 p-5 md:p-6 text-white border border-yellow-500/30 shadow-xl ring-1 ring-yellow-500/10"
    >
      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-yellow-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        {/* Left Section: Creator Info & Badge */}
        <div className="space-y-2 max-w-xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-400/20 text-yellow-300 border border-yellow-400/40">
              <span className="text-sm">🍌</span>
              MʀツBΛNΛNΛ Milestone Celebration!
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              {daysTaken} Days Sprint Record! 🚀
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-yellow-400 via-amber-500 to-red-500 flex items-center justify-center shadow-lg shadow-yellow-950/40 text-zinc-950 font-black text-2xl">
              🍌
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span>{currentSubs} Subscribers Completed!</span>
                <span className="text-xl">🎉</span>
              </h2>
              <p className="text-xs md:text-sm text-zinc-400 font-normal">
                {channelName} • মাত্র {daysTaken} দিনে ১০০ সাবস্ক্রাইবার পূর্ণ • পরবর্তী লক্ষ্য ১,০০০ পরিবার!
              </p>
            </div>
          </div>
        </div>

        {/* Right Section: Interactive Celebration Button */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            id="celebrate-confetti-btn"
            onClick={triggerConfetti}
            className="w-full md:w-auto px-5 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-zinc-950 hover:brightness-110 active:scale-95 transition shadow-lg shadow-yellow-500/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-zinc-950" />
            <span>Celebrate 100 Subs! (সেলিব্রেট করুন)</span>
            <span className="text-base">🎉</span>
          </button>
        </div>
      </div>

      {/* Progress Bar towards 1,000 Subscribers */}
      <div className="mt-5 pt-4 border-t border-zinc-800/80 space-y-2">
        <div className="flex justify-between text-xs text-zinc-400 font-medium">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <Award className="w-3.5 h-3.5 text-yellow-400" />
            <span>
              Sprint Record: <strong className="text-yellow-300">{currentSubs} Subs</strong> ({daysTaken} Days)
            </span>
          </span>
          <span className="flex items-center gap-1.5 text-zinc-300">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              Next Goal: <strong className="text-emerald-400">{targetSubs.toLocaleString()} Family</strong> ({percentage}% Achieved)
            </span>
          </span>
        </div>

        <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-zinc-700/60">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 via-amber-400 to-emerald-400 rounded-full transition-all duration-1000 shadow-sm"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
