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
    <div className="space-y-3.5 text-white font-sans antialiased">
      <div className="flex items-center justify-between pb-1.5 border-b border-neutral-800">
        <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
          Settings &amp; AI
        </h3>
        {saveStatus && (
          <span className="text-[11px] text-white font-medium flex items-center gap-1">
            <Check className="w-3 h-3" strokeWidth={1.5} /> {saveStatus}
          </span>
        )}
      </div>

      {/* Google Gemini AI Configuration */}
      <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
            <Sparkles className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
            <span>Google Gemini AI</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.useGeminiApi}
              onChange={(e) => setSettings({ ...settings, useGeminiApi: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-8 h-4.5 bg-black border border-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-white peer-checked:after:bg-black"></div>
          </label>
        </div>

        <p className="text-[11px] text-neutral-400 leading-relaxed">
          Power real-time True Cost estimates, product repairability breakdowns, and circular alternatives using Google Gemini.
        </p>

        <div className="space-y-1.5 pt-0.5">
          <label className="text-[10px] uppercase font-semibold text-neutral-400 flex items-center gap-1">
            <Key className="w-3 h-3 text-neutral-400" strokeWidth={1.5} /> Gemini API Key
          </label>
          <div className="flex items-center gap-1.5">
            <div className="relative flex-1">
              <input
                type={showKey ? 'text' : 'password'}
                placeholder="AIzaSy..."
                value={settings.geminiApiKey || ''}
                onChange={(e) => setSettings({ ...settings, geminiApiKey: e.target.value })}
                className="w-full bg-black border border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-white pr-8"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-2 text-neutral-400 hover:text-white cursor-pointer"
              >
                {showKey ? <EyeOff className="w-3.5 h-3.5" strokeWidth={1.5} /> : <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />}
              </button>
            </div>

            <button
              onClick={testGeminiConnection}
              disabled={testingApi || !settings.geminiApiKey}
              className="px-2.5 py-1.5 bg-white hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-500 text-black rounded-xl text-xs font-bold transition-colors flex-shrink-0 cursor-pointer"
            >
              {testingApi ? 'Testing...' : 'Test Key'}
            </button>
          </div>

          {testResult && (
            <div
              className={`p-2 rounded-xl text-[11px] flex items-start gap-1.5 ${
                testResult.success
                  ? 'bg-neutral-800 border border-neutral-700 text-white'
                  : 'bg-neutral-900 border border-neutral-700 text-neutral-300'
              }`}
            >
              {testResult.success ? (
                <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-white" strokeWidth={1.5} />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-neutral-400" strokeWidth={1.5} />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          <div className="text-[10px] text-neutral-400 flex items-center justify-between pt-0.5">
            <span>Configured in .env or stored locally.</span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white underline hover:text-neutral-300 flex items-center gap-0.5"
            >
              Get Free Gemini Key <ExternalLink className="w-2.5 h-2.5" strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>

      {/* Region Information */}
      <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-1.5">
        <label className="text-xs font-semibold text-white flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-white" strokeWidth={1.5} /> Active Region
        </label>
        <div className="flex items-center justify-between p-2 rounded-xl bg-black border border-neutral-800">
          <span className="text-xs font-bold text-white">Delhi NCR</span>
          <span className="text-[10px] text-neutral-400">8 Verified Circular Hubs</span>
        </div>
      </div>

      {/* Actions: Save & Clear */}
      <div className="pt-2 flex items-center justify-between gap-2">
        <button
          onClick={handleClearData}
          className="text-neutral-400 hover:text-white text-xs flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} /> Clear Saved Data
        </button>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-white hover:bg-neutral-200 text-black rounded-xl text-xs font-bold transition-all cursor-pointer"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};
