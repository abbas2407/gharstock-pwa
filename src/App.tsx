import { useState, useCallback, useEffect, useRef } from 'react';
import type { TabId, InventoryItem, AppState } from './types';
import { loadState, saveState, generateId } from './storage';
import HomeScreen from './screens/HomeScreen';
import ListScreen from './screens/ListScreen';
import RemindersScreen from './screens/RemindersScreen';
import FamilyScreen from './screens/FamilyScreen';
import AddItemModal from './components/AddItemModal';
import Toast from './components/Toast';
import type { ToastMessage } from './components/Toast';

const NAV_TABS: { id: TabId; icon: string; label: string }[] = [
  { id: 'home', icon: '🏠', label: 'Home' },
  { id: 'list', icon: '📋', label: 'List' },
  { id: 'reminders', icon: '🔔', label: 'Reminders' },
  { id: 'family', icon: '👨‍👩‍👧', label: 'Family' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [state, setState] = useState<AppState>(() => loadState());
  const [showAddModal, setShowAddModal] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [screenKey, setScreenKey] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Save whenever state changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  // PWA Install prompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Tab switching
  const switchTab = useCallback((tab: TabId) => {
    setActiveTab(tab);
    setScreenKey(k => k + 1);
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, []);

  // Add toast
  const addToast = useCallback((text: string, type: ToastMessage['type'] = 'success') => {
    const id = generateId();
    setToasts(prev => [...prev, { id, text, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Toggle shopping list
  const handleToggle = useCallback((id: string, checked: boolean) => {
    setState(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === id ? { ...item, inShoppingList: checked } : item
      ),
    }));
    addToast(checked ? '🛒 Shopping list mein add kiya!' : '✅ List se remove kiya', checked ? 'success' : 'default');
  }, [addToast]);

  // Mark as bought
  const handleMarkBought = useCallback((id: string, bought: boolean) => {
    setState(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === id ? { ...item, bought } : item
      ),
      activity: bought ? [
        {
          id: generateId(),
          memberName: 'Aap',
          memberAvatar: '👤',
          action: `marked ${prev.items.find(i => i.id === id)?.name || 'item'} as "Bought"`,
          time: 'Abhi',
        },
        ...prev.activity,
      ] : prev.activity,
    }));
  }, []);

  // Add new item
  const handleAddItem = useCallback((item: InventoryItem) => {
    setState(prev => ({
      ...prev,
      items: [item, ...prev.items],
      activity: [
        {
          id: generateId(),
          memberName: 'Aap',
          memberAvatar: '👤',
          action: `added "${item.name}" to inventory`,
          time: 'Abhi',
        },
        ...prev.activity,
      ],
    }));
    setShowAddModal(false);
    addToast(`✅ "${item.name}" add ho gaya!`, 'success');

    // Browser notification if permitted
    if ('Notification' in window && Notification.permission === 'granted' && item.status === 'finished') {
      new Notification('⚠️ GharStock Alert', {
        body: `${item.icon} ${item.hindi} khatam ho gaya! Shopping list mein add kar diya.`,
      });
    }
  }, [addToast]);

  // Toggle reminder done
  const handleToggleReminder = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      reminders: prev.reminders.map(r =>
        r.id === id ? { ...r, done: !r.done } : r
      ),
    }));
  }, []);

  // Invite family member
  const handleInvite = useCallback((name: string) => {
    setState(prev => ({
      ...prev,
      familyMembers: [
        ...prev.familyMembers,
        {
          id: generateId(),
          name,
          role: 'Member',
          avatar: '👤',
          status: 'pending',
          lastActive: 'Invitation sent',
        },
      ],
    }));
    addToast(`📨 ${name} ko invite bhej diya!`, 'success');
  }, [addToast]);

  // Install PWA
  const handleInstall = async () => {
    if (!installPrompt) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (installPrompt as any).prompt();
    setShowInstallBanner(false);
    setInstallPrompt(null);
  };

  return (
    <div className="app-shell">
      {/* Install Banner */}
      {showInstallBanner && (
        <div className="install-banner">
          <span style={{ fontSize: 18 }}>📲</span>
          <span className="install-banner-text">GharStock install karein!</span>
          <button className="install-banner-btn" onClick={handleInstall}>Install</button>
          <button className="install-banner-dismiss" onClick={() => setShowInstallBanner(false)}>
            Baad mein
          </button>
        </div>
      )}

      {/* Top Bar */}
      <div className="top-bar">
        <button className="hamburger-btn" aria-label="Menu">
          <span />
          <span />
          <span />
        </button>
        <div className="top-bar-logo">
          Ghar<span>Stock</span>
        </div>
        <div className="avatar-circle">GS</div>
      </div>

      {/* Screen Content */}
      <div className="screen-content" ref={contentRef}>
        {activeTab === 'home' && (
          <HomeScreen
            key={`home-${screenKey}`}
            items={state.items}
            onToggle={handleToggle}
            onAddItem={() => setShowAddModal(true)}
          />
        )}
        {activeTab === 'list' && (
          <ListScreen
            key={`list-${screenKey}`}
            items={state.items}
            onMarkBought={handleMarkBought}
          />
        )}
        {activeTab === 'reminders' && (
          <RemindersScreen
            key={`reminders-${screenKey}`}
            reminders={state.reminders}
            onToggleDone={handleToggleReminder}
          />
        )}
        {activeTab === 'family' && (
          <FamilyScreen
            key={`family-${screenKey}`}
            members={state.familyMembers}
            activity={state.activity}
            onInvite={handleInvite}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        {NAV_TABS.map(tab => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => switchTab(tab.id)}
            aria-label={tab.label}
          >
            <div className="nav-icon-wrap">
              <span className="nav-icon">{tab.icon}</span>
            </div>
            <span className="nav-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Add Item Modal */}
      {showAddModal && (
        <AddItemModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddItem}
        />
      )}

      {/* Toast Notifications */}
      <Toast messages={toasts} onRemove={removeToast} />
    </div>
  );
}
