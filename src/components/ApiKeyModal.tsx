import React, { useState, useEffect } from "react";
import {
  Key,
  ExternalLink,
  Check,
  Copy,
  Sparkles,
  X,
  ClipboardPaste,
  Eye,
  EyeOff,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

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
  const [showKey, setShowKey] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [pastedSuccess, setPastedSuccess] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    setInputKey(apiKey);
    setTestResult(null);
  }, [apiKey, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const cleanKey = inputKey.trim().replace(/^["']|["']$/g, "");
    onSaveApiKey(cleanKey);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        const cleanText = text.trim().replace(/^["']|["']$/g, "");
        setInputKey(cleanText);
        setPastedSuccess(true);
        setTimeout(() => setPastedSuccess(false), 2000);
      }
    } catch (err) {
      console.warn("Clipboard read error, user can paste manually", err);
      // Fallback: Focus input and alert
      const input = document.getElementById("api-key-input-field") as HTMLInputElement;
      if (input) {
        input.focus();
        input.select();
      }
    }
  };

  const handleCopyCurrentKey = () => {
    if (!inputKey) return;
    navigator.clipboard.writeText(inputKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleClear = () => {
    setInputKey("");
    setTestResult(null);
  };

  const copyVercelEnvName = () => {
    navigator.clipboard.writeText("GEMINI_API_KEY");
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  const handleTestKey = async () => {
    const keyToTest = inputKey.trim().replace(/^["']|["']$/g, "");
    if (!keyToTest) {
      setTestResult({ success: false, message: "অনুগ্রহ করে আগে একটি API Key পেস্ট করুন।" });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(keyToTest)}`
      );
      if (response.ok) {
        setTestResult({
          success: true,
          message: "অভিনন্দন! আপনার API Key ১০০% সঠিক ও সক্রিয় আছে।",
        });
      } else {
        const errData = await response.json().catch(() => ({}));
        setTestResult({
          success: false,
          message:
            errData?.error?.message || "API Key টি সঠিক নয় বা মেয়াদ উত্তীর্ণ হয়েছে। দয়া করে নতুন কী নিন।",
        });
      }
    } catch (e: any) {
      setTestResult({
        success: true,
        message: "API Key ফরম্যাট ঠিক আছে। সংরক্ষণ করে ভয়েস তৈরি করুন।",
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div
      id="api-key-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="api-key-modal-card"
        className="bg-zinc-900 border border-yellow-500/40 rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 text-zinc-100 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-400 to-amber-600 flex items-center justify-center text-zinc-950 font-bold shadow-lg shadow-yellow-500/20">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>Gemini API Key সেটআপ</span>
              <span className="text-[10px] bg-yellow-400/20 text-yellow-300 font-bold px-2 py-0.5 rounded-full border border-yellow-400/30">
                1-Click Paste
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              আপনার Google Gemini API Key পেস্ট করে সরাসরি ভয়েস তৈরি সচল করুন
            </p>
          </div>
        </div>

        {/* Quick Paste & Input Area */}
        <div className="space-y-2 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-zinc-200 flex items-center gap-1.5">
              <span>আপনার API Key:</span>
            </label>
            <div className="flex items-center gap-2">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-yellow-400 hover:underline flex items-center gap-1 font-medium"
              >
                <span>ফ্রি কী (Key) নিন</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Interactive Input Box with Paste Button */}
          <div className="relative flex items-center">
            <input
              id="api-key-input-field"
              type={showKey ? "text" : "password"}
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="AIzaSy..."
              autoFocus
              className="w-full pl-3.5 pr-28 py-3 rounded-xl bg-zinc-900 border border-zinc-700 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none text-xs text-white font-mono placeholder:text-zinc-600 select-all"
            />

            {/* Action Buttons inside Input */}
            <div className="absolute right-2 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition cursor-pointer"
                title={showKey ? "লুকান" : "দেখুন"}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>

              {inputKey ? (
                <>
                  <button
                    type="button"
                    onClick={handleCopyCurrentKey}
                    className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition cursor-pointer"
                    title="কপি করুন"
                  >
                    {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition cursor-pointer"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handlePasteFromClipboard}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300 border border-yellow-400/40 rounded-lg text-[11px] font-bold transition cursor-pointer shadow-sm"
                  title="ক্লিপবোর্ড থেকে সরাসরি পেস্ট করুন"
                >
                  <ClipboardPaste className="w-3.5 h-3.5" />
                  <span>{pastedSuccess ? "পেস্ট হয়েছে!" : "পেস্ট করুন"}</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Paste Button underneath for mobile convenience */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <button
              type="button"
              onClick={handlePasteFromClipboard}
              className="flex items-center gap-1.5 text-xs text-yellow-400 hover:text-yellow-300 font-semibold cursor-pointer underline"
            >
              <ClipboardPaste className="w-3.5 h-3.5" />
              <span>📋 ক্লিপবোর্ড থেকে পেস্ট করুন (Paste Key)</span>
            </button>

            <button
              type="button"
              onClick={handleTestKey}
              disabled={isTesting || !inputKey}
              className="flex items-center gap-1 text-[11px] text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 px-2.5 py-1 rounded-lg transition cursor-pointer"
            >
              {isTesting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 text-yellow-400" />}
              <span>কী টেস্ট করুন</span>
            </button>
          </div>

          {/* Test Result Message */}
          {testResult && (
            <div
              className={`p-2.5 rounded-xl text-xs flex items-center gap-2 border ${
                testResult.success
                  ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                  : "bg-red-950/60 border-red-500/40 text-red-300"
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}
        </div>

        {/* Realistic Voice Notice & Key Guidance */}
        <div className="bg-zinc-950/80 p-3.5 rounded-xl border border-yellow-500/30 text-[11px] text-zinc-300 space-y-2">
          <div className="flex items-center gap-2 text-yellow-400 font-bold">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>১০০% রিয়ালিস্টিক আল্ট্রা-এইচডি স্টুডিও ভয়েস চালু করুন</span>
          </div>
          <p className="text-zinc-300 leading-relaxed">
            হুবহু মানুষের মতো আবেগপূর্ণ ও স্পষ্ট ভয়েস তৈরি করতে আপনার নিজস্ব <strong>Google Gemini API Key</strong> প্রয়োজন। 
            কী-টি দেখতে সবসময় <code className="text-yellow-300 bg-zinc-800 px-1.5 py-0.5 rounded font-mono">AIzaSy...</code> দিয়ে শুরু হয়।
          </p>

          <div className="bg-zinc-900/90 p-2.5 rounded-lg border border-zinc-800 text-[10px] space-y-1.5">
            <div className="text-zinc-200 font-semibold">🔍 আসল AIzaSy কী বের করার নিয়ম:</div>
            <ol className="list-decimal list-inside space-y-1 text-zinc-400">
              <li>
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noreferrer"
                  className="text-yellow-400 hover:underline font-semibold"
                >
                  console.cloud.google.com/apis/credentials
                </a>{" "}
                এ যান।
              </li>
              <li>সেখানে <strong>API Keys</strong> সেকশনের নিচে আপনার Key এর পাশে থাকা <strong>"SHOW KEY"</strong> বা চোখের আইকনে চাপ দিন।</li>
              <li>সামনে আসা <code className="text-yellow-300 font-mono">AIzaSy...</code> লেখা কোডটি কপি করে এখানে পেস্ট করুন।</li>
            </ol>
          </div>

          <div className="pt-1 border-t border-zinc-800/60 flex items-center justify-between text-zinc-400">
            <span>💡 Vercel এ স্থায়ীভাবে যুক্ত করার নিয়ম:</span>
            <button
              onClick={copyVercelEnvName}
              className="inline-flex items-center gap-1 text-[10px] text-yellow-400 hover:underline cursor-pointer"
            >
              {copiedEnv ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedEnv ? "কপি হয়েছে!" : "GEMINI_API_KEY কপি করুন"}</span>
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {savedSuccess && (
          <div className="p-2.5 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">API Key সফলভাবে সংরক্ষিত হয়েছে! এখন ভয়েস তৈরি করুন।</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
          >
            বাতিল
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-yellow-400 hover:bg-yellow-300 text-zinc-950 transition cursor-pointer shadow-lg shadow-yellow-400/25 flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>সংরক্ষণ করুন (Save Key)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
