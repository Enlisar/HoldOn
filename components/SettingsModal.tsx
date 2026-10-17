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
    grokApiKey: '',
    currentCity: 'Delhi NCR',
    useGrokApi: false,
    autoAnalyze: true,
    theme: 'light',
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

  const testGrokConnection = async () => {
    if (!settings.grokApiKey) {
      setTestResult({ success: false, message: 'Please enter a Grok API key first.' });
      return;
    }

    setTestingApi(true);
    setTestResult(null);

    try {
      const res = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${settings.grokApiKey.trim()}`,
        },
        body: JSON.stringify({
          model: 'grok-beta',
          messages: [{ role: 'user', content: 'Ping' }],
          max_tokens: 5,
        }),
      });

      if (res.ok) {
        setTestResult({ success: true, message: 'Grok API connection verified!' });
        setSettings((prev) => ({ ...prev, useGrokApi: true }));
        await saveSettings({ ...settings, useGrokApi: true });
      } else {
        const errData = await res.json().catch(() => ({}));
        setTestResult({
          success: false,
          message: errData.error?.message || `API error ${res.status}: Invalid key or quota limit.`,
        });
      }
    } catch (e: any) {
      setTestResult({
        success: false,
        message: 'Network error connecting to x.ai: ' + (e?.message || 'Check connection'),
      });
    } finally {
      setTestingApi(false);
    }
  };

  const handleClearData = async () => {
    if (confirm('Clear all items from your 30-Day Pause List?')) {
      await clearAllPauseItems();
      alert('Pause List cleared.');
    }
  };

  return (
    <div className="space-y-3.5 text-[#252923] font-sans antialiased">
      <div className="flex items-center justify-between pb-1.5 border-b border-[#E9E7E0]">
        <h3 className="text-xs font-semibold text-[#252923] uppercase tracking-wider">
          Settings &amp; AI
        </h3>
        {saveStatus && (
          <span className="text-[11px] text-[#3E5234] font-medium flex items-center gap-1">
            <Check className="w-3 h-3" strokeWidth={1.5} /> {saveStatus}
          </span>
        )}
      </div>

      {/* Grok API Configuration */}
      <div className="p-3 rounded-2xl bg-white/90 border border-[#E9E7E0] space-y-2.5 shadow-[0_2px_6px_rgba(37,41,35,0.03)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#252923]">
            <Sparkles className="w-3.5 h-3.5 text-[#A7B79B]" strokeWidth={1.5} />
            <span>xAI Grok API Integration</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.useGrokApi}
              onChange={(e) => setSettings({ ...settings, useGrokApi: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-8 h-4.5 bg-[#D5D2C7] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#252923]"></div>
          </label>
        </div>

        <p className="text-[11px] text-[#5E645A] leading-relaxed">
          Power real-time True Cost estimates, product repairability breakdowns, and circular alternatives with xAI Grok.
        </p>

        <div className="space-y-1.5 pt-0.5">
          <label className="text-[10px] uppercase font-semibold text-[#5E645A] flex items-center gap-1">
            <Key className="w-3 h-3 text-[#5E645A]" strokeWidth={1.5} /> Grok API Key (xai-...)
          </label>
          <div className="flex items-center gap-1.5">
            <div className="relative flex-1">
              <input
                type={showKey ? 'text' : 'password'}
                placeholder="xai-xxxxxxxxxxxxxxxxxxxx"
                value={settings.grokApiKey}
                onChange={(e) => setSettings({ ...settings, grokApiKey: e.target.value })}
                className="w-full bg-[#F7F6F0] border border-[#E9E7E0] rounded-xl px-2.5 py-1.5 text-xs text-[#252923] placeholder:text-[#8A9084] focus:outline-none focus:border-[#A7B79B] pr-8"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-2 text-[#8A9084] hover:text-[#252923] cursor-pointer"
              >
                {showKey ? <EyeOff className="w-3.5 h-3.5" strokeWidth={1.5} /> : <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />}
              </button>
            </div>

            <button
              onClick={testGrokConnection}
              disabled={testingApi || !settings.grokApiKey}
              className="px-2.5 py-1.5 bg-[#252923] hover:bg-[#343a31] disabled:bg-[#E9E7E0] disabled:text-[#8A9084] text-[#F7F6F0] rounded-xl text-xs font-semibold transition-colors flex-shrink-0 cursor-pointer shadow-sm"
            >
              {testingApi ? 'Testing...' : 'Test Key'}
            </button>
          </div>

          {testResult && (
            <div
              className={`p-2 rounded-xl text-[11px] flex items-start gap-1.5 ${
                testResult.success
                  ? 'bg-[#A7B79B]/15 border border-[#A7B79B]/40 text-[#3E5234]'
                  : 'bg-[#B96C60]/10 border border-[#B96C60]/30 text-[#8A3B30]'
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

          <div className="text-[10px] text-[#5E645A] flex items-center justify-between pt-0.5">
            <span>Stored securely in local extension storage.</span>
            <a
              href="https://console.x.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3E5234] hover:underline flex items-center gap-0.5"
            >
              Get API Key <ExternalLink className="w-2.5 h-2.5" strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>

      {/* City Configuration */}
      <div className="p-3 rounded-2xl bg-white/90 border border-[#E9E7E0] space-y-1.5 shadow-[0_2px_6px_rgba(37,41,35,0.03)]">
        <label className="text-xs font-semibold text-[#252923] flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#A7B79B]" strokeWidth={1.5} /> Active Region
        </label>
        <div className="flex items-center justify-between p-2 rounded-xl bg-[#F7F6F0] border border-[#E9E7E0]">
          <span className="text-xs font-bold text-[#252923]">Delhi NCR</span>
          <span className="text-[10px] text-[#5E645A]">MVP Selected City</span>
        </div>
      </div>

      {/* Actions: Save & Clear */}
      <div className="pt-2 flex items-center justify-between gap-2">
        <button
          onClick={handleClearData}
          className="text-[#8A9084] hover:text-[#B96C60] text-xs flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} /> Clear Saved Data
        </button>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-[#252923] hover:bg-[#343a31] text-[#F7F6F0] rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};
