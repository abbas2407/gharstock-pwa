import { useState } from 'react';
import type { InventoryItem } from '../types';

interface ListScreenProps {
  items: InventoryItem[];
  onMarkBought: (id: string, bought: boolean) => void;
}

export default function ListScreen({ items, onMarkBought }: ListScreenProps) {
  const [localBought, setLocalBought] = useState<Record<string, boolean>>({});

  const listItems = items.filter(i => i.inShoppingList || i.status === 'finished' || i.status === 'low');

  const isBought = (id: string) => localBought[id] ?? items.find(i => i.id === id)?.bought ?? false;

  const pendingItems = listItems.filter(i => !isBought(i.id));
  const boughtItems = listItems.filter(i => isBought(i.id));

  const handleCheck = (id: string) => {
    const newVal = !isBought(id);
    setLocalBought(prev => ({ ...prev, [id]: newVal }));
    onMarkBought(id, newVal);
  };

  const handleWhatsApp = () => {
    const lines = pendingItems.map(i => `• ${i.icon} ${i.hindi || i.name} — ${i.qty || '?'} ${i.unit}`);
    if (boughtItems.length > 0) {
      lines.push('');
      lines.push('✅ Already Bought:');
      boughtItems.forEach(i => lines.push(`  ✓ ${i.icon} ${i.hindi || i.name}`));
    }
    const text = `🛒 GharStock Shopping List:\n\n${lines.join('\n')}\n\n_Shared from GharStock App_`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  if (listItems.length === 0) {
    return (
      <div className="screen">
        <div className="page-header">
          <h1 className="page-title">Shopping List / Khareedne Ka List</h1>
          <p className="page-subtitle">Items you need to buy.</p>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">🎉</div>
          <h2 className="empty-state-title">Sab Kuch Hai!</h2>
          <p className="empty-state-sub">
            Your pantry is fully stocked.<br />Nothing to buy right now.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="page-header">
        <h1 className="page-title">Shopping List / Khareedne Ka List</h1>
        <p className="page-subtitle">Items you need to buy.</p>
      </div>

      {/* Count pill */}
      {pendingItems.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{
            background: '#FFE8E8',
            color: '#D4380D',
            fontSize: 12,
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: 20,
          }}>
            {pendingItems.length} item{pendingItems.length > 1 ? 's' : ''} to buy
          </span>
        </div>
      )}

      {/* Pending items */}
      {pendingItems.map(item => (
        <div className="card" key={item.id}>
          <div className="list-item-card">
            <button
              className="list-checkbox"
              onClick={() => handleCheck(item.id)}
              aria-label={`Mark ${item.name} as bought`}
            >
              {isBought(item.id) && <span style={{ color: '#fff', fontSize: 14 }}>✓</span>}
            </button>
            <span className="list-item-icon">{item.icon}</span>
            <div className="list-item-info">
              <div className="list-item-name">{item.name} ({item.hindi})</div>
              <div className="list-item-qty">
                Need to buy • <span style={{
                  color: item.status === 'finished' ? '#D4380D' : '#E8890C',
                  fontWeight: 500,
                }}>
                  {item.status === 'finished' ? 'Empty' : `${item.qty} ${item.unit} left`}
                </span>
              </div>
            </div>
            <div style={{
              fontSize: 11,
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: 12,
              background: item.status === 'finished' ? '#FFE8E8' : '#FFF0E0',
              color: item.status === 'finished' ? '#D4380D' : '#E8890C',
            }}>
              {item.status === 'finished' ? 'EMPTY' : 'LOW'}
            </div>
          </div>
        </div>
      ))}

      {/* Bought items */}
      {boughtItems.length > 0 && (
        <>
          <div className="section-header" style={{ marginTop: 16 }}>
            <span className="section-title" style={{ fontSize: 15 }}>Khareed Liya / Bought ✅</span>
          </div>
          {boughtItems.map(item => (
            <div className="card" key={item.id} style={{ opacity: 0.7 }}>
              <div className="list-item-card">
                <button
                  className="list-checkbox checked"
                  onClick={() => handleCheck(item.id)}
                  aria-label={`Unmark ${item.name}`}
                >
                  <span style={{ color: '#fff', fontSize: 14 }}>✓</span>
                </button>
                <span className="list-item-icon">{item.icon}</span>
                <div className="list-item-info">
                  <div className="list-item-name bought">{item.name} ({item.hindi})</div>
                  <div className="list-item-qty">Bought</div>
                </div>
                <span className="bought-badge">BOUGHT ✅</span>
              </div>
            </div>
          ))}
        </>
      )}

      {/* WhatsApp Share Button */}
      <div style={{ marginTop: 20, marginBottom: 8 }}>
        <button className="whatsapp-btn" onClick={handleWhatsApp}>
          <span style={{ fontSize: 20 }}>📤</span>
          WhatsApp par Share Karein
        </button>
      </div>
    </div>
  );
}
