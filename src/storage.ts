import type { AppState, InventoryItem } from './types';

const STORAGE_KEY = 'gharstock_v1';

const DEFAULT_ITEMS: InventoryItem[] = [
  { id: '1', name: 'Milk', hindi: 'Doodh', icon: '🥛', iconBg: '#D4E8C8', qty: 2, unit: 'L', status: 'available', inShoppingList: false, category: 'dairy', bought: false, addedAt: new Date().toISOString() },
  { id: '2', name: 'Rice', hindi: 'Chawal', icon: '🌾', iconBg: '#C8D8E8', qty: 1.5, unit: 'kg', status: 'low', inShoppingList: false, category: 'grains', bought: false, addedAt: new Date().toISOString() },
  { id: '3', name: 'Onions', hindi: 'Pyaj', icon: '🧅', iconBg: '#D4E8C8', qty: 0, unit: 'kg', status: 'finished', inShoppingList: true, category: 'veggies', bought: false, addedAt: new Date().toISOString() },
  { id: '4', name: 'Cleaning Liquid', hindi: 'Safai', icon: '🫧', iconBg: '#D4E8C8', qty: 1, unit: 'Bottle', status: 'available', inShoppingList: false, category: 'home', bought: false, addedAt: new Date().toISOString() },
  { id: '5', name: 'Tea Leaves', hindi: 'Chai Patti', icon: '🍃', iconBg: '#D4E8C8', qty: 500, unit: 'g', status: 'available', inShoppingList: false, category: 'kitchen', bought: false, addedAt: new Date().toISOString() },
  { id: '6', name: 'Atta', hindi: 'Atta', icon: '🌾', iconBg: '#E8DFC8', qty: 2, unit: 'kg', status: 'available', inShoppingList: false, category: 'grains', bought: false, addedAt: new Date().toISOString() },
  { id: '7', name: 'Sugar', hindi: 'Cheeni', icon: '🧂', iconBg: '#F0E8D8', qty: 0.5, unit: 'kg', status: 'low', inShoppingList: false, category: 'kitchen', bought: false, addedAt: new Date().toISOString() },
  { id: '8', name: 'Cooking Oil', hindi: 'Tel', icon: '🫒', iconBg: '#D8E8C8', qty: 1, unit: 'L', status: 'available', inShoppingList: false, category: 'kitchen', bought: false, addedAt: new Date().toISOString() },
  { id: '9', name: 'Dal', hindi: 'Dal', icon: '🫘', iconBg: '#E8E0C8', qty: 0, unit: 'kg', status: 'finished', inShoppingList: true, category: 'grains', bought: false, addedAt: new Date().toISOString() },
  { id: '10', name: 'Bread', hindi: 'Bread', icon: '🍞', iconBg: '#E8DCC8', qty: 1, unit: 'packet', status: 'available', inShoppingList: false, category: 'other', bought: false, addedAt: new Date().toISOString() },
];

const DEFAULT_STATE: AppState = {
  items: DEFAULT_ITEMS,
  familyMembers: [
    { id: 'f1', name: 'Maa', role: 'Admin', avatar: '👩', status: 'admin', lastActive: 'Now', isYou: true },
    { id: 'f2', name: 'Papa', role: 'Member', avatar: '👨', status: 'joined', lastActive: '2 hours ago' },
    { id: 'f3', name: 'Priya', role: 'Member', avatar: '👧', status: 'pending', lastActive: 'Invitation sent' },
  ],
  reminders: [
    { id: 'r1', type: 'urgent', title: 'EMPTY NOW', body: 'Onions (Pyaj) khatam ho gaya — buy today', icon: '⚠️', done: false, urgency: 'urgent' },
    { id: 'r2', type: 'health', title: 'HEALTH', body: "Papa's BP Medicine — take now", icon: '💊', done: false, urgency: 'urgent' },
    { id: 'r3', type: 'soon', title: 'RUNNING LOW', body: 'Rice (Chawal) is low — restock soon', icon: '📦', done: false, urgency: 'soon' },
  ],
  activity: [
    { id: 'a1', memberName: 'Papa', memberAvatar: '👨', action: 'marked Milk as "Bought"', time: '2 hrs ago' },
    { id: 'a2', memberName: 'Maa', memberAvatar: '👩', action: 'added "Haldi" to list', time: '5 hrs ago' },
    { id: 'a3', memberName: 'Priya', memberAvatar: '👧', action: 'decreased Rice quantity', time: '1 day ago' },
  ],
  settings: {
    householdName: 'Sharma',
    notificationsEnabled: false,
  },
};

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      ...DEFAULT_STATE,
      ...parsed,
      items: parsed.items?.length ? parsed.items : DEFAULT_STATE.items,
      familyMembers: parsed.familyMembers?.length ? parsed.familyMembers : DEFAULT_STATE.familyMembers,
      reminders: parsed.reminders?.length ? parsed.reminders : DEFAULT_STATE.reminders,
      activity: parsed.activity?.length ? parsed.activity : DEFAULT_STATE.activity,
      settings: { ...DEFAULT_STATE.settings, ...parsed.settings },
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    console.warn('GharStock: Could not save to localStorage');
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
