import type { AppSettings, ImpactStats, PauseItem } from './types';

const STORAGE_KEYS = {
  PAUSE_LIST: 'holdon_pause_list',
  SETTINGS: 'holdon_settings',
  STATS: 'holdon_stats',
};

const DEFAULT_SETTINGS: AppSettings = {
  grokApiKey: '',
  currentCity: 'Delhi NCR',
  useGrokApi: false,
  autoAnalyze: true,
  theme: 'dark',
};

// Safe access to storage whether in extension context or regular web context
const hasBrowserStorage = typeof browser !== 'undefined' && browser.storage?.local;

async function getStoredItem<T>(key: string, defaultValue: T): Promise<T> {
  try {
    if (hasBrowserStorage) {
      const result = await browser.storage.local.get(key);
      return (result as Record<string, any>)[key] !== undefined
        ? ((result as Record<string, any>)[key] as T)
        : defaultValue;
    } else if (typeof localStorage !== 'undefined') {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    }
  } catch (err) {
    console.warn(`[HoldOn Storage] Error reading ${key}:`, err);
  }
  return defaultValue;
}

async function setStoredItem<T>(key: string, value: T): Promise<void> {
  try {
    if (hasBrowserStorage) {
      await browser.storage.local.set({ [key]: value });
    } else if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (err) {
    console.warn(`[HoldOn Storage] Error writing ${key}:`, err);
  }
}

export async function getSettings(): Promise<AppSettings> {
  const current = await getStoredItem<AppSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  return { ...DEFAULT_SETTINGS, ...current };
}

export async function saveSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
  const current = await getSettings();
  const updated = { ...current, ...settings };
  await setStoredItem(STORAGE_KEYS.SETTINGS, updated);
  return updated;
}

export async function getPauseList(): Promise<PauseItem[]> {
  return await getStoredItem<PauseItem[]>(STORAGE_KEYS.PAUSE_LIST, []);
}

export async function addToPauseList(item: Omit<PauseItem, 'id' | 'dateAdded' | 'expiresAt' | 'status'>): Promise<PauseItem> {
  const list = await getPauseList();
  const now = Date.now();
  const newItem: PauseItem = {
    ...item,
    id: 'pause_' + now + '_' + Math.random().toString(36).substring(2, 7),
    dateAdded: now,
    expiresAt: now + 30 * 24 * 60 * 60 * 1000, // 30 days
    status: 'active',
  };

  const updatedList = [newItem, ...list];
  await setStoredItem(STORAGE_KEYS.PAUSE_LIST, updatedList);
  await recalculateStats(updatedList);
  return newItem;
}

export async function updatePauseItemStatus(id: string, status: 'reconsidered' | 'purchased'): Promise<PauseItem[]> {
  const list = await getPauseList();
  const updated = list.map((item) => (item.id === id ? { ...item, status } : item));
  await setStoredItem(STORAGE_KEYS.PAUSE_LIST, updated);
  await recalculateStats(updated);
  return updated;
}

export async function removeFromPauseList(id: string): Promise<PauseItem[]> {
  const list = await getPauseList();
  const updated = list.filter((item) => item.id !== id);
  await setStoredItem(STORAGE_KEYS.PAUSE_LIST, updated);
  await recalculateStats(updated);
  return updated;
}

export async function clearAllPauseItems(): Promise<void> {
  await setStoredItem(STORAGE_KEYS.PAUSE_LIST, []);
  await recalculateStats([]);
}

export async function getImpactStats(): Promise<ImpactStats> {
  const defaultStats: ImpactStats = {
    totalItemsPaused: 0,
    totalMoneySaved: 0,
    totalCo2SavedKg: 0,
    reconsideredCount: 0,
  };
  return await getStoredItem<ImpactStats>(STORAGE_KEYS.STATS, defaultStats);
}

async function recalculateStats(list: PauseItem[]): Promise<ImpactStats> {
  const reconsidered = list.filter((i) => i.status === 'reconsidered');
  const active = list.filter((i) => i.status === 'active');

  const totalMoneySaved = reconsidered.reduce((acc, curr) => acc + (curr.price || 0), 0);
  const totalCo2SavedKg = reconsidered.reduce((acc, curr) => acc + (curr.co2EstimateKg || 12), 0);

  const stats: ImpactStats = {
    totalItemsPaused: list.length,
    totalMoneySaved,
    totalCo2SavedKg: Math.round(totalCo2SavedKg * 10) / 10,
    reconsideredCount: reconsidered.length,
  };

  await setStoredItem(STORAGE_KEYS.STATS, stats);
  return stats;
}
