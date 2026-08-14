import { useEffect, useRef, useState, ChangeEvent } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  Share2,
  Sparkles,
  Copy,
  Check,
  Zap,
} from "lucide-react";
import { formatTime } from "../utils/audioUtils";
import confetti from "canvas-confetti";

interface AudioPlayerProps {
  audioBlobUrl: string | null;
  text: string;
  voice: string;
  language: string;
  duration?: number;
  totalChunks?: number;
}

export function AudioPlayer({
  audioBlobUrl,
  text,
  voice,
  language,
  duration = 0,
  totalChunks = 1,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(duration);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const [copied, setCopied] = useState(false);

  // Audio Context & Analyser for visualizer
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (audioRef.current && audioBlobUrl) {
      audioRef.current.load();
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [audioBlobUrl]);

  useEffect(() => {
    if (duration > 0) {
      setTotalDuration(duration);
    }
  }, [duration]);

  // Setup visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let bars = 48;
    const renderWaveform = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!isPlaying || !analyserRef.current) {
        // Idle bars
        const barWidth = canvas.width / bars;
        for (let i = 0; i < bars; i++) {
          const heightFactor = Math.sin((i / bars) * Math.PI) * 0.45 + 0.2;
          const h = heightFactor * (canvas.height * 0.4);
          const x = i * barWidth + 2;
          const y = (canvas.height - h) / 2;

          ctx.fillStyle = "#3f3f46";
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth - 3, h, 3);
          ctx.fill();
        }
      } else {
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);

        const barWidth = canvas.width / bars;
        for (let i = 0; i < bars; i++) {
          const index = Math.floor((i / bars) * dataArray.length);
          const value = dataArray[index] || 0;
          const percent = value / 255;
          const h = Math.max(6, percent * canvas.height * 0.85);
          const x = i * barWidth + 2;
          const y = (canvas.height - h) / 2;

          const gradient = ctx.createLinearGradient(0, y, 0, y + h);
          gradient.addColorStop(0, "#facc15"); // yellow-400
          gradient.addColorStop(0.5, "#f59e0b"); // amber-500
          gradient.addColorStop(1, "#ef4444"); // red-500

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth - 3, h, 3);
          ctx.fill();
        }
      }

      animationFrameRef.current = requestAnimationFrame(renderWaveform);
    };

    renderWaveform();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  const initAudioNodes = () => {
    if (!audioRef.current) return;
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
      analyserRef.current = audioCtxRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;

      try {
        sourceNodeRef.current = audioCtxRef.current.createMediaElementSource(audioRef.current);
        sourceNodeRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioCtxRef.current.destination);
      } catch (e) {
        // already connected
      }
    }

    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !audioBlobUrl) return;

    initAudioNodes();

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error("Playback error:", err));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (!totalDuration && audioRef.current.duration) {
        setTotalDuration(audioRef.current.duration);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setTotalDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#facc15", "#f59e0b", "#10b981"],
    });
  };

  const handleScrub = (e: ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 1;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const cycleSpeed = () => {
    const speeds = [0.75, 1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackRate(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const handleDownload = () => {
    if (!audioBlobUrl) return;
    const a = document.createElement("a");
    a.href = audioBlobUrl;
    a.download = `MR_BANANA_VOICE_${language}_${voice}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyText = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!audioBlobUrl) {
    return (
      <div
        id="audio-player-idle"
        className="rounded-2xl bg-zinc-900 border border-dashed border-zinc-800 p-6 flex flex-col items-center justify-center text-center text-zinc-500"
      >
        <div className="w-12 h-12 rounded-full bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mb-3">
          <span className="text-2xl">🍌</span>
        </div>
        <h3 className="text-zinc-300 font-bold text-sm">
          MʀツBΛNΛNΛ Voice Is Ready To Speak!
        </h3>
        <p className="text-xs text-zinc-400 mt-1 max-w-md">
          Write or select your script with emojis (😭 কান্না, 😂 হাসি, 😡 রাগ, 😍 ভালোবাসা) and click <strong>&quot;Generate Voice&quot;</strong> to hear lifelike crystal-clear speech.
        </p>
      </div>
    );
  }

  return (
    <div
      id="audio-player-active"
      className="rounded-2xl bg-gradient-to-b from-zinc-900 via-neutral-900 to-zinc-950 border border-yellow-500/30 p-5 md:p-6 shadow-2xl ring-1 ring-yellow-500/20"
    >
      <audio
        ref={audioRef}
        src={audioBlobUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        loop={isLooping}
      />

      {/* Header Info */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-ping" />
          <span className="text-xs font-bold uppercase tracking-wider text-yellow-400 flex items-center gap-1">
            <span>🍌</span>
            <span>MʀツBΛNΛNΛ Studio Master Audio</span>
          </span>
          <span className="text-zinc-600">•</span>
          <span className="text-xs text-zinc-400 font-medium">
            Voice: <span className="text-white font-bold">{voice}</span>
          </span>
          <span className="text-zinc-600">•</span>
          <span className="text-[11px] px-2 py-0.5 rounded bg-zinc-800 text-yellow-300 font-semibold uppercase border border-zinc-700">
            {language}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="copy-speech-btn"
            onClick={handleCopyText}
            title="Copy Transcript"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition text-xs flex items-center gap-1 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
          </button>

          <button
            id="download-wav-btn"
            onClick={handleDownload}
            title="Download high quality WAV audio"
            className="px-3.5 py-1.5 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-zinc-950 text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-yellow-500/20"
          >
            <Download className="w-3.5 h-3.5 text-zinc-950" />
            <span>Download .WAV</span>
          </button>
        </div>
      </div>

      {/* Visualizer Canvas */}
      <div className="w-full h-16 bg-zinc-950 rounded-xl overflow-hidden mb-4 border border-zinc-800 relative flex items-center justify-center">
        <canvas ref={canvasRef} width={600} height={70} className="w-full h-full block" />
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
            <span className="text-[11px] text-yellow-300 bg-zinc-900/90 px-3 py-0.5 rounded-full border border-yellow-500/40 font-semibold">
              ▶ Click Play to hear MʀツBΛNΛNΛ Voice
            </span>
          </div>
        )}
      </div>

      {/* Timeline Scrub Slider */}
      <div className="space-y-1.5 mb-4">
        <input
          id="audio-scrub-slider"
          type="range"
          min={0}
          max={totalDuration || 1}
          step={0.05}
          value={currentTime}
          onChange={handleScrub}
          className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-yellow-400"
        />
        <div className="flex justify-between text-xs text-zinc-400 font-mono">
          <span>{formatTime(currentTime)}</span>
          <span className="text-yellow-400 font-semibold">{formatTime(totalDuration)}</span>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-zinc-800/60">
        <div className="flex items-center gap-3">
          {/* Main Play/Pause Button */}
          <button
            id="audio-play-toggle-btn"
            onClick={togglePlay}
            className="w-12 h-12 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-zinc-950 flex items-center justify-center hover:scale-105 active:scale-95 transition shadow-lg shadow-yellow-500/30 cursor-pointer font-bold"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
          </button>

          {/* Replay */}
          <button
            id="audio-replay-btn"
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play();
                setIsPlaying(true);
              }
            }}
            className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition cursor-pointer"
            title="Replay from start"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Playback Speed */}
          <button
            id="playback-speed-btn"
            onClick={cycleSpeed}
            className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 transition cursor-pointer"
            title="Cycle Playback Speed"
          >
            {playbackRate}x
          </button>

          {/* Loop toggle */}
          <button
            id="playback-loop-btn"
            onClick={() => setIsLooping(!isLooping)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              isLooping ? "bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 font-bold" : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Loop
          </button>
        </div>

        {/* Volume controls */}
        <div className="flex items-center gap-2">
          <button onClick={toggleMute} className="text-zinc-400 hover:text-white transition cursor-pointer">
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 sm:w-24 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-yellow-400"
          />
        </div>
      </div>
    </div>
  );
}
