import type { InventoryItem } from '../types';
import ToggleSwitch from '../components/ToggleSwitch';

interface HomeScreenProps {
  items: InventoryItem[];
  onToggle: (id: string, checked: boolean) => void;
  onAddItem: () => void;
}

function ItemCard({ item, onToggle }: { item: InventoryItem; onToggle: (id: string, checked: boolean) => void }) {
  const statusLabel = item.status === 'available'
    ? `Available • ${item.qty}${item.unit} Left`
    : item.status === 'low'
    ? `Low • ${item.qty}${item.unit} Left`
    : 'Finished • Need to Buy';

  const cardClass = item.status === 'finished' ? 'card item-finished'
    : item.status === 'low' ? 'card item-low'
    : 'card';

  return (
    <div className={cardClass}>
      <div className="item-card">
        {/* Icon Circle */}
        <div
          className="item-icon-circle"
          style={{ background: item.iconBg }}
        >
          {item.icon}
        </div>

        {/* Info */}
        <div className="item-info">
          <div className="item-name-row">
            <span className={`status-dot ${item.status}`} />
            <span className="item-name">
              {item.name} <span style={{ fontWeight: 400, color: '#8B8680', fontSize: 13 }}>({item.hindi})</span>
            </span>
          </div>
          <div className={`item-qty-row ${item.status}`}>
            {statusLabel}
          </div>
        </div>

        {/* Toggle */}
        <ToggleSwitch
          id={`toggle-${item.id}`}
          checked={item.inShoppingList}
          onChange={(checked) => onToggle(item.id, checked)}
        />
      </div>
    </div>
  );
}

export default function HomeScreen({ items, onToggle, onAddItem }: HomeScreenProps) {
  const finishedCount = items.filter(i => i.status === 'finished' || i.status === 'low').length;

  return (
    <div className="screen">
      {/* Page Header */}
      <div className="page-header">
        <h1 className="page-title">Home / Ghar</h1>
        <p className="page-subtitle">Daily essentials for the Sharma household.</p>
      </div>

      {/* Quick Stats Bar */}
      <div style={{
        display: 'flex',
        gap: 8,
        marginBottom: 14,
      }}>
        <div style={{
          flex: 1,
          background: '#E8F5E2',
          borderRadius: 14,
          padding: '10px 12px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'Nunito, sans-serif', color: '#2D5016' }}>
            {items.filter(i => i.status === 'available').length}
          </div>
          <div style={{ fontSize: 11, color: '#2D8B1A', fontWeight: 600 }}>Available</div>
        </div>
        <div style={{
          flex: 1,
          background: '#FFF0E0',
          borderRadius: 14,
          padding: '10px 12px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'Nunito, sans-serif', color: '#E8890C' }}>
            {items.filter(i => i.status === 'low').length}
          </div>
          <div style={{ fontSize: 11, color: '#E8890C', fontWeight: 600 }}>Low Stock</div>
        </div>
        <div style={{
          flex: 1,
          background: '#FFE8E8',
          borderRadius: 14,
          padding: '10px 12px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'Nunito, sans-serif', color: '#D4380D' }}>
            {items.filter(i => i.status === 'finished').length}
          </div>
          <div style={{ fontSize: 11, color: '#D4380D', fontWeight: 600 }}>Empty</div>
        </div>
      </div>

      {/* Item Cards */}
      {items.map((item) => (
        <ItemCard key={item.id} item={item} onToggle={onToggle} />
      ))}

      {/* Seasonal Banner */}
      <div className="seasonal-banner">
        <p className="seasonal-badge">🎉 Festive Season</p>
        <p className="seasonal-title">Stock Up for Festive Week</p>
        <p className="seasonal-sub">
          {finishedCount > 0
            ? `You're running low on ${finishedCount} item${finishedCount > 1 ? 's' : ''}`
            : 'Your pantry looks great! 👏'}
        </p>
      </div>

      {/* FAB — rendered here but positioned fixed via CSS */}
      <div className="fab-wrapper">
        <button className="fab-btn" onClick={onAddItem}>
          <span style={{ fontSize: 20 }}>+</span>
          Add Item / Item Add Karein
        </button>
      </div>
    </div>
  );
}
