import React, { useEffect, useState } from 'react';
import { clearAllPauseItems, getSettings, saveSettings } from '../lib/storage';
import type { AppSettings } from '../lib/types';
import { 
  Key, 
  MapPin, 
  Sparkles, 
  Check, 
  AlertCircle, 
  Trash2, 
  ExternalLink,
  Eye,
  EyeOff,
  ShieldCheck
} from 'lucide-react';

interface SettingsModalProps {
  onClose?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = () => {
  const [settings, setSettings] = useState<AppSettings>({
    geminiApiKey: '',
    useGeminiApi: true,
    grokApiKey: '',
    useGrokApi: false,
    currentCity: 'Delhi NCR',
    autoAnalyze: true,
    theme: 'dark',
  });
  const [showKey, setShowKey] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [testingApi, setTestingApi] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  const handleSave = async () => {
    await saveSettings(settings);
    setSaveStatus('Preferences saved');
    setTimeout(() => setSaveStatus(null), 2500);
  };

  const testGeminiConnection = async () => {
    const key = settings.geminiApiKey?.trim();
    if (!key) {
      setTestResult({ success: false, message: 'Please enter your Gemini API key first.' });
      return;
    }

    setTestingApi(true);
    setTestResult(null);

    const models = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.0-flash'];
    let verified = false;
    let errorDetail = '';

    for (const model of models) {
      try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Respond with "OK".' }] }],
          }),
        });

        if (res.ok) {
          verified = true;
          break;
        } else {
          const errData = await res.json().catch(() => ({}));
          errorDetail = errData.error?.message || `HTTP ${res.status}`;
        }
      } catch (err: any) {
        errorDetail = err?.message || 'Network error';
      }
    }

    if (verified) {
      setTestResult({ success: true, message: 'Google Gemini API connection verified!' });
      setSettings((prev) => ({ ...prev, useGeminiApi: true }));
      await saveSettings({ ...settings, useGeminiApi: true });
    } else {
      setTestResult({
        success: false,
        message: `API check failed: ${errorDetail}`,
      });
    }

    setTestingApi(false);
  };

  const handleClearData = async () => {
    if (confirm('Clear all items from your 30-Day Pause List?')) {
      await clearAllPauseItems();
      alert('Pause List cleared.');
    }
  };

  return (
    <div className="space-y-3.5 text-[#F4F0FA] font-sans antialiased">
      <div className="flex items-center justify-between pb-1.5 border-b border-[#3A344E]">
        <h3 className="text-xs font-semibold text-[#F4F0FA] uppercase tracking-wider">
          Settings &amp; AI
        </h3>
        {saveStatus && (
          <span className="text-[11px] text-[#B9A1F5] font-medium flex items-center gap-1">
            <Check className="w-3 h-3" strokeWidth={1.5} /> {saveStatus}
          </span>
        )}
      </div>

      {/* Google Gemini AI Configuration */}
      <div className="p-3 rounded-2xl bg-[#292438] border border-[#3A344E] space-y-2.5 shadow-[0_4px_16px_rgba(23,21,31,0.2)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F4F0FA]">
            <Sparkles className="w-3.5 h-3.5 text-[#B9A1F5]" strokeWidth={1.5} />
            <span>Google Gemini AI</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.useGeminiApi}
              onChange={(e) => setSettings({ ...settings, useGeminiApi: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-8 h-4.5 bg-[#17151F] border border-[#3A344E] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#B9A1F5]"></div>
          </label>
        </div>

        <p className="text-[11px] text-[#C8C2D8] leading-relaxed">
          Power real-time True Cost estimates, product repairability breakdowns, and circular alternatives using Google Gemini.
        </p>

        <div className="space-y-1.5 pt-0.5">
          <label className="text-[10px] uppercase font-semibold text-[#A69FB8] flex items-center gap-1">
            <Key className="w-3 h-3 text-[#A69FB8]" strokeWidth={1.5} /> Gemini API Key (AIza...)
          </label>
          <div className="flex items-center gap-1.5">
            <div className="relative flex-1">
              <input
                type={showKey ? 'text' : 'password'}
                placeholder="AIzaSy..."
                value={settings.geminiApiKey || ''}
                onChange={(e) => setSettings({ ...settings, geminiApiKey: e.target.value })}
                className="w-full bg-[#17151F] border border-[#3A344E] rounded-xl px-2.5 py-1.5 text-xs text-[#F4F0FA] placeholder:text-[#5E5873] focus:outline-none focus:border-[#B9A1F5] pr-8"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-2 text-[#A69FB8] hover:text-[#F4F0FA] cursor-pointer"
              >
                {showKey ? <EyeOff className="w-3.5 h-3.5" strokeWidth={1.5} /> : <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />}
              </button>
            </div>

            <button
              onClick={testGeminiConnection}
              disabled={testingApi || !settings.geminiApiKey}
              className="px-2.5 py-1.5 bg-[#B9A1F5] hover:bg-[#cbb9f8] disabled:bg-[#3A344E] disabled:text-[#A69FB8] text-[#17151F] rounded-xl text-xs font-semibold transition-colors flex-shrink-0 cursor-pointer shadow-[0_4px_16px_rgba(185,161,245,0.25)]"
            >
              {testingApi ? 'Testing...' : 'Test Key'}
            </button>
          </div>

          {testResult && (
            <div
              className={`p-2 rounded-xl text-[11px] flex items-start gap-1.5 ${
                testResult.success
                  ? 'bg-[#B9A1F5]/15 border border-[#B9A1F5]/40 text-[#B9A1F5]'
                  : 'bg-[#F08787]/15 border border-[#F08787]/30 text-[#F08787]'
              }`}
            >
              {testResult.success ? (
                <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          <div className="text-[10px] text-[#A69FB8] flex items-center justify-between pt-0.5">
            <span>Stored in local extension storage or loaded via .env</span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#B9A1F5] hover:underline flex items-center gap-0.5"
            >
              Get Free Gemini Key <ExternalLink className="w-2.5 h-2.5" strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>

      {/* Region Information */}
      <div className="p-3 rounded-2xl bg-[#292438] border border-[#3A344E] space-y-1.5 shadow-[0_4px_16px_rgba(23,21,31,0.2)]">
        <label className="text-xs font-semibold text-[#F4F0FA] flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#B9A1F5]" strokeWidth={1.5} /> Active Region
        </label>
        <div className="flex items-center justify-between p-2 rounded-xl bg-[#17151F] border border-[#3A344E]">
          <span className="text-xs font-bold text-[#F0C987]">Delhi NCR</span>
          <span className="text-[10px] text-[#A69FB8]">8 Verified Circular Hubs</span>
        </div>
      </div>

      {/* Actions: Save & Clear */}
      <div className="pt-2 flex items-center justify-between gap-2">
        <button
          onClick={handleClearData}
          className="text-[#A69FB8] hover:text-[#F08787] text-xs flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} /> Clear Saved Data
        </button>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-[#B9A1F5] hover:bg-[#cbb9f8] text-[#17151F] rounded-xl text-xs font-bold transition-all shadow-[0_4px_16px_rgba(185,161,245,0.25)] cursor-pointer"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};
