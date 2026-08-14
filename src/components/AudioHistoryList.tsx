import { Play, Download, Trash2, Clock, Volume2, Sparkles } from "lucide-react";
import { AudioItem } from "../types";
import { formatTime } from "../utils/audioUtils";

interface AudioHistoryListProps {
  history: AudioItem[];
  currentAudioId: string | null;
  onSelectAudio: (item: AudioItem) => void;
  onDeleteAudio: (id: string) => void;
  onClearAll: () => void;
}

export function AudioHistoryList({
  history,
  currentAudioId,
  onSelectAudio,
  onDeleteAudio,
  onClearAll,
}: AudioHistoryListProps) {
  if (history.length === 0) return null;

  return (
    <div
      id="audio-history-section"
      className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 md:p-6 shadow-xl space-y-4"
    >
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div>
          <h3 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-yellow-400" />
            <span>Voiceover History (তৈরি করা অডিওসমূহ)</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            {history.length} {history.length === 1 ? "take" : "takes"} recorded in this session
          </p>
        </div>

        <button
          onClick={onClearAll}
          className="text-xs text-zinc-500 hover:text-red-400 transition cursor-pointer"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {history.map((item) => {
          const isSelected = item.id === currentAudioId;
          const langFlag = item.language === "bengali" ? "🇧🇩" : item.language === "hindi" ? "🇮🇳" : "🇺🇸";

          return (
            <div
              key={item.id}
              className={`p-3 rounded-xl border transition flex items-center justify-between gap-3 ${
                isSelected
                  ? "bg-zinc-800/90 border-yellow-400/80 ring-1 ring-yellow-400/40"
                  : "bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <button
                  onClick={() => onSelectAudio(item)}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition cursor-pointer shrink-0 ${
                    isSelected
                      ? "bg-yellow-400 text-zinc-950 shadow-md shadow-yellow-500/40 font-bold"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                  title="Play this take"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white truncate">Voice: {item.voice}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-yellow-300 border border-zinc-700 font-semibold uppercase">
                      {langFlag} {item.language}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {formatTime(item.duration)}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 truncate mt-0.5">{item.text}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={item.audioBlobUrl}
                  download={`MR_BANANA_VOICE_${item.language}_${item.voice}.wav`}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs transition cursor-pointer"
                  title="Download WAV"
                >
                  <Download className="w-3.5 h-3.5 text-yellow-400" />
                </a>

                <button
                  onClick={() => onDeleteAudio(item.id)}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
