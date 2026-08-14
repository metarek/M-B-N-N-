import React, { useState } from "react";
import { Key, ExternalLink, Check, Copy, ShieldAlert, Sparkles, X } from "lucide-react";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
}) => {
  const [inputKey, setInputKey] = useState(apiKey);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveApiKey(inputKey.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const copyVercelEnvName = () => {
    navigator.clipboard.writeText("GEMINI_API_KEY");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-yellow-500/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-zinc-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-400 to-amber-600 flex items-center justify-center text-zinc-950 font-bold">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              Vercel & Gemini API Setup (সেটিংস)
            </h2>
            <p className="text-xs text-zinc-400">
              Vercel বা GitHub এ পাবলিশ করার পর ভয়েস সচল করার নির্দেশিকা
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-3 text-xs leading-relaxed text-zinc-300">
          <p className="font-semibold text-yellow-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Vercel-এ ভয়েস সচল করার ২ টি সহজ উপায়:</span>
          </p>

          <div className="space-y-2 pl-1">
            <div className="flex items-start gap-2">
              <span className="bg-yellow-400/20 text-yellow-300 font-bold px-1.5 py-0.5 rounded text-[10px]">
                পদ্ধতি ১ (সেরা)
              </span>
              <div>
                <strong>Vercel Dashboard Environment Variable যোগ করুন:</strong>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Vercel Project Settings &gt; <strong>Environment Variables</strong> এ যান। Key নাম দিন{" "}
                  <code className="text-yellow-300 bg-zinc-800 px-1 py-0.2 rounded font-mono">
                    GEMINI_API_KEY
                  </code>{" "}
                  <button
                    onClick={copyVercelEnvName}
                    className="inline-flex items-center gap-1 text-[10px] text-zinc-300 hover:text-white underline ml-1 cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400 inline" /> : <Copy className="w-3 h-3 inline" />}
                    {copied ? "কপি হয়েছে!" : "কপি করুন"}
                  </button>
                  এবং Value তে আপনার Gemini API Key দিয়ে Save করুন, এরপর একবার <strong>Redeploy</strong> দিন।
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-1 border-t border-zinc-800/80">
              <span className="bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded text-[10px]">
                পদ্ধতি ২ (তাত্ক্ষণিক)
              </span>
              <div>
                <strong>সরাসরি এখানে API Key সংরক্ষণ করুন:</strong>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  নিচের বক্সে আপনার ফ্রি Gemini API Key পেস্ট করে সেভ করুন। এটি আপনার ব্রাউজারে সংরক্ষিত থাকবে এবং সাথে সাথে কাজ শুরু করবে!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Input Field */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-200 flex items-center justify-between">
            <span>আপনার Gemini API Key:</span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-yellow-400 hover:underline flex items-center gap-1"
            >
              <span>ফ্রি API Key নিন</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </label>
          <input
            type="password"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 focus:border-yellow-400 focus:outline-none text-xs text-white font-mono placeholder:text-zinc-600"
          />
        </div>

        {savedSuccess && (
          <div className="p-2.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>API Key সফলভাবে সংরক্ষিত হয়েছে!</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
          >
            বন্ধ করুন
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-yellow-400 hover:bg-yellow-300 text-zinc-950 transition cursor-pointer shadow-lg shadow-yellow-400/20"
          >
            সংরক্ষণ করুন (Save Key)
          </button>
        </div>
      </div>
    </div>
  );
};
